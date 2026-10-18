import type { InputSignal, OnInit, Signal, OutputEmitterRef } from '@angular/core';
import type { FormGroup } from '@angular/forms';

import { ChangeDetectionStrategy, Component, input, output, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatListItem } from '@angular/material/list';
import { Store } from '@ngrx/store';

import type { IngredientErrors } from '@/app/core/errors/ingredient.error';
import type { IngredientsFormNames } from '@/app/core/factories/ingredient.factory';
import type { Ingredient } from '@/app/core/models/ingredient';
import type { State } from '@/app/core/store/ingredients/reducers';

import { Length } from '@/app/config/form.config';
import { ingredientErrors } from '@/app/core/errors/ingredient.error';
import { formNames, IngredientFormFactory } from '@/app/core/factories/ingredient.factory';
import { ingredientNameUpdate } from '@/app/core/store/ingredients/actions';
import { FormUtils } from '@/app/core/utils/form.utils';
import { BaseComponent } from '@/app/modules/base.component';
import { ErrorsContainerComponent } from '@/app/modules/shared/components/errors-container/errors-container.component';
import { AutocompletePipe } from '@/app/modules/shared/pipes/autocomplete.pipe';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatListItem,
    MatIcon,
    MatFormField,
    MatLabel,
    MatHint,
    ErrorsContainerComponent,
    AutocompletePipe,
    MatIconButton,
    MatInput,
  ],
  providers: [IngredientFormFactory],
  selector: 'ingredients-ingredient-edit',
  styleUrl: './ingredient-edit.component.scss',
  templateUrl: './ingredient-edit.component.html',
})
export class IngredientEditComponent extends BaseComponent implements OnInit {
  public ingredient: InputSignal<Ingredient> = input.required<Ingredient>();
  public edit: OutputEmitterRef<boolean[]> = output<boolean[]>();
  public errors: IngredientErrors = ingredientErrors;
  public form!: FormGroup;
  public formNames: IngredientsFormNames = formNames;
  public maxNameLength: number = Length.maxIngredientNameLength;
  public nameLength!: Signal<number>;
  private ingredientFormFactory: IngredientFormFactory = inject(IngredientFormFactory);
  private store: Store<State> = inject<Store<State>>(Store);

  public ngOnInit(): void {
    this.form = this.ingredientFormFactory.getEditForm(this.ingredient().id);
    this.form.get(this.formNames.name)?.setValue(this.ingredient().name);
    this.nameLength = FormUtils.getLength(this.injector, this.form, this.formNames.name, this.ingredient().name);
  }

  public stopEdit(): void {
    this.edit.emit([false, false]);
  }

  public submit(): void {
    if (this.form.invalid) {
      return;
    }

    this.store.dispatch(
      ingredientNameUpdate({
        id: this.ingredient().id,
        name: this.form.get(this.formNames.name)?.value,
      }),
    );
  }
}
