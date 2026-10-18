import type { OnDestroy, OnInit, Signal, WritableSignal } from '@angular/core';
import type { Event } from '@angular/router';

import { ChangeDetectionStrategy, Component, DestroyRef, signal, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { NavigationEnd, Router } from '@angular/router';
import { interval, takeUntil } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';

import type { Time } from '@/app/core/models/time';
import type { FullTimer, Timer } from '@/app/core/models/timer';
import type { TimersTooltips } from '@/app/core/tooltips/timers.tooltips';

import { messages } from '@/app/core/messages/timers.messages';
import { NotificationService } from '@/app/core/services/notification.service';
import { TimersListService } from '@/app/core/services/timers-list.service';
import { tooltips } from '@/app/core/tooltips/timers.tooltips';
import { TimeUtils } from '@/app/core/utils/time.utils';
import { BaseComponent } from '@/app/modules/base.component';
import { AddDialogComponent } from '@/app/modules/timers/components/add-dialog/add-dialog.component';
import { AlarmDialogComponent } from '@/app/modules/timers/components/alarm-dialog/alarm-dialog.component';
import { TimerComponent } from '@/app/modules/timers/components/timer/timer.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon, MatButton, MatTooltip, TimerComponent],
  selector: 'timers-timers',
  styleUrl: './timers.component.scss',
  templateUrl: './timers.component.html',
})
export class TimersComponent extends BaseComponent implements OnInit, OnDestroy {
  public step!: number;
  public timers: WritableSignal<FullTimer[]> = signal<FullTimer[]>([]);
  public tooltips: TimersTooltips = tooltips;
  public onRecipesPage!: Signal<boolean>;
  private activeAlarms: WritableSignal<number[]> = signal<number[]>([]);
  private audio: HTMLAudioElement;
  private dialog: MatDialog = inject(MatDialog);
  private notificationService: NotificationService = inject(NotificationService);
  private timersListService: TimersListService = inject(TimersListService);
  private destroyRef: DestroyRef = inject(DestroyRef);
  private router: Router = inject(Router);
  public constructor() {
    super();
    this.audio = new Audio();
    this.audio.loop = true;
    this.audio.src = 'assets/alarm.mp3';
    this.audio.load();
  }

  public ngOnInit(): void {
    this.onRecipesPage = this.mapToSignal(
      this.router.events.pipe(
        filter((evt: Event): evt is NavigationEnd => evt instanceof NavigationEnd),
        map((evt: NavigationEnd) => evt.url),
      ),
      (url: string) => url.startsWith('/recipes'),
      this.router.url,
    );

    this.onSignalValue(
      (alarms: number[]): void | Promise<void> => (alarms.length === 0 ? this.audio.pause() : this.audio.play()),
      this.activeAlarms,
    );
    this.step = 2;
    let initialized = false;
    this.onSignalValue((timer: Timer) => {
      if (!initialized) {
        initialized = true;

        return;
      }
      const timers = this.timers();
      timers.push({ ...timer, leftTime: timer.time, running: false });
      this.timers.set(timers);
      if (this.step === 2) {
        this.step = 0;
      }
    }, this.timersListService.getState());
    interval(1000)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.reduceTime());
  }

  public ngOnDestroy(): void {
    this.activeAlarms.set([]);
  }

  public delete(id: number): void {
    const timers = this.timers();
    timers.splice(id, 1);
    this.timers.set(timers);
  }

  public openAddDialog(): void {
    this.dialog.open(AddDialogComponent);
  }

  public restart(id: number): void {
    const timer = this.timers()[id];

    if (!timer) {
      return;
    }
    timer.running = false;
    timer.leftTime = timer.time;
    this.timers.set(this.timers());
  }

  public setStep(step: number): void {
    this.step = step;
  }

  public switch(id: number): void {
    const timer = this.timers()[id];

    if (!timer) {
      return;
    }
    timer.running = !timer.running;
    this.timers.set(this.timers());
  }

  public updateName(id: number, name: string | null): void {
    const timer = this.timers()[id];

    if (!timer) {
      return;
    }
    timer.name = name;
    this.timers.set(this.timers());
    this.notificationService.showMessage(messages.timerUpdated);
  }

  public updateTime(id: number, time: Time): void {
    const timer = this.timers()[id];

    if (!timer) {
      return;
    }
    const newTime = TimeUtils.dateToTime(time);
    timer.time = newTime;
    timer.leftTime = newTime;
    this.timers.set(this.timers());
    this.notificationService.showMessage(messages.timerUpdated);
  }

  private reduceTime(): void {
    const timers = this.timers();
    timers.forEach((timer: FullTimer) => {
      if (timer.leftTime <= 0 && timer.running) {
        timer.running = false;
        const alarms = this.activeAlarms();
        alarms.push(timer.id);
        this.activeAlarms.set(alarms);
        const dialogRef = this.dialog.open(AlarmDialogComponent, {
          data: {
            timer,
          },
        });

        this.onObservable(
          () => {
            const alarms = this.activeAlarms();
            alarms.push(timer.id);
            this.activeAlarms.set(alarms);
          },
          dialogRef.componentInstance.getOnPlayEvent().pipe(takeUntil(dialogRef.afterClosed())),
        );

        this.onObservable(
          () => {
            let alarms = this.activeAlarms();
            alarms = alarms.filter((item: number) => item !== timer.id);
            this.activeAlarms.set(alarms);
          },
          dialogRef.componentInstance.getOnPauseEvent().pipe(takeUntil(dialogRef.afterClosed())),
        );

        dialogRef
          .afterClosed()
          .pipe(take(1))
          .subscribe(() => {
            let alarms = this.activeAlarms();
            alarms = alarms.filter((item: number) => item !== timer.id);
            this.activeAlarms.set(alarms);
          });
      }
      if (timer.leftTime > 0 && timer.running) {
        timer.leftTime -= 1;
      }
    });
    this.timers.set(timers);
  }
}
