import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ChangePasswordFormComponent } from '../../components/change-password-form/change-password-form.component';
import { FormContainerComponent } from '../../components/form-container/form-container.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormContainerComponent, ChangePasswordFormComponent],
  selector: 'auth-pages-change-password',
  standalone: true,
  styleUrls: [],
  templateUrl: './change-password.component.html',
})
export class ChangePasswordComponent {}
