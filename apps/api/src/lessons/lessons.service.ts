import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LessonsService {
  constructor(private prisma: PrismaService) {}

  async create(moduleId: string, data: {
    title: string;
    description?: string;
    type?: string;
    contentUrl?: string;
    duration?: number;
    isFree?: boolean;
    dripDays?: number;
  }, userId: string) {
    const module = await this.prisma.courseModule.findUnique({
      where: { id: moduleId },
      include: { course: true },
    });
    if (!module) throw new NotFoundException('Módulo não encontrado');
    if (module.course.producerId !== userId) throw new ForbiddenException('Sem permissão');

    const maxOrder = await this.prisma.lesson.findFirst({
      where: { moduleId },
      orderBy: { order: 'desc' },
      select: { order: true },
    });

    return this.prisma.lesson.create({
      data: {
        title: data.title,
        description: data.description,
        type: data.type || 'VIDEO',
        contentUrl: data.contentUrl,
        duration: data.duration,
        isFree: data.isFree || false,
        dripDays: data.dripDays,
        order: (maxOrder?.order || 0) + 1,
        moduleId,
      },
    });
  }

  async findByModule(moduleId: string) {
    return this.prisma.lesson.findMany({
      where: { moduleId },
      orderBy: { order: 'asc' },
    });
  }

  async findById(id: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      include: {
        module: {
          include: { course: true },
        },
      },
    });
    if (!lesson) throw new NotFoundException('Aula não encontrada');
    return lesson;
  }

  async update(id: string, data: {
    title?: string;
    description?: string;
    type?: string;
    contentUrl?: string;
    duration?: number;
    isFree?: boolean;
    dripDays?: number;
  }, userId: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      include: { module: { include: { course: true } } },
    });
    if (!lesson) throw new NotFoundException('Aula não encontrada');
    if (lesson.module.course.producerId !== userId) throw new ForbiddenException('Sem permissão');

    return this.prisma.lesson.update({ where: { id }, data });
  }

  async delete(id: string, userId: string) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id },
      include: { module: { include: { course: true } } },
    });
    if (!lesson) throw new NotFoundException('Aula não encontrada');
    if (lesson.module.course.producerId !== userId) throw new ForbiddenException('Sem permissão');

    return this.prisma.lesson.delete({ where: { id } });
  }
}
