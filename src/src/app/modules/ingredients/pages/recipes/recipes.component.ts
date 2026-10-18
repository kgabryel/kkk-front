import type { OnInit, Signal } from '@angular/core';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import type { Ingredient } from '@/app/core/models/ingredient';
import type { Recipe } from '@/app/core/models/recipe';
import type { State as IngredientsState } from '@/app/core/store/ingredients/reducers';
import type { State as RecipesState } from '@/app/core/store/recipes/reducers';

import { selectById } from '@/app/core/store/ingredients/selectors';
import { selectRecipesForIngredient } from '@/app/core/store/recipes/selectors';
import { RouterUtils } from '@/app/core/utils/router.utils';
import { SignalUtils } from '@/app/core/utils/signal.utils';
import { BaseComponent } from '@/app/modules/base.component';
import { DividerComponent } from '@/app/modules/layout/components/divider/divider.component';
import { RecipesListComponent } from '@/app/modules/recipes/components/recipes-list/recipes-list.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RecipesListComponent, DividerComponent],
  selector: 'ingredients-pages-recipes',
  templateUrl: './recipes.component.html',
})
export class RecipesComponent extends BaseComponent implements OnInit {
  public recipes!: Signal<Recipe[]>;
  private ingredientsStore: Store<IngredientsState> = inject<Store<IngredientsState>>(Store);
  private recipesStore: Store<RecipesState> = inject<Store<RecipesState>>(Store);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);

  public ngOnInit(): void {
    const ingredientId = parseInt(this.route.snapshot.paramMap.get('id') ?? '') || 0;
    const ingredient = this.ingredientsStore.selectSignal(selectById(ingredientId));
    RouterUtils.redirectIfMissing<Ingredient>(this.injector, ingredient, this.router);

    this.recipes = SignalUtils.map<Ingredient | undefined, Recipe[]>(
      ingredient,
      (ingredient: Ingredient | undefined) => {
        if (ingredient === undefined) {
          return [];
        }

        return this.recipesStore.selectSignal(selectRecipesForIngredient(ingredient))();
      },
    );
  }
}
