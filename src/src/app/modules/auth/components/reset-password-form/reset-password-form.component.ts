import type { OnInit, Signal, WritableSignal } from '@angular/core';
import type { FormGroup } from '@angular/forms';

import { ChangeDetectionStrategy, Component, signal, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { take } from 'rxjs/operators';

import type { AuthErrors } from '@/app/core/errors/auth.error';
import type { AuthFormNames } from '@/app/core/factories/auth-form.factory';

import { Length } from '@/app/config/form.config';
import { RoutingConfig } from '@/app/config/routing.config';
import { authErrors } from '@/app/core/errors/auth.error';
import { AuthFormFactory, formNames } from '@/app/core/factories/auth-form.factory';
import { messages } from '@/app/core/messages/auth.messages';
import { AuthService } from '@/app/core/services/auth.service';
import { NotificationService } from '@/app/core/services/notification.service';
import { FormUtils } from '@/app/core/utils/form.utils';
import { PathUtils } from '@/app/core/utils/path.utils';
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
    RouterLink,
    MatButton,
  ],
  selector: 'auth-reset-password-form',
  styleUrl: './reset-password-form.component.scss',
  templateUrl: './reset-password-form.component.html',
})
export class ResetPasswordFormComponent extends BaseComponent implements OnInit {
  public emailLength!: Signal<number>;
  public errorMessage: WritableSignal<string> = signal<string>('');
  public errors: AuthErrors = authErrors;
  public form!: FormGroup;
  public formNames: AuthFormNames = formNames;
  public loginPath: string = PathUtils.concatPath(RoutingConfig.login);
  public maxEmailLength: number = Length.maxEmailLength;
  private authService: AuthService = inject(AuthService);
  private notificationService: NotificationService = inject(NotificationService);

  public ngOnInit(): void {
    this.form = AuthFormFactory.getResetPasswordForm();
    this.emailLength = FormUtils.getLength(this.injector, this.form, this.formNames.email);
  }

  public submitForm(): void {
    if (this.form.invalid) {
      return;
    }
    this.authService
      .resetPassword(this.form.value)
      .pipe(take(1))
      .subscribe((isCorrect: boolean) => {
        if (isCorrect) {
          FormUtils.clearInputs(this.form, '', this.formNames.email);
          this.notificationService.showMessage(messages.emailSent);
          this.errorMessage.set('');
        } else {
          this.errorMessage.set(messages.invalidData);
        }
      });
  }
}
