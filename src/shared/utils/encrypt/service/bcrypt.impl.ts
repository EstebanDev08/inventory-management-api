import bcrypt from 'bcrypt';

import { injectable } from '#src/shared/decorator/injectable.decorator';

import { IEncryptor } from '../domain/encryptRepository';

@injectable()
export class EncryptImpl implements IEncryptor {
  private readonly saltRounds = 10;

  async encrypt(textPlain: string) {
    return bcrypt.hash(textPlain, this.saltRounds);
  }

  async compare(textPlain: string, hashText: string) {
    return bcrypt.compare(textPlain, hashText);
  }
}
