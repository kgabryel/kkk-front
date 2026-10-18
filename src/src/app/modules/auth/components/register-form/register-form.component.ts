import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {AuthFormFactory, AuthFormNames, formNames} from '../../../../core/factories/auth-form.factory';
import {RegisterService} from '../../../../core/services/register/register.service';
import {AuthService} from '../../../../core/services/auth/auth.service';
import {Router} from '@angular/router';
import {PathUtils} from '../../../../core/utils/path.utils';
import {RoutingConfig} from '../../../../config/routing.config';
import {authErrors, AuthErrors} from '../../../../core/errors/auth.error';
import {LoginService} from '../../../../core/services/login/login.service';
import {LoginRequest, RegisterRequest} from '../../../../core/requests/auth.request';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {Length} from '../../../../config/form.config';
import {messages} from '../../../../core/messages/auth.messages';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'auth-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterFormComponent implements OnInit, OnDestroy {
  public form: FormGroup;
  public formNames: AuthFormNames;
  public errorMessage$: BehaviorSubject<string>;
  public errors: AuthErrors;
  public loginPath: string;
  public maxPasswordLength: number;
  public maxEmailLength: number;
  public emailLength$: Observable<number>;
  public passwordLength$: Observable<number>;
  public repeatPasswordLength$: Observable<number>;
  private registerService: RegisterService;
  private loginService: LoginService;
  private authService: AuthService;
  private router: Router;
  private subscriptions: Subscription[];

  public constructor(
    registerService: RegisterService,
    loginService: LoginService,
    authService: AuthService,
    router: Router
  ) {
    this.formNames = formNames;
    this.maxPasswordLength = Length.maxPasswordLength;
    this.maxEmailLength = Length.maxEmailLength;
    this.registerService = registerService;
    this.loginService = loginService;
    this.authService = authService;
    this.router = router;
    this.errors = authErrors;
    this.loginPath = PathUtils.concatPath(RoutingConfig.login);
    this.subscriptions = [];
  }

  public ngOnInit(): void {
    this.errorMessage$ = new BehaviorSubject<string>('');
    this.form = AuthFormFactory.getRegisterForm();
    this.emailLength$ = (this.form.get(this.formNames.username) as FormControl).valueChanges.pipe(
      startWith(''),
      map(value => value.length)
    );
    this.passwordLength$ = (this.form.get(this.formNames.password) as FormControl).valueChanges.pipe(
      startWith(''),
      map(value => value.length)
    );
    this.repeatPasswordLength$ = (this.form.get(this.formNames.passwordRepeat) as FormControl).valueChanges.pipe(
      startWith(''),
      map(value => value.length)
    );
    this.subscriptions.push(
      this.form.valueChanges.subscribe(() => this.errorMessage$.next(''))
    );
  }

  public submitForm(): void {
    if (this.form.invalid) {
      return;
    }
    const registerData: RegisterRequest = {
      email: this.form.get(this.formNames.email)?.value,
      password: {
        first: this.form.get(this.formNames.password)?.value,
        second: this.form.get(this.formNames.passwordRepeat)?.value
      }
    };
    this.subscriptions.push(
      this.registerService.register(registerData).subscribe(data => {
        if (data === '') {
          const loginData: LoginRequest = {
            username: this.form.get(this.formNames.email)?.value,
            password: this.form.get(this.formNames.password)?.value
          };
          this.loginService.login(loginData).subscribe(
            data => {
              if (data.isCorrect) {
                this.errorMessage$.next('');
                this.authService.storeToken(data);
                this.router.navigateByUrl(PathUtils.concatPath(RoutingConfig.home));
              } else {
                this.errorMessage$.next(messages.invalidData);
              }
            });
        } else {
          this.errorMessage$.next(data);
        }
      })
    );
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
