import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { ValidationMessagesModule } from '@ng-validation-messages';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, ValidationMessagesModule],
  bootstrap: [AppComponent]
})
export class AppModule {}
