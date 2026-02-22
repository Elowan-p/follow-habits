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

import { RightsInterface } from '../../../core/rights/rights.interface';

@Entity('users')
export class UserEntity implements RightsInterface {
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

  @Column({
    type: 'bigint',
    default: 0,
    transformer: {
      to: (value: bigint) => value,
      from: (value: string) => BigInt(value),
    },
  })
  rights: bigint;

  @OneToOne(() => AuthCredentialEntity, (auth) => auth.user)
  auth: AuthCredentialEntity;

  @OneToMany(() => HabitEntity, (habit) => habit.user)
  habits: HabitEntity[];

  @OneToMany(() => StatEntity, (stat) => stat.user)
  stats: StatEntity[];
}
