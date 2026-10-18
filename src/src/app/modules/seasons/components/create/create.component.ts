import type { OnInit, Signal, WritableSignal } from '@angular/core';
import type { AbstractControl, FormGroup } from '@angular/forms';

import { ChangeDetectionStrategy, Component, signal, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteTrigger, MatOption } from '@angular/material/autocomplete';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { Store } from '@ngrx/store';
import { cloneDeep } from 'lodash-unified';
import { EMPTY } from 'rxjs';
import { take } from 'rxjs/operators';

import type { Month } from '@/app/config/months.config';
import type { SeasonErrors } from '@/app/core/errors/season.error';
import type { SeasonsFormNames } from '@/app/core/factories/seasons.factory';
import type { Ingredient } from '@/app/core/models/ingredient';
import type { SeasonRequest } from '@/app/core/requests/season.request';
import type { State as IngredientsState } from '@/app/core/store/ingredients/reducers';
import type { State as SeasonsState } from '@/app/core/store/seasons/reducers';

import { months } from '@/app/config/months.config';
import { seasonErrors } from '@/app/core/errors/season.error';
import { formNames, SeasonsFormFactory } from '@/app/core/factories/seasons.factory';
import { selectByName, selectIngredientsWithoutSeason } from '@/app/core/store/ingredients/selectors';
import { seasonAdd } from '@/app/core/store/seasons/actions';
import { FormUtils } from '@/app/core/utils/form.utils';
import { StringUtils } from '@/app/core/utils/string.utils';
import { BaseComponent } from '@/app/modules/base.component';
import { ErrorsContainerComponent } from '@/app/modules/shared/components/errors-container/errors-container.component';
import { AutocompletePipe } from '@/app/modules/shared/pipes/autocomplete.pipe';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    AutocompletePipe,
    MatAutocomplete,
    MatAutocompleteTrigger,
    MatOption,
    MatHint,
    ErrorsContainerComponent,
    MatInput,
    MatSelect,
    MatIcon,
    MatButton,
  ],
  providers: [SeasonsFormFactory],
  selector: 'seasons-create',
  styleUrl: './create.component.scss',
  templateUrl: './create.component.html',
})
export class CreateComponent extends BaseComponent implements OnInit {
  public endMonths: Month[];
  public errors: SeasonErrors = seasonErrors;
  public filteredIngredients: WritableSignal<Ingredient[]> = signal<Ingredient[]>([]);
  public form!: FormGroup;
  public formNames: SeasonsFormNames = formNames;
  public ingredients!: Signal<Ingredient[]>;
  public seasonsStore: Store<SeasonsState> = inject<Store<SeasonsState>>(Store);
  public startMonths: Month[];
  private ingredientsStore: Store<IngredientsState> = inject<Store<IngredientsState>>(Store);
  private seasonsFormFactory: SeasonsFormFactory = inject(SeasonsFormFactory);
  public constructor() {
    super();
    this.startMonths = cloneDeep(months);
    this.endMonths = cloneDeep(months);
  }

  public ngOnInit(): void {
    this.form = this.seasonsFormFactory.getCreateForm();
    this.ingredients = this.ingredientsStore.selectSignal(selectIngredientsWithoutSeason);

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
      13,
    );

    const ingredientInput = this.form.get(this.formNames.ingredient) as AbstractControl;
    this.onObservableValue(
      (search: string) =>
        this.filteredIngredients.set(
          this.ingredients().filter((ingredient: Ingredient) => StringUtils.stringIncludes(ingredient.name, search)),
        ),
      ingredientInput.valueChanges,
      '',
    );
  }

  public clearForm(): void {
    FormUtils.clearInputs(this.form, '', this.formNames.ingredient);

    FormUtils.clearInputs(this.form, 0, this.formNames.startMonth);

    FormUtils.clearInputs(this.form, 13, this.formNames.endMonth);

    this.startMonths.forEach((month: Month) => (month.disabled = false));
    this.endMonths.forEach((month: Month) => (month.disabled = false));
  }

  public submit(): void {
    if (this.form.invalid) {
      return;
    }
    const name = this.form.get(this.formNames.ingredient)?.value;
    this.ingredientsStore
      .select(selectByName(name))
      .pipe(take(1))
      .subscribe((ingredient: Ingredient | undefined) => {
        const request: SeasonRequest = {
          ingredient: ingredient?.id ?? 0,
          start: parseInt(this.form.get(this.formNames.startMonth)?.value),
          stop: parseInt(this.form.get(this.formNames.endMonth)?.value),
        };
        this.seasonsStore.dispatch(seasonAdd({ season: request }));
        this.clearForm();
      });
  }
}
