import type { InputSignal, OutputEmitterRef } from '@angular/core';

import { ChangeDetectionStrategy, Component, input, output, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatTooltip } from '@angular/material/tooltip';
import { take } from 'rxjs/operators';

import type { Time } from '@/app/core/models/time';
import type { FullTimer } from '@/app/core/models/timer';
import type { TimersTooltips } from '@/app/core/tooltips/timers.tooltips';
import type { EditDialogResult } from '@/app/modules/timers/components/edit-dialog/edit-dialog.component';

import { tooltips } from '@/app/core/tooltips/timers.tooltips';
import { TimerTimePipe } from '@/app/modules/shared/pipes/timer-time.pipe';
import { EditDialogComponent } from '@/app/modules/timers/components/edit-dialog/edit-dialog.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [TimerTimePipe, MatTooltip, MatButton, MatIcon, MatMenuTrigger, MatMenu, MatMenuItem],
  selector: 'timers-timer',
  styleUrl: './timer.component.scss',
  templateUrl: './timer.component.html',
})
export class TimerComponent {
  public timer: InputSignal<FullTimer> = input.required<FullTimer>();
  public leftTime: InputSignal<number> = input.required<number>();
  public switch: OutputEmitterRef<void> = output<void>();
  public delete: OutputEmitterRef<void> = output<void>();
  public restart: OutputEmitterRef<void> = output<void>();
  public nameUpdate: OutputEmitterRef<string | null> = output<string | null>();
  public timeUpdate: OutputEmitterRef<Time> = output<Time>();
  public tooltips: TimersTooltips = tooltips;
  private dialog: MatDialog = inject(MatDialog);

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
