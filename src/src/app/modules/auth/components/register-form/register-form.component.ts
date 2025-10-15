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
import { Router, RouterLink } from '@angular/router';
import { take } from 'rxjs/operators';

import { Length } from '../../../../config/form.config';
import { RoutingConfig } from '../../../../config/routing.config';
import { authErrors, AuthErrors } from '../../../../core/errors/auth.error';
import {
  AuthFormFactory,
  AuthFormNames,
  formNames,
} from '../../../../core/factories/auth-form.factory';
import { messages } from '../../../../core/messages/auth.messages';
import { TokensData } from '../../../../core/models/auth';
import { LoginRequest, RegisterRequest } from '../../../../core/requests/auth.request';
import { AuthService } from '../../../../core/services/auth.service';
import { LoginService } from '../../../../core/services/login.service';
import { RegisterService } from '../../../../core/services/register.service';
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
    MatButton,
    RouterLink,
  ],
  providers: [LoginService, RegisterService],
  selector: 'auth-register-form',
  standalone: true,
  styleUrls: ['./register-form.component.scss'],
  templateUrl: './register-form.component.html',
})
export class RegisterFormComponent extends BaseComponent implements OnInit {
  public emailLength!: Signal<number>;
  public errorMessage: WritableSignal<string> = signal<string>('');
  public errors: AuthErrors;
  public form!: FormGroup;
  public formNames: AuthFormNames;
  public loginPath: string;
  public maxEmailLength: number;
  public maxPasswordLength: number;
  public passwordLength!: Signal<number>;
  public repeatPasswordLength!: Signal<number>;
  private authService: AuthService;
  private loginService: LoginService;
  private registerService: RegisterService;
  private router: Router;
  public constructor(
    registerService: RegisterService,
    loginService: LoginService,
    authService: AuthService,
    router: Router,
  ) {
    super();
    this.formNames = formNames;
    this.maxPasswordLength = Length.maxPasswordLength;
    this.maxEmailLength = Length.maxEmailLength;
    this.registerService = registerService;
    this.loginService = loginService;
    this.authService = authService;
    this.router = router;
    this.errors = authErrors;
    this.loginPath = PathUtils.concatPath(RoutingConfig.login);
  }

  public ngOnInit(): void {
    this.form = AuthFormFactory.getRegisterForm();
    this.emailLength = FormUtils.getLength(this.injector, this.form, this.formNames.email);
    this.passwordLength = FormUtils.getLength(this.injector, this.form, this.formNames.password);
    this.repeatPasswordLength = FormUtils.getLength(
      this.injector,
      this.form,
      this.formNames.passwordRepeat,
    );
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
