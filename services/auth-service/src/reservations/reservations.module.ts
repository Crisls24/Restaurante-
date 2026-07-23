import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Reservation } from './entities/reservation.entity';
import { Mesa } from './entities/mesa.entity';
import { EstadoReservacion } from './entities/estado-reservacion.entity';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reservation, Mesa, EstadoReservacion]),
    forwardRef(() => NotificationsModule),
  ],
  controllers: [ReservationsController],
  providers: [ReservationsService],
  exports: [ReservationsService],
})
export class ReservationsModule {}
