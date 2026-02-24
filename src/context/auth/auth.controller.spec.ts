import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { loginDTO } from './dto/login.dto';
import { registerDTO } from './dto/register.dto';
import { LoginPresenter } from './presenter/login.presenter';
import { RegisterPresenter } from './presenter/register.presenter';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    login: jest.fn(),
    register: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should call authService.login and return LoginPresenter', () => {
      const dto: loginDTO = { email: 'test@test.com', password: 'password123' };
      const serviceResponse = { accessToken: 'jwt-token', user: { id: '1' } };

      mockAuthService.login.mockReturnValue(serviceResponse);

      const result = controller.login(dto);

      expect(mockAuthService.login).toHaveBeenCalledWith(dto);
      expect(result).toBeInstanceOf(LoginPresenter);
      expect(result.accessToken).toBe('jwt-token');
    });
  });

  describe('register', () => {
    it('should call authService.register and return RegisterPresenter', () => {
      const dto: registerDTO = {
        username: 'testuser',
        email: 'test@test.com',
        password: 'password123',
      };
      const serviceResponse = { accessToken: 'jwt-token', user: { id: '1' } };

      mockAuthService.register.mockReturnValue(serviceResponse);

      const result = controller.register(dto);

      expect(mockAuthService.register).toHaveBeenCalledWith(dto);
      expect(result).toBeInstanceOf(RegisterPresenter);
      expect(result.accessToken).toBe('jwt-token');
    });
  });
});
