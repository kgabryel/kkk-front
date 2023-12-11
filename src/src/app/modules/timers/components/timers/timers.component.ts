import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {FullTimer} from '../../../../core/models/timer';
import {TimersListService} from '../../../../core/services/timers-list/timers-list.service';
import {skip} from 'rxjs/operators';
import {BehaviorSubject, interval} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {AddDialogComponent} from '../add-dialog/add-dialog.component';
import {TimeUtils} from '../../../../core/utils/time.utils';
import {NotificationService} from '../../../../core/services/notification/notification.service';
import {AlarmDialogComponent} from '../alarm-dialog/alarm-dialog.component';
import {messages} from '../../../../core/messages/timers.messages';
import {TimersTooltips, tooltips} from '../../../../core/tooltips/timers.tooltips';

@Component({
  selector: 'timers-timers',
  templateUrl: './timers.component.html',
  styleUrls: ['./timers.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class TimersComponent implements OnInit, OnDestroy {

  public step: number;
  public timers$: BehaviorSubject<FullTimer[]>;
  public tooltips: TimersTooltips;
  private timersListService: TimersListService;
  private dialog: MatDialog;
  private notificationService: NotificationService;
  private audio: HTMLAudioElement;
  private activeAlarms$: BehaviorSubject<number[]>;

  public constructor(
    timersListService: TimersListService,
    dialog: MatDialog,
    notificationService: NotificationService
  ) {
    this.timers$ = new BehaviorSubject<FullTimer[]>([]);
    this.timersListService = timersListService;
    this.dialog = dialog;
    this.notificationService = notificationService;
    this.audio = new Audio();
    this.audio.loop = true;
    this.audio.src = 'assets/alarm.mp3';
    this.audio.load();
    this.tooltips = tooltips;
  }

  public ngOnInit(): void {
    this.activeAlarms$ = new BehaviorSubject<number[]>([]);
    this.activeAlarms$.subscribe(alarms => alarms.length === 0 ? this.audio.pause() : this.audio.play());
    this.step = 2;
    this.timersListService.getState().pipe(skip(1)).subscribe(timer => {
      const timers = this.timers$.value;
      timers.push({...timer, leftTime: timer.time, running: false});
      this.timers$.next(timers);
      if (this.step === 2) {
        this.step = 0;
      }
    });
    interval(1000).subscribe(() => this.reduceTime());
  }

  public setStep(step: number): void {
    this.step = step;
  }

  public delete(id: number): void {
    const timers = this.timers$.value;
    timers.splice(id, 1);
    this.timers$.next(timers);
  }

  public switch(id: number): void {
    const timers = this.timers$.value;
    timers[id].running = !timers[id].running;
    this.timers$.next(timers);
  }

  public restart(id: number): void {
    const timers = this.timers$.value;
    timers[id].running = false;
    timers[id].leftTime = timers[id].time;
    this.timers$.next(timers);
  }

  public updateName(id: number, name: string | null): void {
    const timers = this.timers$.value;
    timers[id].name = name;
    this.timers$.next(timers);
    this.notificationService.showMessage(messages.timerUpdated);
  }

  public updateTime(id: number, time: Date): void {
    const timers = this.timers$.value;
    timers[id].time = TimeUtils.dateToTime(time);
    timers[id].leftTime = TimeUtils.dateToTime(time);
    this.timers$.next(timers);
    this.notificationService.showMessage(messages.timerUpdated);
  }

  public openAddDialog(): void {
    this.dialog.open(AddDialogComponent);
  }

  public ngOnDestroy(): void {
    this.activeAlarms$.next([]);
  }

  private reduceTime(): void {
    const timers = this.timers$.value;
    timers.forEach((timer, key) => {
      if (timer.leftTime <= 0 && timer.running) {
        timers[key].running = false;
        let alarms = this.activeAlarms$.value;
        alarms.push(timer.id);
        this.activeAlarms$.next(alarms);
        const dialogRef = this.dialog.open(AlarmDialogComponent, {
          data: {
            timer: timers[key]
          }
        });
        dialogRef.componentInstance.getOnPlayEvent().subscribe(() => {
          let alarms = this.activeAlarms$.value;
          alarms.push(timer.id);
          this.activeAlarms$.next(alarms);
        });
        dialogRef.componentInstance.getOnPauseEvent().subscribe(() => {
          let alarms = this.activeAlarms$.value;
          alarms = alarms.filter(item => item !== timer.id);
          this.activeAlarms$.next(alarms);
        });
        dialogRef.afterClosed().subscribe(() => {
          let alarms = this.activeAlarms$.value;
          alarms = alarms.filter(item => item !== timer.id);
          this.activeAlarms$.next(alarms);
        });
      }
      if (timer.leftTime > 0 && timer.running) {
        timers[key].leftTime -= 1;
      }
    });
    this.timers$.next(timers);
  }
}
