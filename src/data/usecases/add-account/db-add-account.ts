import {
  IAccountModel,
  IAddAccount,
  IAddAccountModel,
  IAddAccountRepository,
  IEncrypter,
} from './db-add-account-protocols';

export class DbAddAccount implements IAddAccount {
  private readonly encrypter: IEncrypter;
  private readonly addAccountRepository: IAddAccountRepository;

  constructor(encrypter: IEncrypter, addAccountRepository: IAddAccountRepository) {
    this.encrypter = encrypter;
    this.addAccountRepository = addAccountRepository;
  }
  async add(accountData: IAddAccountModel): Promise<IAccountModel> {
    const { name, email, password } = accountData;
    const hashedPassword = await this.encrypter.encrypt(password);
    await this.addAccountRepository.add({ name, email, password: hashedPassword });
    return Promise.resolve(null);
  }
}
