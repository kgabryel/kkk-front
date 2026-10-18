import type { OnInit, Signal } from '@angular/core';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import type { Recipe } from '@/app/core/models/recipe';
import type { Tag } from '@/app/core/models/tag';
import type { State as RecipesState } from '@/app/core/store/recipes/reducers';
import type { State as TagsState } from '@/app/core/store/tags/reducers';

import { selectRecipesForTag } from '@/app/core/store/recipes/selectors';
import { selectTagById } from '@/app/core/store/tags/selectors';
import { RouterUtils } from '@/app/core/utils/router.utils';
import { SignalUtils } from '@/app/core/utils/signal.utils';
import { BaseComponent } from '@/app/modules/base.component';
import { DividerComponent } from '@/app/modules/layout/components/divider/divider.component';
import { RecipesListComponent } from '@/app/modules/recipes/components/recipes-list/recipes-list.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RecipesListComponent, DividerComponent],
  selector: 'tags-pages-recipes',
  templateUrl: './recipes.component.html',
})
export class RecipesComponent extends BaseComponent implements OnInit {
  public recipes!: Signal<Recipe[]>;
  private recipesStore: Store<RecipesState> = inject<Store<RecipesState>>(Store);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);
  private tagsStore: Store<TagsState> = inject<Store<TagsState>>(Store);

  public ngOnInit(): void {
    const tagId = parseInt(this.route.snapshot.paramMap.get('id') ?? '') || 0;
    const tag = this.tagsStore.selectSignal(selectTagById(tagId));
    RouterUtils.redirectIfMissing<Tag>(this.injector, tag, this.router);

    this.recipes = SignalUtils.map<Tag | undefined, Recipe[]>(tag, (tag: Tag | undefined) => {
      if (tag === undefined) {
        return [];
      }

      return this.recipesStore.selectSignal(selectRecipesForTag(tag))();
    });
  }
}
