import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {AuthFormFactory, AuthFormNames, formNames} from '../../../../core/factories/auth-form.factory';
import {AuthErrors, authErrors} from '../../../../core/errors/auth.error';
import {PathUtils} from '../../../../core/utils/path.utils';
import {RoutingConfig} from '../../../../config/routing.config';
import {AuthService} from '../../../../core/services/auth/auth.service';
import {NotificationService} from '../../../../core/services/notification/notification.service';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {Length} from '../../../../config/form.config';
import {messages} from '../../../../core/messages/auth.messages';
import {FormUtils} from '../../../../core/utils/form.utils';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'auth-reset-password-form',
  templateUrl: './reset-password-form.component.html',
  styleUrls: ['./reset-password-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ResetPasswordFormComponent implements OnInit, OnDestroy {
  public form: FormGroup;
  public errorMessage$: BehaviorSubject<string>;
  public errors: AuthErrors;
  public formNames: AuthFormNames;
  public loginPath: string;
  public emailLength$: Observable<number>;
  public maxEmailLength: number;
  private authService: AuthService;
  private notificationService: NotificationService;
  private subscription: Subscription;

  public constructor(authService: AuthService, notificationService: NotificationService) {
    this.errors = authErrors;
    this.formNames = formNames;
    this.loginPath = PathUtils.concatPath(RoutingConfig.login);
    this.authService = authService;
    this.notificationService = notificationService;
    this.maxEmailLength = Length.maxEmailLength;
  }

  public ngOnInit(): void {
    this.form = AuthFormFactory.getResetPasswordForm();
    this.errorMessage$ = new BehaviorSubject<string>('');
    this.errorMessage$.next('');
    this.emailLength$ = (this.form.get(this.formNames.email) as FormControl).valueChanges.pipe(
      startWith(''),
      map(value => value.length)
    );
  }

  public submitForm(): void {
    if (this.form.invalid) {
      return;
    }
    this.subscription = this.authService.resetPassword(this.form.value).subscribe(
      isCorrect => {
        if (isCorrect) {
          FormUtils.clearInputs(this.form, '', this.formNames.email);
          this.notificationService.showMessage(messages.emailSent);
          this.errorMessage$.next('');
        } else {
          this.errorMessage$.next(messages.invalidData);
        }
      }
    );
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
