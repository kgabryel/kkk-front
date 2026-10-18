import { ChangeDetectionStrategy, Component, OnInit, Signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { Recipe } from '../../../../core/models/recipe';
import { Tag } from '../../../../core/models/tag';
import { State as RecipesState } from '../../../../core/store/recipes/reducers';
import { selectRecipesForTag } from '../../../../core/store/recipes/selectors';
import { State as TagsState } from '../../../../core/store/tags/reducers';
import { selectTagById } from '../../../../core/store/tags/selectors';
import { RouterUtils } from '../../../../core/utils/router.utils';
import { SignalUtils } from '../../../../core/utils/signal.utils';
import { BaseComponent } from '../../../base.component';
import { DividerComponent } from '../../../layout/components/divider/divider.component';
import { RecipesListComponent } from '../../../recipes/components/recipes-list/recipes-list.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RecipesListComponent, DividerComponent],
  selector: 'tags-pages-recipes',
  standalone: true,
  styleUrls: [],
  templateUrl: './recipes.component.html',
})
export class RecipesComponent extends BaseComponent implements OnInit {
  public recipes!: Signal<Recipe[]>;
  private recipesStore: Store<RecipesState>;
  private route: ActivatedRoute;
  private readonly router: Router;
  private tagsStore: Store<TagsState>;
  public constructor(
    route: ActivatedRoute,
    recipesStore: Store<RecipesState>,
    tagsStore: Store<TagsState>,
    router: Router,
  ) {
    super();
    this.route = route;
    this.recipesStore = recipesStore;
    this.tagsStore = tagsStore;
    this.router = router;
  }

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
