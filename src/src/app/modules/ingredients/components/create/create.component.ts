import type { OnInit, Signal, WritableSignal } from '@angular/core';
import type { AbstractControl, FormGroup } from '@angular/forms';

import { ChangeDetectionStrategy, Component, signal, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteTrigger, MatOption } from '@angular/material/autocomplete';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { Store } from '@ngrx/store';
import { EMPTY } from 'rxjs';

import type { IngredientErrors } from '@/app/core/errors/ingredient.error';
import type { IngredientsFormNames } from '@/app/core/factories/ingredient.factory';
import type { OzaSupply } from '@/app/core/models/oza-supply';
import type { IngredientRequest } from '@/app/core/requests/ingredient.request';
import type { State as IngredientsState } from '@/app/core/store/ingredients/reducers';
import type { State as SuppliesState } from '@/app/core/store/oza-supplies/reducers';

import { Length } from '@/app/config/form.config';
import { ingredientErrors } from '@/app/core/errors/ingredient.error';
import { formNames, IngredientFormFactory } from '@/app/core/factories/ingredient.factory';
import { ingredientAdd } from '@/app/core/store/ingredients/actions';
import { selectSupplies } from '@/app/core/store/oza-supplies/selectors';
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
  styleUrl: './create.component.scss',
  templateUrl: './create.component.html',
})
export class CreateComponent extends BaseComponent implements OnInit {
  public errors: IngredientErrors = ingredientErrors;
  public filteredSupplies: WritableSignal<OzaSupply[]> = signal<OzaSupply[]>([]);
  public form!: FormGroup;
  public formNames: IngredientsFormNames = formNames;
  public maxNameLength: number = Length.maxIngredientNameLength;
  public nameLength!: Signal<number>;
  public supplies!: Signal<OzaSupply[]>;
  private ingredientFormFactory: IngredientFormFactory = inject(IngredientFormFactory);
  private ingredientsStore: Store<IngredientsState> = inject<Store<IngredientsState>>(Store);
  private suppliesStore: Store<SuppliesState> = inject<Store<SuppliesState>>(Store);

  public ngOnInit(): void {
    this.form = this.ingredientFormFactory.getCreateForm();
    this.supplies = this.suppliesStore.selectSignal(selectSupplies);
    this.nameLength = FormUtils.getLength(this.injector, this.form, this.formNames.name);

    const supplyInput = this.form.get(this.formNames.supplySearch) as AbstractControl;
    this.onObservableValue(
      (search: string) =>
        this.filteredSupplies.set(
          this.supplies().filter((supply: OzaSupply) => StringUtils.stringIncludes(supply.name, search)),
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
