import type { Signal, WritableSignal } from '@angular/core';

import { Injectable, signal } from '@angular/core';

import type { Timer } from '@/app/core/models/timer';

@Injectable({ providedIn: 'root' })
export class TimersListService {
  private timers: WritableSignal<Timer> = signal<Timer>({
    id: 0,
    name: null,
    time: 0,
  });

  public addTimer(timer: Timer): void {
    this.timers.set(timer);
  }

  public getState(): Signal<Timer> {
    return this.timers.asReadonly();
  }
}
