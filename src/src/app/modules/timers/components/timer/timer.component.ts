import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, InputSignal, output } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatTooltip } from '@angular/material/tooltip';
import { take } from 'rxjs/operators';

import { Time } from '../../../../core/models/time';
import { FullTimer } from '../../../../core/models/timer';
import { TimersTooltips, tooltips } from '../../../../core/tooltips/timers.tooltips';
import { TimerTimePipe } from '../../../shared/pipes/timer-time.pipe';
import { EditDialogComponent, EditDialogResult } from '../edit-dialog/edit-dialog.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TimerTimePipe,
    MatTooltip,
    NgClass,
    MatButton,
    MatIcon,
    MatMenuTrigger,
    MatMenu,
    MatMenuItem,
  ],
  selector: 'timers-timer',
  standalone: true,
  styleUrls: ['./timer.component.scss'],
  templateUrl: './timer.component.html',
})
export class TimerComponent {
  public timer: InputSignal<FullTimer> = input.required<FullTimer>();
  public leftTime: InputSignal<number> = input.required<number>();
  public switch = output<void>();
  public delete = output<void>();
  public restart = output<void>();
  public nameUpdate = output<string | null>();
  public timeUpdate = output<Time>();
  public tooltips: TimersTooltips;
  private dialog: MatDialog;
  public constructor(dialog: MatDialog) {
    this.dialog = dialog;
    this.tooltips = tooltips;
  }

  public emitDelete(): void {
    this.delete.emit();
  }

  public emitRestart(): void {
    this.restart.emit();
  }

  public emitSwitch(): void {
    this.switch.emit();
  }

  public openEditDialog(): void {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      data: {
        leftTime: this.leftTime(),
        timer: this.timer(),
      },
    });
    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((data: EditDialogResult | undefined) => {
        if (data === undefined) {
          return;
        }
        if (data.name) {
          this.nameUpdate.emit(data.name);
        }
        if (data.time) {
          this.timeUpdate.emit(data.time);
        }
      });
  }
}
