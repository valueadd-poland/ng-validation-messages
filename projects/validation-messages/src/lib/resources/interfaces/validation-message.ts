export interface ValidationMessage {
  message: string;
  validatorValue?: string;
  pattern?: string;

  // @TODO value should be Moment temporary it is any
  validatorValueParser?(value: any): string;
}
