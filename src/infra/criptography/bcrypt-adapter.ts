import { IHasher } from '../../data/protocols/criptography/hasher';
import { hash } from 'bcrypt';

export class BcryptAdapter implements IHasher {
  private readonly salt: number;
  constructor(salt: number) {
    this.salt = salt;
  }
  async hash(value: string): Promise<string> {
    const hashedPassword = await hash(value, this.salt);
    return hashedPassword;
  }
}
