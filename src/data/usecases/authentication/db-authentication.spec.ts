import { IAuthenticationModel } from '../../../domain/usecases/authentication';
import { IHashComparer } from '../../protocols/criptography/hash-comparer';
import { ILoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository';
import { IAccountModel } from '../add-account/db-add-account-protocols';
import { DbAuthentication } from './db-authentication';

describe('DbAuthentication UseCase', () => {
  const makeFakeAccount = (): IAccountModel => ({
    id: 'any_id',
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'hashed_password',
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

  const makeHashComparer = (): IHashComparer  => {
    class HashComparerStub implements IHashComparer {
      async compare(value: string, hash: string): Promise<boolean> {
        return Promise.resolve(true);
      }
    }
    return new HashComparerStub();
  };

  interface ISutTypes {
    sut: DbAuthentication;
    loadAccountByEmailRepositoryStub: ILoadAccountByEmailRepository;
    hashComparerStub: IHashComparer;
  }

  const makeSut = (): ISutTypes => {
    const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
    const hashComparerStub = makeHashComparer();
    const sut = new DbAuthentication(loadAccountByEmailRepositoryStub, hashComparerStub);
    return {
      sut,
      loadAccountByEmailRepositoryStub,
      hashComparerStub
    };
  };

  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load');
    await sut.auth(makeFakeAuthentication());
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com');
  });

  test('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(Promise.reject(new Error()))
    const promise =  sut.auth(makeFakeAuthentication());
    await expect(promise).rejects.toThrow()
  });

  test('Should return null if LoadAccountByEmailRepository returns null', async () => {
    const { sut, loadAccountByEmailRepositoryStub } = makeSut();
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(null)
    const accessToken = await sut.auth(makeFakeAuthentication());
    expect(accessToken).toBe(null)
  });

  test('Should call HashComparer with correct values', async () => {
    const { sut, hashComparerStub } = makeSut();
    const compareSpy = jest.spyOn(hashComparerStub, 'compare');
    await sut.auth(makeFakeAuthentication());
    expect(compareSpy).toHaveBeenCalledWith('any_password', 'hashed_password');
  });

  test('Should throw if HashComparer throws', async () => {
    const { sut, hashComparerStub } = makeSut();
    jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(Promise.reject(new Error()))
    const promise =  sut.auth(makeFakeAuthentication());
    await expect(promise).rejects.toThrow()
  });


});
