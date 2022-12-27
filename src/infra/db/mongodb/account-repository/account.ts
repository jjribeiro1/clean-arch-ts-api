import { IAddAccountRepository } from '../../../../data/protocols/db/add-account-repository';
import { IAccountModel } from '../../../../domain/models/account';
import { IAddAccountModel } from '../../../../domain/usecases/add-account';
import { MongoHelper } from '../helpers/mongo-helper';
import { ObjectId } from 'mongodb';

export class AccountMongoRepository implements IAddAccountRepository {
  async add(accountData: IAddAccountModel) {
    const accountCollection = await MongoHelper.getCollection('accounts');
    const result = await accountCollection.insertOne(accountData);
    const id = result.insertedId;
    const dataToReturn = await accountCollection.findOne({ _id: new ObjectId(id) });
    const mappedReturn: IAccountModel = MongoHelper.map(dataToReturn);
    return mappedReturn;
  }
}
