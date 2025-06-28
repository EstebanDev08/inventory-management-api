import { UUID } from 'crypto';

import { Test, TestingModule } from '@nestjs/testing';

import { AuthenticatedUser } from '#src/modules/auth/domain/jwt.repository';
import { GetUserByIduseCase } from '#src/modules/user/app/usecases/get-by-id/get-by-id.usecase';
import { UserRole } from '#src/modules/user/domain/entities/user.entity';

import { CurrentUserDto } from '../../dto/current-user.dto';

import { GetCurrentUserCommand } from './get-current-user.command';
import { GetCurrentUserUseCase } from './get-current-user.usecase';

describe('GetCurrentUserUseCase', () => {
  let useCase: GetCurrentUserUseCase;
  let mockGetUserByIdUseCase: jest.Mocked<GetUserByIduseCase>;

  const userId = '12345678-1234-1234-1234-123456789012' as UUID;
  const mockAuthUser: AuthenticatedUser = {
    sub: userId,
    email: 'test@example.com',
    roles: [UserRole.CUSTOMER],
  };

  beforeEach(async () => {
    const mockGetUserById = {
      run: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GetCurrentUserUseCase,
        { provide: GetUserByIduseCase, useValue: mockGetUserById },
      ],
    }).compile();

    useCase = module.get<GetCurrentUserUseCase>(GetCurrentUserUseCase);
    mockGetUserByIdUseCase = module.get(GetUserByIduseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('run', () => {
    it('should return current user information successfully', async () => {
      // Arrange
      const command = GetCurrentUserCommand.create({
        authUser: mockAuthUser,
      });

      const mockUser = {
        id: userId,
        name: 'Test User',
        email: 'test@example.com',
        roles: [UserRole.CUSTOMER],
      };

      mockGetUserByIdUseCase.run.mockResolvedValue(mockUser as any);

      // Act
      const result = await useCase.run(command);

      // Assert
      expect(result).toBeInstanceOf(CurrentUserDto);
      expect(result.id).toBe(userId);
      expect(result.name).toBe('Test User');
      expect(result.email).toBe('test@example.com');
      expect(result.roles).toEqual([UserRole.CUSTOMER]);

      expect(mockGetUserByIdUseCase.run).toHaveBeenCalledWith({ id: userId });
      expect(mockGetUserByIdUseCase.run).toHaveBeenCalledTimes(1);
    });

    it('should return updated user information from database', async () => {
      // Arrange
      const command = GetCurrentUserCommand.create({
        authUser: mockAuthUser,
      });

      // Usuario con información actualizada en la base de datos
      const mockUpdatedUser = {
        id: userId,
        name: 'Updated Name',
        email: 'updated@example.com',
        roles: [UserRole.CUSTOMER, UserRole.SELLER],
      };

      mockGetUserByIdUseCase.run.mockResolvedValue(mockUpdatedUser as any);

      // Act
      const result = await useCase.run(command);

      // Assert
      expect(result.name).toBe('Updated Name');
      expect(result.email).toBe('updated@example.com');
      expect(result.roles).toEqual([UserRole.CUSTOMER, UserRole.SELLER]);
    });

    it('should propagate error when getUserByIdUseCase fails', async () => {
      // Arrange
      const command = GetCurrentUserCommand.create({
        authUser: mockAuthUser,
      });

      const mockError = new Error('User not found');
      mockGetUserByIdUseCase.run.mockRejectedValue(mockError);

      // Act & Assert
      await expect(useCase.run(command)).rejects.toThrow(mockError);

      expect(mockGetUserByIdUseCase.run).toHaveBeenCalledWith({ id: userId });
    });

    it('should use correct user ID from auth token', async () => {
      // Arrange
      const differentUserId = '87654321-4321-4321-4321-210987654321' as UUID;
      const differentAuthUser: AuthenticatedUser = {
        sub: differentUserId,
        email: 'different@example.com',
        roles: [UserRole.ADMIN],
      };

      const command = GetCurrentUserCommand.create({
        authUser: differentAuthUser,
      });

      const mockUser = {
        id: differentUserId,
        name: 'Different User',
        email: 'different@example.com',
        roles: [UserRole.ADMIN],
      };

      mockGetUserByIdUseCase.run.mockResolvedValue(mockUser as any);

      // Act
      const result = await useCase.run(command);

      // Assert
      expect(result.id).toBe(differentUserId);
      expect(mockGetUserByIdUseCase.run).toHaveBeenCalledWith({ id: differentUserId });
    });
  });
});
