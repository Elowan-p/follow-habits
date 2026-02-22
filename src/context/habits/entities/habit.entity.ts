import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { TrackingEntity } from '../../tracking/entities/tracking.entity';
import { HabitCategory } from '../enums/habit-category.enum';

@Entity('habits')
export class HabitEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, (user) => user.habits, { onDelete: 'CASCADE' })
  user: UserEntity;

  // Relation inverse
  @OneToMany(() => TrackingEntity, (tracking) => tracking.habit)
  trackings: TrackingEntity[];

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: HabitCategory,
    default: HabitCategory.OTHER,
  })
  category: HabitCategory;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
