export interface ValidationMessage {
  message: string;
  validatorValue?: string;
  // @TODO value should be Moment temporary it is any
  validatorValueParser?(value: any): string;
}
