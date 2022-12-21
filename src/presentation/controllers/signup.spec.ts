import { SignUpController } from './signup';
import { MissingParamError } from '../errors/missing-param-error';

describe('Signup Controller', () => {
  test('Should return 400 if no name is provided', () => {
    const sut = new SignUpController();
    const httpRequest = {
      body: {
        email: 'email@mail.com',
        password: 'password',
        passwordConfirmation: 'password',
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('name'));
  });

  test('Should return 400 if no email is provided', () => {
    const sut = new SignUpController();
    const httpRequest = {
      body: {
        name: 'name',
        password: 'password',
        passwordConfirmation: 'password',
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('email'));
  });

  test('Should return 400 if no password is provided', () => {
    const sut = new SignUpController();
    const httpRequest = {
      body: {
        name: 'name',
        email: 'email@mail.com',
        passwordConfirmation: 'password',
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('password'));
  });

  test('Should return 400 if no passwordConfirmation is provided', () => {
    const sut = new SignUpController();
    const httpRequest = {
      body: {
        name: 'name',
        email: 'email@mail.com',
        password: 'password',
      },
    };
    const httpResponse = sut.handle(httpRequest);
    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'));
  });
});