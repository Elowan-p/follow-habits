import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RIGHTS_KEY } from '../decorators/require-rights.decorator';
import { RightsUtils } from '../rights.utils';
import { UserEntity } from '../../../context/users/entities/user.entity';

@Injectable()
export class RightsGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRights = this.reflector.getAllAndOverride<bigint>(RIGHTS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRights) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user || !user.rights) {
        throw new ForbiddenException('Insufficient rights: No user rights found');
    }
    const userRights = typeof user.rights === 'string' ? BigInt(user.rights) : BigInt(user.rights);

    if (!RightsUtils.hasAll(userRights, requiredRights)) {
      throw new ForbiddenException('Insufficient rights');
    }

    return true;
  }
}
