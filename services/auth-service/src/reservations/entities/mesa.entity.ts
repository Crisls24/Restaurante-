import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

@Entity('mesas')
export class Mesa {
  @PrimaryGeneratedColumn()
  id_mesa: number;

  @Column({ unique: true })
  numero: number;

  @Column()
  capacidad: number;

  @Column({ length: 100, nullable: true })
  ubicacion: string;

  @Column({ default: true })
  activa: boolean;
}
