import {
  ChangeDetectionStrategy,
  Component,
  input,
  InputSignal,
  OnInit,
  output,
  Signal,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MatFormField, MatHint, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatListItem } from '@angular/material/list';
import { Store } from '@ngrx/store';

import { Length } from '../../../../config/form.config';
import { ingredientErrors, IngredientErrors } from '../../../../core/errors/ingredient.error';
import {
  formNames,
  IngredientFormFactory,
  IngredientsFormNames,
} from '../../../../core/factories/ingredient.factory';
import { Ingredient } from '../../../../core/models/ingredient';
import { ingredientNameUpdate } from '../../../../core/store/ingredients/actions';
import { State } from '../../../../core/store/ingredients/reducers';
import { FormUtils } from '../../../../core/utils/form.utils';
import { BaseComponent } from '../../../base.component';
import { ErrorsContainerComponent } from '../../../shared/components/errors-container/errors-container.component';
import { AutocompletePipe } from '../../../shared/pipes/autocomplete.pipe';

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
  standalone: true,
  styleUrls: ['./ingredient-edit.component.scss'],
  templateUrl: './ingredient-edit.component.html',
})
export class IngredientEditComponent extends BaseComponent implements OnInit {
  public ingredient: InputSignal<Ingredient> = input.required<Ingredient>();
  public edit = output<boolean[]>();
  public errors: IngredientErrors;
  public form!: FormGroup;
  public formNames: IngredientsFormNames;
  public maxNameLength: number;
  public nameLength!: Signal<number>;
  private ingredientFormFactory: IngredientFormFactory;
  private store: Store<State>;
  public constructor(store: Store<State>, ingredientFormFactory: IngredientFormFactory) {
    super();
    this.store = store;
    this.ingredientFormFactory = ingredientFormFactory;
    this.formNames = formNames;
    this.errors = ingredientErrors;
    this.maxNameLength = Length.maxIngredientNameLength;
  }

  public ngOnInit(): void {
    this.form = this.ingredientFormFactory.getEditForm(this.ingredient().id);
    this.form.get(this.formNames.name)?.setValue(this.ingredient().name);
    this.nameLength = FormUtils.getLength(
      this.injector,
      this.form,
      this.formNames.name,
      this.ingredient().name,
    );
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
