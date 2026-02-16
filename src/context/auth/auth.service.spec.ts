import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { AuthRepositoryInterface } from './auth.repository.interface';
import { IJwtService } from './jwt.ports';
import { UsersRepositoryInterface } from '../users/users.repository.interface';
import { AuthError } from './error/auth.error';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;

  const mockAuthRepository = {
    createCredential: jest.fn(),
    findCredentialByEmail: jest.fn(),
    updateRefreshToken: jest.fn(),
  };

  const mockJwtService = {
    signToken: jest.fn(),
    verifyToken: jest.fn(),
  };

  const mockUsersRepository = {
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: AuthRepositoryInterface, useValue: mockAuthRepository },
        { provide: IJwtService, useValue: mockJwtService },
        { provide: UsersRepositoryInterface, useValue: mockUsersRepository },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const dto = {
        email: 'test@example.com',
        password: 'password',
        username: 'testuser',
      };
      const hashedPassword = 'hashedPassword';

      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      mockAuthRepository.createCredential.mockResolvedValue({
        id: '1',
        ...dto,
        passwordHashed: hashedPassword,
      });
      mockUsersRepository.create.mockResolvedValue({});

      const result = await service.register(dto);

      expect(bcrypt.hash).toHaveBeenCalledWith(dto.password, 10);
      expect(mockAuthRepository.createCredential).toHaveBeenCalled();
      expect(mockUsersRepository.create).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });

  describe('login', () => {
    it('should return tokens for valid credentials', async () => {
      const dto = { email: 'test@example.com', password: 'password' };
      const user = {
        id: '1',
        email: dto.email,
        passwordHashed: 'hashedPassword',
      };
      const tokens = { access_token: 'access', refresh_token: 'refresh' };

      mockAuthRepository.findCredentialByEmail.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedRefreshToken');
      mockJwtService.signToken.mockReturnValue(tokens);

      const result = await service.login(dto);

      expect(result).toEqual(tokens);
      expect(mockAuthRepository.updateRefreshToken).toHaveBeenCalled();
    });

    it('should throw AuthError for invalid email', async () => {
      mockAuthRepository.findCredentialByEmail.mockResolvedValue(null);

      await expect(
        service.login({ email: 'wrong@example.com', password: 'pwd' }),
      ).rejects.toThrow(AuthError);
    });

    it('should throw AuthError for invalid password', async () => {
      const user = {
        id: '1',
        email: 'test@example.com',
        passwordHashed: 'hashedPassword',
      };
      mockAuthRepository.findCredentialByEmail.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.login({ email: 'test@example.com', password: 'wrong' }),
      ).rejects.toThrow(AuthError);
    });
  });
});
