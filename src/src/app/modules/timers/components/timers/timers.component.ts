import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnDestroy,
  OnInit,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { Event, NavigationEnd, Router } from '@angular/router';
import { interval, takeUntil } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';

import { messages } from '../../../../core/messages/timers.messages';
import { Time } from '../../../../core/models/time';
import { FullTimer, Timer } from '../../../../core/models/timer';
import { NotificationService } from '../../../../core/services/notification.service';
import { TimersListService } from '../../../../core/services/timers-list.service';
import { TimersTooltips, tooltips } from '../../../../core/tooltips/timers.tooltips';
import { TimeUtils } from '../../../../core/utils/time.utils';
import { BaseComponent } from '../../../base.component';
import { AddDialogComponent } from '../add-dialog/add-dialog.component';
import { AlarmDialogComponent } from '../alarm-dialog/alarm-dialog.component';
import { TimerComponent } from '../timer/timer.component';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  imports: [NgClass, MatIcon, MatButton, MatTooltip, TimerComponent],
  selector: 'timers-timers',
  standalone: true,
  styleUrls: ['./timers.component.scss'],
  templateUrl: './timers.component.html',
})
export class TimersComponent extends BaseComponent implements OnInit, OnDestroy {
  public step!: number;
  public timers: WritableSignal<FullTimer[]> = signal<FullTimer[]>([]);
  public tooltips: TimersTooltips;
  public onRecipesPage!: Signal<boolean>;
  private activeAlarms: WritableSignal<number[]> = signal<number[]>([]);
  private audio: HTMLAudioElement;
  private dialog: MatDialog;
  private notificationService: NotificationService;
  private timersListService: TimersListService;
  private destroyRef: DestroyRef;
  private router: Router;
  public constructor(
    timersListService: TimersListService,
    dialog: MatDialog,
    notificationService: NotificationService,
    destroyRef: DestroyRef,
    router: Router,
  ) {
    super();
    this.timersListService = timersListService;
    this.dialog = dialog;
    this.notificationService = notificationService;
    this.audio = new Audio();
    this.audio.loop = true;
    this.audio.src = 'assets/alarm.mp3';
    this.audio.load();
    this.tooltips = tooltips;
    this.destroyRef = destroyRef;
    this.router = router;
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
      (alarms: number[]): void | Promise<void> =>
        alarms.length === 0 ? this.audio.pause() : this.audio.play(),
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
    const timers = this.timers();
    timers[id]!.running = false;
    timers[id]!.leftTime = timers[id]!.time;
    this.timers.set(timers);
  }

  public setStep(step: number): void {
    this.step = step;
  }

  public switch(id: number): void {
    const timers = this.timers();
    timers[id]!.running = !timers[id]!.running;
    this.timers.set(timers);
  }

  public updateName(id: number, name: string | null): void {
    const timers = this.timers();
    timers[id]!.name = name;
    this.timers.set(timers);
    this.notificationService.showMessage(messages.timerUpdated);
  }

  public updateTime(id: number, time: Time): void {
    const timers = this.timers();
    timers[id]!.time = TimeUtils.dateToTime(time);
    timers[id]!.leftTime = TimeUtils.dateToTime(time);
    this.timers.set(timers);
    this.notificationService.showMessage(messages.timerUpdated);
  }

  private reduceTime(): void {
    const timers = this.timers();
    timers.forEach((timer: FullTimer, key: number) => {
      if (timer.leftTime <= 0 && timer.running) {
        timers[key]!.running = false;
        const alarms = this.activeAlarms();
        alarms.push(timer.id);
        this.activeAlarms.set(alarms);
        const dialogRef = this.dialog.open(AlarmDialogComponent, {
          data: {
            timer: timers[key],
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
        timers[key]!.leftTime -= 1;
      }
    });
    this.timers.set(timers);
  }
}
