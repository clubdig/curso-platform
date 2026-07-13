import { Controller, Get, Post, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CouponsService } from './coupons.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Coupons')
@Controller('coupons')
export class CouponsController {
  constructor(private couponsService: CouponsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Criar cupom (Admin)' })
  async create(@Body() body: {
    code: string;
    type: string;
    value: number;
    maxUses?: number;
    expiresAt?: string;
    courseId?: string;
  }) {
    return this.couponsService.create(body);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar cupons (Admin)' })
  async findAll() {
    return this.couponsService.findAll();
  }

  @Post('validate')
  @ApiOperation({ summary: 'Validar cupom' })
  async validate(@Body() body: { code: string; courseId: string }) {
    return this.couponsService.validate(body.code, body.courseId);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Excluir cupom (Admin)' })
  async delete(@Param('id') id: string) {
    return this.couponsService.delete(id);
  }
}
