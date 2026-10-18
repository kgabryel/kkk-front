import { ChangeDetectionStrategy, Component } from '@angular/core';

import { FormContainerComponent } from '@/app/modules/auth/components/form-container/form-container.component';
import { ResetPasswordFormComponent } from '@/app/modules/auth/components/reset-password-form/reset-password-form.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormContainerComponent, ResetPasswordFormComponent],
  selector: 'auth-pages-reset-password',
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent {}
