import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatMiniFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';

import type { TimersTooltips } from '@/app/core/tooltips/timers.tooltips';

import { tooltips } from '@/app/core/tooltips/timers.tooltips';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatTooltip, MatIcon, MatMiniFabButton],
  selector: 'timers-add-button',
  styleUrl: './add-button.component.scss',
  templateUrl: './add-button.component.html',
})
export class AddButtonComponent {
  public tooltips: TimersTooltips = tooltips;
}
