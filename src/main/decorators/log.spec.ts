import { serverError, ok } from '../../presentation/helper/http-helper';
import { IController, IHttpRequest, IHttpResponse } from '../../presentation/protocols';
import { LogControllerDecorator } from './log';
import { LogErrorRepository } from '../../data/protocols/log-error-repository';
import { IAccountModel } from '../../domain/models/account';

const makeLogErrorRepository = (): LogErrorRepository => {
  class logErrorRepositoryStub implements LogErrorRepository {
    async log(stack: string): Promise<void> {
      return Promise.resolve();
    }
  }
  return new logErrorRepositoryStub();
};

const makeController = (): IController => {
  class ControllerStub implements IController {
    async handle(httpRequest: IHttpRequest): Promise<IHttpResponse> {
      return Promise.resolve(ok(makeFakeAccount()));
    }
  }
  return new ControllerStub();
};

const makeFakeRequest = (): IHttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'password',
    passwordConfirmation: 'password',
  },
});

const makeFakeAccount = (): IAccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password',
});

const makeFakeServerError = (): IHttpResponse => {
  const fakeError = new Error();
  fakeError.stack = 'any_stack';
  return serverError(fakeError);
};

interface ISutTypes {
  sut: LogControllerDecorator;
  controllerStub: IController;
  logErrorRepositoryStub: LogErrorRepository;
}
const makeSut = (): ISutTypes => {
  const controllerStub = makeController();
  const logErrorRepositoryStub = makeLogErrorRepository();
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub);
  return {
    sut,
    controllerStub,
    logErrorRepositoryStub,
  };
};

describe('LogController Decorator', () => {
  test('Should call controller handle ', async () => {
    const { sut, controllerStub } = makeSut();
    const handleSpy = jest.spyOn(controllerStub, 'handle');
    await sut.handle(makeFakeRequest());
    expect(handleSpy).toHaveBeenCalledWith(makeFakeRequest());
  });

  test('Should return the same result of controller ', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle(makeFakeRequest());
    expect(httpResponse).toEqual(ok(makeFakeAccount()));
  });

  test('Should call LogErrorRepository with correct error if controller returns a server error ', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = makeSut();
    const logSpy = jest.spyOn(logErrorRepositoryStub, 'log');
    jest
      .spyOn(controllerStub, 'handle')
      .mockReturnValueOnce(new Promise((resolve) => resolve(makeFakeServerError())));
    await sut.handle(makeFakeRequest());
    expect(logSpy).toHaveBeenCalledWith('any_stack');
  });
});
