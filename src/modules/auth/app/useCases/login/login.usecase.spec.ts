import { User } from '#src/modules/user/domain/entities/user.entity';
import { IUserRepository } from '#src/modules/user/domain/user.repository';
import { UnautorizedError } from '#src/shared/errors/unauthorized.error';
import { IEncryptor } from '#src/shared/utils/index';

import { LoginDto } from '../../dto/login.dto';
import { AuthService } from '../../services/auth.service';

import { LoginCommand } from './login.command';
import { LoginUseCase } from './login.usecase';

describe('LoginUseCase', () => {
  let loginUseCase: LoginUseCase;
  let mockUserRepository: jest.Mocked<IUserRepository>;
  let mockEncryptor: jest.Mocked<IEncryptor>;
  let mockAuthService: jest.Mocked<AuthService>;

  // Datos de prueba
  const validEmail = 'test@example.com';
  const validPassword = 'password123';
  const hashedPassword = 'hashed_password';
  const mockUser = User.create({
    id: '00000000-0000-0000-0000-000000000001',
    email: validEmail,
    password: hashedPassword,
    name: 'Test User',
    role: 'customer',
  });
  const mockToken = { accessToken: 'jwt-token', expiresIn: 3600 };

  beforeEach(() => {
    // Crear mocks para todas las dependencias
    mockUserRepository = {
      findByEmail: jest.fn(),
    } as any;

    mockEncryptor = {
      compare: jest.fn(),
    } as any;

    mockAuthService = {
      generateUserToken: jest.fn(),
    } as any;

    // Crear la instancia a probar
    loginUseCase = new LoginUseCase(mockUserRepository, mockEncryptor, mockAuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw UnautorizedError when user is not found', async () => {
    // Arrange
    mockUserRepository.findByEmail.mockResolvedValue(null);
    const command = LoginCommand.create({
      email: 'nonexistent@example.com',
      password: validPassword,
    });

    // Act & Assert
    await expect(loginUseCase.run(command)).rejects.toThrow(UnautorizedError);
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(command.email);
    expect(mockEncryptor.compare).not.toHaveBeenCalled();
  });

  it('should throw UnautorizedError when password does not match', async () => {
    // Arrange
    mockUserRepository.findByEmail.mockResolvedValue(mockUser);
    mockEncryptor.compare.mockResolvedValue(false);
    const command = LoginCommand.create({
      email: validEmail,
      password: 'wrong_password',
    });

    // Act & Assert
    await expect(loginUseCase.run(command)).rejects.toThrow(UnautorizedError);
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(command.email);
    expect(mockEncryptor.compare).toHaveBeenCalledWith(command.password, mockUser.password);
    expect(mockAuthService.generateUserToken).not.toHaveBeenCalled();
  });

  it('should return LoginDto with token when credentials are valid', async () => {
    // Arrange
    mockUserRepository.findByEmail.mockResolvedValue(mockUser);
    mockEncryptor.compare.mockResolvedValue(true);
    mockAuthService.generateUserToken.mockReturnValue(mockToken.accessToken);
    const command = LoginCommand.create({
      email: validEmail,
      password: validPassword,
    });

    // Act
    const result = await loginUseCase.run(command);

    // Assert
    expect(result).toBeInstanceOf(LoginDto);
    expect(result).toEqual(new LoginDto(mockToken.accessToken));
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(command.email);
    expect(mockEncryptor.compare).toHaveBeenCalledWith(command.password, mockUser.password);
    expect(mockAuthService.generateUserToken).toHaveBeenCalledWith(mockUser);
  });
});
