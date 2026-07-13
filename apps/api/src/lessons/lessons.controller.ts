import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { LessonsService } from './lessons.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Lessons')
@Controller('modules/:moduleId/lessons')
export class LessonsController {
  constructor(private lessonsService: LessonsService) {}

  @Get()
  @ApiOperation({ summary: 'Listar aulas do módulo' })
  async findAll(@Param('moduleId') moduleId: string) {
    return this.lessonsService.findByModule(moduleId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obter aula por ID' })
  async findOne(@Param('id') id: string) {
    return this.lessonsService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar aula' })
  async create(
    @Param('moduleId') moduleId: string,
    @Body() body: {
      title: string;
      description?: string;
      type?: string;
      contentUrl?: string;
      duration?: number;
      isFree?: boolean;
      dripDays?: number;
    },
    @Request() req,
  ) {
    return this.lessonsService.create(moduleId, body, req.user.sub);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar aula' })
  async update(
    @Param('id') id: string,
    @Body() body: {
      title?: string;
      description?: string;
      type?: string;
      contentUrl?: string;
      duration?: number;
      isFree?: boolean;
      dripDays?: number;
    },
    @Request() req,
  ) {
    return this.lessonsService.update(id, body, req.user.sub);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Excluir aula' })
  async delete(@Param('id') id: string, @Request() req) {
    return this.lessonsService.delete(id, req.user.sub);
  }
}
