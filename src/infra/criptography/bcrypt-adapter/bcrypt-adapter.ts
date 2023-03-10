import { IHasher } from '../../../data/protocols/criptography/hasher';
import { hash, compare } from 'bcrypt';
import { IHashComparer } from '../../../data/protocols/criptography/hash-comparer';

export class BcryptAdapter implements IHasher, IHashComparer {
  constructor(private readonly salt: number) {}

  async hash(value: string): Promise<string> {
    const hashedPassword = await hash(value, this.salt);
    return hashedPassword;
  }

  async compare(value: string, hash: string): Promise<boolean> {
    const isValid = await compare(value, hash);
    return isValid;
  }
}
