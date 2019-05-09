import { Injectable } from '@angular/core';
import { validatorsWithValue } from '../resources/const';
import { ValidatorValue, ValidatorWithValue } from '../resources/enums';
import { EventType, ValidationMessage, ValidationMessagesConfig } from '../resources/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ValidationMessagesService {
  private static validationMessages = {};

  // @Todo: implement cache
  static getValidatorErrorMessage(validatorName: string, validatorValue: any = {}): string {
    if (
      (validatorName === 'pattern' &&
        !ValidationMessagesService.validationMessages[validatorName][
          validatorValue.requiredPattern
        ]) ||
      !ValidationMessagesService.validationMessages[validatorName]
    ) {
      console.warn(
        `Validation message for ${validatorName} validator is not specified in ValidationMessagesService.`,
        `Did you called 'ValidationMessagesService.setValidationMessages()'?`
      );
      return '';
    }

    if (validatorName === 'pattern') {
      return ValidationMessagesService.validationMessages[validatorName][
        validatorValue.requiredPattern
      ];
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
    // Clear memoized cache
    // (this.getValidatorErrorMessage as any).cache.clear();

    // Set validation messages
    for (const key in validationMessages) {
      if (typeof validationMessages[key] === 'string') {
        ValidationMessagesService.validationMessages[key] = {
          message: validationMessages[key],
          validatorValue: this.getValidatorValue(key)
        };
      } else {
        ValidationMessagesService.validationMessages[key] = validationMessages[key];
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
}
