import { SetMetadata } from '@nestjs/common';

export const RIGHTS_KEY = 'rights';
export const RequireRights = (rights: bigint) =>
  SetMetadata(RIGHTS_KEY, rights);
