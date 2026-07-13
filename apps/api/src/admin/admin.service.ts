import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboard() {
    const [
      totalUsers,
      totalCourses,
      totalOrders,
      totalRevenue,
      recentOrders,
      recentUsers,
      coursesByStatus,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.course.count(),
      this.prisma.order.count(),
      this.prisma.payment.aggregate({
        where: { status: 'PAID' },
        _sum: { amount: true },
      }),
      this.prisma.order.findMany({
        take: 10,
        include: {
          user: { select: { id: true, name: true, email: true } },
          items: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.findMany({
        take: 10,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.course.groupBy({
        by: ['status'],
        _count: true,
      }),
    ]);

    return {
      stats: {
        totalUsers,
        totalCourses,
        totalOrders,
        totalRevenue: totalRevenue._sum.amount || 0,
      },
      recentOrders,
      recentUsers,
      coursesByStatus,
    };
  }

  async getSalesReport(startDate?: string, endDate?: string) {
    const where: any = { status: 'PAID' };

    if (startDate || endDate) {
      where.paidAt = {};
      if (startDate) where.paidAt.gte = new Date(startDate);
      if (endDate) where.paidAt.lte = new Date(endDate);
    }

    const payments = await this.prisma.payment.findMany({
      where,
      include: {
        order: {
          include: {
            user: { select: { id: true, name: true, email: true } },
            items: { include: { course: { select: { title: true } } } },
          },
        },
      },
      orderBy: { paidAt: 'desc' },
    });

    const totalRevenue = payments.reduce((sum, p) => sum + Number(p.amount), 0);
    const totalTransactions = payments.length;

    return {
      payments,
      summary: {
        totalRevenue,
        totalTransactions,
        averageTicket: totalTransactions > 0 ? totalRevenue / totalTransactions : 0,
      },
    };
  }

  async getStudentsReport() {
    const students = await this.prisma.user.findMany({
      where: { role: 'STUDENT' },
      include: {
        enrollments: {
          include: {
            course: { select: { id: true, title: true } },
          },
        },
        orders: {
          where: { status: 'PAID' },
          select: { total: true },
        },
      },
    });

    return students.map((student) => ({
      id: student.id,
      name: student.name,
      email: student.email,
      enrolledCourses: student.enrollments.length,
      totalSpent: student.orders.reduce((sum, o) => sum + Number(o.total), 0),
      enrolledAt: student.enrollments[0]?.createdAt,
    }));
  }

  async getAuditLogs(page = 1, limit = 50) {
    const skip = (page - 1) * limit;
    const [logs, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.auditLog.count(),
    ]);

    return {
      logs,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }
}
