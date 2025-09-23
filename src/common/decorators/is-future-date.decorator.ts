import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

export interface FutureDateOptions {
  allowToday?: boolean;
  allowPast?: boolean;
}

@ValidatorConstraint({ name: 'isFutureDate', async: false })
export class IsFutureDateConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    if (!value) {
      return true; // Allow empty values, let @IsOptional handle it
    }

    const options: FutureDateOptions = args.constraints[0] || {};
    const { allowToday = true, allowPast = false } = options;

    const inputDate = new Date(value);
    const today = new Date();

    // Set time to start of day for fair comparison
    today.setHours(0, 0, 0, 0);
    inputDate.setHours(0, 0, 0, 0);
   
    if (allowPast) {
      return true; // Allow any date
    }

    if (allowToday) {
      return inputDate >= today; // Today or future
    }

    return inputDate > today; // Only future dates
  }

  defaultMessage(args: ValidationArguments) {
    const options: FutureDateOptions = args.constraints[0] || {};
    const { allowToday = true } = options;

    if (allowToday) {
      return `${args.property} must be today or a future date`;
    }
    return `${args.property} must be a future date`;
  }
}

export function IsFutureDate(validationOptions?: ValidationOptions & { allowToday?: boolean; allowPast?: boolean }) {
  return function (object: Object, propertyName: string) {
    const { allowToday, allowPast, ...options } = validationOptions || {};

    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: options,
      constraints: [{ allowToday, allowPast }],
      validator: IsFutureDateConstraint,
    });
  };
}