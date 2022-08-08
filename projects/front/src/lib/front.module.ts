import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ValidationMessagesModule } from '../../../validation-messages/src/lib/validation-messages.module';
import { TestFormComponent } from './components/test-form/test-form.component';
import { FrontRoutingModule } from './front-routing.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [TestFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FrontRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    ValidationMessagesModule
  ]
})
export class FrontModule {}
