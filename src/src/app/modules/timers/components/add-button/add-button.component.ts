import {ChangeDetectionStrategy, Component} from '@angular/core';
import {TimersTooltips, tooltips} from '../../../../core/tooltips/timers.tooltips';

@Component({
  selector: 'timers-add-button',
  templateUrl: './add-button.component.html',
  styleUrls: ['./add-button.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddButtonComponent {

  public tooltips: TimersTooltips;

  public constructor() {
    this.tooltips = tooltips;
  }
}
