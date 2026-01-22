import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { UsersRepositoryInterface } from './users.repository.interface';

@Injectable()
export class UsersRepository implements UsersRepositoryInterface {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {}

  async findAll(): Promise<UserEntity[]> {
    return this.repository.find();
  }

  async findOneById(id: string): Promise<UserEntity | null> {
    return this.repository.findOne({ where: { id } });
  }

  async update(user: UserEntity): Promise<UserEntity> {
    return this.repository.save(user);
  }

  async remove(user: UserEntity): Promise<UserEntity> {
    return this.repository.remove(user);
  }

  async create(user: UserEntity): Promise<UserEntity> {
    return this.repository.save(user);
  }
}
