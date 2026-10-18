import type { InputSignal, OnInit, Signal } from '@angular/core';

import { ChangeDetectionStrategy, Component, input, inject } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatLine } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatListItem } from '@angular/material/list';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';

import type { Recipe } from '@/app/core/models/recipe';
import type { State } from '@/app/core/store/recipes/reducers';
import type { RecipesTooltips } from '@/app/core/tooltips/recipes.tooltips';

import { selectRecipeAvailable } from '@/app/core/store/recipes/selectors';
import { tooltips } from '@/app/core/tooltips/recipes.tooltips';
import { SignalUtils } from '@/app/core/utils/signal.utils';
import { RecipeDialogComponent } from '@/app/modules/recipes/components/recipe-dialog/recipe-dialog.component';
import { RecipePreviewHrefPipe } from '@/app/modules/shared/pipes/recipe-preview-href.pipe';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatListItem, MatIcon, MatTooltip, MatIconButton, MatLine, RouterLink, RecipePreviewHrefPipe],
  selector: 'recipes-recipe-position',
  styleUrl: './recipe-position.component.scss',
  templateUrl: './recipe-position.component.html',
})
export class RecipePositionComponent implements OnInit {
  public recipe: InputSignal<Recipe> = input.required<Recipe>();
  public measure: InputSignal<string> = input.required<string>();
  public amount: InputSignal<string | null> = input.required<string | null>();
  public additional: InputSignal<boolean> = input.required<boolean>();
  public available!: Signal<boolean>;
  public tooltips: RecipesTooltips = tooltips;
  private dialog: MatDialog = inject(MatDialog);
  private readonly store: Store<State> = inject<Store<State>>(Store);

  public ngOnInit(): void {
    this.available = SignalUtils.map<Recipe, boolean>(this.recipe, (recipe: Recipe) =>
      this.store.selectSignal(selectRecipeAvailable(recipe))(),
    );
  }

  public openDialog(): void {
    this.dialog.open(RecipeDialogComponent, {
      data: { recipe: this.recipe() },
      width: '800px',
    });
  }
}
