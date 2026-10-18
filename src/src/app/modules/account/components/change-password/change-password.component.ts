import type { OnInit, Signal, WritableSignal } from '@angular/core';
import type { FormGroup } from '@angular/forms';

import { ChangeDetectionStrategy, Component, signal, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { EMPTY } from 'rxjs';
import { take } from 'rxjs/operators';

import type { ChangePasswordError } from '@/app/core/errors/change-password.error';
import type { ChangePasswordFormNames } from '@/app/core/factories/change-password-form.factory';
import type { ChangePasswordRequest } from '@/app/core/requests/change-password.request';

import { Length } from '@/app/config/form.config';
import { changePasswordError } from '@/app/core/errors/change-password.error';
import { ChangePasswordFormFactory, formNames } from '@/app/core/factories/change-password-form.factory';
import { messages } from '@/app/core/messages/account.messages';
import { NotificationService } from '@/app/core/services/notification.service';
import { UserService } from '@/app/core/services/user.service';
import { FormUtils } from '@/app/core/utils/form.utils';
import { BaseComponent } from '@/app/modules/base.component';
import { ErrorsContainerComponent } from '@/app/modules/shared/components/errors-container/errors-container.component';

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
  styleUrl: './change-password.component.scss',
  templateUrl: './change-password.component.html',
})
export class ChangePasswordComponent extends BaseComponent implements OnInit {
  public errorMessage: WritableSignal<string> = signal<string>('');
  public errors: ChangePasswordError = changePasswordError;
  public form!: FormGroup;
  public formNames: ChangePasswordFormNames = formNames;
  public maxPasswordLength: number = Length.maxPasswordLength;
  public newPasswordLength!: Signal<number>;
  public oldPasswordLength!: Signal<number>;
  public repeatPasswordLength!: Signal<number>;
  private notificationService: NotificationService = inject(NotificationService);
  private userService: UserService = inject(UserService);

  public ngOnInit(): void {
    this.form = ChangePasswordFormFactory.get();

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
