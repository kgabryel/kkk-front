import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AbstractControl, FormControl, FormGroup} from '@angular/forms';
import {formNames, TimerFormNames} from '../../../../core/factories/timer.factory';
import {Length} from '../../../../config/form.config';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'timers-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FormComponent implements OnInit {

  @Input() public formPart: AbstractControl;
  @Input() public add: boolean;
  @Input() public edit: boolean;
  @Input() public remove: boolean;
  @Input() public addText: string;
  public formGroup: FormGroup;
  public formNames: TimerFormNames;
  public maxNameLength: number;
  public nameLength$: Observable<number>;
  @Output() private delete: EventEmitter<void>;

  public constructor() {
    this.formNames = formNames;
    this.maxNameLength = Length.maxTimerNameLength;
    this.delete = new EventEmitter<void>();
    this.add = false;
    this.edit = false;
    this.remove = false;
    this.addText = 'Utwórz';
  }

  public ngOnInit(): void {
    this.formGroup = this.formPart as FormGroup;
    this.nameLength$ = (this.formGroup.get(this.formNames.name) as FormControl).valueChanges.pipe(
      startWith(''),
      map(value => value.length)
    );
  }

  public emitDelete(): void {
    this.delete.emit();
  }
}
