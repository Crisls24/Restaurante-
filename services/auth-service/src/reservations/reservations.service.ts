import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from './entities/reservation.entity';
import { Mesa } from './entities/mesa.entity';
import { EstadoReservacion } from './entities/estado-reservacion.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class ReservationsService implements OnModuleInit {
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

  async onModuleInit() {
    await this.seedCatalogs();
  }

  private async seedCatalogs() {
    const estadosCount = await this.estadosRepo.count();
    if (estadosCount === 0) {
      await this.estadosRepo.save([
        this.estadosRepo.create({ nombre: 'Pendiente' }),
        this.estadosRepo.create({ nombre: 'Confirmada' }),
        this.estadosRepo.create({ nombre: 'Cancelada' }),
        this.estadosRepo.create({ nombre: 'Completada' }),
      ]);
      this.logger.log('Estados de reservación sembrados');
    }

    const mesasCount = await this.mesasRepo.count();
    if (mesasCount === 0) {
      const seedMesas = [
        { numero: 1, capacidad: 2, ubicacion: 'Terraza' },
        { numero: 2, capacidad: 2, ubicacion: 'Terraza' },
        { numero: 3, capacidad: 4, ubicacion: 'Terraza' },
        { numero: 4, capacidad: 4, ubicacion: 'Interior' },
        { numero: 5, capacidad: 4, ubicacion: 'Interior' },
        { numero: 6, capacidad: 4, ubicacion: 'Interior' },
        { numero: 7, capacidad: 6, ubicacion: 'Barra' },
        { numero: 8, capacidad: 6, ubicacion: 'Barra' },
        { numero: 9, capacidad: 6, ubicacion: 'Barra' },
        { numero: 10, capacidad: 8, ubicacion: 'VIP' },
        { numero: 11, capacidad: 8, ubicacion: 'VIP' },
        { numero: 12, capacidad: 8, ubicacion: 'VIP' },
      ];
      await this.mesasRepo.save(seedMesas.map((m) => this.mesasRepo.create(m)));
      this.logger.log('Mesas sembradas (12)');
    }
  }

  async create(dto: CreateReservationDto, userId?: number) {
    const allTables = await this.mesasRepo.find({ where: { activa: true } });
    const maxCapacity = Math.max(...allTables.map((t) => t.capacidad), 0);

    if (dto.num_personas > maxCapacity) {
      throw new BadRequestException(
        `No hay mesas con capacidad para ${dto.num_personas} personas (máximo ${maxCapacity})`,
      );
    }

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
      id_usuario: userId ?? null,
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
    this.logger.log(
      `Reservación creada: #${saved.id_reservacion} - Mesa ${disponible.numero}`,
    );

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
      mensaje:
        'Reservación registrada. Te esperamos en Xiú; al llegar indica tu nombre y el número de mesa.',
    };
  }

  async findAll() {
    return this.reservationsRepo.find({
      relations: { mesa: true, estado: true },
      order: { fecha: 'DESC', hora_inicio: 'DESC' },
    });
  }

  async findToday(fecha?: string) {
    const today = fecha || new Date().toISOString().split('T')[0];
    return this.reservationsRepo.find({
      where: { fecha: today },
      relations: { mesa: true, estado: true },
      order: { hora_inicio: 'ASC' },
    });
  }

  async findMine(userId: number, email?: string) {
    const where: Array<{ id_usuario?: number; cliente_email?: string }> = [];
    if (userId) where.push({ id_usuario: userId });
    if (email) where.push({ cliente_email: email });
    if (where.length === 0) return [];

    return this.reservationsRepo.find({
      where,
      order: { fecha: 'DESC', hora_inicio: 'DESC' },
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

    await this.reservationsRepo.update(id, { id_estado: estado.id_estado });

    return { message: `Reservación actualizada a "${estadoNombre}"` };
  }

  async remove(id: number, user?: { sub: number; email: string; rol: string }) {
    const reservation = await this.findOne(id);

    const isOwner =
      reservation.id_usuario === user?.sub ||
      (!!user?.email && reservation.cliente_email === user.email);

    if (user?.rol !== 'admin' && !isOwner) {
      throw new ForbiddenException(
        'No tienes permiso para cancelar esta reservación',
      );
    }

    const result = await this.reservationsRepo.delete(id);
    if (result.affected === 0)
      throw new NotFoundException('Reservación no encontrada');
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
    if (compatible.length === 0) return null;

    // Mesas ocupadas: reservas no canceladas cuyo horario se traslapa
    const booked = await this.reservationsRepo
      .createQueryBuilder('r')
      .select('r.id_mesa')
      .where('r.fecha = :fecha', { fecha })
      .andWhere('r.hora_inicio < :horaFin', { horaFin })
      .andWhere('r.hora_fin > :horaInicio', { horaInicio })
      .andWhere('r.id_estado != 3')
      .getMany();

    const bookedIds = booked.map((r) => r.id_mesa);
    return compatible.find((t) => !bookedIds.includes(t.id_mesa)) || null;
  }
}
