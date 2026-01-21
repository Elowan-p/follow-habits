import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('user_credentials')
export class UserCredentialEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'password_hashed', type: 'varchar', length: 255 })
  passwordHashed: string;

  @Index({ unique: true })
  @Column({ name: 'email', type: 'varchar', length: 255 })
  email: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;
}
