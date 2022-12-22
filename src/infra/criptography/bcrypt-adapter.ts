import { IEncrypter } from '../../data/protocols/encrypter';
import { hash } from 'bcrypt';

export class BcryptAdapter implements IEncrypter {
  private readonly salt: number;
  constructor(salt: number) {
    this.salt = salt;
  }
  async encrypt(value: string): Promise<string> {
    const hashedPassword = await hash(value, this.salt);
    return hashedPassword;
  }
}
