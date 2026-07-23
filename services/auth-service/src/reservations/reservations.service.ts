import { Injectable, BadRequestException, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import { Mesa } from './entities/mesa.entity';
import { EstadoReservacion } from './entities/estado-reservacion.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ReservationsService {
  private readonly logger = new Logger(ReservationsService.name);

  constructor(
    @InjectRepository(Reservation)
    private readonly reservationsRepo: Repository<Reservation>,
    @InjectRepository(Mesa)
    private readonly mesasRepo: Repository<Mesa>,
    @InjectRepository(EstadoReservacion)
    private readonly estadosRepo: Repository<EstadoReservacion>,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(dto: CreateReservationDto) {
    const disponible = await this.findAvailableTable(
      dto.fecha,
      dto.hora_inicio,
      dto.hora_fin,
      dto.num_personas,
    );

    if (!disponible) {
      throw new BadRequestException(
        'No hay mesas disponibles para la fecha, hora y número de personas solicitadas',
      );
    }

    const estadoPendiente = await this.estadosRepo.findOne({
      where: { nombre: 'Pendiente' },
    });

    const reservation = this.reservationsRepo.create({
      id_mesa: disponible.id_mesa,
      id_estado: estadoPendiente?.id_estado || 1,
      fecha: dto.fecha,
      hora_inicio: dto.hora_inicio,
      hora_fin: dto.hora_fin,
      num_personas: dto.num_personas,
      notas: dto.notas,
      cliente_nombre: dto.cliente_nombre,
      cliente_telefono: dto.cliente_telefono,
      cliente_email: dto.cliente_email,
    });

    const saved = await this.reservationsRepo.save(reservation);
    this.logger.log(`Reservación creada: #${saved.id_reservacion} - Mesa ${disponible.numero}`);

    try {
      const message = this.notificationsService.buildReservationConfirmation({
        nombre: dto.cliente_nombre,
        fecha: dto.fecha,
        hora: dto.hora_inicio,
        mesa: disponible.numero,
        personas: dto.num_personas,
      });

      await this.notificationsService.sendWhatsApp({
        to: dto.cliente_telefono,
        message,
      });

      this.logger.log(`Notificación enviada a ${dto.cliente_telefono}`);
    } catch (err) {
      this.logger.warn(`No se pudo enviar notificación: ${err.message}`);
    }

    return {
      id_reservacion: saved.id_reservacion,
      mesa_asignada: disponible.numero,
      ubicacion: disponible.ubicacion,
      fecha: saved.fecha,
      hora_inicio: saved.hora_inicio,
      hora_fin: saved.hora_fin,
      num_personas: saved.num_personas,
      estado: 'Pendiente',
      mensaje: 'Reservación creada exitosamente. Recibirás confirmación por WhatsApp.',
    };
  }

  async findAll() {
    return this.reservationsRepo.find({
      relations: { mesa: true, estado: true },
      order: { fecha: 'DESC', hora_inicio: 'DESC' },
    });
  }

  async findToday() {
    const today = new Date().toISOString().split('T')[0];
    return this.reservationsRepo.find({
      where: { fecha: today },
      relations: { mesa: true, estado: true },
      order: { hora_inicio: 'ASC' },
    });
  }

  async findOne(id: number) {
    const reservation = await this.reservationsRepo.findOne({
      where: { id_reservacion: id },
      relations: { mesa: true, estado: true },
    });
    if (!reservation) throw new NotFoundException('Reservación no encontrada');
    return reservation;
  }

  async updateStatus(id: number, estadoNombre: string) {
    const reservation = await this.findOne(id);
    const estado = await this.estadosRepo.findOne({
      where: { nombre: estadoNombre },
    });
    if (!estado) throw new NotFoundException('Estado no válido');

    reservation.id_estado = estado.id_estado;
    await this.reservationsRepo.save(reservation);

    return { message: `Reservación actualizada a "${estadoNombre}"` };
  }

  async remove(id: number) {
    const result = await this.reservationsRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException('Reservación no encontrada');
    return { message: 'Reservación cancelada exitosamente' };
  }

  async getAvailableTables(fecha: string, hora: string, numPersonas: number) {
    const allTables = await this.mesasRepo.find({
      where: { activa: true },
      order: { capacidad: 'ASC' },
    });

    const compatible = allTables.filter((t) => t.capacidad >= numPersonas);

    const booked = await this.reservationsRepo
      .createQueryBuilder('r')
      .where('r.fecha = :fecha', { fecha })
      .andWhere('r.hora_inicio <= :hora', { hora })
      .andWhere('r.hora_fin > :hora', { hora })
      .andWhere('r.id_estado != 3')
      .getMany();

    const bookedIds = booked.map((r) => r.id_mesa);
    const available = compatible.filter((t) => !bookedIds.includes(t.id_mesa));

    return available;
  }

  private async findAvailableTable(
    fecha: string,
    horaInicio: string,
    horaFin: string,
    numPersonas: number,
  ): Promise<Mesa | null> {
    const allTables = await this.mesasRepo.find({
      where: { activa: true },
      order: { capacidad: 'ASC' },
    });

    const compatible = allTables.filter((t) => t.capacidad >= numPersonas);

    for (const mesa of compatible) {
      const conflict = await this.reservationsRepo.findOne({
        where: {
          id_mesa: mesa.id_mesa,
          fecha,
          id_estado: 1,
        },
      });

      if (!conflict) {
        return mesa;
      }

      const existingEnd = conflict.hora_fin;
      const existingStart = conflict.hora_inicio;

      if (horaInicio >= existingEnd || horaFin <= existingStart) {
        return mesa;
      }
    }

    return null;
  }
}
