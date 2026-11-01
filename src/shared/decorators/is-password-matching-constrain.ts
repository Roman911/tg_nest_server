import { type ValidationArguments, ValidatorConstraint, type ValidatorConstraintInterface } from 'class-validator';

import { NewPasswordInput } from '../../modules/auth/password-recovery/inputs/new-password.input.js';

@ValidatorConstraint({ name: 'IsPasswordMatching', async: false })
export class IsPasswordMatchingConstrain implements ValidatorConstraintInterface {
	public validate(passwordRepeat: string, args: ValidationArguments) {
		const object = args.object as NewPasswordInput;

		return object.password === passwordRepeat;
	}

	public defaultMessage(validationArguments?: ValidationArguments) {
		return 'password must be between 8 and 16 characters';
	}
}
