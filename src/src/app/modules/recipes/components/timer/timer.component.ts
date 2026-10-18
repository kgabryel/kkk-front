import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {Timer} from '../../../../core/models/timer';
import {RecipesTooltips, tooltips} from '../../../../core/tooltips/recipes.tooltips';

@Component({
  selector: 'recipes-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimerComponent {

  @Input() public timer: Timer;
  public tooltips: RecipesTooltips;
  @Output() private add: EventEmitter<void>;

  public constructor() {
    this.add = new EventEmitter<void>();
    this.tooltips = tooltips;
  }

  public addTimer(): void {
    this.add.emit();
  }
}
