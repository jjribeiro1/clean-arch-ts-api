import {
  IAuthentication,
  IAuthenticationModel,
  ILoadAccountByEmailRepository,
  IHashComparer,
  IEncrypter,
  IUpdateAccessTokenRepository,
} from './db-authentication-protocols';

export class DbAuthentication implements IAuthentication {
  constructor(
    private readonly loadAccountByEmailRepository: ILoadAccountByEmailRepository,
    private readonly hashComparer: IHashComparer,
    private readonly encrypter: IEncrypter,
    private readonly updateAccessTokenRepository: IUpdateAccessTokenRepository,
  ) {}
  async auth(authentication: IAuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(
      authentication.email,
    );

    if (account) {
      const passwordIsValid = await this.hashComparer.compare(
        authentication.password,
        account.password,
      );
      if (passwordIsValid) {
        const accessToken = await this.encrypter.encrypt(account.id);
        await this.updateAccessTokenRepository.updateAccessToken(account.id, accessToken);
        return accessToken;
      }
    }
    return null;
  }
}
