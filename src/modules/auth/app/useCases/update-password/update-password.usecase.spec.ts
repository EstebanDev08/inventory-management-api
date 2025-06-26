import { UUID } from 'crypto';

import { Test, TestingModule } from '@nestjs/testing';

import { AuthenticatedUser } from '#src/modules/auth/domain/jwt.repository';
import { GetUserByIduseCase } from '#src/modules/user/app/usecases/get-by-id/get-by-id.usecase';
import { UpdateUserUseCase } from '#src/modules/user/app/usecases/update/update.usecase';
import { ValidateUserPasswordUseCase } from '#src/modules/user/app/usecases/validate-password/validate-password.usecase';
import { UserRole } from '#src/modules/user/domain/entities/user.entity';
import { UnautorizedError } from '#src/shared/errors/unauthorized.error';

import { UpdatePasswordCommand } from './update-password.command';
import { UpdatePasswordUseCase } from './update-password.usecase';

describe('UpdatePasswordUseCase', () => {
  let useCase: UpdatePasswordUseCase;
  let mockValidateUserPasswordUseCase: jest.Mocked<ValidateUserPasswordUseCase>;
  let mockUpdateUserUseCase: jest.Mocked<UpdateUserUseCase>;
  let mockGetUserByIdUseCase: jest.Mocked<GetUserByIduseCase>;

  const userId = '12345678-1234-1234-1234-123456789012' as UUID;
  const mockAuthUser: AuthenticatedUser = {
    sub: userId,
    email: 'test@example.com',
    roles: [UserRole.CUSTOMER],
  };

  beforeEach(async () => {
    const mockValidatePassword = {
      run: jest.fn(),
    };

    const mockUpdateUser = {
      run: jest.fn(),
    };

    const mockGetUserById = {
      run: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdatePasswordUseCase,
        { provide: ValidateUserPasswordUseCase, useValue: mockValidatePassword },
        { provide: UpdateUserUseCase, useValue: mockUpdateUser },
        { provide: GetUserByIduseCase, useValue: mockGetUserById },
      ],
    }).compile();

    useCase = module.get<UpdatePasswordUseCase>(UpdatePasswordUseCase);
    mockValidateUserPasswordUseCase = module.get(ValidateUserPasswordUseCase);
    mockUpdateUserUseCase = module.get(UpdateUserUseCase);
    mockGetUserByIdUseCase = module.get(GetUserByIduseCase);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('run', () => {
    it('should update password successfully when current password is correct and new password is different', async () => {
      // Arrange
      const command = UpdatePasswordCommand.create({
        authUser: mockAuthUser,
        currentPassword: 'currentPassword123',
        newPassword: 'newPassword456',
      });

      mockGetUserByIdUseCase.run.mockResolvedValue({
        id: userId,
        email: 'test@example.com',
        name: 'Test User',
        roles: [UserRole.CUSTOMER],
      } as any);

      // Mock: current password is valid (first call)
      mockValidateUserPasswordUseCase.run
        .mockResolvedValueOnce({ user_id: userId, isMatching: true } as any)
        // Mock: new password is different (second call)
        .mockResolvedValueOnce({ user_id: userId, isMatching: false } as any);

      mockUpdateUserUseCase.run.mockResolvedValue({} as any);

      // Act
      await useCase.run(command);

      // Assert
      expect(mockGetUserByIdUseCase.run).toHaveBeenCalledWith({ id: userId });
      expect(mockValidateUserPasswordUseCase.run).toHaveBeenCalledTimes(2);
      expect(mockValidateUserPasswordUseCase.run).toHaveBeenNthCalledWith(1, {
        user_id: userId,
        password: 'currentPassword123',
      });
      expect(mockValidateUserPasswordUseCase.run).toHaveBeenNthCalledWith(2, {
        user_id: userId,
        password: 'newPassword456',
      });
      expect(mockUpdateUserUseCase.run).toHaveBeenCalledWith({
        id: userId,
        password: 'newPassword456',
      });
    });

    it('should throw UnautorizedError when current password is incorrect', async () => {
      // Arrange
      const command = UpdatePasswordCommand.create({
        authUser: mockAuthUser,
        currentPassword: 'wrongPassword',
        newPassword: 'newPassword123',
      });

      mockGetUserByIdUseCase.run.mockResolvedValue({} as any);
      mockValidateUserPasswordUseCase.run.mockResolvedValue({
        user_id: userId,
        isMatching: false,
      } as any);

      // Act & Assert
      await expect(useCase.run(command)).rejects.toThrow(
        new UnautorizedError('Cannot update password'),
      );

      expect(mockGetUserByIdUseCase.run).toHaveBeenCalledWith({ id: userId });
      expect(mockValidateUserPasswordUseCase.run).toHaveBeenCalledTimes(1);
      expect(mockValidateUserPasswordUseCase.run).toHaveBeenCalledWith({
        user_id: userId,
        password: 'wrongPassword',
      });
      expect(mockUpdateUserUseCase.run).not.toHaveBeenCalled();
    });

    it('should throw UnautorizedError when new password is same as current password', async () => {
      // Arrange
      const command = UpdatePasswordCommand.create({
        authUser: mockAuthUser,
        currentPassword: 'samePassword123',
        newPassword: 'samePassword123',
      });

      mockGetUserByIdUseCase.run.mockResolvedValue({} as any);
      // Mock: current password is valid (first call)
      mockValidateUserPasswordUseCase.run
        .mockResolvedValueOnce({ user_id: userId, isMatching: true } as any)
        // Mock: new password is same as current (second call)
        .mockResolvedValueOnce({ user_id: userId, isMatching: true } as any);

      // Act & Assert
      await expect(useCase.run(command)).rejects.toThrow(
        new UnautorizedError('Cannot update password'),
      );

      expect(mockGetUserByIdUseCase.run).toHaveBeenCalledWith({ id: userId });
      expect(mockValidateUserPasswordUseCase.run).toHaveBeenCalledTimes(2);
      expect(mockUpdateUserUseCase.run).not.toHaveBeenCalled();
    });

    it('should propagate error when getUserByIdUseCase fails', async () => {
      // Arrange
      const command = UpdatePasswordCommand.create({
        authUser: mockAuthUser,
        currentPassword: 'currentPassword123',
        newPassword: 'newPassword456',
      });

      const mockError = new Error('User not found');
      mockGetUserByIdUseCase.run.mockRejectedValue(mockError);

      // Act & Assert
      await expect(useCase.run(command)).rejects.toThrow(mockError);

      expect(mockGetUserByIdUseCase.run).toHaveBeenCalledWith({ id: userId });
      expect(mockValidateUserPasswordUseCase.run).not.toHaveBeenCalled();
      expect(mockUpdateUserUseCase.run).not.toHaveBeenCalled();
    });

    it('should propagate error when updateUserUseCase fails', async () => {
      // Arrange
      const command = UpdatePasswordCommand.create({
        authUser: mockAuthUser,
        currentPassword: 'currentPassword123',
        newPassword: 'newPassword456',
      });

      mockGetUserByIdUseCase.run.mockResolvedValue({} as any);
      mockValidateUserPasswordUseCase.run
        .mockResolvedValueOnce({ user_id: userId, isMatching: true } as any)
        .mockResolvedValueOnce({ user_id: userId, isMatching: false } as any);

      const mockError = new Error('Database error');
      mockUpdateUserUseCase.run.mockRejectedValue(mockError);

      // Act & Assert
      await expect(useCase.run(command)).rejects.toThrow(mockError);

      expect(mockGetUserByIdUseCase.run).toHaveBeenCalledWith({ id: userId });
      expect(mockValidateUserPasswordUseCase.run).toHaveBeenCalledTimes(2);
      expect(mockUpdateUserUseCase.run).toHaveBeenCalledWith({
        id: userId,
        password: 'newPassword456',
      });
    });

    it('should use correct authUser from command', async () => {
      // Arrange
      const differentUserId = '87654321-4321-4321-4321-210987654321' as UUID;
      const differentAuthUser: AuthenticatedUser = {
        sub: differentUserId,
        email: 'different@example.com',
        roles: [UserRole.SELLER],
      };

      const command = UpdatePasswordCommand.create({
        authUser: differentAuthUser,
        currentPassword: 'currentPassword123',
        newPassword: 'newPassword456',
      });

      mockGetUserByIdUseCase.run.mockResolvedValue({} as any);
      mockValidateUserPasswordUseCase.run
        .mockResolvedValueOnce({ user_id: differentUserId, isMatching: true } as any)
        .mockResolvedValueOnce({ user_id: differentUserId, isMatching: false } as any);
      mockUpdateUserUseCase.run.mockResolvedValue({} as any);

      // Act
      await useCase.run(command);

      // Assert
      expect(mockGetUserByIdUseCase.run).toHaveBeenCalledWith({ id: differentUserId });
      expect(mockValidateUserPasswordUseCase.run).toHaveBeenNthCalledWith(1, {
        user_id: differentUserId,
        password: 'currentPassword123',
      });
      expect(mockValidateUserPasswordUseCase.run).toHaveBeenNthCalledWith(2, {
        user_id: differentUserId,
        password: 'newPassword456',
      });
      expect(mockUpdateUserUseCase.run).toHaveBeenCalledWith({
        id: differentUserId,
        password: 'newPassword456',
      });
    });

    it('should throw UnautorizedError when validateUserPasswordUseCase fails on first call', async () => {
      // Arrange
      const command = UpdatePasswordCommand.create({
        authUser: mockAuthUser,
        currentPassword: 'currentPassword123',
        newPassword: 'newPassword456',
      });

      mockGetUserByIdUseCase.run.mockResolvedValue({} as any);
      const mockError = new Error('Validation service error');
      mockValidateUserPasswordUseCase.run.mockRejectedValue(mockError);

      // Act & Assert
      await expect(useCase.run(command)).rejects.toThrow(mockError);

      expect(mockGetUserByIdUseCase.run).toHaveBeenCalledWith({ id: userId });
      expect(mockValidateUserPasswordUseCase.run).toHaveBeenCalledTimes(1);
      expect(mockUpdateUserUseCase.run).not.toHaveBeenCalled();
    });
  });
});
