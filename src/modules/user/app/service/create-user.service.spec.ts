import { ITransaction } from '#src/shared/database/transaction.interface';
import { ResourceAlreadyExistsError } from '#src/shared/errors/resourceAlreadyExists.error';
import { IEncryptor } from '#src/shared/utils/index';

import { User, UserRole } from '../../domain/entities/user.entity';
import { IUserRepository } from '../../domain/user.repository';

import { CreateUserService } from './create-user.service';

jest.mock('../../domain/user.repository');
jest.mock('#src/shared/utils/index');

describe('CreateUserService', () => {
  let createUserService: CreateUserService;
  let userRepo: jest.Mocked<IUserRepository>;
  let encryptor: jest.Mocked<IEncryptor>;
  let tx: ITransaction;

  beforeEach(() => {
    userRepo = {
      findByEmail: jest.fn(),
      create: jest.fn(),
    } as unknown as jest.Mocked<IUserRepository>;

    encryptor = {
      encrypt: jest.fn(),
    } as unknown as jest.Mocked<IEncryptor>;

    createUserService = new CreateUserService(userRepo, encryptor);
    tx = {} as ITransaction;
  });

  it('should create a new user successfully', async () => {
    userRepo.findByEmail.mockResolvedValue(null);
    encryptor.encrypt.mockResolvedValue('hashedPassword');
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password',
      role: 'user',
    };

    const user = await createUserService.run(userData, tx);

    expect(userRepo.findByEmail).toHaveBeenCalledWith('john@example.com');
    expect(encryptor.encrypt).toHaveBeenCalledWith('password');
    expect(userRepo.create).toHaveBeenCalledWith(expect.any(User), tx);
    expect(user).toEqual(
      expect.objectContaining({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedPassword',
        role: 'user',
      }),
    );
  });

  it('should throw ResourceAlreadyExistsError if user already exists', async () => {
    userRepo.findByEmail.mockResolvedValue(
      User.create({
        id: '00000000-0000-0000-0000-000000000000',
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password',
        role: UserRole.SELLER,
      }),
    );

    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password',
      role: UserRole.SELLER,
    };

    await expect(createUserService.run(userData, tx)).rejects.toThrow(ResourceAlreadyExistsError);
    expect(userRepo.findByEmail).toHaveBeenCalledWith('john@example.com');
    expect(encryptor.encrypt).not.toHaveBeenCalled();
    expect(userRepo.create).not.toHaveBeenCalled();
  });

  it('should encrypt the password before creating the user', async () => {
    userRepo.findByEmail.mockResolvedValue(null);
    encryptor.encrypt.mockResolvedValue('hashedPassword');
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password',
      role: 'user',
    };

    await createUserService.run(userData, tx);

    expect(encryptor.encrypt).toHaveBeenCalledWith('password');
  });
});
