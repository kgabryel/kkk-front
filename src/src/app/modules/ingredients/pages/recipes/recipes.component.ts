import { ChangeDetectionStrategy, Component, OnInit, Signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { Ingredient } from '../../../../core/models/ingredient';
import { Recipe } from '../../../../core/models/recipe';
import { State as IngredientsState } from '../../../../core/store/ingredients/reducers';
import { selectById } from '../../../../core/store/ingredients/selectors';
import { State as RecipesState } from '../../../../core/store/recipes/reducers';
import { selectRecipesForIngredient } from '../../../../core/store/recipes/selectors';
import { RouterUtils } from '../../../../core/utils/router.utils';
import { SignalUtils } from '../../../../core/utils/signal.utils';
import { BaseComponent } from '../../../base.component';
import { DividerComponent } from '../../../layout/components/divider/divider.component';
import { RecipesListComponent } from '../../../recipes/components/recipes-list/recipes-list.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RecipesListComponent, DividerComponent],
  selector: 'ingredients-pages-recipes',
  standalone: true,
  styleUrls: [],
  templateUrl: './recipes.component.html',
})
export class RecipesComponent extends BaseComponent implements OnInit {
  public recipes!: Signal<Recipe[]>;
  private ingredientsStore: Store<IngredientsState>;
  private recipesStore: Store<RecipesState>;
  private route: ActivatedRoute;
  private readonly router: Router;
  public constructor(
    route: ActivatedRoute,
    recipesStore: Store<RecipesState>,
    ingredientsStore: Store<IngredientsState>,
    router: Router,
  ) {
    super();
    this.route = route;
    this.recipesStore = recipesStore;
    this.ingredientsStore = ingredientsStore;
    this.router = router;
  }

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
