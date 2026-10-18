import type { OnInit, Signal, WritableSignal } from '@angular/core';
import type { FormGroup } from '@angular/forms';

import { ChangeDetectionStrategy, Component, signal, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { take } from 'rxjs/operators';

import type { AuthErrors } from '@/app/core/errors/auth.error';
import type { AuthFormNames } from '@/app/core/factories/auth-form.factory';
import type { TokensData } from '@/app/core/models/auth';

import { Length } from '@/app/config/form.config';
import { RoutingConfig } from '@/app/config/routing.config';
import { authErrors } from '@/app/core/errors/auth.error';
import { AuthFormFactory, formNames } from '@/app/core/factories/auth-form.factory';
import { messages } from '@/app/core/messages/auth.messages';
import { AuthService } from '@/app/core/services/auth.service';
import { LoginService } from '@/app/core/services/login.service';
import { FormUtils } from '@/app/core/utils/form.utils';
import { PathUtils } from '@/app/core/utils/path.utils';
import { BaseComponent } from '@/app/modules/base.component';
import { ErrorsContainerComponent } from '@/app/modules/shared/components/errors-container/errors-container.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatFormField,
    ReactiveFormsModule,
    MatLabel,
    MatHint,
    MatInput,
    ErrorsContainerComponent,
    MatButton,
    MatIcon,
    RouterLink,
  ],
  providers: [LoginService],
  selector: 'auth-login-form',
  styleUrl: './login-form.component.scss',
  templateUrl: './login-form.component.html',
})
export class LoginFormComponent extends BaseComponent implements OnInit {
  public emailLength!: Signal<number>;
  public errorMessage: WritableSignal<string> = signal<string>('');
  public errors: AuthErrors = authErrors;
  public form!: FormGroup;
  public formNames: AuthFormNames = formNames;
  public maxEmailLength: number = Length.maxEmailLength;
  public maxPasswordLength: number = Length.maxPasswordLength;
  public passwordLength!: Signal<number>;
  public registerPath: string = PathUtils.concatPath(RoutingConfig.registration);
  public resetPasswordPath: string = PathUtils.concatPath(RoutingConfig.resetPassword);
  private authService: AuthService = inject(AuthService);
  private loginService: LoginService = inject(LoginService);
  private router: Router = inject(Router);

  public ngOnInit(): void {
    this.form = AuthFormFactory.getLoginForm();
    this.emailLength = FormUtils.getLength(this.injector, this.form, this.formNames.username);
    this.passwordLength = FormUtils.getLength(this.injector, this.form, this.formNames.password);
    this.onObservable(() => this.errorMessage.set(''), this.form.valueChanges);
  }

  public fbRedirect(): void {
    void this.loginService.fbRedirect();
  }

  public submitForm(): void {
    if (this.form.invalid) {
      return;
    }
    this.loginService
      .login(this.form.value)
      .pipe(take(1))
      .subscribe((data: TokensData) => {
        if (data.isCorrect) {
          this.errorMessage.set('');
          this.authService.storeToken(data);
          void this.router.navigateByUrl(PathUtils.concatPath(RoutingConfig.home));
        } else {
          this.errorMessage.set(messages.invalidData);
        }
      });
  }
}
