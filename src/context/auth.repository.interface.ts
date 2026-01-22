/* eslint-disable prettier/prettier */
import { UserCredentialEntity } from './auth/entities/user-credential.entity';


export abstract class AuthRepositoryInterface {
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  abstract findCredentialByEmail(email: string): Promise<UserCredentialEntity | null>;
  abstract createCredential(userCredential: UserCredentialEntity): Promise<UserCredentialEntity>;
  abstract updateCredential(userCredential: UserCredentialEntity): Promise<UserCredentialEntity>;
  abstract deleteCredential(userCredential: UserCredentialEntity): Promise<UserCredentialEntity>;
}
