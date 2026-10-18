import type { OnInit, Signal, WritableSignal } from '@angular/core';
import type { FormGroup } from '@angular/forms';

import { ChangeDetectionStrategy, Component, signal, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EMPTY } from 'rxjs';
import { filter, take } from 'rxjs/operators';

import type { AuthErrors } from '@/app/core/errors/auth.error';
import type { AuthFormNames } from '@/app/core/factories/auth-form.factory';
import type { ChangePasswordRequest } from '@/app/core/requests/auth.request';

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
  selector: 'auth-change-password-form',
  styleUrl: './change-password-form.component.scss',
  templateUrl: './change-password-form.component.html',
})
export class ChangePasswordFormComponent extends BaseComponent implements OnInit {
  public errorMessage: WritableSignal<string> = signal<string>('');
  public errors: AuthErrors = authErrors;
  public form!: FormGroup;
  public formNames: AuthFormNames = formNames;
  public loginPath: string = PathUtils.concatPath(RoutingConfig.login);
  public maxPasswordLength: number = Length.maxPasswordLength;
  public passwordLength!: Signal<number>;
  public repeatPasswordLength!: Signal<number>;
  private authService: AuthService = inject(AuthService);
  private notificationService: NotificationService = inject(NotificationService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  private token!: string;

  public ngOnInit(): void {
    this.token = this.route.snapshot.paramMap.get('token') ?? '';
    this.authService
      .checkToken(this.token)
      .pipe(
        take(1),
        filter((isCorrect: boolean) => !isCorrect),
      )
      .subscribe(() => this.router.navigateByUrl(PathUtils.concatPath(RoutingConfig.login)));
    this.form = AuthFormFactory.getChangePasswordForm();

    this.onObservable(
      () => this.form.get(this.formNames.passwordRepeat)?.updateValueAndValidity(),
      this.form.get(this.formNames.password)?.valueChanges ?? EMPTY,
    );

    this.passwordLength = FormUtils.getLength(this.injector, this.form, this.formNames.password);
    this.repeatPasswordLength = FormUtils.getLength(this.injector, this.form, this.formNames.passwordRepeat);
  }

  public submitForm(): void {
    if (this.form.invalid) {
      return;
    }
    const data: ChangePasswordRequest = {
      newPassword: {
        first: this.form.get(this.formNames.password)?.value,
        second: this.form.get(this.formNames.passwordRepeat)?.value,
      },
    };
    this.authService
      .changePassword(data, this.token)
      .pipe(take(1))
      .subscribe((isCorrect: boolean) => {
        if (isCorrect) {
          this.notificationService.showMessage(messages.passwordChanged);
          void this.router.navigateByUrl(PathUtils.concatPath(RoutingConfig.login));
        } else {
          this.errorMessage.set(messages.invalidData);
        }
      });
  }
}
