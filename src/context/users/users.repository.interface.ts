import { UserEntity } from './entities/user.entity';

export abstract class UsersRepositoryInterface {
  abstract findAll(): Promise<UserEntity[]>;
  abstract findOneById(id: string): Promise<UserEntity | null>;
  abstract update(user: UserEntity): Promise<UserEntity>;
  abstract remove(user: UserEntity): Promise<UserEntity>;
  abstract create(user: UserEntity): Promise<UserEntity>;
}
