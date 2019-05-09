import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

const validationConfig = {
  nameMinLength: 4,
  nameMaxLength: 255,
  commentMaxLength: 2048
};

@Component({
  selector: 'ng-test-form',
  templateUrl: './test-form.component.html'
})
export class TestFormComponent implements OnInit {
  form: FormGroup;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.email]],
      name: [
        '',
        [
          Validators.minLength(validationConfig.nameMinLength),
          Validators.maxLength(validationConfig.nameMaxLength),
          Validators.required
        ]
      ],
      comment: ['', [Validators.maxLength(validationConfig.commentMaxLength)]]
    });
  }
}
