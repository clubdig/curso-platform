import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CoursesService {
  constructor(private prisma: PrismaService) {}

  async create(createCourseDto: CreateCourseDto, producerId: string) {
    const slug = this.generateSlug(createCourseDto.title);

    return this.prisma.course.create({
      data: {
        title: createCourseDto.title,
        slug,
        description: createCourseDto.description,
        shortDescription: createCourseDto.shortDescription,
        price: createCourseDto.price,
        salePrice: createCourseDto.salePrice,
        type: createCourseDto.type || 'ONE_TIME',
        accessDuration: createCourseDto.accessDuration,
        coverUrl: createCourseDto.coverUrl,
        producerId,
        status: 'DRAFT',
      },
    });
  }

  async findAll(page = 1, limit = 20, publishedOnly = false) {
    const skip = (page - 1) * limit;
    const where = publishedOnly ? { status: 'PUBLISHED' } : {};

    const [courses, total] = await Promise.all([
      this.prisma.course.findMany({
        where,
        skip,
        take: limit,
        include: {
          producer: {
            select: { id: true, name: true, avatarUrl: true },
          },
          _count: {
            select: { enrollments: true, modules: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.course.count({ where }),
    ]);

    return {
      courses,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    };
  }

  async findBySlug(slug: string) {
    const course = await this.prisma.course.findUnique({
      where: { slug },
      include: {
        producer: {
          select: { id: true, name: true, avatarUrl: true },
        },
        modules: {
          include: {
            lessons: {
              select: { id: true, title: true, type: true, duration: true, isFree: true },
              orderBy: { order: 'asc' },
            },
          },
          orderBy: { order: 'asc' },
        },
        _count: {
          select: { enrollments: true },
        },
      },
    });

    if (!course) {
      throw new NotFoundException('Curso não encontrado');
    }

    return course;
  }

  async findById(id: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: {
        producer: { select: { id: true, name: true } },
        modules: {
          include: {
            lessons: true,
          },
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!course) {
      throw new NotFoundException('Curso não encontrado');
    }

    return course;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto, userId: string) {
    const course = await this.prisma.course.findUnique({ where: { id } });

    if (!course) {
      throw new NotFoundException('Curso não encontrado');
    }

    if (course.producerId !== userId) {
      throw new ForbiddenException('Você não tem permissão para editar este curso');
    }

    return this.prisma.course.update({
      where: { id },
      data: updateCourseDto,
    });
  }

  async publish(id: string, userId: string) {
    const course = await this.prisma.course.findUnique({ where: { id } });

    if (!course) {
      throw new NotFoundException('Curso não encontrado');
    }

    if (course.producerId !== userId) {
      throw new ForbiddenException('Você não tem permissão para publicar este curso');
    }

    return this.prisma.course.update({
      where: { id },
      data: { status: 'PUBLISHED' },
    });
  }

  async findByProducer(producerId: string) {
    return this.prisma.course.findMany({
      where: { producerId },
      include: {
        _count: {
          select: { enrollments: true, modules: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async delete(id: string, userId: string) {
    const course = await this.prisma.course.findUnique({ where: { id } });

    if (!course) {
      throw new NotFoundException('Curso não encontrado');
    }

    if (course.producerId !== userId) {
      throw new ForbiddenException('Você não tem permissão para excluir este curso');
    }

    return this.prisma.course.delete({ where: { id } });
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  }
}
