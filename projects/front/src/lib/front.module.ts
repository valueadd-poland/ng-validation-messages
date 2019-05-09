import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule } from '@angular/material';
import { TestFormComponent } from './components/test-form/test-form.component';
import { FrontRoutingModule } from './front-routing.module';

@NgModule({
  declarations: [TestFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FrontRoutingModule,
    MatFormFieldModule,
    MatInputModule
  ]
})
export class FrontModule {}
