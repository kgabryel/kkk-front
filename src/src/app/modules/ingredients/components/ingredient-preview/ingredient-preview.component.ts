import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Ingredient} from '../../../../core/models/ingredient';
import {State as IngredientsState} from '../../../../core/store/ingredients/reducers';
import {Store} from '@ngrx/store';
import {ingredientAvailableUpdate, ingredientDelete} from '../../../../core/store/ingredients/actions';
import {State as RecipesState} from '../../../../core/store/recipes/reducers';
import {selectRecipesForIngredient} from '../../../../core/store/recipes/selectors';
import {Subscription} from 'rxjs';
import {DeleteDialogComponent} from '../../../shared/components/delete-dialog/delete-dialog.component';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'ingredients-ingredient-preview',
  templateUrl: './ingredient-preview.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IngredientPreviewComponent implements OnInit, OnDestroy {
  @Input() public ingredient: Ingredient;
  @Input() public ozaKey: string | null;
  public recipesCount: number;
  @Output() private edit: EventEmitter<boolean[]>;
  private ingredientsStore: Store<IngredientsState>;
  private recipesStore: Store<RecipesState>;
  private subscription: Subscription;
  private dialog: MatDialog;

  public constructor(store: Store<IngredientsState>, recipesStore: Store<RecipesState>, dialog: MatDialog) {
    this.edit = new EventEmitter();
    this.ingredientsStore = store;
    this.recipesStore = recipesStore;
    this.dialog = dialog;
  }

  public ngOnInit(): void {
    this.recipesCount = 0;
    this.subscription = this.recipesStore.select(selectRecipesForIngredient(this.ingredient))
      .subscribe(recipes => this.recipesCount = recipes.length);
  }

  public startEdit(): void {
    this.edit.emit([true, false]);
  }

  public startOzaEdit(): void {
    this.edit.emit([true, true]);
  }

  public updateAvailable(): void {
    this.ingredientsStore.dispatch(ingredientAvailableUpdate({
        id: this.ingredient.id,
        available: !this.ingredient.available
      })
    );
  }

  public delete(): void {
    this.dialog.open(DeleteDialogComponent, {
      width: '800px',
      autoFocus: false,
      data: {
        onClose: () => this.ingredientsStore.dispatch(ingredientDelete({id: this.ingredient.id}))
      }
    });
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
