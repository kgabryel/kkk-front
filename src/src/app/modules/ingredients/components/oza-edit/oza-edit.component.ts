import type { InputSignal, OnInit, Signal, WritableSignal, OutputEmitterRef } from '@angular/core';
import type { AbstractControl, FormGroup } from '@angular/forms';

import {
  ChangeDetectionStrategy,
  Component,
  effect,
  input,
  output,
  runInInjectionContext,
  signal,
  inject,
} from '@angular/core';
import { ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteTrigger, MatOption } from '@angular/material/autocomplete';
import { MatIconButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatListItem } from '@angular/material/list';
import { Store } from '@ngrx/store';

import type { OzaSupplyFormNames } from '@/app/core/factories/oza-supply.factory';
import type { Ingredient } from '@/app/core/models/ingredient';
import type { OzaSupply } from '@/app/core/models/oza-supply';
import type { State as IngredientsState } from '@/app/core/store/ingredients/reducers';
import type { State as SuppliesState } from '@/app/core/store/oza-supplies/reducers';

import { formNames, OzaSupplyFactory } from '@/app/core/factories/oza-supply.factory';
import { ingredientOzaIdUpdate } from '@/app/core/store/ingredients/actions';
import { selectSupplies } from '@/app/core/store/oza-supplies/selectors';
import { StringUtils } from '@/app/core/utils/string.utils';
import { OzaValidator } from '@/app/core/validators/oza.validator';
import { BaseComponent } from '@/app/modules/base.component';
import { AutocompletePipe } from '@/app/modules/shared/pipes/autocomplete.pipe';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatListItem,
    AutocompletePipe,
    MatIconButton,
    MatIcon,
    MatFormField,
    MatLabel,
    MatAutocompleteTrigger,
    MatAutocomplete,
    MatOption,
    MatInput,
  ],
  selector: 'ingredients-oza-edit',
  styleUrl: './oza-edit.component.scss',
  templateUrl: './oza-edit.component.html',
})
export class OzaEditComponent extends BaseComponent implements OnInit {
  public ingredient: InputSignal<Ingredient> = input.required<Ingredient>();
  public edit: OutputEmitterRef<boolean[]> = output<boolean[]>();
  public filteredSupplies: WritableSignal<OzaSupply[]> = signal<OzaSupply[]>([]);
  public form!: FormGroup;
  public formNames: OzaSupplyFormNames = formNames;
  public supplies!: Signal<OzaSupply[]>;
  private ingredientsStore: Store<IngredientsState> = inject<Store<IngredientsState>>(Store);
  private suppliesStore: Store<SuppliesState> = inject<Store<SuppliesState>>(Store);

  public ngOnInit(): void {
    this.form = OzaSupplyFactory.getForm(null, null);
    this.supplies = this.suppliesStore.selectSignal(selectSupplies);
    runInInjectionContext(this.injector, () => {
      const ref = effect(() => {
        const supplies = this.supplies();
        this.form.get(this.formNames.supplySearch)?.setValidators([Validators.required, OzaValidator.exists(supplies)]);
        if (this.ingredient().ozaId !== null) {
          const supply = supplies.find((supply: OzaSupply) => supply.id === this.ingredient().ozaId);

          if (supply !== undefined) {
            this.form.get(this.formNames.supplySearch)?.setValue(supply.name);
            this.form.get(this.formNames.supply)?.setValue(supply.id);
          }
        }
        ref.destroy();
      });
    });

    const supplyInput = this.form.get(this.formNames.supplySearch) as AbstractControl;
    this.onObservableValue(
      (search: string) =>
        this.filteredSupplies.set(
          this.supplies().filter((supply: OzaSupply) => StringUtils.stringIncludes(supply.name, search)),
        ),
      supplyInput.valueChanges,
      '',
    );
  }

  public remove(): void {
    this.ingredientsStore.dispatch(
      ingredientOzaIdUpdate({
        id: this.ingredient().id,
        ozaId: 0,
      }),
    );
  }

  public selectSupply(supply: number): void {
    this.form.get(this.formNames.supply)?.setValue(supply);
  }

  public stopEdit(): void {
    this.edit.emit([false, false]);
  }

  public submit(): void {
    if (this.form.invalid) {
      return;
    }
    this.ingredientsStore.dispatch(
      ingredientOzaIdUpdate({
        id: this.ingredient().id,
        ozaId: this.form.get(this.formNames.supply)?.value,
      }),
    );
  }
}
