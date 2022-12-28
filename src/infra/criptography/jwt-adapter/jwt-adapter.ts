import { IEncrypter } from '../../../data/protocols/criptography/encrypter';
import jwt from 'jsonwebtoken';

export class JwtAdapter implements IEncrypter {
  private readonly secret: string;

  constructor(secret: string) {
    this.secret = secret;
  }
  async encrypt(value: string): Promise<string> {
    const accessToken = await jwt.sign({ id: value }, this.secret);
    return accessToken
  }
}