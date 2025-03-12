import bcrypt from 'bcrypt';

import { EncryptImpl } from './bcrypt.impl';

jest.mock('bcrypt');

describe('EncryptImpl', () => {
  let encryptImpl: EncryptImpl;

  beforeEach(() => {
    encryptImpl = new EncryptImpl();
  });

  describe('encrypt', () => {
    it('should encrypt a plain text', async () => {
      const plainText = 'password123';
      const hashedText = 'hashedPassword123';
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedText);

      const result = await encryptImpl.encrypt(plainText);

      expect(bcrypt.hash).toHaveBeenCalledWith(plainText, 10);
      expect(result).toBe(hashedText);
    });

    it('should use provided salt rounds', async () => {
      const plainText = 'password123';
      const hashedText = 'hashedPassword123';
      const saltRounds = 12;
      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedText);

      const result = await encryptImpl.encrypt(plainText, saltRounds);

      expect(bcrypt.hash).toHaveBeenCalledWith(plainText, saltRounds);
      expect(result).toBe(hashedText);
    });
  });

  describe('compare', () => {
    it('should compare a plain text with a hash', async () => {
      const plainText = 'password123';
      const hashText = 'hashedPassword123';
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await encryptImpl.compare(plainText, hashText);

      expect(bcrypt.compare).toHaveBeenCalledWith(plainText, hashText);
      expect(result).toBe(true);
    });

    it('should return false if comparison fails', async () => {
      const plainText = 'password123';
      const hashText = 'hashedPassword123';
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      const result = await encryptImpl.compare(plainText, hashText);

      expect(bcrypt.compare).toHaveBeenCalledWith(plainText, hashText);
      expect(result).toBe(false);
    });
  });
});
