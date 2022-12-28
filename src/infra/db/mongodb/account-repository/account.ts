import { IAddAccountRepository } from '../../../../data/protocols/db/add-account-repository';
import { IAccountModel } from '../../../../domain/models/account';
import { IAddAccountModel } from '../../../../domain/usecases/add-account';
import { MongoHelper } from '../helpers/mongo-helper';
import { ObjectId } from 'mongodb';
import { ILoadAccountByEmailRepository } from '../../../../data/protocols/db/load-account-by-email-repository';

export class AccountMongoRepository
  implements IAddAccountRepository, ILoadAccountByEmailRepository
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
}
