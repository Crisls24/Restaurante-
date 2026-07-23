import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/user.entity';
import { Mesa } from './mesa.entity';
import { EstadoReservacion } from './estado-reservacion.entity';

@Entity('reservaciones')
export class Reservation {
  @PrimaryGeneratedColumn()
  id_reservacion: number;

  @Column({ nullable: true })
  id_usuario: number;

  @Column()
  id_mesa: number;

  @Column({ default: 1 })
  id_estado: number;

  @Column({ type: 'date' })
  fecha: string;

  @Column({ type: 'time' })
  hora_inicio: string;

  @Column({ type: 'time' })
  hora_fin: string;

  @Column()
  num_personas: number;

  @Column({ type: 'text', nullable: true })
  notas: string;

  @Column({ length: 100, nullable: true })
  cliente_nombre: string;

  @Column({ length: 15, nullable: true })
  cliente_telefono: string;

  @Column({ length: 150, nullable: true })
  cliente_email: string;

  @CreateDateColumn()
  fecha_creacion: Date;

  @ManyToOne(() => Mesa, { eager: true })
  @JoinColumn({ name: 'id_mesa' })
  mesa: Mesa;

  @ManyToOne(() => EstadoReservacion, { eager: true })
  @JoinColumn({ name: 'id_estado' })
  estado: EstadoReservacion;
}
