import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@ApiTags('Admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@ApiBearerAuth()
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Dashboard do admin' })
  async getDashboard() {
    return this.adminService.getDashboard();
  }

  @Get('sales')
  @ApiOperation({ summary: 'Relatório de vendas' })
  async getSalesReport(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.adminService.getSalesReport(startDate, endDate);
  }

  @Get('students')
  @ApiOperation({ summary: 'Relatório de alunos' })
  async getStudentsReport() {
    return this.adminService.getStudentsReport();
  }

  @Get('audit-logs')
  @ApiOperation({ summary: 'Logs de auditoria' })
  async getAuditLogs(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.adminService.getAuditLogs(page || 1, limit || 50);
  }
}
