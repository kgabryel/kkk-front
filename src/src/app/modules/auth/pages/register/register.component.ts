import { ChangeDetectionStrategy, Component } from '@angular/core';

import { FormContainerComponent } from '../../components/form-container/form-container.component';
import { RegisterFormComponent } from '../../components/register-form/register-form.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormContainerComponent, RegisterFormComponent],
  selector: 'auth-pages-register',
  standalone: true,
  styleUrls: [],
  templateUrl: './register.component.html',
})
export class RegisterComponent {}
