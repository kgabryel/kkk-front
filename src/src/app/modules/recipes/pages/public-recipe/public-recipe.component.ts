import { HttpClient } from '@angular/common/http';
import {
  ChangeDetectionStrategy,
  Component,
  effect,
  OnInit,
  runInInjectionContext,
  Signal,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { recipesRoutes } from '../../../../config/routes.config';
import { RoutingConfig } from '../../../../config/routing.config';
import { FullRecipe } from '../../../../core/models/full-recipe';
import { PathUtils } from '../../../../core/utils/path.utils';
import { RouterUtils } from '../../../../core/utils/router.utils';
import { BaseComponent } from '../../../base.component';
import { FullPhotoComponent } from '../../components/full-photo/full-photo.component';
import { FullRecipeComponent } from '../../components/full-recipe/full-recipe.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FullRecipeComponent, FullPhotoComponent],
  selector: 'recipes-pages-public-recipe',
  standalone: true,
  styleUrls: ['./public-recipe.component.scss'],
  templateUrl: './public-recipe.component.html',
})
export class PublicRecipeComponent extends BaseComponent implements OnInit {
  public recipe!: Signal<FullRecipe | undefined>;
  private httpClient: HttpClient;
  private route: ActivatedRoute;
  private readonly router: Router;
  public constructor(route: ActivatedRoute, router: Router, httpClient: HttpClient) {
    super();
    this.route = route;
    this.router = router;
    this.httpClient = httpClient;
  }

  public ngOnInit(): void {
    const recipeId = this.route.snapshot.paramMap.get('id') ?? '';

    if (!recipeId) {
      this.redirectToNotFound();

      return;
    }
    this.recipe = this.signalFromObservable(
      this.httpClient.get<FullRecipe | undefined>(recipesRoutes.byPublicId(recipeId)),
      undefined,
    );
    let first = true;

    runInInjectionContext(this.injector, () =>
      effect(() => {
        if (first) {
          first = false;

          return;
        }

        RouterUtils.redirectIfMissing<FullRecipe>(this.injector, this.recipe, this.router);
      }),
    );
  }

  private redirectToNotFound(): void {
    void this.router.navigateByUrl(PathUtils.concatPath(RoutingConfig.notFound), {
      skipLocationChange: true,
    });
  }
}
