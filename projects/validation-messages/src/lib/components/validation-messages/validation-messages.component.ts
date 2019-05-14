import { ChangeDetectorRef, Component, DoCheck, Input, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApiErrorMessage, Parser } from '../../resources/interfaces';
import { ValidationMessagesService } from '../../services';

@Component({
  selector: 'ng-validation-messages',
  templateUrl: './validation-messages.component.html'
})
export class ValidationMessagesComponent implements OnDestroy, DoCheck {
  materialErrorMatcher = false;
  errorMessages: string[] = [];
  @Input()
  control?: FormControl;
  showServerErrors = false;
  parsedApiErrorMessages: string[] = [];
  valueChanges: Subscription | null = null;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(
    private cd: ChangeDetectorRef,
    private validationMessagesService: ValidationMessagesService
  ) {
    this.unsubscribeAndClearValueChanges = this.unsubscribeAndClearValueChanges.bind(this);
    this.materialErrorMatcher = validationMessagesService.materialErrorMatcher;
  }

  private _multiple: boolean = false;

  get multiple(): boolean {
    return this._multiple;
  }

  @Input()
  set multiple(multiple: boolean) {
    this._multiple = multiple;
    this.updateErrorMessages();
  }

  private _apiErrorMessages: ApiErrorMessage[] | ApiErrorMessage | null = null;

  get apiErrorMessages(): ApiErrorMessage[] | ApiErrorMessage {
    return this._apiErrorMessages;
  }

  @Input()
  set apiErrorMessages(apiErrorMessages: ApiErrorMessage[] | ApiErrorMessage | null) {
    this.unsubscribeAndClearValueChanges();
    this._apiErrorMessages = apiErrorMessages;
    this.parseApiErrorMessages(this._apiErrorMessages);
    this.showServerErrors = true;

    if (this.control && apiErrorMessages) {
      this.control.setErrors({
        server: apiErrorMessages
      });

      this.observeInputValueChanges();
    }
  }

  observeInputValueChanges(): void {
    if (!this.valueChanges) {
      this.valueChanges = this.control.valueChanges
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(this.unsubscribeAndClearValueChanges);

      setTimeout(() => {
        this.cd.markForCheck();
      });
    }
  }

  parseApiErrorMessages(apiErrorMessages: ApiErrorMessage[] | ApiErrorMessage | null): void {
    if (!apiErrorMessages) {
      return;
    }

    this.parsedApiErrorMessages = [];
    if (apiErrorMessages instanceof Array) {
      apiErrorMessages.forEach(apiErrorMessage => {
        apiErrorMessage.message = this.validationMessagesService.parseApiErrorMessage(
          apiErrorMessage.message,
          apiErrorMessage.property
        );
        this.parsedApiErrorMessages.push(apiErrorMessage.message);
      });
    } else {
      apiErrorMessages.message = this.validationMessagesService.parseApiErrorMessage(
        apiErrorMessages.message,
        apiErrorMessages.property
      );
      this.parsedApiErrorMessages.push(apiErrorMessages.message);
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  ngDoCheck(): void {
    if (
      this.control &&
      ((this.control.invalid && this.control.touched) ||
        (!this.control.invalid && this.errorMessages.length > 0))
    ) {
      this.updateErrorMessages();
    }
  }

  private updateErrorMessages(): void {
    this.errorMessages = [];

    if (this.control && this.control.errors) {
      for (const propertyName in this.control.errors) {
        if (
          this.control.errors.hasOwnProperty(propertyName) &&
          propertyName !== 'server' &&
          !(!this.multiple && this.errorMessages.length === 1)
        ) {
          this.errorMessages.push(
            this.validationMessagesService.getValidatorErrorMessage(
              propertyName,
              this.control.errors[propertyName]
            )
          );
        }
      }
    }
  }

  private unsubscribeAndClearValueChanges(): void {
    if (this.control) {
      this.control.setErrors({});
      this.control.updateValueAndValidity({ onlySelf: true, emitEvent: false });
    }

    if (this.valueChanges && !this.valueChanges.closed) {
      this.valueChanges.unsubscribe();
    }

    this.showServerErrors = false;
    this.valueChanges = null;
  }
}
