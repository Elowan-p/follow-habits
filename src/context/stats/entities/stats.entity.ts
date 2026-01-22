import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';

@Entity('stats')
export class StatEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => UserEntity, (user) => user.stats, { onDelete: 'CASCADE' })
  user: UserEntity;

  @Column({ type: 'float' })
  value: number;

  @CreateDateColumn()
  createdAt: Date;
}
