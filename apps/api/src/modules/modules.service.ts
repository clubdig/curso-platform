import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ModulesService {
  constructor(private prisma: PrismaService) {}

  async create(courseId: string, data: { title: string; description?: string }, userId: string) {
    const course = await this.prisma.course.findUnique({ where: { id: courseId } });
    if (!course) throw new NotFoundException('Curso não encontrado');
    if (course.producerId !== userId) throw new ForbiddenException('Sem permissão');

    const maxOrder = await this.prisma.courseModule.findFirst({
      where: { courseId },
      orderBy: { order: 'desc' },
      select: { order: true },
    });

    return this.prisma.courseModule.create({
      data: {
        title: data.title,
        description: data.description,
        order: (maxOrder?.order || 0) + 1,
        courseId,
      },
    });
  }

  async findByCourse(courseId: string) {
    return this.prisma.courseModule.findMany({
      where: { courseId },
      include: {
        lessons: {
          orderBy: { order: 'asc' },
        },
      },
      orderBy: { order: 'asc' },
    });
  }

  async update(id: string, data: { title?: string; description?: string }, userId: string) {
    const module = await this.prisma.courseModule.findUnique({
      where: { id },
      include: { course: true },
    });
    if (!module) throw new NotFoundException('Módulo não encontrado');
    if (module.course.producerId !== userId) throw new ForbiddenException('Sem permissão');

    return this.prisma.courseModule.update({ where: { id }, data });
  }

  async delete(id: string, userId: string) {
    const module = await this.prisma.courseModule.findUnique({
      where: { id },
      include: { course: true },
    });
    if (!module) throw new NotFoundException('Módulo não encontrado');
    if (module.course.producerId !== userId) throw new ForbiddenException('Sem permissão');

    return this.prisma.courseModule.delete({ where: { id } });
  }
}
