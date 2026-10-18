import { ChangeDetectionStrategy, Component } from '@angular/core';

import { FormContainerComponent } from '@/app/modules/auth/components/form-container/form-container.component';
import { RegisterFormComponent } from '@/app/modules/auth/components/register-form/register-form.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormContainerComponent, RegisterFormComponent],
  selector: 'auth-pages-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent {}
