import {
  EmailValidation,
  RequiredFieldValidation,
  ValidationComposite,
} from '../../../presentation/helper/validators';
import { IValidation } from '../../../presentation/protocols/validation';
import { IEmailValidator } from '../../../presentation/protocols/email-validator';
import { makeLoginValidation } from './login-validation-factory';

jest.mock('../../../presentation/helper/validators/validation-composite');

const makeEmailValidator = (): IEmailValidator => {
  class EmailValidatorStub implements IEmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};

describe('Login Validation Factory', () => {
  test('Should call Validation Composite with all validations', () => {
    makeLoginValidation();
    const validations: IValidation[] = [];
    for (const field of ['email', 'password']) {
      validations.push(new RequiredFieldValidation(field));
    }
    validations.push(new EmailValidation('email', makeEmailValidator()));
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
