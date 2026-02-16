import { Injectable } from '@nestjs/common';
import * as usersType from './dto/users.dto';
import { UpdateUserDTO } from './dto/update-user.dto';
import { UsersRepositoryInterface } from './users.repository.interface';
import { UsersError } from './error/users.error';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepositoryInterface) {}

  async findAll(_query: usersType.findAllDTO) {
    const users = await this.usersRepository.findAll();
    return {
      message: 'Tous les utilisateurs',
      data: users,
    };
  }

  async findOne(params: usersType.findOneDTO) {
    const user = await this.usersRepository.findOneById(params.id);
    if (!user) {
      throw new UsersError({
        code: 'USER_NOT_FOUND',
        message: `L'utilisateur recherché n'a pas été trouvé`,
        statusCode: 404,
      });
    }
    return {
      message: 'Un utilisateur',
      data: user,
    };
  }

  async update(id: string, updateUserDto: UpdateUserDTO) {
    const user = await this.usersRepository.findOneById(id);
    if (!user) {
      throw new UsersError({
        code: 'USER_NOT_FOUND',
        message: `L'utilisateur recherché n'a pas été trouvé`,
        statusCode: 404,
      });
    }

    const userToUpdate = { ...user, ...updateUserDto };

    const updatedUser = await this.usersRepository.update(userToUpdate);

    return {
      message: 'Utilisateur modifié',
      data: updatedUser,
    };
  }

  async remove(id: string) {
    const user = await this.usersRepository.findOneById(id);
    if (!user) {
      throw new UsersError({
        code: 'USER_NOT_FOUND',
        message: `L'utilisateur recherché n'a pas été trouvé`,
        statusCode: 404,
      });
    }

    await this.usersRepository.remove(user);

    return {
      message: 'Utilisateur supprimé',
      data: user,
    };
  }
}
