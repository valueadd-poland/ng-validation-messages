import { NgModule } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ValidationMessagesConfig } from '../../projects/validation-messages/src/lib/resources';
import { ValidationMessagesService } from '../../projects/validation-messages/src/lib/services';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app.routing.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserAnimationsModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  errorMessages: ValidationMessagesConfig = {
    documentType: 'Invalid document type.',
    email: 'Invalid e-mail address.',
    emailDomain: 'Invalid email domain, it should be @valueadd.pl',
    length: 'This field should be {{value}} characters long.',
    matDatepickerMax: 'The date can not be later than {{value}}.',
    matDatepickerMin: 'The date can not be earlier than {{value}}.',
    max: 'This field value should be lower than {{value}}.',
    maxlength: 'This field should have maximum {{value}} characters.',
    min: 'This field value should be greater than {{value}}.',
    minlength: 'This field should contain at least {{value}} characters.',
    required: 'This field is required.',
    pattern: {
      message: 'patternIssue',
      validatorValue: 'requiredPattern',
      pattern: '^[a-zA-Z]*$'
    }
  };

  constructor(private validationMessageService: ValidationMessagesService) {
    this.validationMessageService.setValidationMessages(this.errorMessages);
  }
}
