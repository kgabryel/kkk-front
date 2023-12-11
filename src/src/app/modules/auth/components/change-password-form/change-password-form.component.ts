import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from '../../../../core/services/auth/auth.service';
import {ActivatedRoute, Router} from '@angular/router';
import {filter, map, startWith} from 'rxjs/operators';
import {PathUtils} from '../../../../core/utils/path.utils';
import {RoutingConfig} from '../../../../config/routing.config';
import {FormControl, FormGroup} from '@angular/forms';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {authErrors, AuthErrors} from '../../../../core/errors/auth.error';
import {AuthFormFactory, AuthFormNames, formNames} from '../../../../core/factories/auth-form.factory';
import {NotificationService} from '../../../../core/services/notification/notification.service';
import {ChangePasswordRequest} from '../../../../core/requests/auth.request';
import {Length} from '../../../../config/form.config';
import {messages} from '../../../../core/messages/auth.messages';

@Component({
  selector: 'auth-change-password-form',
  templateUrl: './change-password-form.component.html',
  styleUrls: ['./change-password-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChangePasswordFormComponent implements OnInit, OnDestroy {
  public form: FormGroup;
  public errorMessage$: BehaviorSubject<string>;
  public errors: AuthErrors;
  public formNames: AuthFormNames;
  public loginPath: string;
  public maxPasswordLength: number;
  public passwordLength$: Observable<number>;
  public repeatPasswordLength$: Observable<number>;
  private authService: AuthService;
  private route: ActivatedRoute;
  private router: Router;
  private token: string;
  private notificationService: NotificationService;
  private subscriptions: (Subscription | undefined)[];

  public constructor(
    authService: AuthService,
    route: ActivatedRoute,
    router: Router,
    notificationService: NotificationService
  ) {
    this.authService = authService;
    this.route = route;
    this.router = router;
    this.errors = authErrors;
    this.formNames = formNames;
    this.loginPath = PathUtils.concatPath(RoutingConfig.login);
    this.notificationService = notificationService;
    this.maxPasswordLength = Length.maxPasswordLength;
    this.subscriptions = [];
  }

  public ngOnInit(): void {
    this.errorMessage$ = new BehaviorSubject<string>('');
    this.token = this.route.snapshot.paramMap.get('token') ?? '';
    this.subscriptions.push(
      this.authService.checkToken(this.token).pipe(filter(isCorrect => !isCorrect))
        .subscribe(() => this.router.navigateByUrl(PathUtils.concatPath(RoutingConfig.login)))
    );
    this.form = AuthFormFactory.getChangePasswordForm();
    this.subscriptions.push(
      this.form.get(this.formNames.password)?.valueChanges
        .subscribe(() => this.form.get(this.formNames.passwordRepeat)?.updateValueAndValidity())
    );
    this.errorMessage$.next('');
    this.passwordLength$ = (this.form.get(this.formNames.password) as FormControl).valueChanges.pipe(
      startWith(''),
      map(value => value.length)
    );
    this.repeatPasswordLength$ = (this.form.get(this.formNames.passwordRepeat) as FormControl).valueChanges.pipe(
      startWith(''),
      map(value => value.length)
    );
  }

  public submitForm(): void {
    if (this.form.invalid) {
      return;
    }
    const data: ChangePasswordRequest = {
      newPassword: {
        first: this.form.get(this.formNames.password)?.value,
        second: this.form.get(this.formNames.passwordRepeat)?.value
      }
    };
    this.subscriptions.push(
      this.authService.changePassword(data, this.token).subscribe(
        isCorrect => {
          if (isCorrect) {
            this.notificationService.showMessage(messages.passwordChanged);
            this.router.navigateByUrl(PathUtils.concatPath(RoutingConfig.login));
          } else {
            this.errorMessage$.next(messages.invalidData);
          }
        }
      )
    );
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      if (subscription !== undefined) {
        subscription.unsubscribe();
      }
    });
  }
}
