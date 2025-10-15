import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { AbstractControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
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

import { Month, months } from '../../../../config/months.config';
import { seasonErrors, SeasonErrors } from '../../../../core/errors/season.error';
import {
  formNames,
  SeasonsFormFactory,
  SeasonsFormNames,
} from '../../../../core/factories/seasons.factory';
import { Ingredient } from '../../../../core/models/ingredient';
import { SeasonRequest } from '../../../../core/requests/season.request';
import { State as IngredientsState } from '../../../../core/store/ingredients/reducers';
import {
  selectByName,
  selectIngredientsWithoutSeason,
} from '../../../../core/store/ingredients/selectors';
import { seasonAdd } from '../../../../core/store/seasons/actions';
import { State as SeasonsState } from '../../../../core/store/seasons/reducers';
import { FormUtils } from '../../../../core/utils/form.utils';
import { StringUtils } from '../../../../core/utils/string.utils';
import { BaseComponent } from '../../../base.component';
import { ErrorsContainerComponent } from '../../../shared/components/errors-container/errors-container.component';
import { AutocompletePipe } from '../../../shared/pipes/autocomplete.pipe';

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
  standalone: true,
  styleUrls: ['./create.component.scss'],
  templateUrl: './create.component.html',
})
export class CreateComponent extends BaseComponent implements OnInit {
  public endMonths: Month[];
  public errors: SeasonErrors;
  public filteredIngredients: WritableSignal<Ingredient[]> = signal<Ingredient[]>([]);
  public form!: FormGroup;
  public formNames: SeasonsFormNames;
  public ingredients!: Signal<Ingredient[]>;
  public seasonsStore: Store<SeasonsState>;
  public startMonths: Month[];
  private ingredientsStore: Store<IngredientsState>;
  private seasonsFormFactory: SeasonsFormFactory;
  public constructor(
    ingredientsStore: Store<IngredientsState>,
    seasonsStore: Store<SeasonsState>,
    seasonsFormFactory: SeasonsFormFactory,
  ) {
    super();
    this.startMonths = cloneDeep(months);
    this.endMonths = cloneDeep(months);
    this.formNames = formNames;
    this.ingredientsStore = ingredientsStore;
    this.seasonsStore = seasonsStore;
    this.errors = seasonErrors;
    this.seasonsFormFactory = seasonsFormFactory;
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
          this.ingredients().filter((ingredient: Ingredient) =>
            StringUtils.stringIncludes(ingredient.name, search),
          ),
        ),
      ingredientInput.valueChanges,
      '',
    );
  }

  public clearForm(): void {
    FormUtils.clearInputs(
      this.form,
      '',
      this.formNames.ingredient,
      this.formNames.startMonth,
      this.formNames.endMonth,
    );

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
