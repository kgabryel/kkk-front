import type { OnInit, Signal } from '@angular/core';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import type { Recipe } from '@/app/core/models/recipe';
import type { State } from '@/app/core/store/recipes/reducers';

import { selectById } from '@/app/core/store/recipes/selectors';
import { RouterUtils } from '@/app/core/utils/router.utils';
import { BaseComponent } from '@/app/modules/base.component';
import { RecipePreviewComponent } from '@/app/modules/recipes/components/recipe-preview/recipe-preview.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RecipePreviewComponent],
  selector: 'recipes-pages-recipe',
  styleUrl: './recipe.component.scss',
  templateUrl: './recipe.component.html',
})
export class RecipeComponent extends BaseComponent implements OnInit {
  public recipe!: Signal<Recipe | undefined>;
  private route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);
  private store: Store<State> = inject<Store<State>>(Store);

  public ngOnInit(): void {
    const recipeId = parseInt(this.route.snapshot.paramMap.get('id') ?? '') || 0;
    this.recipe = this.store.selectSignal(selectById(recipeId));
    RouterUtils.redirectIfMissing<Recipe>(this.injector, this.recipe, this.router);
  }
}
