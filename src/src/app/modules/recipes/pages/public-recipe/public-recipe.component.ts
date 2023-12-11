import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {PathUtils} from '../../../../core/utils/path.utils';
import {RoutingConfig} from '../../../../config/routing.config';
import {tap} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {recipesRoutes} from '../../../../config/routes.config';
import {FullRecipe} from '../../../../core/models/full-recipe';

@Component({
  selector: 'recipes-pages-public-recipe',
  templateUrl: './public-recipe.component.html',
  styleUrls: ['./public-recipe.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PublicRecipeComponent implements OnInit {

  public recipe$: Observable<FullRecipe | undefined>;
  private route: ActivatedRoute;
  private router: Router;
  private httpClient: HttpClient;

  public constructor(route: ActivatedRoute, router: Router, httpClient: HttpClient) {
    this.route = route;
    this.router = router;
    this.httpClient = httpClient;
  }

  public ngOnInit(): void {
    const recipeId = this.route.snapshot.paramMap.get('id') ?? '';
    if (recipeId !== '') {
      this.recipe$ = this.httpClient.get<FullRecipe | undefined>(recipesRoutes.byPublicId(recipeId)).pipe(
        tap(recipe => {
          if (recipe === undefined) {
            this.router.navigateByUrl(PathUtils.concatPath(RoutingConfig.notFound), {skipLocationChange: true});
          }
        })
      );
    } else {
      this.router.navigateByUrl(PathUtils.concatPath(RoutingConfig.notFound), {skipLocationChange: true});
    }
  }
}
