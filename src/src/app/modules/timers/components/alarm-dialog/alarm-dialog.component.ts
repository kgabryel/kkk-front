import { ChangeDetectionStrategy, Component, EventEmitter, Inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogTitle } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { interval } from 'rxjs';

import { ImagesConfig } from '../../../../config/images.config';
import { FullTimer } from '../../../../core/models/timer';
import { TimerTimePipe } from '../../../shared/pipes/timer-time.pipe';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  imports: [MatIcon, MatDialogTitle, MatButton, TimerTimePipe, MatDialogClose],
  selector: 'timers-alarm-dialog',
  standalone: true,
  styleUrls: ['./alarm-dialog.component.scss'],
  templateUrl: './alarm-dialog.component.html',
})
export class AlarmDialogComponent {
  public alarm: string;
  public paused: boolean;
  public time: number;
  public readonly timer: FullTimer;
  private readonly onPause: EventEmitter<void>;
  private readonly onPlay: EventEmitter<void>;
  public constructor(@Inject(MAT_DIALOG_DATA) data: AlarmDialogInput) {
    this.timer = data.timer;
    this.paused = false;
    this.alarm = ImagesConfig.alarm;
    this.time = 0;
    interval(1000)
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.time++);
    this.onPlay = new EventEmitter();
    this.onPause = new EventEmitter();
  }

  public getOnPauseEvent(): EventEmitter<void> {
    return this.onPause;
  }

  public getOnPlayEvent(): EventEmitter<void> {
    return this.onPlay;
  }

  public switchAudio(): void {
    this.paused = !this.paused;
    if (this.paused) {
      this.onPause.emit();
    } else {
      this.onPlay.emit();
    }
  }
}

export interface AlarmDialogInput {
  timer: FullTimer;
}
