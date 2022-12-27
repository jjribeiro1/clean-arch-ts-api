import { EmailValidation } from '../../../presentation/helper/validators/email-validation';
import { RequiredFieldValidation } from '../../../presentation/helper/validators/required-field-validation';
import { IValidation } from '../../../presentation/helper/validators/validation';
import { ValidationComposite } from '../../../presentation/helper/validators/validation-composite';
import { IEmailValidator } from '../../../presentation/protocols/email-validator';
import { makeLoginValidation } from './login-validation';

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
    validations.push(new EmailValidation('email', makeEmailValidator()))
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
