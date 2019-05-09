import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ValidationMessagesComponent } from './components/validation-messages/validation-messages.component';

@NgModule({
  imports: [CommonModule],
  declarations: [ValidationMessagesComponent],
  exports: [ValidationMessagesComponent]
})
export class ValidationMessagesModule {
  static setServerMessagesParser(
    serverMessageParser: ((str: string, params?: any) => string) | null
  ): void {
    ValidationMessagesComponent.parser = serverMessageParser;
  }

  static useMaterialErrorMatcher(): void {
    ValidationMessagesComponent.materialErrorMatcher = true;
  }
}
