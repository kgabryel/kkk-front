import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {FullTimer} from '../../../../core/models/timer';
import {EditDialogComponent} from '../edit-dialog/edit-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {TimersTooltips, tooltips} from '../../../../core/tooltips/timers.tooltips';

@Component({
  selector: 'timers-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimerComponent {

  @Input() public timer: FullTimer;
  @Input() public leftTime: number;
  public tooltips: TimersTooltips;
  @Output() private switch: EventEmitter<void>;
  @Output() private delete: EventEmitter<void>;
  @Output() private restart: EventEmitter<void>;
  @Output() private nameUpdate: EventEmitter<string | null>;
  @Output() private timeUpdate: EventEmitter<Date>;
  private dialog: MatDialog;

  public constructor(dialog: MatDialog) {
    this.switch = new EventEmitter<void>();
    this.delete = new EventEmitter<void>();
    this.restart = new EventEmitter<void>();
    this.nameUpdate = new EventEmitter<string | null>();
    this.timeUpdate = new EventEmitter<Date>();
    this.dialog = dialog;
    this.tooltips = tooltips;
  }

  public emitSwitch(): void {
    this.switch.emit();
  }

  public emitRestart(): void {
    this.restart.emit();
  }


  public emitDelete(): void {
    this.delete.emit();
  }

  public openEditDialog(): void {
    const dialogRef = this.dialog.open(EditDialogComponent, {
      data: {
        timer: this.timer,
        leftTime: this.leftTime
      }
    });
    dialogRef.afterClosed().subscribe(data => {
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
