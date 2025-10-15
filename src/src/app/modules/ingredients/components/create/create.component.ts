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
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { Store } from '@ngrx/store';
import { EMPTY } from 'rxjs';

import { Length } from '../../../../config/form.config';
import { ingredientErrors, IngredientErrors } from '../../../../core/errors/ingredient.error';
import {
  formNames,
  IngredientFormFactory,
  IngredientsFormNames,
} from '../../../../core/factories/ingredient.factory';
import { OzaSupply } from '../../../../core/models/oza-supply';
import { IngredientRequest } from '../../../../core/requests/ingredient.request';
import { ingredientAdd } from '../../../../core/store/ingredients/actions';
import { State as IngredientsState } from '../../../../core/store/ingredients/reducers';
import { State as SuppliesState } from '../../../../core/store/oza-supplies/reducers';
import { selectSupplies } from '../../../../core/store/oza-supplies/selectors';
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
    MatInput,
    MatHint,
    ErrorsContainerComponent,
    MatSlideToggle,
    MatAutocompleteTrigger,
    MatAutocomplete,
    MatOption,
    MatButton,
    MatIcon,
  ],
  providers: [IngredientFormFactory],
  selector: 'ingredients-create',
  standalone: true,
  styleUrls: ['./create.component.scss'],
  templateUrl: './create.component.html',
})
export class CreateComponent extends BaseComponent implements OnInit {
  public errors: IngredientErrors;
  public filteredSupplies: WritableSignal<OzaSupply[]> = signal<OzaSupply[]>([]);
  public form!: FormGroup;
  public formNames: IngredientsFormNames;
  public maxNameLength: number;
  public nameLength!: Signal<number>;
  public supplies!: Signal<OzaSupply[]>;
  private ingredientFormFactory: IngredientFormFactory;
  private ingredientsStore: Store<IngredientsState>;
  private suppliesStore: Store<SuppliesState>;
  public constructor(
    ingredientsStore: Store<IngredientsState>,
    ingredientFormFactory: IngredientFormFactory,
    suppliesStore: Store<SuppliesState>,
  ) {
    super();
    this.ingredientFormFactory = ingredientFormFactory;
    this.formNames = formNames;
    this.errors = ingredientErrors;
    this.ingredientsStore = ingredientsStore;
    this.suppliesStore = suppliesStore;
    this.maxNameLength = Length.maxIngredientNameLength;
  }

  public ngOnInit(): void {
    this.form = this.ingredientFormFactory.getCreateForm();
    this.supplies = this.suppliesStore.selectSignal(selectSupplies);
    this.nameLength = FormUtils.getLength(this.injector, this.form, this.formNames.name);

    const supplyInput = this.form.get(this.formNames.supplySearch) as AbstractControl;
    this.onObservableValue(
      (search: string) =>
        this.filteredSupplies.set(
          this.supplies().filter((supply: OzaSupply) =>
            StringUtils.stringIncludes(supply.name, search),
          ),
        ),
      supplyInput.valueChanges,
      '',
    );
    this.onObservableValue(
      (supplyValue: number | null) => {
        const availableControl = this.form.get(this.formNames.available);

        if (supplyValue !== null) {
          availableControl?.disable({ emitEvent: false });
        } else {
          availableControl?.enable({ emitEvent: false });
        }
      },
      this.form.get(this.formNames.supply)?.valueChanges ?? EMPTY,
      null,
    );
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

  public submit(): void {
    if (this.form.invalid) {
      return;
    }
    const ingredient: IngredientRequest = {
      available: this.form.get(this.formNames.available)?.value,
      name: this.form.get(this.formNames.name)?.value,
      ozaId: this.form.get(this.formNames.supply)?.value,
    };
    this.ingredientsStore.dispatch(ingredientAdd({ ingredient }));
    this.clearForm();
  }
}
