import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ModulesService } from './modules.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Course Modules')
@Controller('courses/:courseId/modules')
export class ModulesController {
  constructor(private modulesService: ModulesService) {}

  @Get()
  @ApiOperation({ summary: 'Listar módulos do curso' })
  async findAll(@Param('courseId') courseId: string) {
    return this.modulesService.findByCourse(courseId);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar módulo' })
  async create(
    @Param('courseId') courseId: string,
    @Body() body: { title: string; description?: string },
    @Request() req,
  ) {
    return this.modulesService.create(courseId, body, req.user.sub);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar módulo' })
  async update(
    @Param('id') id: string,
    @Body() body: { title?: string; description?: string },
    @Request() req,
  ) {
    return this.modulesService.update(id, body, req.user.sub);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Excluir módulo' })
  async delete(@Param('id') id: string, @Request() req) {
    return this.modulesService.delete(id, req.user.sub);
  }
}
