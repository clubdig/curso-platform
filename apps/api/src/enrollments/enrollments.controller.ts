import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { EnrollmentsService } from './enrollments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Enrollments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('enrollments')
export class EnrollmentsController {
  constructor(private enrollmentsService: EnrollmentsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar cursos matriculados' })
  async findMyEnrollments(@Request() req) {
    return this.enrollmentsService.findByUser(req.user.sub);
  }

  @Get(':courseId')
  @ApiOperation({ summary: 'Obter matrícula em curso específico' })
  async findByCourse(@Param('courseId') courseId: string, @Request() req) {
    return this.enrollmentsService.findByUserAndCourse(req.user.sub, courseId);
  }

  @Get(':courseId/progress')
  @ApiOperation({ summary: 'Obter progresso no curso' })
  async getProgress(@Param('courseId') courseId: string, @Request() req) {
    return this.enrollmentsService.getCourseProgress(req.user.sub, courseId);
  }

  @Post('progress')
  @ApiOperation({ summary: 'Atualizar progresso da aula' })
  async updateProgress(
    @Body() body: { lessonId: string; completed: boolean },
    @Request() req,
  ) {
    return this.enrollmentsService.updateProgress(req.user.sub, body.lessonId, body.completed);
  }
}
