import { Controller, Get, Post, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CertificatesService } from './certificates.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@ApiTags('Certificates')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('certificates')
export class CertificatesController {
  constructor(private certificatesService: CertificatesService) {}

  @Post(':courseId')
  @ApiOperation({ summary: 'Gerar certificado de conclusão' })
  async generate(@Param('courseId') courseId: string, @Request() req) {
    return this.certificatesService.generate(req.user.sub, courseId);
  }

  @Get()
  @ApiOperation({ summary: 'Listar meus certificados' })
  async findMyCertificates(@Request() req) {
    return this.certificatesService.findByUser(req.user.sub);
  }

  @Get('verify/:number')
  @ApiOperation({ summary: 'Verificar certificado por número' })
  async verify(@Param('number') number: string) {
    return this.certificatesService.findByNumber(number);
  }
}
