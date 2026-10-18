import { ChangeDetectionStrategy, Component, EventEmitter, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogClose, MatDialogTitle } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { interval } from 'rxjs';

import type { FullTimer } from '@/app/core/models/timer';

import { ImagesConfig } from '@/app/config/images.config';
import { TimerTimePipe } from '@/app/modules/shared/pipes/timer-time.pipe';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon, MatDialogTitle, MatButton, TimerTimePipe, MatDialogClose],
  selector: 'timers-alarm-dialog',
  styleUrl: './alarm-dialog.component.scss',
  templateUrl: './alarm-dialog.component.html',
})
export class AlarmDialogComponent {
  public alarm: string;
  public paused: boolean;
  public time: number;
  public readonly timer: FullTimer;
  private readonly onPause: EventEmitter<void>;
  private readonly onPlay: EventEmitter<void>;
  public constructor() {
    const data = inject<AlarmDialogInput>(MAT_DIALOG_DATA);

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
