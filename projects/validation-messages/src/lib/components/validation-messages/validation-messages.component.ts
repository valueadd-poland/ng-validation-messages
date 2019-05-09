import { ChangeDetectorRef, Component, Input, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ValidationMessagesService } from '../../services';

@Component({
  selector: 'ng-validation-messages',
  templateUrl: './validation-messages.component.html'
})
export class ValidationMessagesComponent implements OnDestroy {
  static materialErrorMatcher = false;
  static parser: ((str: string, params?: object) => string) | null = null;
  @Input()
  control?: FormControl;
  @Input()
  multiple = false;
  showServerErrors = false;
  @Input()
  useCache = true;
  valueChanges: Subscription | null = null;
  private ngUnsubscribe: Subject<void> = new Subject<void>();

  constructor(private cd: ChangeDetectorRef) {
    this.unsubscribeAndClearValueChanges = this.unsubscribeAndClearValueChanges.bind(this);
  }

  // @TODO it was ApiErrorMessage[] model it's temporary any[], discuss it with rest of team
  private _apiMessages: any[] | null = null;

  get apiMessages(): any[] | null {
    return this.multiple
      ? this._apiMessages
      : this._apiMessages
      ? this._apiMessages.slice(0, 1)
      : null;
  }

  @Input()
  set apiMessages(apiMessages: any[] | null) {
    if (this._apiMessages === apiMessages) {
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

  get errorMessages(): string[] {
    const messages: string[] = [];

    if (this.control && this.control.errors) {
      for (const propertyName in this.control.errors) {
        if (
          this.control.errors.hasOwnProperty(propertyName) &&
          propertyName !== 'server' &&
          !(!this.multiple && messages.length === 1)
        ) {
          this.clearValidationMessagesCacheIfNeeded();
          messages.push(
            ValidationMessagesService.getValidatorErrorMessage(
              propertyName,
              this.control.errors[propertyName]
            )
          );
        }
      }
    }

    return messages;
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

  private clearValidationMessagesCacheIfNeeded(): void {
    if (!this.useCache) {
      (ValidationMessagesService.getValidatorErrorMessage as any).cache.clear();
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
