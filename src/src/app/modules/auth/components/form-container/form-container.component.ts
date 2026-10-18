import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ImagesConfig } from '@/app/config/images.config';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'auth-form-container',
  styleUrl: './form-container.component.scss',
  templateUrl: './form-container.component.html',
})
export class FormContainerComponent {
  public authHorizontal: string = ImagesConfig.authVertical;
  public authVertical: string = ImagesConfig.authHorizontal;
}
