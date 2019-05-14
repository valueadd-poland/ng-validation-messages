import { Injectable } from '@angular/core';
import { angularValidatorsWithValueMap } from '../resources/const';
import { Memoize } from '../resources/decorators';
import { Parser, ValidationMessage, ValidationMessagesConfig } from '../resources/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ValidationMessagesService {
  private parser: Parser | null;
  private validationMessagesFinalConfig: ValidationMessagesConfig<ValidationMessage> = {};

  private _materialErrorMatcher = false;

  get materialErrorMatcher(): boolean {
    return this._materialErrorMatcher;
  }

  @Memoize()
  getValidatorErrorMessage(validatorName: string, validatorValue: any = {}): string {
    if (!this.validationMessagesFinalConfig[validatorName]) {
      return this.validatorNotSpecified(validatorName);
    }

    if (validatorName === 'pattern') {
      if (!this.validationMessagesFinalConfig[validatorName][validatorValue.requiredPattern]) {
        return this.validatorNotSpecified(validatorName);
      }

      return this.validationMessagesFinalConfig[validatorName][validatorValue.requiredPattern]
        .message;
    }

    const validatorMessage = this.validationMessagesFinalConfig[validatorName];
    return validatorMessage.validatorValue
      ? this.interpolateValue(
          validatorMessage.message,
          validatorMessage.validatorValueParser
            ? validatorMessage.validatorValueParser(validatorValue[validatorMessage.validatorValue])
            : validatorValue[validatorMessage.validatorValue]
        )
      : validatorMessage.message;
  }

  setValidationMessages(validationMessagesConfig: ValidationMessagesConfig): void {
    const validationMessagesFinalConfig = {};
    // Clear memoized cache. Find different way to access clear method
    if ((this.getValidatorErrorMessage as any).clear) {
      (this.getValidatorErrorMessage as any).clear();
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

    this.validationMessagesFinalConfig = { ...validationMessagesFinalConfig };
  }

  setServerMessagesParser(serverMessageParser: Parser | null): void {
    this.parser = serverMessageParser;
  }

  useMaterialErrorMatcher(): void {
    this._materialErrorMatcher = true;
  }

  parseApiErrorMessage(message: string, params: any): string {
    if (this.parser) {
      return this.parser.parse(message, params);
    }

    return message;
  }

  private interpolateValue(str: string, value: any): string {
    const regex = { re: /{{value}}/, flags: 'g' };
    return str.replace(new RegExp(regex.re, regex.flags), value);
  }

  private getValidatorValue(key: string): string {
    return angularValidatorsWithValueMap[key] || key;
  }

  private validatorNotSpecified(validatorName: string): string {
    console.warn(
      `Validation message for ${validatorName} validator is not specified in this.`,
      `Did you called 'this.setValidationMessages()'?`
    );

    return '';
  }
}
