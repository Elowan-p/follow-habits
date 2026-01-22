import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { AuthCredentialEntity } from '../../auth/entities/auth-credential.entity';
import { HabitEntity } from '../../habits/entities/habit.entity';
import { StatEntity } from '../../stats/entities/stats.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @OneToOne(() => AuthCredentialEntity, (auth) => auth.user)
  auth: AuthCredentialEntity;

  // Placeholder for other relations to avoid errors before defining them
  @OneToMany(() => HabitEntity, (habit) => habit.user)
  habits: HabitEntity[];

  @OneToMany(() => StatEntity, (stat) => stat.user)
  stats: StatEntity[];
}
