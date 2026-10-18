import { ChangeDetectionStrategy, Component } from '@angular/core';

import { FormContainerComponent } from '@/app/modules/auth/components/form-container/form-container.component';
import { LoginFormComponent } from '@/app/modules/auth/components/login-form/login-form.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormContainerComponent, LoginFormComponent],
  selector: 'auth-pages-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {}
