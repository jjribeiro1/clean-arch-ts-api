import { CompareFieldsValidation } from '../../presentation/helper/validators/compare-fields-validation';
import { RequiredFieldValidation } from '../../presentation/helper/validators/required-field-validation';
import { IValidation } from '../../presentation/helper/validators/validation';
import { ValidationComposite } from '../../presentation/helper/validators/validation-composite';
import { makeSignUpController } from './signup';

jest.mock('../../presentation/helper/validators/validation-composite');

describe('Signup Validation Factory', () => {
  test('Should call Validation Composite with all validations', () => {
    makeSignUpController();
    const validations: IValidation[] = [];
    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field));
    }
    validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'))
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
