import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {
  ChangePasswordFormFactory,
  ChangePasswordFormNames,
  formNames
} from '../../../../core/factories/change-password-form.factory';
import {changePasswordError, ChangePasswordError} from '../../../../core/errors/change-password.error';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {ChangePasswordRequest} from '../../../../core/requests/change-password.request';
import {UserService} from '../../../../core/services/user/user.service';
import {NotificationService} from '../../../../core/services/notification/notification.service';
import {Length} from '../../../../config/form.config';
import {messages} from '../../../../core/messages/account.messages';
import {FormUtils} from '../../../../core/utils/form.utils';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'account-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangePasswordComponent implements OnInit, OnDestroy {
  public form: FormGroup;
  public errors: ChangePasswordError;
  public formNames: ChangePasswordFormNames;
  public errorMessage$: BehaviorSubject<string>;
  public maxPasswordLength: number;
  public oldPasswordLength$: Observable<number>;
  public newPasswordLength$: Observable<number>;
  public repeatPasswordLength$: Observable<number>;
  private userService: UserService;
  private notificationService: NotificationService;
  private subscriptions: (Subscription | undefined) [];

  public constructor(userService: UserService, notificationService: NotificationService) {
    this.maxPasswordLength = Length.maxPasswordLength;
    this.errors = changePasswordError;
    this.formNames = formNames;
    this.userService = userService;
    this.notificationService = notificationService;
  }

  public ngOnInit(): void {
    this.errorMessage$ = new BehaviorSubject<string>('');
    this.form = ChangePasswordFormFactory.get();
    this.errorMessage$.next('');
    this.oldPasswordLength$ = (this.form.get(this.formNames.oldPassword) as FormControl).valueChanges.pipe(
      startWith(''),
      map(value => value.length)
    );
    this.newPasswordLength$ = (this.form.get(this.formNames.newPassword) as FormControl).valueChanges.pipe(
      startWith(''),
      map(value => value.length)
    );
    this.repeatPasswordLength$ = (this.form.get(this.formNames.passwordRepeat) as FormControl).valueChanges.pipe(
      startWith(''),
      map(value => value.length)
    );
    this.subscriptions = [
      this.form.get(this.formNames.oldPassword)?.valueChanges
        .subscribe(() => this.form.get(this.formNames.newPassword)?.updateValueAndValidity()),
      this.form.get(this.formNames.newPassword)?.valueChanges
        .subscribe(() => this.form.get(this.formNames.passwordRepeat)?.updateValueAndValidity())
    ];
  }

  public submitForm(): void {
    if (this.form.invalid) {
      return;
    }
    const data: ChangePasswordRequest = {
      oldPassword: this.form.get(this.formNames.oldPassword)?.value,
      newPassword: {
        first: this.form.get(this.formNames.newPassword)?.value,
        second: this.form.get(this.formNames.passwordRepeat)?.value
      }
    };

    this.userService.changePassword(data).subscribe(
      isCorrect => {
        if (isCorrect) {
          this.notificationService.showMessage(messages.passwordChanged);
          FormUtils.clearInputs(this.form, '', this.formNames.oldPassword, this.formNames.newPassword, this.formNames.passwordRepeat);
        } else {
          this.errorMessage$.next(messages.invalidData);
        }
      }
    );
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      if (subscription !== undefined) {
        subscription.unsubscribe();
      }
    });
  }
}
