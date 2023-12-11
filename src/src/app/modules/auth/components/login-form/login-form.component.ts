import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {AuthFormFactory, AuthFormNames, formNames} from '../../../../core/factories/auth-form.factory';
import {LoginService} from '../../../../core/services/login/login.service';
import {AuthService} from '../../../../core/services/auth/auth.service';
import {Router} from '@angular/router';
import {PathUtils} from '../../../../core/utils/path.utils';
import {RoutingConfig} from '../../../../config/routing.config';
import {authErrors, AuthErrors} from '../../../../core/errors/auth.error';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {Length} from '../../../../config/form.config';
import {messages} from '../../../../core/messages/auth.messages';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'auth-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginFormComponent implements OnInit, OnDestroy {
  public form: FormGroup;
  public formNames: AuthFormNames;
  public errorMessage$: BehaviorSubject<string>;
  public errors: AuthErrors;
  public registerPath: string;
  public maxPasswordLength: number;
  public maxEmailLength: number;
  public emailLength$: Observable<number>;
  public passwordLength$: Observable<number>;
  public resetPasswordPath: string;
  private loginService: LoginService;
  private authService: AuthService;
  private router: Router;
  private subscriptions: Subscription[];

  public constructor(loginService: LoginService, authService: AuthService, router: Router) {
    this.loginService = loginService;
    this.authService = authService;
    this.router = router;
    this.formNames = formNames;
    this.maxPasswordLength = Length.maxPasswordLength;
    this.maxEmailLength = Length.maxEmailLength;
    this.errors = authErrors;
    this.registerPath = PathUtils.concatPath(RoutingConfig.registration);
    this.resetPasswordPath = PathUtils.concatPath(RoutingConfig.resetPassword);
    this.subscriptions = [];
  }

  public ngOnInit(): void {
    this.errorMessage$ = new BehaviorSubject<string>('');
    this.form = AuthFormFactory.getLoginForm();
    this.errorMessage$.next('');
    this.emailLength$ = (this.form.get(this.formNames.username) as FormControl).valueChanges.pipe(
      startWith(''),
      map(value => value.length)
    );
    this.passwordLength$ = (this.form.get(this.formNames.password) as FormControl).valueChanges.pipe(
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
    this.subscriptions.push(
      this.loginService.login(this.form.value).subscribe(
        data => {
          if (data.isCorrect) {
            this.errorMessage$.next('');
            this.authService.storeToken(data);
            this.router.navigateByUrl(PathUtils.concatPath(RoutingConfig.home));
          } else {
            this.errorMessage$.next(messages.invalidData);
          }
        }
      )
    );
  }

  public fbRedirect(): void {
    this.loginService.fbRedirect();
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
