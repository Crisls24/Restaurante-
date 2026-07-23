import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/user.entity';

@Entity('estados_reservacion')
export class EstadoReservacion {
  @PrimaryGeneratedColumn()
  id_estado: number;

  @Column({ length: 50 })
  nombre: string;
}
