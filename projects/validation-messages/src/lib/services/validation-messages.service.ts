import { Injectable } from '@angular/core';
import { angularValidatorsWithValueMap } from '../resources/const';
import { Memoize } from '../resources/decorators';
import { ValidationMessage, ValidationMessagesConfig } from '../resources/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ValidationMessagesService {
  private static validationMessagesFinalConfig: ValidationMessagesConfig<ValidationMessage>;

  @Memoize()
  static getValidatorErrorMessage(validatorName: string, validatorValue: any = {}): string {
    if (!ValidationMessagesService.validationMessagesFinalConfig[validatorName]) {
      return ValidationMessagesService.validatorNotSpecified(validatorName);
    }

    if (validatorName === 'pattern') {
      if (
        !ValidationMessagesService.validationMessagesFinalConfig[validatorName][
          validatorValue.requiredPattern
        ]
      ) {
        return ValidationMessagesService.validatorNotSpecified(validatorName);
      }

      return ValidationMessagesService.validationMessagesFinalConfig[validatorName][
        validatorValue.requiredPattern
      ].message;
    }

    const validatorMessage = ValidationMessagesService.validationMessagesFinalConfig[validatorName];
    return validatorMessage.validatorValue
      ? this.interpolateValue(
          validatorMessage.message,
          validatorMessage.validatorValueParser
            ? validatorMessage.validatorValueParser(validatorValue[validatorMessage.validatorValue])
            : validatorValue[validatorMessage.validatorValue]
        )
      : validatorMessage.message;
  }

  /**
   * Set validation errorMessages.
   * @param {ValidationMessage} validationMessagesConfig
   * @param patternValidationMessages
   */
  static setValidationMessages(
    validationMessagesConfig: ValidationMessagesConfig,
    patternValidationMessages: any = {}
  ): void {
    const validationMessagesFinalConfig = {};
    // Clear memoized cache. Find different way to access clear method
    if ((ValidationMessagesService.getValidatorErrorMessage as any).clear) {
      (ValidationMessagesService.getValidatorErrorMessage as any).clear();
    }

    // Set validation errorMessages
    for (const key in validationMessagesConfig) {
      if (typeof validationMessagesConfig[key] === 'string') {
        validationMessagesFinalConfig[key] = {
          message: validationMessagesConfig[key],
          validatorValue: this.getValidatorValue(key)
        };
      } else {
        const validator = validationMessagesConfig[key] as ValidationMessage;
        if (validator.pattern) {
          validationMessagesFinalConfig['pattern'] = {
            ...validationMessagesFinalConfig['pattern'],
            [validator.pattern]: validator
          };
        } else {
          validationMessagesFinalConfig[key] = validator;
        }
      }
    }

    ValidationMessagesService.validationMessagesFinalConfig = { ...validationMessagesFinalConfig };
  }

  /**
   * Interpolates {{value}} to provided value.
   * @param {string} str
   * @param value
   * @returns {string}
   */
  private static interpolateValue(str: string, value: any): string {
    return str.replace(/{{value}}/g, value);
  }

  private static getValidatorValue(key: string): string {
    return angularValidatorsWithValueMap[key] || key;
  }

  private static validatorNotSpecified(validatorName: string): string {
    console.warn(
      `Validation message for ${validatorName} validator is not specified in ValidationMessagesService.`,
      `Did you called 'ValidationMessagesService.setValidationMessages()'?`
    );

    return '';
  }
}
