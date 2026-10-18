import type { InputSignal, OutputEmitterRef } from '@angular/core';

import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';

import type { Timer } from '@/app/core/models/timer';
import type { RecipesTooltips } from '@/app/core/tooltips/recipes.tooltips';

import { tooltips } from '@/app/core/tooltips/recipes.tooltips';
import { TimerTimePipe } from '@/app/modules/shared/pipes/timer-time.pipe';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TimerTimePipe, MatTooltip, MatButton, MatIcon],
  selector: 'recipes-timer',
  styleUrl: './timer.component.scss',
  templateUrl: './timer.component.html',
})
export class TimerComponent {
  public timer: InputSignal<Timer> = input.required<Timer>();
  public add: OutputEmitterRef<void> = output<void>();
  public tooltips: RecipesTooltips = tooltips;

  public addTimer(): void {
    this.add.emit();
  }
}
