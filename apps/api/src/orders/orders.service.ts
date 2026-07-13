import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, data: {
    courseId: string;
    couponCode?: string;
    paymentMethod: string;
  }) {
    const course = await this.prisma.course.findUnique({
      where: { id: data.courseId },
    });

    if (!course) throw new NotFoundException('Curso não encontrado');
    if (course.status !== 'PUBLISHED') throw new BadRequestException('Curso não disponível');

    let discount = 0;
    let couponId = null;

    if (data.couponCode) {
      const coupon = await this.prisma.coupon.findUnique({
        where: { code: data.couponCode },
      });

      if (!coupon) throw new BadRequestException('Cupom inválido');
      if (coupon.expiresAt && coupon.expiresAt < new Date()) {
        throw new BadRequestException('Cupom expirado');
      }
      if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
        throw new BadRequestException('Cupom esgotado');
      }

      if (coupon.type === 'PERCENTAGE') {
        discount = Number(course.price) * (Number(coupon.value) / 100);
      } else {
        discount = Number(coupon.value);
      }

      couponId = coupon.id;
    }

    const finalPrice = Math.max(0, Number(course.price) - discount);

    const order = await this.prisma.order.create({
      data: {
        userId,
        total: finalPrice,
        status: 'PENDING',
        couponId,
        items: {
          create: {
            courseId: data.courseId,
            price: finalPrice,
            quantity: 1,
          },
        },
      },
      include: {
        items: true,
        coupon: true,
      },
    });

    if (couponId) {
      await this.prisma.coupon.update({
        where: { id: couponId },
        data: { usedCount: { increment: 1 } },
      });
    }

    return order;
  }

  async findById(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: { course: true },
        },
        payments: true,
        coupon: true,
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!order) throw new NotFoundException('Pedido não encontrado');
    return order;
  }

  async findByUser(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: { course: { select: { id: true, title: true, coverUrl: true, slug: true } } },
        },
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: string, status: string) {
    return this.prisma.order.update({
      where: { id },
      data: { status },
    });
  }

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        skip,
        take: limit,
        include: {
          user: { select: { id: true, name: true, email: true } },
          items: true,
          payments: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.order.count(),
    ]);

    return {
      orders,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }
}
