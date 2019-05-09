import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { tap } from 'rxjs/internal/operators/tap';
import { takeUntil } from 'rxjs/operators';
import { ApiErrorMessage } from '../../resources/interfaces';
import { ValidationMessagesService } from '../../services';

@Component({
  selector: 'ng-validation-messages',
  templateUrl: './validation-messages.component.html'
})
export class ValidationMessagesComponent implements OnDestroy, OnInit {
  static materialErrorMatcher = false;
  static parser: ((str: string, params?: object) => string) | null = null;
  messages: string[] = [];
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

  private _apiMessages: ApiErrorMessage[] | null = null;

  get apiMessages(): ApiErrorMessage[] | null {
    return this.multiple
      ? this._apiMessages
      : this._apiMessages
      ? this._apiMessages.slice(0, 1)
      : null;
  }

  @Input()
  set apiMessages(apiMessages: ApiErrorMessage[] | null) {
    if (this._apiMessages === apiMessages) {
      this._apiMessages = this.multiple
        ? this._apiMessages
        : this._apiMessages
        ? this._apiMessages.slice(0, 1)
        : null;
      return;
    }

    this.unsubscribeAndClearValueChanges();

    this._apiMessages = apiMessages;
    this.showServerErrors = true;

    if (this.control && apiMessages && apiMessages.length) {
      this.control.setErrors({
        server: apiMessages
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

  private errorMessages(): void {
    this.messages = [];

    if (this.control && this.control.errors) {
      for (const propertyName in this.control.errors) {
        if (
          this.control.errors.hasOwnProperty(propertyName) &&
          propertyName !== 'server' &&
          !(!this.multiple && this.messages.length === 1)
        ) {
          this.messages.push(
            ValidationMessagesService.getValidatorErrorMessage(
              propertyName,
              this.control.errors[propertyName]
            )
          );
        }
      }
    }
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

  ngOnInit(): void {
    if (this.control) {
      this.control.valueChanges
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe(() => this.errorMessages());
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
