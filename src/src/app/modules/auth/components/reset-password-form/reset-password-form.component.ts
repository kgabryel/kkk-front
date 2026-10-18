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
import { MatInput } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { take } from 'rxjs/operators';

import { Length } from '../../../../config/form.config';
import { RoutingConfig } from '../../../../config/routing.config';
import { AuthErrors, authErrors } from '../../../../core/errors/auth.error';
import {
  AuthFormFactory,
  AuthFormNames,
  formNames,
} from '../../../../core/factories/auth-form.factory';
import { messages } from '../../../../core/messages/auth.messages';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { FormUtils } from '../../../../core/utils/form.utils';
import { PathUtils } from '../../../../core/utils/path.utils';
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
    RouterLink,
    MatButton,
  ],
  selector: 'auth-reset-password-form',
  standalone: true,
  styleUrls: ['./reset-password-form.component.scss'],
  templateUrl: './reset-password-form.component.html',
})
export class ResetPasswordFormComponent extends BaseComponent implements OnInit {
  public emailLength!: Signal<number>;
  public errorMessage: WritableSignal<string> = signal<string>('');
  public errors: AuthErrors;
  public form!: FormGroup;
  public formNames: AuthFormNames;
  public loginPath: string;
  public maxEmailLength: number;
  private authService: AuthService;
  private notificationService: NotificationService;
  public constructor(authService: AuthService, notificationService: NotificationService) {
    super();
    this.errors = authErrors;
    this.formNames = formNames;
    this.loginPath = PathUtils.concatPath(RoutingConfig.login);
    this.authService = authService;
    this.notificationService = notificationService;
    this.maxEmailLength = Length.maxEmailLength;
  }

  public ngOnInit(): void {
    this.form = AuthFormFactory.getResetPasswordForm();
    this.errorMessage.set('');
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
