import { IAddAccountRepository } from '../../../../data/protocols/db/add-account-repository';
import { IAccountModel } from '../../../../domain/models/account';
import { IAddAccountModel } from '../../../../domain/usecases/add-account';
import { MongoHelper } from '../helpers/mongo-helper';
import { ObjectId } from 'mongodb';
import { ILoadAccountByEmailRepository } from '../../../../data/protocols/db/load-account-by-email-repository';
import { IUpdateAccessTokenRepository } from '../../../../data/protocols/db/update-access-token-repository';

export class AccountMongoRepository
  implements
    IAddAccountRepository,
    ILoadAccountByEmailRepository,
    IUpdateAccessTokenRepository
{
  async add(accountData: IAddAccountModel) {
    const accountCollection = await MongoHelper.getCollection('accounts');
    const result = await accountCollection.insertOne(accountData);
    const id = result.insertedId;
    const account = await accountCollection.findOne({ _id: new ObjectId(id) });
    return MongoHelper.map(account);
  }

  async loadByEmail(email: string): Promise<IAccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    const account = await accountCollection.findOne({ email });
    if (account) {
      return MongoHelper.map(account);
    }
  }

  async updateAccessToken(id: string, token: string): Promise<void> {
    const accountCollection = await MongoHelper.getCollection('accounts');
    await accountCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: { accessToken: token } },
    );
  }
}
