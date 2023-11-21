"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = exports.getFirstErrorConstraints = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const getFirstErrorConstraints = (err) => {
    let firstErrorConstraints;
    if (err.constraints) {
        firstErrorConstraints = err.constraints;
    }
    else if (err.children && err.children.length > 0) {
        firstErrorConstraints = (0, exports.getFirstErrorConstraints)(err.children[0]);
    }
    return firstErrorConstraints;
};
exports.getFirstErrorConstraints = getFirstErrorConstraints;
const validate = async (data, type, validatorOptions = {}) => {
    const dto = (0, class_transformer_1.plainToClass)(type, data);
    const errors = await (0, class_validator_1.validate)(dto, {
        validationError: { target: false },
        whitelist: true,
        ...validatorOptions,
    });
    if (errors.length > 0) {
        const errorMessages = [];
        errors.forEach((err) => {
            const firstErrorConstraints = (0, exports.getFirstErrorConstraints)(err);
            if (firstErrorConstraints) {
                errorMessages.push(...Object.values(firstErrorConstraints));
            }
        });
        throw new Error(errorMessages.reverse()[0]);
    }
    return dto;
};
exports.validate = validate;
