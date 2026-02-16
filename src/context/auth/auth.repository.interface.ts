/* eslint-disable prettier/prettier */
import { AuthCredentialEntity } from './entities/auth-credential.entity';

export abstract class AuthRepositoryInterface {
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  abstract findCredentialByEmail(
    email: string,
  ): Promise<AuthCredentialEntity | null>;
  abstract createCredential(
    userCredential: AuthCredentialEntity,
  ): Promise<AuthCredentialEntity>;
  abstract updateCredential(
    userCredential: AuthCredentialEntity,
  ): Promise<AuthCredentialEntity>;
  abstract deleteCredential(
    userCredential: AuthCredentialEntity,
  ): Promise<AuthCredentialEntity>;
  abstract updateRefreshToken(
    id: string,
    refreshTokenHashed: string | null,
  ): Promise<void>;
}
