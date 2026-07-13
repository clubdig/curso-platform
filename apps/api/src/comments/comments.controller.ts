import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  constructor(private commentsService: CommentsService) {}

  @Post('lessons/:lessonId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Comentar na aula' })
  async create(
    @Param('lessonId') lessonId: string,
    @Body() body: { content: string; parentId?: string },
    @Request() req,
  ) {
    return this.commentsService.create(req.user.sub, lessonId, body.content, body.parentId);
  }

  @Get('lessons/:lessonId')
  @ApiOperation({ summary: 'Listar comentários da aula' })
  async findByLesson(@Param('lessonId') lessonId: string) {
    return this.commentsService.findByLesson(lessonId);
  }

  @Get('pending')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'PRODUCER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar comentários pendentes' })
  async findPending() {
    return this.commentsService.findPending();
  }

  @Put(':id/moderate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN', 'PRODUCER')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Moderar comentário' })
  async moderate(
    @Param('id') id: string,
    @Body() body: { status: 'APPROVED' | 'REJECTED' },
  ) {
    return this.commentsService.moderate(id, body.status);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Excluir comentário' })
  async delete(@Param('id') id: string) {
    return this.commentsService.delete(id);
  }
}
