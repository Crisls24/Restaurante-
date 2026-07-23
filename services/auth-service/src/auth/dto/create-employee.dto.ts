import { IsString, IsOptional, IsNumber, IsEmail } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateEmployeeDto {
  @ApiProperty({ example: 'Carlos' })
  @IsString()
  nombre: string;

  @ApiProperty({ example: 'López' })
  @IsString()
  apellido: string;

  @ApiProperty({ example: 'carlos@xiu.mx' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: '7712345678' })
  @IsOptional()
  @IsString()
  telefono?: string;

  @ApiProperty({ example: 'empleado123' })
  @IsString()
  password: string;

  @ApiProperty({ example: 'mesero', enum: ['admin', 'mesero', 'cocina'] })
  @IsString()
  rol: string;
}
