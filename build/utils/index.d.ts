import { ClassConstructor } from 'class-transformer';
import { ValidationError as ClassValidatorValidationError, ValidatorOptions } from 'class-validator';
export declare const getFirstErrorConstraints: (err: ClassValidatorValidationError) => {
    [key: string]: string;
} | undefined;
export declare const validate: <T>(data: unknown, type: ClassConstructor<T>, validatorOptions?: ValidatorOptions) => Promise<T>;
