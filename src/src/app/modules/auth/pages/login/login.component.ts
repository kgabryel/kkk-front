import { ChangeDetectionStrategy, Component } from '@angular/core';

import { FormContainerComponent } from '../../components/form-container/form-container.component';
import { LoginFormComponent } from '../../components/login-form/login-form.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormContainerComponent, LoginFormComponent],
  selector: 'auth-pages-login',
  standalone: true,
  styleUrls: [],
  templateUrl: './login.component.html',
})
export class LoginComponent {}
