import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ChangePasswordFormComponent } from '@/app/modules/auth/components/change-password-form/change-password-form.component';
import { FormContainerComponent } from '@/app/modules/auth/components/form-container/form-container.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormContainerComponent, ChangePasswordFormComponent],
  selector: 'auth-pages-change-password',
  templateUrl: './change-password.component.html',
})
export class ChangePasswordComponent {}
