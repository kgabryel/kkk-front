import {ChangeDetectionStrategy, Component, EventEmitter, Inject} from '@angular/core';
import {FullTimer} from '../../../../core/models/timer';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import {ImagesConfig} from '../../../../config/images.config';
import {interval} from 'rxjs';

@Component({
  selector: 'timers-alarm-dialog',
  templateUrl: './alarm-dialog.component.html',
  styleUrls: ['./alarm-dialog.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class AlarmDialogComponent {
  public readonly timer: FullTimer;
  public paused: boolean;
  public alarm: string;
  public time: number;
  private readonly onPlay: EventEmitter<void>;
  private readonly onPause: EventEmitter<void>;

  public constructor(@Inject(MAT_DIALOG_DATA) data: any) {
    this.timer = data.timer;
    this.paused = false;
    this.alarm = ImagesConfig.alarm;
    this.time = 0;
    interval(1000).subscribe(() => this.time++);
    this.onPlay = new EventEmitter();
    this.onPause = new EventEmitter();
  }

  public switchAudio(): void {
    this.paused = !this.paused;
    this.paused ? this.onPause.emit() : this.onPlay.emit();
  }

  public getOnPlayEvent(): EventEmitter<void> {
    return this.onPlay;
  }

  public getOnPauseEvent(): EventEmitter<void> {
    return this.onPause;
  }
}
