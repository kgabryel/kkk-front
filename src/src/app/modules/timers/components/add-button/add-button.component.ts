import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatMiniFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';

import { TimersTooltips, tooltips } from '../../../../core/tooltips/timers.tooltips';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatTooltip, MatIcon, MatMiniFabButton],
  selector: 'timers-add-button',
  standalone: true,
  styleUrls: ['./add-button.component.scss'],
  templateUrl: './add-button.component.html',
})
export class AddButtonComponent {
  public tooltips: TimersTooltips;
  public constructor() {
    this.tooltips = tooltips;
  }
}
