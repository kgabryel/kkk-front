import { Component, input, InputSignal } from '@angular/core';
import { ControlContainer, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { NgbTimepicker } from '@ng-bootstrap/ng-bootstrap';

@Component({
  imports: [NgbTimepicker, ReactiveFormsModule],
  selector: 'shared-time-picker',
  standalone: true,
  styleUrl: './time-picker.component.scss',
  templateUrl: './time-picker.component.html',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class TimePickerComponent {
  public controlName: InputSignal<string> = input.required<string>();
}
