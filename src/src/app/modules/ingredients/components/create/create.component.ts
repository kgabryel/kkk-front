import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup} from '@angular/forms';
import {ingredientErrors, IngredientErrors} from '../../../../core/errors/ingredient.error';
import {Store} from '@ngrx/store';
import {State as IngredientsState} from '../../../../core/store/ingredients/reducers';
import {State as SuppliesState} from '../../../../core/store/oza-supplies/reducers';
import {formNames, IngredientFormFactory, IngredientsFormNames} from '../../../../core/factories/ingredient.factory';
import {ingredientAdd} from '../../../../core/store/ingredients/actions';
import {IngredientRequest} from '../../../../core/requests/ingredient.request';
import {Length} from '../../../../config/form.config';
import {Observable, Subscription} from 'rxjs';
import {OzaSupply} from '../../../../core/models/oza-supply';
import {map, startWith, switchMap} from 'rxjs/operators';
import {StringUtils} from '../../../../core/utils/string.utils';
import {selectSupplies} from '../../../../core/store/oza-supplies/selectors';
import {FormUtils} from '../../../../core/utils/form.utils';

@Component({
  selector: 'ingredients-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateComponent implements OnInit, OnDestroy {

  public form: FormGroup;
  public formNames: IngredientsFormNames;
  public errors: IngredientErrors;
  public nameLength$: Observable<number>;
  public maxNameLength: number;
  public supplies$: Observable<OzaSupply[]>;
  public filteredSupplies$: Observable<OzaSupply[]>;
  private ingredientsStore: Store<IngredientsState>;
  private suppliesStore: Store<SuppliesState>;
  private subscription: Subscription | undefined;
  private ingredientFormFactory: IngredientFormFactory;

  public constructor(
    ingredientsStore: Store<IngredientsState>,
    ingredientFormFactory: IngredientFormFactory,
    suppliesStore: Store<SuppliesState>
  ) {
    this.ingredientFormFactory = ingredientFormFactory;
    this.formNames = formNames;
    this.errors = ingredientErrors;
    this.ingredientsStore = ingredientsStore;
    this.suppliesStore = suppliesStore;
    this.maxNameLength = Length.maxIngredientNameLength;
  }

  public ngOnInit(): void {
    this.form = this.ingredientFormFactory.getCreateForm();
    this.supplies$ = this.suppliesStore.select(selectSupplies);
    this.nameLength$ = (this.form.get(this.formNames.name) as FormControl).valueChanges.pipe(
      startWith(''),
      map(value => value.length)
    );
    this.subscription = this.form.get(this.formNames.supplySearch)?.valueChanges
      .subscribe(() => this.form.get(this.formNames.supply)?.setValue(null));
    const supplyInput = this.form.get(this.formNames.supplySearch) as AbstractControl;
    this.filteredSupplies$ = supplyInput.valueChanges.pipe(
      startWith(''),
      switchMap((value: string) => this.supplies$.pipe(
        map(supplies => supplies.filter(supply => StringUtils.stringIncludes(supply.name, value)))
      )));
  }

  public submit(): void {
    if (this.form.invalid) {
      return;
    }
    const ingredient: IngredientRequest = {
      name: this.form.get(this.formNames.name)?.value,
      available: this.form.get(this.formNames.available)?.value,
      ozaId: this.form.get(this.formNames.supply)?.value
    };
    this.ingredientsStore.dispatch(ingredientAdd({ingredient}));
    this.clearForm();
  }

  public clearForm(): void {
    FormUtils.clearInputs(this.form, '', this.formNames.name);
    FormUtils.clearInputs(this.form, false, this.formNames.available);
    FormUtils.clearInputs(this.form, null, this.formNames.supply, this.formNames.supplySearch);
  }

  public selectSupply(supply: OzaSupply): void {
    this.form.get(this.formNames.supply)?.setValue(supply.id);
    this.form.get(this.formNames.available)?.setValue(supply.available);
  }

  public ngOnDestroy(): void {
    if (this.subscription !== undefined) {
      this.subscription.unsubscribe();
    }
  }
}
