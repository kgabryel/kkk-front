import type { InputSignal, OnInit, Signal, OutputEmitterRef } from '@angular/core';
import type { AbstractControl, FormGroup } from '@angular/forms';

import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';

import type { TimerFormNames } from '@/app/core/factories/timer.factory';

import { Length } from '@/app/config/form.config';
import { formNames } from '@/app/core/factories/timer.factory';
import { FormUtils } from '@/app/core/utils/form.utils';
import { BaseComponent } from '@/app/modules/base.component';
import { TimePickerComponent } from '@/app/modules/shared/components/time-picker/time-picker.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule, MatFormField, MatLabel, MatHint, MatInput, MatButton, MatIcon, TimePickerComponent],
  selector: 'timers-form',
  styleUrl: './form.component.scss',
  templateUrl: './form.component.html',
})
export class FormComponent extends BaseComponent implements OnInit {
  public formPart: InputSignal<AbstractControl> = input.required<AbstractControl>();
  public add: InputSignal<boolean> = input<boolean>(false);
  public edit: InputSignal<boolean> = input<boolean>(false);
  public remove: InputSignal<boolean> = input<boolean>(false);
  public addText: InputSignal<string> = input<string>('Utwórz');
  public delete: OutputEmitterRef<void> = output<void>();
  public formGroup!: FormGroup;
  public formNames: TimerFormNames = formNames;
  public maxNameLength: number = Length.maxTimerNameLength;
  public nameLength!: Signal<number>;

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
