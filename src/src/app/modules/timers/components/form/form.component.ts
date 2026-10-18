import { ChangeDetectionStrategy, Component, input, OnInit, output, Signal } from '@angular/core';
import { AbstractControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';

import { Length } from '../../../../config/form.config';
import { formNames, TimerFormNames } from '../../../../core/factories/timer.factory';
import { FormUtils } from '../../../../core/utils/form.utils';
import { BaseComponent } from '../../../base.component';
import { TimePickerComponent } from '../../../shared/components/time-picker/time-picker.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatHint,
    MatInput,
    MatButton,
    MatIcon,
    TimePickerComponent,
  ],
  selector: 'timers-form',
  standalone: true,
  styleUrls: ['./form.component.scss'],
  templateUrl: './form.component.html',
})
export class FormComponent extends BaseComponent implements OnInit {
  public formPart = input.required<AbstractControl>();
  public add = input<boolean>(false);
  public edit = input<boolean>(false);
  public remove = input<boolean>(false);
  public addText = input<string>('Utwórz');
  public delete = output<void>();
  public formGroup!: FormGroup;
  public formNames: TimerFormNames;
  public maxNameLength: number;
  public nameLength!: Signal<number>;
  public constructor() {
    super();
    this.formNames = formNames;
    this.maxNameLength = Length.maxTimerNameLength;
  }

  public ngOnInit(): void {
    this.formGroup = this.formPart() as FormGroup;
    this.nameLength = FormUtils.getLength(
      this.injector,
      this.formGroup as FormGroup,
      this.formNames.name,
      this.formGroup.get(this.formNames.name)?.value ?? '',
    );
  }

  public emitDelete(): void {
    this.delete.emit();
  }
}
