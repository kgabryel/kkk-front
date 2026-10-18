import { ChangeDetectionStrategy, Component } from '@angular/core';

import { ImagesConfig } from '../../../../config/images.config';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'auth-form-container',
  standalone: true,
  styleUrls: ['./form-container.component.scss'],
  templateUrl: './form-container.component.html',
})
export class FormContainerComponent {
  public authHorizontal: string;
  public authVertical: string;
  public constructor() {
    this.authVertical = ImagesConfig.authVertical;
    this.authHorizontal = ImagesConfig.authHorizontal;
  }
}
