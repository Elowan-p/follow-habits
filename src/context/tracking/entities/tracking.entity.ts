import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { HabitEntity } from '../../habits/entities/habit.entity';

@Entity('trackings')
export class TrackingEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => HabitEntity, (habit) => habit.trackings, {
    onDelete: 'CASCADE',
  })
  habit: HabitEntity;

  @Column({ type: 'datetime' })
  date: Date;

  @Column({ type: 'varchar', length: 50 })
  status: string; // ex: "completed", "skipped"

  @CreateDateColumn()
  createdAt: Date;
}
