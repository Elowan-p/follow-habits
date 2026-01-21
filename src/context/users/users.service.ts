import { Injectable } from '@nestjs/common';
import * as usersType from './dto/users.dto';
import { UpdateUserDTO } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  private users = [
    { id: '1', name: 'John Doe', email: 'john@example.com' },
    { id: '2', name: 'Jane Doe', email: 'jane@example.com' },
  ];

  findAll(query: usersType.findAllDTO) {
    return {
      message: 'Tous les utilisateurs',
      data: this.users,
    };
  }

  findOne(params: usersType.findOneDTO) {
    const user = this.users.find((u) => u.id === params.id);
    return {
      message: 'Un utilisateur',
      data: user,
    };
  }

  update(id: string, updateUserDto: UpdateUserDTO) {
    const userIndex = this.users.findIndex((u) => u.id === id);
    if (userIndex > -1) {
      this.users[userIndex] = { ...this.users[userIndex], ...updateUserDto };
      return {
        message: 'Utilisateur modifié',
        data: this.users[userIndex],
      };
    }
    return null;
  }

  remove(id: string) {
    const userIndex = this.users.findIndex((u) => u.id === id);
    if (userIndex > -1) {
      const deletedUser = this.users[userIndex];
      this.users.splice(userIndex, 1);
      return {
        message: 'Utilisateur supprimé',
        data: deletedUser,
      };
    }
    return null;
  }
}
