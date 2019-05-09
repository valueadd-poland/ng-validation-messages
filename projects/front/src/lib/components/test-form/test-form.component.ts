import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

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
      email: ['', [Validators.email, this.emailDomainValidator]],
      name: [
        '',
        [
          Validators.minLength(validationConfig.nameMinLength),
          Validators.maxLength(validationConfig.nameMaxLength),
          Validators.required,
          Validators.pattern('[a-zA-Z]*')
        ]
      ],
      comment: ['', [Validators.maxLength(validationConfig.commentMaxLength)]]
    });
  }

  emailDomainValidator(control: FormControl) {
    const email = control.value;
    if (email && email.indexOf('@') !== -1) {
      const [, domain] = email.split('@');
      if (domain !== 'valueadd.pl') {
        return {
          emailDomain: {
            parsedDomain: domain
          }
        };
      }
    }
    return null;
  }
}
