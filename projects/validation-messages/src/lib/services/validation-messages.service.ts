import { Injectable } from '@angular/core';
import { ValidationMessages } from '../resources/interfaces';

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
   * @param {ValidationMessages} validationMessages
   * @param patternValidationMessages
   */
  static setValidationMessages(
    validationMessages: ValidationMessages,
    patternValidationMessages: any = {}
  ): void {
    // Clear memoized cache
    // (this.getValidatorErrorMessage as any).cache.clear();

    // Set validation messages
    ValidationMessagesService.validationMessages = {
      email: {
        message: validationMessages.email
      },
      length: {
        message: validationMessages.length,
        validatorValue: 'length'
      },
      min: {
        message: validationMessages.min,
        validatorValue: 'min'
      },
      max: {
        message: validationMessages.max,
        validatorValue: 'max'
      },
      maxlength: {
        message: validationMessages.maxlength,
        validatorValue: 'requiredLength'
      },
      minlength: {
        message: validationMessages.minlength,
        validatorValue: 'requiredLength'
      },
      required: {
        message: validationMessages.required
      },
      pattern: patternValidationMessages
    };
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
}
