import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, lessonId: string, content: string, parentId?: string) {
    return this.prisma.comment.create({
      data: {
        userId,
        lessonId,
        content,
        parentId,
        status: 'PENDING',
      },
      include: {
        user: { select: { id: true, name: true, avatarUrl: true } },
      },
    });
  }

  async findByLesson(lessonId: string) {
    return this.prisma.comment.findMany({
      where: {
        lessonId,
        status: 'APPROVED',
        parentId: null,
      },
      include: {
        user: { select: { id: true, name: true, avatarUrl: true } },
        replies: {
          where: { status: 'APPROVED' },
          include: {
            user: { select: { id: true, name: true, avatarUrl: true } },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async moderate(id: string, status: 'APPROVED' | 'REJECTED') {
    return this.prisma.comment.update({
      where: { id },
      data: { status },
    });
  }

  async findPending() {
    return this.prisma.comment.findMany({
      where: { status: 'PENDING' },
      include: {
        user: { select: { id: true, name: true } },
        lesson: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async delete(id: string) {
    return this.prisma.comment.delete({ where: { id } });
  }
}
