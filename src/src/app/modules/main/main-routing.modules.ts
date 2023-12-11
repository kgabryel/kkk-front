import {NgModule} from '@angular/core';

import {RouterModule, Routes} from '@angular/router';
import {RoutingConfig} from '../../config/routing.config';
import {NotFoundComponent} from './pages/not-found/not-found.component';
import {MainComponent} from './components/main/main.component';
import {TagsResolver} from '../../core/resolvers/tags.resolver';
import {IngredientsResolver} from '../../core/resolvers/ingredients.resolver';
import {SeasonsResolver} from '../../core/resolvers/seasons.resolver';
import {RecipesResolver} from '../../core/resolvers/recipes.resolver';
import {PathUtils} from '../../core/utils/path.utils';
import {SettingsResolver} from '../../core/resolvers/settings.resolver';
import {SuppliesResolver} from '../../core/resolvers/supplies.resolver';
import {TimersResolver} from '../../core/resolvers/timers.resolver';

const routes: Routes = [
  {
    path: RoutingConfig.home, component: MainComponent, children: [
      {
        path: RoutingConfig.recipes,
        loadChildren: () => import('../recipes/recipes.module').then(m => m.RecipesModule),
        resolve: {
          recipes: RecipesResolver,
          tags: TagsResolver,
          ingredients: IngredientsResolver
        }
      },
      {
        path: RoutingConfig.seasons,
        loadChildren: () => import('../seasons/seasons.module').then(m => m.SeasonsModule),
        resolve: {seasons: SeasonsResolver, ingredients: IngredientsResolver, recipes: RecipesResolver}
      },
      {
        path: RoutingConfig.ingredients,
        loadChildren: () => import('../ingredients/ingredients.module').then(m => m.IngredientsModule),
        resolve: {
          ingredients: IngredientsResolver,
          recipes: RecipesResolver,
          settings: SettingsResolver,
          supplies: SuppliesResolver
        }
      },
      {
        path: RoutingConfig.tags,
        loadChildren: () => import('../tags/tags.module').then(m => m.TagsModule),
        resolve: {tags: TagsResolver}
      },
      {
        path: RoutingConfig.account,
        loadChildren: () => import('../account/account.module').then(m => m.AccountModule)
      },
      {
        path: RoutingConfig.home,
        redirectTo: PathUtils.concatPath(RoutingConfig.home, RoutingConfig.recipes)
      },
      {path: RoutingConfig.notFound, component: NotFoundComponent},
      {path: RoutingConfig.any, component: NotFoundComponent}
    ],
    resolve: {
      settings: SettingsResolver,
      timers: TimersResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule {
}
