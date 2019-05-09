import { ValidationMessage } from './validation-message';

export interface ValidationMessagesConfig {
  [key: string]: string | ValidationMessage;
}
