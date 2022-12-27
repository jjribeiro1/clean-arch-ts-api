import { IAuthenticationModel } from '../../../domain/usecases/authentication';
import { ILoadAccountByEmailRepository } from '../../protocols/load-account-by-email-repository';
import { IAccountModel } from '../add-account/db-add-account-protocols';
import { DbAuthentication } from './db-authentication';

describe('DbAuthentication UseCase', () => {
  const makeFakeAccount = (): IAccountModel => ({
    id: 'any_id',
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
  });

  const makeFakeAuthentication = (): IAuthenticationModel => ({
    email: 'any_email@mail.com',
    password: 'any_password',
  });

  const makeLoadAccountByEmailRepository = (): ILoadAccountByEmailRepository => {
    class LoadAccountByEmailRepositoryStub implements ILoadAccountByEmailRepository {
      async load(email: string): Promise<IAccountModel> {
        return Promise.resolve(makeFakeAccount());
      }
    }
    return new LoadAccountByEmailRepositoryStub();
  };

  interface ISutTypes {
    sut: DbAuthentication;
    loadAccountByEmailRepositoryStub: ILoadAccountByEmailRepository;
  }

  const makeSut = (): ISutTypes => {
    const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
    const sut = new DbAuthentication(loadAccountByEmailRepositoryStub);
    return {
      sut,
      loadAccountByEmailRepositoryStub,
    };
  };

  test('Should call LoadAccountByEmail with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load');
    await sut.auth(makeFakeAuthentication());
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com');
  });
});
