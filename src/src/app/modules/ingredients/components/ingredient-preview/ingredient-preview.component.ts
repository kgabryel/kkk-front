import type { InputSignal, OnInit, Signal, OutputEmitterRef } from '@angular/core';

import { ChangeDetectionStrategy, Component, input, output, inject } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatListItem } from '@angular/material/list';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';

import type { Ingredient } from '@/app/core/models/ingredient';
import type { Recipe } from '@/app/core/models/recipe';
import type { State as IngredientsState } from '@/app/core/store/ingredients/reducers';
import type { State as RecipesState } from '@/app/core/store/recipes/reducers';

import { ingredientAvailableUpdate, ingredientDelete } from '@/app/core/store/ingredients/actions';
import { selectRecipesForIngredient } from '@/app/core/store/recipes/selectors';
import { SignalUtils } from '@/app/core/utils/signal.utils';
import { DeleteDialogComponent } from '@/app/modules/shared/components/delete-dialog/delete-dialog.component';
import { IngredientRecipesHrefPipe } from '@/app/modules/shared/pipes/ingredient-recipes-href.pipe';
import { OzaSuccessPipe } from '@/app/modules/shared/pipes/oza-success.pipe';
import { OzaSupplyPipe } from '@/app/modules/shared/pipes/oza-supply.pipe';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatListItem,
    OzaSuccessPipe,
    MatMenuTrigger,
    OzaSupplyPipe,
    MatIconButton,
    MatIcon,
    MatMenu,
    RouterLink,
    IngredientRecipesHrefPipe,
    MatMenuItem,
    MatSlideToggle,
  ],
  selector: 'ingredients-ingredient-preview',
  styleUrl: './ingredient-preview.component.scss',
  templateUrl: './ingredient-preview.component.html',
})
export class IngredientPreviewComponent implements OnInit {
  public ingredient: InputSignal<Ingredient> = input.required<Ingredient>();
  public ozaKey: InputSignal<string | null> = input.required<string | null>();
  public edit: OutputEmitterRef<boolean[]> = output<boolean[]>();
  public recipesCount!: Signal<number>;
  private dialog: MatDialog = inject(MatDialog);
  private ingredientsStore: Store<IngredientsState> = inject<Store<IngredientsState>>(Store);
  private recipesStore: Store<RecipesState> = inject<Store<RecipesState>>(Store);

  public ngOnInit(): void {
    this.recipesCount = SignalUtils.arrayToCount<Recipe>(
      this.recipesStore.selectSignal(selectRecipesForIngredient(this.ingredient())),
    );
  }

  public delete(): void {
    this.dialog.open(DeleteDialogComponent, {
      autoFocus: false,
      data: {
        onClose: () => this.ingredientsStore.dispatch(ingredientDelete({ id: this.ingredient().id })),
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
