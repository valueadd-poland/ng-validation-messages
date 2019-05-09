import { ValidationMessagesService } from './validation-messages.service';

describe('ValidationMessagesService', () => {
  beforeEach(() => {
    ValidationMessagesService.setValidationMessages({
      required: 'required',
      maxlength: 'maxlength {{value}}',
      min: 'min {{value}}',
      max: 'max {{value}}',
      email: 'email',
      minlength: 'minlength {{value}}',
      length: 'length {{value}}',
      matDatepickerMin: 'datepicker min {{value}}',
      matDatepickerMax: 'datepicker max {{value}}'
    });
  });

  it('should return empty string if there is no validator', () => {
    const msg = ValidationMessagesService.getValidatorErrorMessage(undefined as any);
    expect(msg).toEqual('');
  });

  it('should return validation message for Validators.email', () => {
    const msg = ValidationMessagesService.getValidatorErrorMessage('email');
    expect(!!msg).toBeTruthy();
  });

  it('should return validation message for Validators.min', () => {
    const msg = ValidationMessagesService.getValidatorErrorMessage('min');
    expect(!!msg).toBeTruthy();
  });

  it('should return validation message for Validators.max', () => {
    const msg = ValidationMessagesService.getValidatorErrorMessage('max');
    expect(!!msg).toBeTruthy();
  });

  it('should return validation message for Validators.maxlength', () => {
    const msg = ValidationMessagesService.getValidatorErrorMessage('maxlength');
    expect(!!msg).toBeTruthy();
  });

  it('should return validation message for Validators.minlength', () => {
    const msg = ValidationMessagesService.getValidatorErrorMessage('minlength');
    expect(!!msg).toBeTruthy();
  });

  it('should return validation message for Validators.required', () => {
    const msg = ValidationMessagesService.getValidatorErrorMessage('required');
    expect(!!msg).toBeTruthy();
  });

  it('should return validation message for Validators.length', () => {
    const msg = ValidationMessagesService.getValidatorErrorMessage('length');
    expect(!!msg).toBeTruthy();
  });
});
