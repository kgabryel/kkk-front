import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';

import { Timer } from '../../../../core/models/timer';
import { RecipesTooltips, tooltips } from '../../../../core/tooltips/recipes.tooltips';
import { TimerTimePipe } from '../../../shared/pipes/timer-time.pipe';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TimerTimePipe, MatTooltip, MatButton, MatIcon],
  selector: 'recipes-timer',
  standalone: true,
  styleUrls: ['./timer.component.scss'],
  templateUrl: './timer.component.html',
})
export class TimerComponent {
  public timer = input.required<Timer>();
  public add = output<void>();
  public tooltips: RecipesTooltips;
  public constructor() {
    this.tooltips = tooltips;
  }

  public addTimer(): void {
    this.add.emit();
  }
}
