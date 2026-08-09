import {
  IsString,
  IsOptional,
  IsNumber,
  IsEmail,
  Min,
  Max,
  Matches,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateReservationDto {
  @ApiProperty({ example: 'Juan' })
  @IsString()
  cliente_nombre: string;

  @ApiProperty({ example: '7712345678' })
  @IsString()
  cliente_telefono: string;

  @ApiPropertyOptional({ example: 'juan@email.com' })
  @IsOptional()
  @IsEmail()
  cliente_email?: string;

  @ApiProperty({ example: '2026-08-01' })
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'fecha debe tener formato YYYY-MM-DD',
  })
  fecha: string;

  @ApiProperty({ example: '19:00' })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: 'hora_inicio debe tener formato HH:MM',
  })
  hora_inicio: string;

  @ApiProperty({ example: '21:00' })
  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, {
    message: 'hora_fin debe tener formato HH:MM',
  })
  hora_fin: string;

  @ApiProperty({ example: 4 })
  @IsNumber()
  @Min(1)
  @Max(20)
  num_personas: number;

  @ApiPropertyOptional({ example: 'Mesa junto a la ventana' })
  @IsOptional()
  @IsString()
  notas?: string;
}
