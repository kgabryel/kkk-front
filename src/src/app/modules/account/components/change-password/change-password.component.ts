import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { EMPTY } from 'rxjs';
import { take } from 'rxjs/operators';

import { Length } from '../../../../config/form.config';
import {
  changePasswordError,
  ChangePasswordError,
} from '../../../../core/errors/change-password.error';
import {
  ChangePasswordFormFactory,
  ChangePasswordFormNames,
  formNames,
} from '../../../../core/factories/change-password-form.factory';
import { messages } from '../../../../core/messages/account.messages';
import { ChangePasswordRequest } from '../../../../core/requests/change-password.request';
import { NotificationService } from '../../../../core/services/notification.service';
import { UserService } from '../../../../core/services/user.service';
import { FormUtils } from '../../../../core/utils/form.utils';
import { BaseComponent } from '../../../base.component';
import { ErrorsContainerComponent } from '../../../shared/components/errors-container/errors-container.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatHint,
    MatInput,
    ErrorsContainerComponent,
    MatIcon,
    MatButton,
  ],
  selector: 'account-change-password',
  standalone: true,
  styleUrls: ['./change-password.component.scss'],
  templateUrl: './change-password.component.html',
})
export class ChangePasswordComponent extends BaseComponent implements OnInit {
  public errorMessage: WritableSignal<string> = signal<string>('');
  public errors: ChangePasswordError;
  public form!: FormGroup;
  public formNames: ChangePasswordFormNames;
  public maxPasswordLength: number;
  public newPasswordLength!: Signal<number>;
  public oldPasswordLength!: Signal<number>;
  public repeatPasswordLength!: Signal<number>;
  private notificationService: NotificationService;
  private userService: UserService;
  public constructor(userService: UserService, notificationService: NotificationService) {
    super();
    this.maxPasswordLength = Length.maxPasswordLength;
    this.errors = changePasswordError;
    this.formNames = formNames;
    this.userService = userService;
    this.notificationService = notificationService;
  }

  public ngOnInit(): void {
    this.form = ChangePasswordFormFactory.get();
    this.errorMessage.set('');

    this.oldPasswordLength = FormUtils.getLength(
      this.injector,
      this.form,
      this.formNames.oldPassword,
      this.form.get(this.formNames.oldPassword)?.value ?? '',
    );

    this.newPasswordLength = FormUtils.getLength(
      this.injector,
      this.form,
      this.formNames.newPassword,
      this.form.get(this.formNames.newPassword)?.value ?? '',
    );

    this.repeatPasswordLength = FormUtils.getLength(
      this.injector,
      this.form,
      this.formNames.passwordRepeat,
      this.form.get(this.formNames.passwordRepeat)?.value ?? '',
    );

    this.onObservable(
      () => this.form.get(this.formNames.newPassword)?.updateValueAndValidity(),
      this.form.get(this.formNames.oldPassword)?.valueChanges ?? EMPTY,
    );

    this.onObservable(
      () => this.form.get(this.formNames.passwordRepeat)?.updateValueAndValidity(),
      this.form.get(this.formNames.newPassword)?.valueChanges ?? EMPTY,
    );
  }

  public submitForm(): void {
    if (this.form.invalid) {
      return;
    }
    const data: ChangePasswordRequest = {
      newPassword: {
        first: this.form.get(this.formNames.newPassword)?.value,
        second: this.form.get(this.formNames.passwordRepeat)?.value,
      },
      oldPassword: this.form.get(this.formNames.oldPassword)?.value,
    };

    this.userService
      .changePassword(data)
      .pipe(take(1))
      .subscribe((isCorrect: boolean) => {
        if (!isCorrect) {
          this.errorMessage.set(messages.invalidData);

          return;
        }
        this.notificationService.showMessage(messages.passwordChanged);
        FormUtils.clearInputs(
          this.form,
          '',
          this.formNames.oldPassword,
          this.formNames.newPassword,
          this.formNames.passwordRepeat,
        );
      });
  }
}
