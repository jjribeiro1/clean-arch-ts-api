import {
  IAccountModel,
  IAddAccount,
  IAddAccountModel,
  IAddAccountRepository,
  IHasher,
} from './db-add-account-protocols';

export class DbAddAccount implements IAddAccount {
  private readonly hasher: IHasher;
  private readonly addAccountRepository: IAddAccountRepository;

  constructor(hasher: IHasher, addAccountRepository: IAddAccountRepository) {
    this.hasher = hasher;
    this.addAccountRepository = addAccountRepository;
  }
  async add(accountData: IAddAccountModel): Promise<IAccountModel> {
    const { name, email, password } = accountData;
    const hashedPassword = await this.hasher.hash(password);
    const account = await this.addAccountRepository.add({
      name,
      email,
      password: hashedPassword,
    });
    return account;
  }
}
