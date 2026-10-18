import type { InputSignal, OnInit, OutputEmitterRef } from '@angular/core';
import type { FormGroup } from '@angular/forms';

import { ChangeDetectionStrategy, Component, input, output, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatListItem } from '@angular/material/list';
import { MatSelect, MatOption } from '@angular/material/select';
import { Store } from '@ngrx/store';
import { cloneDeep } from 'lodash-unified';
import { EMPTY } from 'rxjs';

import type { Month } from '@/app/config/months.config';
import type { SeasonErrors } from '@/app/core/errors/season.error';
import type { SeasonsFormNames } from '@/app/core/factories/seasons.factory';
import type { Season } from '@/app/core/models/season';
import type { UpdateSeasonRequest } from '@/app/core/requests/season.request';
import type { State } from '@/app/core/store/seasons/reducers';

import { months } from '@/app/config/months.config';
import { seasonErrors } from '@/app/core/errors/season.error';
import { formNames, SeasonsFormFactory } from '@/app/core/factories/seasons.factory';
import { seasonUpdate } from '@/app/core/store/seasons/actions';
import { BaseComponent } from '@/app/modules/base.component';
import { ErrorsContainerComponent } from '@/app/modules/shared/components/errors-container/errors-container.component';
import { AutocompletePipe } from '@/app/modules/shared/pipes/autocomplete.pipe';

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
  styleUrl: './season-edit.component.scss',
  templateUrl: './season-edit.component.html',
})
export class SeasonEditComponent extends BaseComponent implements OnInit {
  public season: InputSignal<Season> = input.required<Season>();
  public edit: OutputEmitterRef<boolean> = output<boolean>();
  public endMonths: Month[];
  public errors: SeasonErrors = seasonErrors;
  public form!: FormGroup;
  public formNames: SeasonsFormNames = formNames;
  public startMonths: Month[];
  private seasonFormFactory: SeasonsFormFactory = inject(SeasonsFormFactory);
  private store: Store<State> = inject<Store<State>>(Store);
  public constructor() {
    super();
    this.startMonths = cloneDeep(months);
    this.endMonths = cloneDeep(months);
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
