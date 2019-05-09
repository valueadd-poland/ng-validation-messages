import { NgModule } from '@angular/core';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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
  errorMessages = {
    documentType: 'Invalid document type.',
    email: 'Invalid e-mail address.',
    length: 'This field should be {{value}} characters long.',
    matDatepickerMax: 'The date can not be later than {{value}}.',
    matDatepickerMin: 'The date can not be earlier than {{value}}.',
    max: 'This field value should be lower than {{value}}.',
    maxlength: 'This field should have maximum {{value}} characters.',
    min: 'This field value should be greater than {{value}}.',
    minlength: 'This field should contain at least {{value}} characters.',
    required: 'This field is required.',
    shortcut: { limitReached: 'You have reached the limit of shortcuts.' },
    upload: {
      acceptedFormats:
        'The selected file cannot be uploaded because it is in the invalid format. The accepted formats: {{acceptedFormats}}.',
      invalidFile: 'The selected file cannot be uploaded because it is invalid.',
      maxFileSize:
        'The selected file cannot be uploaded because it exceeds the maximum allowed file size of {{maxFileSize}}.'
    }
  };

  constructor() {
    this.initValidationMessages();
  }

  private initValidationMessages(): void {
    ValidationMessagesService.setValidationMessages(this.errorMessages);
  }
}
