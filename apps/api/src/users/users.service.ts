import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: { email: string; name: string; passwordHash: string; role?: string }) {
    return this.prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        passwordHash: data.passwordHash,
        role: data.role || 'STUDENT',
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }
    const { passwordHash, ...result } = user;
    return result;
  }

  async findAll(page = 1, limit = 20) {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count(),
    ]);

    return {
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    };
  }

  async update(id: string, data: { name?: string; role?: string; avatarUrl?: string }) {
    return this.prisma.user.update({ where: { id }, data });
  }

  async getDashboardStats() {
    const totalUsers = await this.prisma.user.count();
    const totalStudents = await this.prisma.user.count({ where: { role: 'STUDENT' } });
    const totalProducers = await this.prisma.user.count({ where: { role: 'PRODUCER' } });

    return { totalUsers, totalStudents, totalProducers };
  }
}
