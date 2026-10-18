import type { InputSignal } from '@angular/core';

import { Clipboard } from '@angular/cdk/clipboard';
import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';

import type { Recipe } from '@/app/core/models/recipe';
import type { State as RecipesState } from '@/app/core/store/recipes/reducers';
import type { RecipesTooltips } from '@/app/core/tooltips/recipes.tooltips';

import { RoutingConfig } from '@/app/config/routing.config';
import { messages } from '@/app/core/messages/recipes.messages';
import { NotificationService } from '@/app/core/services/notification.service';
import { recipeDelete, recipeFavouriteUpdate, recipeToDoUpdate } from '@/app/core/store/recipes/actions';
import { tooltips } from '@/app/core/tooltips/recipes.tooltips';
import { PathUtils } from '@/app/core/utils/path.utils';
import { BaseComponent } from '@/app/modules/base.component';
import { DeleteDialogComponent } from '@/app/modules/shared/components/delete-dialog/delete-dialog.component';
import { RecipeEditHrefPipe } from '@/app/modules/shared/pipes/recipe-edit-href.pipe';
import { RecipePreviewHrefPipe } from '@/app/modules/shared/pipes/recipe-preview-href.pipe';
import { environment } from '@/environments/environment';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon, MatIconButton, RecipeEditHrefPipe, RecipePreviewHrefPipe, MatTooltip, RouterLink],
  selector: 'recipes-recipe-actions',
  templateUrl: './recipe-actions.component.html',
})
export class RecipeActionsComponent extends BaseComponent {
  public recipe: InputSignal<Recipe> = input.required<Recipe>();
  public previewAvailable: InputSignal<boolean> = input<boolean>(true);
  public tooltips: RecipesTooltips = tooltips;
  private clipboard: Clipboard = inject(Clipboard);
  private dialog: MatDialog = inject(MatDialog);
  private notificationService: NotificationService = inject(NotificationService);
  private recipesStore: Store<RecipesState> = inject<Store<RecipesState>>(Store);

  public share(): void {
    this.clipboard.copy(
      environment.frontUrl +
        PathUtils.bindParams(RoutingConfig.publicRecipe, new Map([['id', this.recipe().publicId]])),
    );
    this.notificationService.showMessage(messages.copied);
  }

  public updateFavourite(): void {
    this.recipesStore.dispatch(
      recipeFavouriteUpdate({
        favourite: !this.recipe().favourite,
        id: this.recipe().id,
      }),
    );
  }

  public updateToDo(): void {
    this.recipesStore.dispatch(
      recipeToDoUpdate({
        id: this.recipe().id,
        toDo: !this.recipe().toDo,
      }),
    );
  }

  public delete(): void {
    this.dialog.open(DeleteDialogComponent, {
      autoFocus: false,
      data: {
        onClose: () => this.recipesStore.dispatch(recipeDelete({ id: this.recipe().id })),
      },
      width: '800px',
    });
  }
}
