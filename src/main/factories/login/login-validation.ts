import { EmailValidation } from '../../../presentation/helper/validators/email-validation';
import { RequiredFieldValidation } from '../../../presentation/helper/validators/required-field-validation';
import { IValidation } from '../../../presentation/protocols/validation';
import { ValidationComposite } from '../../../presentation/helper/validators/validation-composite';
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter';

export const makeLoginValidation = (): ValidationComposite => {
  const validations: IValidation[] = [];
  for (const field of ['email', 'password']) {
    validations.push(new RequiredFieldValidation(field));
  }
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()))
  return new ValidationComposite(validations);
};
