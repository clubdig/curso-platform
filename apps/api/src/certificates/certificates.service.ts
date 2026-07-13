import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CertificatesService {
  constructor(private prisma: PrismaService) {}

  async generate(userId: string, courseId: string) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: {
        userId_courseId: { userId, courseId },
      },
      include: {
        course: {
          include: {
            modules: {
              include: {
                lessons: true,
              },
            },
          },
        },
      },
    });

    if (!enrollment) throw new NotFoundException('Matrícula não encontrada');

    const existingCert = await this.prisma.certificate.findUnique({
      where: {
        userId_courseId: { userId, courseId },
      },
    });

    if (existingCert) return existingCert;

    let totalLessons = 0;
    let completedLessons = 0;

    for (const module of enrollment.course.modules) {
      totalLessons += module.lessons.length;
      for (const lesson of module.lessons) {
        const progress = await this.prisma.lessonProgress.findUnique({
          where: {
            userId_lessonId: { userId, lessonId: lesson.id },
          },
        });
        if (progress?.completed) completedLessons++;
      }
    }

    const percentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

    if (percentage < 100) {
      throw new BadRequestException(
        `Curso não concluído. Progresso atual: ${Math.round(percentage)}%`,
      );
    }

    const certificateNumber = this.generateCertificateNumber();

    return this.prisma.certificate.create({
      data: {
        userId,
        courseId,
        certificateNumber,
        issuedAt: new Date(),
      },
      include: {
        course: { select: { title: true } },
        user: { select: { name: true, email: true } },
      },
    });
  }

  async findByUser(userId: string) {
    return this.prisma.certificate.findMany({
      where: { userId },
      include: {
        course: { select: { id: true, title: true, slug: true, coverUrl: true } },
      },
      orderBy: { issuedAt: 'desc' },
    });
  }

  async findByNumber(certificateNumber: string) {
    const cert = await this.prisma.certificate.findUnique({
      where: { certificateNumber },
      include: {
        course: { select: { title: true, description: true } },
        user: { select: { name: true, email: true } },
      },
    });

    if (!cert) throw new NotFoundException('Certificado não encontrado');
    return cert;
  }

  private generateCertificateNumber(): string {
    const prefix = 'CERT';
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `${prefix}-${timestamp}-${random}`;
  }
}
