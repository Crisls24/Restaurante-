import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Request,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiQuery,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@ApiTags('Reservations')
@Controller('reservations')
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear reservación (público - vincula usuario si hay token)',
  })
  create(@Body() dto: CreateReservationDto, @Request() req) {
    return this.reservationsService.create(dto, req.user?.sub);
  }

  @Get('available')
  @ApiOperation({ summary: 'Mesas disponibles por fecha/hora/personas' })
  @ApiQuery({ name: 'fecha', example: '2026-08-01' })
  @ApiQuery({ name: 'hora', example: '19:00' })
  @ApiQuery({ name: 'personas', example: 4 })
  getAvailable(
    @Query('fecha') fecha: string,
    @Query('hora') hora: string,
    @Query('personas') personas: string,
  ) {
    return this.reservationsService.getAvailableTables(
      fecha,
      hora,
      parseInt(personas),
    );
  }

  @Get('today')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'mesero', 'cocina')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reservaciones de hoy (empleados)' })
  findToday() {
    return this.reservationsService.findToday();
  }

  @Get('my')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reservaciones del usuario autenticado' })
  findMine(@Request() req) {
    return this.reservationsService.findMine(req.user.sub, req.user.email);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'mesero')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Todas las reservaciones (admin/mesero)' })
  findAll() {
    return this.reservationsService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obtener reservación por ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.reservationsService.findOne(id);
  }

  @Put(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin', 'mesero')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cambiar estado de reservación' })
  updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('estado') estado: string,
  ) {
    return this.reservationsService.updateStatus(id, estado);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancelar reservación (admin o dueño)' })
  remove(@Param('id', ParseIntPipe) id: number, @Request() req) {
    return this.reservationsService.remove(id, req.user);
  }
}
