import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable, of} from 'rxjs';
import {Recipe} from '../../../../core/models/recipe';
import {switchMap, tap} from 'rxjs/operators';
import {State as RecipesState} from '../../../../core/store/recipes/reducers';
import {State as TagsState} from '../../../../core/store/tags/reducers';
import {Store} from '@ngrx/store';
import {selectRecipesForTag} from '../../../../core/store/recipes/selectors';
import {selectTagById} from '../../../../core/store/tags/selectors';
import {PathUtils} from '../../../../core/utils/path.utils';
import {RoutingConfig} from '../../../../config/routing.config';

@Component({
  selector: 'tags-pages-recipes',
  templateUrl: './recipes.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecipesComponent implements OnInit {

  public recipes$: Observable<Recipe[]>;
  private route: ActivatedRoute;
  private recipesStore: Store<RecipesState>;
  private tagsStore: Store<TagsState>;
  private router: Router;

  public constructor(
    route: ActivatedRoute,
    recipesStore: Store<RecipesState>,
    tagsStore: Store<TagsState>,
    router: Router
  ) {
    this.route = route;
    this.recipesStore = recipesStore;
    this.tagsStore = tagsStore;
    this.router = router;
  }

  public ngOnInit(): void {
    const tagId = parseInt(this.route.snapshot.paramMap.get('id') ?? '') || 0;
    this.recipes$ = this.tagsStore.select(selectTagById(tagId)).pipe(
      tap(tag => {
        if (tag === undefined) {
          this.router.navigateByUrl(PathUtils.concatPath(RoutingConfig.notFound), {skipLocationChange: true});
        }
      }),
      switchMap(tag => tag === undefined ? of([]) : this.recipesStore.select(selectRecipesForTag(tag)))
    );
  }
}
