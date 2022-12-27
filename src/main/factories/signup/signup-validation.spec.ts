import {
  CompareFieldsValidation,
  EmailValidation,
  ValidationComposite,
  RequiredFieldValidation,
} from '../../../presentation/helper/validators';
import { IValidation } from '../../../presentation/protocols/validation';
import { IEmailValidator } from '../../../presentation/protocols/email-validator';
import { makeSignUpController } from './signup';

jest.mock('../../../presentation/helper/validators/validation-composite');

const makeEmailValidator = (): IEmailValidator => {
  class EmailValidatorStub implements IEmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};

describe('Signup Validation Factory', () => {
  test('Should call Validation Composite with all validations', () => {
    makeSignUpController();
    const validations: IValidation[] = [];
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field));
    }
    validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'));
    validations.push(new EmailValidation('email', makeEmailValidator()));
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
