import { Injectable } from '@angular/core';
import { angularValidatorsWithValueMap } from '../resources/const';
import { ValidationMessage, ValidationMessagesConfig } from '../resources/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ValidationMessagesService {
  private static validationMessagesFinalConfig: ValidationMessagesConfig<ValidationMessage>;

  // @Todo: implement cache
  static getValidatorErrorMessage(validatorName: string, validatorValue: any = {}): string {
    if (
      (validatorName === 'pattern' &&
        !ValidationMessagesService.validationMessagesFinalConfig[validatorName][
          validatorValue.requiredPattern
        ]) ||
      !ValidationMessagesService.validationMessagesFinalConfig[validatorName]
    ) {
      console.warn(
        `Validation message for ${validatorName} validator is not specified in ValidationMessagesService.`,
        `Did you called 'ValidationMessagesService.setValidationMessages()'?`
      );
      return '';
    }

    if (validatorName === 'pattern') {
      return ValidationMessagesService.validationMessagesFinalConfig[validatorName][
        validatorValue.requiredPattern
      ];
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
   * Set validation messages.
   * @param {ValidationMessage} validationMessagesConfig
   * @param patternValidationMessages
   */
  static setValidationMessages(
    validationMessagesConfig: ValidationMessagesConfig,
    patternValidationMessages: any = {}
  ): void {
    const validationMessagesFinalConfig = {};
    // Clear memoized cache
    // (this.getValidatorErrorMessage as any).cache.clear();

    // Set validation messages
    for (const key in validationMessagesConfig) {
      if (typeof validationMessagesConfig[key] === 'string') {
        validationMessagesFinalConfig[key] = {
          message: validationMessagesConfig[key],
          validatorValue: this.getValidatorValue(key)
        };
      } else {
        validationMessagesFinalConfig[key] = validationMessagesConfig[key];
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
}
