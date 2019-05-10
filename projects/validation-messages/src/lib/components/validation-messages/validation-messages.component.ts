import { ChangeDetectorRef, Component, DoCheck, Input, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ApiErrorMessage } from '../../resources/interfaces';
import { ValidationMessagesService } from '../../services';

@Component({
  selector: 'ng-validation-messages',
  templateUrl: './validation-messages.component.html'
})
export class ValidationMessagesComponent implements OnDestroy, DoCheck {
  static materialErrorMatcher = false;
  static parser: ((str: string, params?: object) => string) | null = null;
  errorMessages: string[] = [];
  @Input()
  control?: FormControl;
  @Input()
  multiple = false;
  showServerErrors = false;
  valueChanges: Subscription | null = null;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private cd: ChangeDetectorRef) {
    this.unsubscribeAndClearValueChanges = this.unsubscribeAndClearValueChanges.bind(this);
  }

  private _apiErrorMessages: ApiErrorMessage[] | null = null;

  get apiErrorMessages(): ApiErrorMessage[] | null {
    return this.multiple
      ? this._apiErrorMessages
      : this._apiErrorMessages
      ? this._apiErrorMessages.slice(0, 1)
      : null;
  }

  @Input()
  set apiErrorMessages(apiErrorMessages: ApiErrorMessage[] | null) {
    if (this._apiErrorMessages === apiErrorMessages) {
      this._apiErrorMessages = this.multiple
        ? this._apiErrorMessages
        : this._apiErrorMessages
        ? this._apiErrorMessages.slice(0, 1)
        : null;
      return;
    }

    this.unsubscribeAndClearValueChanges();

    this._apiErrorMessages = apiErrorMessages;
    this.showServerErrors = true;

    if (this.control && apiErrorMessages && apiErrorMessages.length) {
      this.control.setErrors({
        server: apiErrorMessages
      });

      this.valueChanges = this.control.valueChanges
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(this.unsubscribeAndClearValueChanges);

      setTimeout(() => {
        this.cd.markForCheck();
      });
    }
  }

  get useMaterialErrorMatcher(): boolean {
    return ValidationMessagesComponent.materialErrorMatcher;
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  parseApiErrorMessage(message: string, params: any): string {
    const parser = ValidationMessagesComponent.parser;

    if (parser) {
      return parser(message, params);
    }

    return message;
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
            ValidationMessagesService.getValidatorErrorMessage(
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
