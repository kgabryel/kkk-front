import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ImagesConfig} from '../../../../config/images.config';

@Component({
  selector: 'auth-form-container',
  templateUrl: './form-container.component.html',
  styleUrls: ['./form-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormContainerComponent {
  public authVertical: string;
  public authHorizontal: string;

  public constructor() {
    this.authVertical = ImagesConfig.authVertical;
    this.authHorizontal = ImagesConfig.authHorizontal;
  }
}
