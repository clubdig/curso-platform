import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CouponsService {
  constructor(private prisma: PrismaService) {}

  async create(data: {
    code: string;
    type: string;
    value: number;
    maxUses?: number;
    expiresAt?: string;
    courseId?: string;
  }) {
    const existing = await this.prisma.coupon.findUnique({
      where: { code: data.code.toUpperCase() },
    });

    if (existing) {
      throw new BadRequestException('Cupom já existe');
    }

    return this.prisma.coupon.create({
      data: {
        code: data.code.toUpperCase(),
        type: data.type,
        value: data.value,
        maxUses: data.maxUses,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
        courseId: data.courseId,
      },
    });
  }

  async findAll() {
    return this.prisma.coupon.findMany({
      include: {
        course: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async validate(code: string, courseId: string) {
    const coupon = await this.prisma.coupon.findUnique({
      where: { code: code.toUpperCase() },
    });

    if (!coupon) throw new NotFoundException('Cupom não encontrado');
    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      throw new BadRequestException('Cupom expirado');
    }
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) {
      throw new BadRequestException('Cupom esgotado');
    }
    if (coupon.courseId && coupon.courseId !== courseId) {
      throw new BadRequestException('Cupom não válido para este curso');
    }

    const course = await this.prisma.course.findUnique({
      where: { id: courseId },
    });

    let discount = 0;
    if (coupon.type === 'PERCENTAGE') {
      discount = Number(course.price) * (Number(coupon.value) / 100);
    } else {
      discount = Number(coupon.value);
    }

    return {
      valid: true,
      code: coupon.code,
      type: coupon.type,
      value: Number(coupon.value),
      discount,
      finalPrice: Math.max(0, Number(course.price) - discount),
    };
  }

  async delete(id: string) {
    return this.prisma.coupon.delete({ where: { id } });
  }
}
