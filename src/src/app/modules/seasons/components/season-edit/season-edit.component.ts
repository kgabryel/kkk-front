import {
  ChangeDetectionStrategy,
  Component,
  input,
  InputSignal,
  OnInit,
  output,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatListItem } from '@angular/material/list';
import { MatSelect, MatOption } from '@angular/material/select';
import { Store } from '@ngrx/store';
import { cloneDeep } from 'lodash-unified';
import { EMPTY } from 'rxjs';

import { Month, months } from '../../../../config/months.config';
import { seasonErrors, SeasonErrors } from '../../../../core/errors/season.error';
import {
  formNames,
  SeasonsFormFactory,
  SeasonsFormNames,
} from '../../../../core/factories/seasons.factory';
import { Season } from '../../../../core/models/season';
import { UpdateSeasonRequest } from '../../../../core/requests/season.request';
import { seasonUpdate } from '../../../../core/store/seasons/actions';
import { State } from '../../../../core/store/seasons/reducers';
import { BaseComponent } from '../../../base.component';
import { ErrorsContainerComponent } from '../../../shared/components/errors-container/errors-container.component';
import { AutocompletePipe } from '../../../shared/pipes/autocomplete.pipe';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatListItem,
    MatIcon,
    AutocompletePipe,
    MatIconButton,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    MatHint,
    ErrorsContainerComponent,
  ],
  providers: [SeasonsFormFactory],
  selector: 'seasons-season-edit',
  standalone: true,
  styleUrls: ['./season-edit.component.scss'],
  templateUrl: './season-edit.component.html',
})
export class SeasonEditComponent extends BaseComponent implements OnInit {
  public season: InputSignal<Season> = input.required<Season>();
  public edit = output<boolean>();
  public endMonths: Month[];
  public errors: SeasonErrors;
  public form!: FormGroup;
  public formNames: SeasonsFormNames;
  public startMonths: Month[];
  private seasonFormFactory: SeasonsFormFactory;
  private store: Store<State>;
  public constructor(store: Store<State>, seasonFormFactory: SeasonsFormFactory) {
    super();
    this.store = store;
    this.formNames = formNames;
    this.errors = seasonErrors;
    this.startMonths = cloneDeep(months);
    this.endMonths = cloneDeep(months);
    this.seasonFormFactory = seasonFormFactory;
  }

  public ngOnInit(): void {
    this.form = this.seasonFormFactory.getEditForm();
    this.endMonths.forEach((month: Month) => {
      if (month.value < this.season().start) {
        month.disabled = true;
      }
    });
    this.startMonths.forEach((month: Month) => {
      if (month.value > this.season().stop) {
        month.disabled = true;
      }
    });
    this.form.get(this.formNames.startMonth)?.setValue(this.season().start);
    this.form.get(this.formNames.endMonth)?.setValue(this.season().stop);

    this.onObservableValue(
      (startMonth: number) => {
        this.endMonths.forEach((month: Month) => {
          if (month.value < startMonth) {
            month.disabled = true;
          }
        });
      },
      this.form.get(this.formNames.startMonth)?.valueChanges ?? EMPTY,
      0,
    );

    this.onObservableValue(
      (endMonth: number) => {
        this.startMonths.forEach((month: Month) => {
          if (month.value > endMonth) {
            month.disabled = true;
          }
        });
      },
      this.form.get(this.formNames.endMonth)?.valueChanges ?? EMPTY,
      0,
    );
  }

  public stopEdit(): void {
    this.edit.emit(false);
  }

  public submit(): void {
    if (this.form.invalid) {
      return;
    }
    const request: UpdateSeasonRequest = {
      start: parseInt(this.form.get(this.formNames.startMonth)?.value),
      stop: parseInt(this.form.get(this.formNames.endMonth)?.value),
    };
    this.store.dispatch(seasonUpdate({ id: this.season().id, season: request }));
  }
}
