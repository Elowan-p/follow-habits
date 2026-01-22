import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('trackings')
export class TrackingEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  habitId: string;

  @Column({ type: 'datetime' })
  date: Date;

  @Column({ type: 'varchar', length: 50 })
  status: string; // ex: "completed", "skipped"

  @CreateDateColumn()
  createdAt: Date;
}
