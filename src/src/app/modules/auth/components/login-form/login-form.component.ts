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
import { AuthService } from '../../../../core/services/auth.service';
import { LoginService } from '../../../../core/services/login.service';
import { FormUtils } from '../../../../core/utils/form.utils';
import { PathUtils } from '../../../../core/utils/path.utils';
import { BaseComponent } from '../../../base.component';
import { ErrorsContainerComponent } from '../../../shared/components/errors-container/errors-container.component';

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
  standalone: true,
  styleUrls: ['./login-form.component.scss'],
  templateUrl: './login-form.component.html',
})
export class LoginFormComponent extends BaseComponent implements OnInit {
  public emailLength!: Signal<number>;
  public errorMessage: WritableSignal<string> = signal<string>('');
  public errors: AuthErrors;
  public form!: FormGroup;
  public formNames: AuthFormNames;
  public maxEmailLength: number;
  public maxPasswordLength: number;
  public passwordLength!: Signal<number>;
  public registerPath: string;
  public resetPasswordPath: string;
  private authService: AuthService;
  private loginService: LoginService;
  private router: Router;
  public constructor(loginService: LoginService, authService: AuthService, router: Router) {
    super();
    this.loginService = loginService;
    this.authService = authService;
    this.router = router;
    this.formNames = formNames;
    this.maxPasswordLength = Length.maxPasswordLength;
    this.maxEmailLength = Length.maxEmailLength;
    this.errors = authErrors;
    this.registerPath = PathUtils.concatPath(RoutingConfig.registration);
    this.resetPasswordPath = PathUtils.concatPath(RoutingConfig.resetPassword);
  }

  public ngOnInit(): void {
    this.errorMessage.set('');
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
