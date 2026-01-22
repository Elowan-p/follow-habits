/* eslint-disable prettier/prettier */
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserCredentialEntity } from "./entities/user-credential.entity";
import { Repository } from "typeorm";

import { AuthRepositoryInterface } from "../auth.repository.interface";

@Injectable()
export class AuthRepository implements AuthRepositoryInterface {
    constructor(
        @InjectRepository(UserCredentialEntity)
        private readonly credentialRepository: Repository<UserCredentialEntity>,
    ){}

    async findCredentialByEmail(email: string): Promise<UserCredentialEntity | null>{
        return this.credentialRepository.findOne({where: {email}})
    }

    async createCredential(userCredential: UserCredentialEntity): Promise<UserCredentialEntity>{
        return this.credentialRepository.save(userCredential)
    }

    async updateCredential(userCredential: UserCredentialEntity): Promise<UserCredentialEntity>{
        return this.credentialRepository.save(userCredential)
    }

    async deleteCredential(userCredential: UserCredentialEntity): Promise<UserCredentialEntity>{
        return this.credentialRepository.remove(userCredential)
    }
}
