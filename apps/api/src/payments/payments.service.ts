import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import Stripe from 'stripe';

@Injectable()
export class PaymentsService {
  private stripe: Stripe;
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.stripe = new Stripe(
      this.configService.get<string>('STRIPE_SECRET_KEY')!,
      { apiVersion: '2023-10-16' },
    );
  }

  async createCheckoutSession(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: { course: true },
        },
        user: true,
      },
    });

    if (!order) throw new Error('Pedido não encontrado');

    const lineItems = order.items.map((item) => ({
      price_data: {
        currency: 'brl',
        product_data: {
          name: item.course.title,
          images: item.course.coverUrl ? [item.course.coverUrl] : [],
        },
        unit_amount: Math.round(Number(item.price) * 100),
      },
      quantity: 1,
    }));

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card', 'boleto'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${this.configService.get('NEXT_PUBLIC_APP_URL')}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${this.configService.get('NEXT_PUBLIC_APP_URL')}/checkout/cancel`,
      customer_email: order.user.email,
      metadata: {
        orderId: order.id,
      },
    });

    await this.prisma.payment.create({
      data: {
        orderId: order.id,
        amount: order.total,
        method: 'CREDIT_CARD',
        status: 'PENDING',
        gatewayId: session.id,
      },
    });

    return { sessionId: session.id, url: session.url };
  }

  async handleWebhook(payload: Buffer, signature: string) {
    const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');

    let event: Stripe.Event;
    try {
      event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (err) {
      this.logger.error(`Webhook signature verification failed: ${err.message}`);
      throw new Error('Invalid webhook signature');
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      await this.processPayment(session);
    }

    await this.prisma.webhookLog.create({
      data: {
        event: event.type,
        payload: event.data.object as any,
        status: 200,
      },
    });

    return { received: true };
  }

  private async processPayment(session: Stripe.Checkout.Session) {
    const orderId = session.metadata?.orderId;
    if (!orderId) return;

    await this.prisma.order.update({
      where: { id: orderId },
      data: { status: 'PAID' },
    });

    await this.prisma.payment.updateMany({
      where: { gatewayId: session.id },
      data: {
        status: 'PAID',
        paidAt: new Date(),
        gatewayResponse: session as any,
      },
    });

    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (order) {
      for (const item of order.items) {
        const course = await this.prisma.course.findUnique({
          where: { id: item.courseId },
        });

        const enrollmentData: any = {
          userId: order.userId,
          courseId: item.courseId,
          orderId: order.id,
          status: 'ACTIVE',
        };

        if (course?.accessDuration) {
          const expiresAt = new Date();
          expiresAt.setDate(expiresAt.getDate() + course.accessDuration);
          enrollmentData.accessExpiresAt = expiresAt;
        }

        await this.prisma.enrollment.upsert({
          where: {
            userId_courseId: {
              userId: order.userId,
              courseId: item.courseId,
            },
          },
          update: enrollmentData,
          create: enrollmentData,
        });
      }
    }

    this.logger.log(`Pedido ${orderId} processado com sucesso`);
  }

  async createPixPayment(orderId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: { items: { include: { course: true } }, user: true },
    });

    if (!order) throw new Error('Pedido não encontrado');

    const payment = await this.prisma.payment.create({
      data: {
        orderId: order.id,
        amount: order.total,
        method: 'PIX',
        status: 'PENDING',
      },
    });

    return {
      paymentId: payment.id,
      pixQrCode: 'data:image/png;base64,...',
      pixCopyPaste: '00020126580014BR.GOV.BCB.PIX...',
      expiresAt: new Date(Date.now() + 30 * 60 * 1000),
    };
  }
}
