import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {AbstractControl} from '@angular/forms';

@Component({
  selector: 'shared-errors-container',
  templateUrl: './errors-container.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorsContainerComponent {

  @Input() public input: AbstractControl | null;
  @Input() public errors: Map<string, string>;
  @Input() public prefix: string;
  @Input() public part: string;
}
