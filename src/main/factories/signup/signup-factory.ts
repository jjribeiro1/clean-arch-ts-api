import { SignUpController } from '../../../presentation/controllers/signup/signup-controller';
import { DbAddAccount } from '../../../data/usecases/add-account/db-add-account';
import { BcryptAdapter } from '../../../infra/criptography/bcrypt-adapter/bcrypt-adapter';
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository';
import { LogControllerDecorator } from '../../decorators/log-controller-decorator';
import { IController } from '../../../presentation/protocols';
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-mongo-repository';
import { makeSignUpValidation } from './signup-validation-factory';

export const makeSignUpController = (): IController => {
  const salt = 12;
  const bcryptAdapter = new BcryptAdapter(salt);
  const accountMongoRepository = new AccountMongoRepository();
  const dbAddAccount = new DbAddAccount(bcryptAdapter, accountMongoRepository);
  const signupController = new SignUpController(
    dbAddAccount,
    makeSignUpValidation(),
  );
  const logMongoRepository = new LogMongoRepository();

  return new LogControllerDecorator(signupController, logMongoRepository);
};
