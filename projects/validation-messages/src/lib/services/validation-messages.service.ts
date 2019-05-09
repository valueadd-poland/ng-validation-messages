import { Injectable } from '@angular/core';
import { validatorsWithValue } from '../resources/const';
import { memoize } from '../resources/decorators';
import { ValidationMessage, ValidationMessagesConfig } from '../resources/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ValidationMessagesService {
  private static validationMessages = {};

  @memoize()
  static getValidatorErrorMessage(validatorName: string, validatorValue: any = {}): string {
    if (!ValidationMessagesService.validationMessages[validatorName]) {
      return ValidationMessagesService.validatorNotSpecified(validatorName);
    }

    if (validatorName === 'pattern') {
      if (
        !ValidationMessagesService.validationMessages[validatorName][validatorValue.requiredPattern]
      ) {
        return ValidationMessagesService.validatorNotSpecified(validatorName);
      }

      return ValidationMessagesService.validationMessages[validatorName][
        validatorValue.requiredPattern
      ].message;
    }

    const validatorMessage = ValidationMessagesService.validationMessages[validatorName];
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
   * Set validation messages.
   * @param {ValidationMessage} validationMessages
   * @param patternValidationMessages
   */
  static setValidationMessages(
    validationMessages: ValidationMessagesConfig,
    patternValidationMessages: any = {}
  ): void {
    ValidationMessagesService.validationMessages = {};

    // Clear memoized cache. Find different way to access clear method
    if ((ValidationMessagesService.getValidatorErrorMessage as any).clear) {
      (ValidationMessagesService.getValidatorErrorMessage as any).clear();
    }

    // Set validation messages
    for (const key in validationMessages) {
      if (typeof validationMessages[key] === 'string') {
        ValidationMessagesService.validationMessages[key] = {
          message: validationMessages[key],
          validatorValue: this.getValidatorValue(key)
        };
      } else {
        const validator = validationMessages[key] as ValidationMessage;
        if (validator.pattern) {
          ValidationMessagesService.validationMessages['pattern'] = {
            ...ValidationMessagesService.validationMessages['pattern'],
            [validator.pattern]: validator
          };
        } else {
          ValidationMessagesService.validationMessages[key] = validator;
        }
      }
    }
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
    return validatorsWithValue[key] || key;
  }

  private static validatorNotSpecified(validatorName: string): string {
    console.warn(
      `Validation message for ${validatorName} validator is not specified in ValidationMessagesService.`,
      `Did you called 'ValidationMessagesService.setValidationMessages()'?`
    );

    return '';
  }
}
