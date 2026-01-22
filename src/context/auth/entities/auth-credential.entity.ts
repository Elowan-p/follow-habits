import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';

@Entity('auth_credentials')
export class AuthCredentialEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'password_hashed', type: 'varchar', length: 255 })
  passwordHashed: string;

  @Column({
    name: 'refresh_token_hashed',
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  refreshTokenHashed: string;

  @Index({ unique: true })
  @Column({ name: 'email', type: 'varchar', length: 255 })
  email: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @OneToOne(() => UserEntity, (user) => user.auth, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: UserEntity;
}
