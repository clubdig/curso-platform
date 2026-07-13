import { IsString, IsNumber, IsOptional, IsEnum, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCourseDto {
  @ApiProperty({ example: 'Curso de Marketing Digital' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'Aprenda marketing digital do zero' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ example: 'Curso completo de marketing' })
  @IsString()
  @IsOptional()
  shortDescription?: string;

  @ApiProperty({ example: 197.0 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({ example: 97.0 })
  @IsNumber()
  @IsOptional()
  salePrice?: number;

  @ApiPropertyOptional({ enum: ['ONE_TIME', 'SUBSCRIPTION'] })
  @IsEnum(['ONE_TIME', 'SUBSCRIPTION'])
  @IsOptional()
  type?: string;

  @ApiPropertyOptional({ example: 365 })
  @IsNumber()
  @IsOptional()
  accessDuration?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  coverUrl?: string;
}
