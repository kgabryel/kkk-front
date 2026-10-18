import { KeyValuePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input, InputSignal } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { MatHint } from '@angular/material/form-field';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatHint, KeyValuePipe],
  selector: 'shared-errors-container',
  standalone: true,
  styleUrls: [],
  templateUrl: './errors-container.component.html',
})
export class ErrorsContainerComponent {
  public input: InputSignal<AbstractControl | null> = input.required<AbstractControl | null>();
  public errors: InputSignal<Map<string, string>> = input.required<Map<string, string>>();
}
