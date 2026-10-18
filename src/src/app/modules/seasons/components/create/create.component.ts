import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {Month, months} from '../../../../config/months.config';
import cloneDeep from 'lodash/cloneDeep';
import {AbstractControl, FormGroup} from '@angular/forms';
import {formNames, SeasonsFormFactory, SeasonsFormNames} from '../../../../core/factories/seasons.factory';
import {Observable, Subscription} from 'rxjs';
import {Ingredient} from '../../../../core/models/ingredient';
import {Store} from '@ngrx/store';
import {State as IngredientsState} from '../../../../core/store/ingredients/reducers';
import {selectByName, selectIngredientsWithoutAssignedSeason} from '../../../../core/store/ingredients/selectors';
import {map, startWith, switchMap} from 'rxjs/operators';
import {State as SeasonsState} from '../../../../core/store/seasons/reducers';
import {SeasonRequest} from '../../../../core/requests/season.request';
import {seasonAdd} from '../../../../core/store/seasons/actions';
import {selectSeasons} from '../../../../core/store/seasons/selectors';
import {seasonErrors, SeasonErrors} from '../../../../core/errors/season.error';
import {StringUtils} from '../../../../core/utils/string.utils';
import {FormUtils} from '../../../../core/utils/form.utils';

@Component({
  selector: 'seasons-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateComponent implements OnInit, OnDestroy {

  public startMonths: Month[];
  public endMonths: Month[];
  public form: FormGroup;
  public formNames: SeasonsFormNames;
  public ingredients$: Observable<Ingredient[]>;
  public filteredIngredients$: Observable<Ingredient[]>;
  public seasonsStore: Store<SeasonsState>;
  public errors: SeasonErrors;
  private ingredientsStore: Store<IngredientsState>;
  private subscriptions: (Subscription | undefined)[];
  private seasonsFormFactory: SeasonsFormFactory;

  public constructor(
    ingredientsStore: Store<IngredientsState>,
    seasonsStore: Store<SeasonsState>,
    seasonsFormFactory: SeasonsFormFactory
  ) {
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
    this.ingredients$ = this.seasonsStore.select(selectSeasons).pipe(
      map(seasons => seasons.map(season => season.ingredientId)),
      switchMap(usedIngredients => this.ingredientsStore.select(
        selectIngredientsWithoutAssignedSeason(usedIngredients)
      ))).pipe(
      map(ingredients => ingredients.sort(
        (a, b) => StringUtils.compareString(a.name, b.name)
      )));
    this.subscriptions = [
      this.form.get(this.formNames.startMonth)?.valueChanges.subscribe(startMonth => {
        this.endMonths.forEach((month, index, endMonths) => {
          if (endMonths[index].value < startMonth) {
            endMonths[index].disabled = true;
          }
        });
      }),
      this.form.get(this.formNames.endMonth)?.valueChanges.subscribe(endMonth => {
        this.startMonths.forEach((month, index, startMonths) => {
          if (startMonths[index].value > endMonth) {
            startMonths[index].disabled = true;
          }
        });
      })
    ];
    const ingredientInput = this.form.get(this.formNames.ingredient) as AbstractControl;
    this.filteredIngredients$ = ingredientInput.valueChanges.pipe(
      startWith(''),
      switchMap((value: string) => this.ingredients$.pipe(
        map(ingredients => ingredients.filter(ingredient => StringUtils.stringIncludes(ingredient.name, value)))
      )));
  }

  public submit() {
    if (this.form.invalid) {
      return;
    }
    const name = this.form.get(this.formNames.ingredient)?.value;
    this.ingredientsStore.select(selectByName(name)).subscribe(ingredient => {
      const request: SeasonRequest = {
        ingredient: ingredient?.id ?? 0,
        start: parseInt(this.form.get(this.formNames.startMonth)?.value),
        stop: parseInt(this.form.get(this.formNames.endMonth)?.value)
      };
      this.seasonsStore.dispatch(seasonAdd({season: request}));
      this.clearForm();
    });
  }

  public clearForm(): void {
    FormUtils.clearInputs(this.form, '', this.formNames.ingredient, this.formNames.startMonth, this.formNames.endMonth);

    this.startMonths.forEach((month, index, startMonths) => startMonths[index].disabled = false);
    this.endMonths.forEach((month, index, endMonths) => endMonths[index].disabled = false);
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      if (subscription !== undefined) {
        subscription.unsubscribe();
      }
    });
  }
}
