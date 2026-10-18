import {
  ChangeDetectionStrategy,
  Component,
  input,
  InputSignal,
  OnInit,
  output,
  Signal,
} from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatListItem } from '@angular/material/list';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';

import { Ingredient } from '../../../../core/models/ingredient';
import { Recipe } from '../../../../core/models/recipe';
import {
  ingredientAvailableUpdate,
  ingredientDelete,
} from '../../../../core/store/ingredients/actions';
import { State as IngredientsState } from '../../../../core/store/ingredients/reducers';
import { State as RecipesState } from '../../../../core/store/recipes/reducers';
import { selectRecipesForIngredient } from '../../../../core/store/recipes/selectors';
import { SignalUtils } from '../../../../core/utils/signal.utils';
import { DeleteDialogComponent } from '../../../shared/components/delete-dialog/delete-dialog.component';
import { IngredientRecipesHrefPipe } from '../../../shared/pipes/ingredient-recipes-href.pipe';
import { OzaSuccessPipe } from '../../../shared/pipes/oza-success.pipe';
import { OzaSupplyPipe } from '../../../shared/pipes/oza-supply.pipe';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatListItem,
    MatCheckbox,
    OzaSuccessPipe,
    MatMenuTrigger,
    OzaSupplyPipe,
    MatIconButton,
    MatIcon,
    MatMenu,
    RouterLink,
    IngredientRecipesHrefPipe,
    MatMenuItem,
  ],
  selector: 'ingredients-ingredient-preview',
  standalone: true,
  styleUrls: ['./ingredient-preview.component.scss'],
  templateUrl: './ingredient-preview.component.html',
})
export class IngredientPreviewComponent implements OnInit {
  public ingredient: InputSignal<Ingredient> = input.required<Ingredient>();
  public ozaKey: InputSignal<string | null> = input.required<string | null>();
  public edit = output<boolean[]>();
  public recipesCount!: Signal<number>;
  private dialog: MatDialog;
  private ingredientsStore: Store<IngredientsState>;
  private recipesStore: Store<RecipesState>;
  public constructor(
    store: Store<IngredientsState>,
    recipesStore: Store<RecipesState>,
    dialog: MatDialog,
  ) {
    this.ingredientsStore = store;
    this.recipesStore = recipesStore;
    this.dialog = dialog;
  }

  public ngOnInit(): void {
    this.recipesCount = SignalUtils.arrayToCount<Recipe>(
      this.recipesStore.selectSignal(selectRecipesForIngredient(this.ingredient())),
    );
  }

  public delete(): void {
    this.dialog.open(DeleteDialogComponent, {
      autoFocus: false,
      data: {
        onClose: () =>
          this.ingredientsStore.dispatch(ingredientDelete({ id: this.ingredient().id })),
      },
      width: '800px',
    });
  }

  public startEdit(): void {
    this.edit.emit([true, false]);
  }

  public startOzaEdit(): void {
    this.edit.emit([true, true]);
  }

  public updateAvailable(): void {
    this.ingredientsStore.dispatch(
      ingredientAvailableUpdate({
        available: !this.ingredient().available,
        id: this.ingredient().id,
      }),
    );
  }
}
