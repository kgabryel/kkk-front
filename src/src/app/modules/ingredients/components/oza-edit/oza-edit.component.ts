import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Ingredient} from '../../../../core/models/ingredient';
import {Store} from '@ngrx/store';
import {State as IngredientsState} from '../../../../core/store/ingredients/reducers';
import {State as SuppliesState} from '../../../../core/store/oza-supplies/reducers';
import {ingredientOzaIdUpdate} from '../../../../core/store/ingredients/actions';
import {AbstractControl, FormGroup, Validators} from '@angular/forms';
import {OzaSupply} from '../../../../core/models/oza-supply';
import {Observable, Subscription} from 'rxjs';
import {formNames, OzaSupplyFactory, OzaSupplyFormNames} from '../../../../core/factories/oza-supply.factory';
import {map, startWith, switchMap, take} from 'rxjs/operators';
import {OzaValidator} from '../../../../core/validators/oza.validator';
import {StringUtils} from '../../../../core/utils/string.utils';
import {selectSupplies} from '../../../../core/store/oza-supplies/selectors';

@Component({
  selector: 'ingredients-oza-edit',
  templateUrl: './oza-edit.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class OzaEditComponent implements OnInit, OnDestroy {
  @Input() public ingredient: Ingredient;
  public form: FormGroup;
  public supplies$: Observable<OzaSupply[]>;
  public filteredSupplies$: Observable<OzaSupply[]>;
  public formNames: OzaSupplyFormNames;
  @Output() private edit: EventEmitter<boolean[]>;
  private ingredientsStore: Store<IngredientsState>;
  private suppliesStore: Store<SuppliesState>;
  private subscriptions: Subscription[];

  public constructor(ingredientsStore: Store<IngredientsState>, suppliesStore: Store<SuppliesState>) {
    this.edit = new EventEmitter();
    this.ingredientsStore = ingredientsStore;
    this.suppliesStore = suppliesStore;
    this.formNames = formNames;
  }

  public stopEdit(): void {
    this.edit.emit([false, false]);
  }

  public ngOnInit(): void {
    this.form = OzaSupplyFactory.getForm(null, null);
    this.supplies$ = this.suppliesStore.select(selectSupplies);
    this.subscriptions = [
      this.supplies$.pipe(take(1)).subscribe(supplies => {
        this.form.get(this.formNames.supplySearch)?.setValidators([
          Validators.required, OzaValidator.exists(supplies)
        ]);
        if (this.ingredient.ozaId !== null) {
          const supply = supplies.find(supply => supply.id === this.ingredient.ozaId);
          if (supply !== undefined) {
            this.form.get(this.formNames.supplySearch)?.setValue(supply.name);
            this.form.get(this.formNames.supply)?.setValue(supply.id);
          }
        }
      })
    ];
    this.form.get(this.formNames.supplySearch)?.valueChanges
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
    this.ingredientsStore.dispatch(ingredientOzaIdUpdate({
      id: this.ingredient.id,
      ozaId: this.form.get(this.formNames.supply)?.value
    }));
  }

  public remove(): void {
    this.ingredientsStore.dispatch(ingredientOzaIdUpdate({
      id: this.ingredient.id,
      ozaId: 0
    }));
  }

  public selectSupply(supply: number): void {
    this.form.get(this.formNames.supply)?.setValue(supply);
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }
}
