import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import Stripe from 'stripe';

@Injectable()
export class WebhooksService {
  private stripe: Stripe;
  private readonly logger = new Logger(WebhooksService.name);

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {
    this.stripe = new Stripe(
      this.configService.get('STRIPE_SECRET_KEY'),
      { apiVersion: '2023-10-16' },
    );
  }

  async handleStripeWebhook(payload: Buffer, signature: string) {
    const webhookSecret = this.configService.get('STRIPE_WEBHOOK_SECRET');

    let event: Stripe.Event;
    try {
      event = this.stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (err) {
      this.logger.error(`Webhook signature verification failed: ${err.message}`);
      throw new Error('Invalid webhook signature');
    }

    this.logger.log(`Webhook received: ${event.type}`);

    switch (event.type) {
      case 'checkout.session.completed':
        await this.handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case 'invoice.paid':
        await this.handleInvoicePaid(event.data.object as Stripe.Invoice);
        break;
      case 'invoice.payment_failed':
        await this.handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;
      case 'customer.subscription.deleted':
        await this.handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      default:
        this.logger.log(`Unhandled event type: ${event.type}`);
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

  private async handleCheckoutCompleted(session: Stripe.Checkout.Session) {
    const orderId = session.metadata?.orderId;
    if (!orderId) return;

    this.logger.log(`Processing checkout for order: ${orderId}`);

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

    this.logger.log(`Order ${orderId} processed successfully`);
  }

  private async handleInvoicePaid(invoice: Stripe.Invoice) {
    const subscriptionId = invoice.subscription as string;
    if (!subscriptionId) return;

    this.logger.log(`Invoice paid for subscription: ${subscriptionId}`);

    const subscription = await this.prisma.subscription.findFirst({
      where: { gatewaySubscriptionId: subscriptionId },
    });

    if (subscription) {
      await this.prisma.subscription.update({
        where: { id: subscription.id },
        data: {
          status: 'ACTIVE',
          currentPeriodStart: new Date(invoice.period_start * 1000),
          currentPeriodEnd: new Date(invoice.period_end * 1000),
        },
      });
    }
  }

  private async handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
    const subscriptionId = invoice.subscription as string;
    if (!subscriptionId) return;

    this.logger.log(`Payment failed for subscription: ${subscriptionId}`);

    const subscription = await this.prisma.subscription.findFirst({
      where: { gatewaySubscriptionId: subscriptionId },
    });

    if (subscription) {
      await this.prisma.subscription.update({
        where: { id: subscription.id },
        data: { status: 'PAST_DUE' },
      });
    }
  }

  private async handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    this.logger.log(`Subscription deleted: ${subscription.id}`);

    const sub = await this.prisma.subscription.findFirst({
      where: { gatewaySubscriptionId: subscription.id },
    });

    if (sub) {
      await this.prisma.subscription.update({
        where: { id: sub.id },
        data: {
          status: 'CANCELLED',
          cancelAt: new Date(),
        },
      });

      await this.prisma.enrollment.updateMany({
        where: {
          userId: sub.userId,
          courseId: sub.courseId,
        },
        data: { status: 'CANCELLED' },
      });
    }
  }
}
