/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AuthCredentialEntity } from "./entities/auth-credential.entity";
import { Repository } from "typeorm";

import { AuthRepositoryInterface } from "./auth.repository.interface";

@Injectable()
export class AuthRepository implements AuthRepositoryInterface {
    constructor(
        @InjectRepository(AuthCredentialEntity)
        private readonly credentialRepository: Repository<AuthCredentialEntity>,
    ){}

    async findCredentialByEmail(email: string): Promise<AuthCredentialEntity | null>{
        return this.credentialRepository.findOne({where: {email}})
    }

    async createCredential(authCredential: AuthCredentialEntity): Promise<AuthCredentialEntity>{
        return this.credentialRepository.save(authCredential)
    }

    async updateCredential(authCredential: AuthCredentialEntity): Promise<AuthCredentialEntity>{
        return this.credentialRepository.save(authCredential)
    }

    async deleteCredential(authCredential: AuthCredentialEntity): Promise<AuthCredentialEntity>{
        return this.credentialRepository.remove(authCredential)
    }
}
