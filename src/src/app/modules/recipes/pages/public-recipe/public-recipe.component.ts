import type { OnInit, Signal } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, effect, runInInjectionContext, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import type { FullRecipe } from '@/app/core/models/full-recipe';

import { recipesRoutes } from '@/app/config/routes.config';
import { RoutingConfig } from '@/app/config/routing.config';
import { PathUtils } from '@/app/core/utils/path.utils';
import { RouterUtils } from '@/app/core/utils/router.utils';
import { BaseComponent } from '@/app/modules/base.component';
import { FullPhotoComponent } from '@/app/modules/recipes/components/full-photo/full-photo.component';
import { FullRecipeComponent } from '@/app/modules/recipes/components/full-recipe/full-recipe.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FullRecipeComponent, FullPhotoComponent],
  selector: 'recipes-pages-public-recipe',
  styleUrl: './public-recipe.component.scss',
  templateUrl: './public-recipe.component.html',
})
export class PublicRecipeComponent extends BaseComponent implements OnInit {
  public recipe!: Signal<FullRecipe | undefined>;
  private httpClient: HttpClient = inject(HttpClient);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private readonly router: Router = inject(Router);

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
