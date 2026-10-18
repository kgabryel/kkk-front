import type { InputSignal } from '@angular/core';

import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

import type { Recipe } from '@/app/core/models/recipe';
import type { Timer } from '@/app/core/models/timer';

import { messages } from '@/app/core/messages/recipes.messages';
import { NotificationService } from '@/app/core/services/notification.service';
import { TimersListService } from '@/app/core/services/timers-list.service';
import { TimerComponent } from '@/app/modules/recipes/components/timer/timer.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatButton, MatIcon, TimerComponent],
  selector: 'recipes-recipe-timers',
  templateUrl: './recipe-timers.component.html',
})
export class RecipeTimersComponent {
  public recipe: InputSignal<Recipe> = input.required<Recipe>();
  private notificationService: NotificationService = inject(NotificationService);
  private timersListService: TimersListService = inject(TimersListService);

  public addAllTimers(): void {
    this.recipe().timers.forEach((timer: Timer) => this.timersListService.addTimer(timer));
    if (this.recipe().timers.length > 1) {
      this.notificationService.showMessage(messages.timersAdded);
    } else {
      this.notificationService.showMessage(messages.timerAdded);
    }
  }

  public addTimer(timer: Timer): void {
    this.timersListService.addTimer(timer);
    this.notificationService.showMessage(messages.timerAdded);
  }
}
