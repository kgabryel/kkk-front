import { ChangeDetectionStrategy, Component } from '@angular/core';

import { FormContainerComponent } from '../../components/form-container/form-container.component';
import { ResetPasswordFormComponent } from '../../components/reset-password-form/reset-password-form.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormContainerComponent, ResetPasswordFormComponent],
  selector: 'auth-pages-reset-password',
  standalone: true,
  styleUrls: [],
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent {}
