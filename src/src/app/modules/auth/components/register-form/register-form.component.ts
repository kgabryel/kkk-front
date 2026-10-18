import type { OnInit, Signal, WritableSignal } from '@angular/core';
import type { FormGroup } from '@angular/forms';

import { ChangeDetectionStrategy, Component, signal, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { take } from 'rxjs/operators';

import type { AuthErrors } from '@/app/core/errors/auth.error';
import type { AuthFormNames } from '@/app/core/factories/auth-form.factory';
import type { TokensData } from '@/app/core/models/auth';
import type { LoginRequest, RegisterRequest } from '@/app/core/requests/auth.request';

import { Length } from '@/app/config/form.config';
import { RoutingConfig } from '@/app/config/routing.config';
import { authErrors } from '@/app/core/errors/auth.error';
import { AuthFormFactory, formNames } from '@/app/core/factories/auth-form.factory';
import { messages } from '@/app/core/messages/auth.messages';
import { AuthService } from '@/app/core/services/auth.service';
import { LoginService } from '@/app/core/services/login.service';
import { RegisterService } from '@/app/core/services/register.service';
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
    MatButton,
    RouterLink,
  ],
  providers: [LoginService, RegisterService],
  selector: 'auth-register-form',
  styleUrl: './register-form.component.scss',
  templateUrl: './register-form.component.html',
})
export class RegisterFormComponent extends BaseComponent implements OnInit {
  public emailLength!: Signal<number>;
  public errorMessage: WritableSignal<string> = signal<string>('');
  public errors: AuthErrors = authErrors;
  public form!: FormGroup;
  public formNames: AuthFormNames = formNames;
  public loginPath: string = PathUtils.concatPath(RoutingConfig.login);
  public maxEmailLength: number = Length.maxEmailLength;
  public maxPasswordLength: number = Length.maxPasswordLength;
  public passwordLength!: Signal<number>;
  public repeatPasswordLength!: Signal<number>;
  private authService: AuthService = inject(AuthService);
  private loginService: LoginService = inject(LoginService);
  private registerService: RegisterService = inject(RegisterService);
  private router: Router = inject(Router);

  public ngOnInit(): void {
    this.form = AuthFormFactory.getRegisterForm();
    this.emailLength = FormUtils.getLength(this.injector, this.form, this.formNames.email);
    this.passwordLength = FormUtils.getLength(this.injector, this.form, this.formNames.password);
    this.repeatPasswordLength = FormUtils.getLength(this.injector, this.form, this.formNames.passwordRepeat);
    this.onObservable(() => this.errorMessage.set(''), this.form.valueChanges);
  }

  public submitForm(): void {
    if (this.form.invalid) {
      return;
    }
    const registerData: RegisterRequest = {
      email: this.form.get(this.formNames.email)?.value,
      password: {
        first: this.form.get(this.formNames.password)?.value,
        second: this.form.get(this.formNames.passwordRepeat)?.value,
      },
    };
    this.registerService
      .register(registerData)
      .pipe(take(1))
      .subscribe((data: string) => {
        if (data === '') {
          const loginData: LoginRequest = {
            password: this.form.get(this.formNames.password)?.value,
            username: this.form.get(this.formNames.email)?.value,
          };
          this.loginService
            .login(loginData)
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
        } else {
          this.errorMessage.set(data);
        }
      });
  }
}
