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
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EMPTY } from 'rxjs';
import { filter, take } from 'rxjs/operators';

import { Length } from '../../../../config/form.config';
import { RoutingConfig } from '../../../../config/routing.config';
import { authErrors, AuthErrors } from '../../../../core/errors/auth.error';
import {
  AuthFormFactory,
  AuthFormNames,
  formNames,
} from '../../../../core/factories/auth-form.factory';
import { messages } from '../../../../core/messages/auth.messages';
import { ChangePasswordRequest } from '../../../../core/requests/auth.request';
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
  selector: 'auth-change-password-form',
  standalone: true,
  styleUrls: ['./change-password-form.component.scss'],
  templateUrl: './change-password-form.component.html',
})
export class ChangePasswordFormComponent extends BaseComponent implements OnInit {
  public errorMessage: WritableSignal<string> = signal<string>('');
  public errors: AuthErrors;
  public form!: FormGroup;
  public formNames: AuthFormNames;
  public loginPath: string;
  public maxPasswordLength: number;
  public passwordLength!: Signal<number>;
  public repeatPasswordLength!: Signal<number>;
  private authService: AuthService;
  private notificationService: NotificationService;
  private route: ActivatedRoute;
  private router: Router;
  private token!: string;
  public constructor(
    authService: AuthService,
    route: ActivatedRoute,
    router: Router,
    notificationService: NotificationService,
  ) {
    super();
    this.authService = authService;
    this.route = route;
    this.router = router;
    this.errors = authErrors;
    this.formNames = formNames;
    this.loginPath = PathUtils.concatPath(RoutingConfig.login);
    this.notificationService = notificationService;
    this.maxPasswordLength = Length.maxPasswordLength;
  }

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

    this.errorMessage.set('');
    this.passwordLength = FormUtils.getLength(this.injector, this.form, this.formNames.password);
    this.repeatPasswordLength = FormUtils.getLength(
      this.injector,
      this.form,
      this.formNames.passwordRepeat,
    );
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
