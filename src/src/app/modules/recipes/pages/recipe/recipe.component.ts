import { ChangeDetectionStrategy, Component, OnInit, Signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { Recipe } from '../../../../core/models/recipe';
import { State } from '../../../../core/store/recipes/reducers';
import { selectById } from '../../../../core/store/recipes/selectors';
import { RouterUtils } from '../../../../core/utils/router.utils';
import { BaseComponent } from '../../../base.component';
import { RecipePreviewComponent } from '../../components/recipe-preview/recipe-preview.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RecipePreviewComponent],
  selector: 'recipes-pages-recipe',
  standalone: true,
  styleUrls: ['./recipe.component.scss'],
  templateUrl: './recipe.component.html',
})
export class RecipeComponent extends BaseComponent implements OnInit {
  public recipe!: Signal<Recipe | undefined>;
  private route: ActivatedRoute;
  private readonly router: Router;
  private store: Store<State>;
  public constructor(route: ActivatedRoute, recipesStore: Store<State>, router: Router) {
    super();
    this.route = route;
    this.store = recipesStore;
    this.router = router;
  }

  public ngOnInit(): void {
    const recipeId = parseInt(this.route.snapshot.paramMap.get('id') ?? '') || 0;
    this.recipe = this.store.selectSignal(selectById(recipeId));
    RouterUtils.redirectIfMissing<Recipe>(this.injector, this.recipe, this.router);
  }
}
