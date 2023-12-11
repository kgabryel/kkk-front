import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoginComponent} from './pages/login/login.component';
import {RegisterComponent} from './pages/register/register.component';
import {LoginFormComponent} from './components/login-form/login-form.component';
import {RegisterFormComponent} from './components/register-form/register-form.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {FormContainerComponent} from './components/form-container/form-container.component';
import {ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../shared/shared.module';
import {RouterModule} from '@angular/router';
import {LoginService} from '../../core/services/login/login.service';
import {RegisterService} from '../../core/services/register/register.service';
import {FbComponent} from './pages/fb/fb.component';
import {NotificationService} from '../../core/services/notification/notification.service';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {ChangePasswordComponent} from './pages/change-password/change-password.component';
import {ResetPasswordComponent} from './pages/reset-password/reset-password.component';
import {ChangePasswordFormComponent} from './components/change-password-form/change-password-form.component';
import {ResetPasswordFormComponent} from './components/reset-password-form/reset-password-form.component';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    LoginFormComponent,
    RegisterFormComponent,
    FormContainerComponent,
    FbComponent,
    ChangePasswordComponent,
    ResetPasswordComponent,
    ChangePasswordFormComponent,
    ResetPasswordFormComponent
  ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    SharedModule,
    RouterModule,
    MatSnackBarModule
  ],
  providers: [
    LoginService,
    RegisterService,
    NotificationService
  ]
})
export class AuthModule {
}
