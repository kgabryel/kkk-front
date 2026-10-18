import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable, of} from 'rxjs';
import {Recipe} from '../../../../core/models/recipe';
import {Store} from '@ngrx/store';
import {State as RecipesState} from '../../../../core/store/recipes/reducers';
import {State as IngredientsState} from '../../../../core/store/ingredients/reducers';
import {selectById} from '../../../../core/store/ingredients/selectors';
import {switchMap, tap} from 'rxjs/operators';
import {PathUtils} from '../../../../core/utils/path.utils';
import {RoutingConfig} from '../../../../config/routing.config';
import {selectRecipesForIngredient} from '../../../../core/store/recipes/selectors';

@Component({
  selector: 'ingredients-pages-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecipesComponent implements OnInit {

  public recipes$: Observable<Recipe[]>;
  private route: ActivatedRoute;
  private recipesStore: Store<RecipesState>;
  private ingredientsStore: Store<IngredientsState>;
  private router: Router;

  public constructor(
    route: ActivatedRoute,
    recipesStore: Store<RecipesState>,
    ingredientsStore: Store<IngredientsState>,
    router: Router
  ) {
    this.route = route;
    this.recipesStore = recipesStore;
    this.ingredientsStore = ingredientsStore;
    this.router = router;
  }

  public ngOnInit(): void {
    const ingredientId = parseInt(this.route.snapshot.paramMap.get('id') ?? '') || 0;
    this.recipes$ = this.ingredientsStore.select(selectById(ingredientId)).pipe(
      tap(ingredient => {
        if (ingredient === undefined) {
          this.router.navigateByUrl(PathUtils.concatPath(RoutingConfig.notFound), {skipLocationChange: true});
        }
      }),
      switchMap(ingredient => ingredient === undefined ? of([]) : this.recipesStore.select(selectRecipesForIngredient(ingredient)))
    );
  }
}
