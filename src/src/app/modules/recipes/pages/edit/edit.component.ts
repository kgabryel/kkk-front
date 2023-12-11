import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {Recipe} from '../../../../core/models/recipe';
import {Store} from '@ngrx/store';
import {State} from '../../../../core/store/recipes/reducers';
import {selectById} from '../../../../core/store/recipes/selectors';
import {tap} from 'rxjs/operators';
import {PathUtils} from '../../../../core/utils/path.utils';
import {RoutingConfig} from '../../../../config/routing.config';

@Component({
  selector: 'recipes-pages-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditComponent implements OnInit {

  public recipe$: Observable<Recipe | undefined>;
  private route: ActivatedRoute;
  private store: Store<State>;
  private router: Router;

  public constructor(route: ActivatedRoute, recipesStore: Store<State>, router: Router) {
    this.route = route;
    this.store = recipesStore;
    this.router = router;
  }

  public ngOnInit(): void {
    const recipeId = parseInt(this.route.snapshot.paramMap.get('id') ?? '') || 0;
    this.recipe$ = this.store.select(selectById(recipeId)).pipe(
      tap(recipe => {
        if (recipe === undefined) {
          this.router.navigateByUrl(PathUtils.concatPath(RoutingConfig.notFound), {skipLocationChange: true});
        }
      })
    );
  }
}
