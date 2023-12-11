import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Ingredient} from '../../../../core/models/ingredient';
import {ingredientNameUpdate} from '../../../../core/store/ingredients/actions';
import {Store} from '@ngrx/store';
import {State} from '../../../../core/store/ingredients/reducers';
import {FormControl, FormGroup} from '@angular/forms';
import {formNames, IngredientFormFactory, IngredientsFormNames} from '../../../../core/factories/ingredient.factory';
import {ingredientErrors, IngredientErrors} from '../../../../core/errors/ingredient.error';
import {Length} from '../../../../config/form.config';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'ingredients-ingredient-edit',
  templateUrl: './ingredient-edit.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IngredientEditComponent implements OnInit {
  @Input() public ingredient: Ingredient;
  public form: FormGroup;
  public formNames: IngredientsFormNames;
  public nameLength$: Observable<number>;
  public errors: IngredientErrors;
  public maxNameLength: number;
  @Output() private edit: EventEmitter<boolean[]>;
  private store: Store<State>;
  private ingredientFormFactory: IngredientFormFactory;

  public constructor(store: Store<State>, ingredientFormFactory: IngredientFormFactory) {
    this.edit = new EventEmitter();
    this.store = store;
    this.ingredientFormFactory = ingredientFormFactory;
    this.formNames = formNames;
    this.errors = ingredientErrors;
    this.maxNameLength = Length.maxIngredientNameLength;
  }

  public ngOnInit(): void {
    this.form = this.ingredientFormFactory.getEditForm(this.ingredient.id);
    this.form.get(this.formNames.name)?.setValue(this.ingredient.name);
    this.nameLength$ = (this.form.get(this.formNames.name) as FormControl).valueChanges.pipe(
      startWith(this.ingredient.name),
      map(value => value.length)
    );
  }

  public stopEdit(): void {
    this.edit.emit([false, false]);
  }

  public submit(): void {
    if (this.form.invalid) {
      return;
    }

    this.store.dispatch(ingredientNameUpdate({
      id: this.ingredient.id,
      name: this.form.get(this.formNames.name)?.value
    }));
  }
}
