import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';

import { RoutingConfig } from '../../config/routing.config';
import { ingredientsResolver } from '../../core/resolvers/ingredients.resolver';
import { recipesResolver } from '../../core/resolvers/recipes.resolver';
import { seasonsResolver } from '../../core/resolvers/seasons.resolver';
import { settingsResolver } from '../../core/resolvers/settings.resolver';
import { suppliesResolver } from '../../core/resolvers/supplies.resolver';
import { tagsResolver } from '../../core/resolvers/tags.resolver';
import { timersResolver } from '../../core/resolvers/timers.resolver';
import { IngredientsService } from '../../core/services/ingredients.service';
import { RecipesService } from '../../core/services/recipes.service';
import { SeasonsService } from '../../core/services/seasons.service';
import { TagsService } from '../../core/services/tags.service';
import { TimersService } from '../../core/services/timers.service';
import { IngredientsEffects } from '../../core/store/ingredients/effects';
import { INGREDIENTS_KEY, ingredientsReducer } from '../../core/store/ingredients/reducers';
import { OzaSuppliesEffects } from '../../core/store/oza-supplies/effects';
import { SUPPLIES_KEY, suppliesReducer } from '../../core/store/oza-supplies/reducers';
import { RecipesEffects } from '../../core/store/recipes/effects';
import { RECIPES_KEY, recipesReducer } from '../../core/store/recipes/reducers';
import { SeasonsEffects } from '../../core/store/seasons/effects';
import { SEASONS_KEY, seasonsReducer } from '../../core/store/seasons/reducers';
import { SettingsEffects } from '../../core/store/settings/effects';
import { SETTINGS_KEY, settingsReducer } from '../../core/store/settings/reducers';
import { TagsEffects } from '../../core/store/tags/effects';
import { TAGS_KEY, tagsReducer } from '../../core/store/tags/reducers';
import { TimersEffects } from '../../core/store/timers/effects';
import { TIMERS_KEY, timersReducer } from '../../core/store/timers/reducers';
import { PathUtils } from '../../core/utils/path.utils';
import { MainComponent } from './components/main/main.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';

export const routes: Routes = [
  {
    children: [
      {
        loadChildren: () =>
          import('../recipes/recipes.routes').then((m: { routes: Routes }) => m.routes),
        path: RoutingConfig.recipes,
        providers: [
          provideState(INGREDIENTS_KEY, ingredientsReducer),
          provideState(TAGS_KEY, tagsReducer),
          provideEffects(IngredientsEffects),
          provideEffects(TagsEffects),
          IngredientsService,
          TagsService,
        ],
        resolve: {
          ingredients: ingredientsResolver,
          tags: tagsResolver,
        },
      },
      {
        loadChildren: () =>
          import('../seasons/seasons.routes').then((m: { routes: Routes }) => m.routes),
        path: RoutingConfig.seasons,
        providers: [
          provideState(INGREDIENTS_KEY, ingredientsReducer),
          provideState(SEASONS_KEY, seasonsReducer),
          provideEffects(IngredientsEffects),
          provideEffects(SeasonsEffects),
          IngredientsService,
          SeasonsService,
        ],
        resolve: {
          ingredients: ingredientsResolver,
          seasons: seasonsResolver,
        },
      },
      {
        loadChildren: () =>
          import('../ingredients/ingredients.routes').then((m: { routes: Routes }) => m.routes),
        path: RoutingConfig.ingredients,
        providers: [
          provideState(INGREDIENTS_KEY, ingredientsReducer),
          provideState(SETTINGS_KEY, settingsReducer),
          provideState(SUPPLIES_KEY, suppliesReducer),
          provideEffects(IngredientsEffects),
          provideEffects(SettingsEffects),
          provideEffects(OzaSuppliesEffects),
          IngredientsService,
        ],
        resolve: {
          ingredients: ingredientsResolver,
          settings: settingsResolver,
          supplies: suppliesResolver,
        },
      },
      {
        loadChildren: () => import('../tags/tags.routes').then((m: { routes: Routes }) => m.routes),
        path: RoutingConfig.tags,
        providers: [provideState(TAGS_KEY, tagsReducer), provideEffects(TagsEffects), TagsService],
        resolve: { tags: tagsResolver },
      },
      {
        loadChildren: () =>
          import('../account/account.routes').then((m: { routes: Routes }) => m.routes),
        path: RoutingConfig.account,
      },
      {
        path: RoutingConfig.home,
        pathMatch: 'full',
        redirectTo: PathUtils.concatPath(RoutingConfig.home, RoutingConfig.recipes),
      },
      { component: NotFoundComponent, path: RoutingConfig.notFound },
      { component: NotFoundComponent, path: RoutingConfig.any },
    ],
    component: MainComponent,
    path: RoutingConfig.home,
    providers: [
      provideState(SETTINGS_KEY, settingsReducer),
      provideState(TIMERS_KEY, timersReducer),
      provideState(RECIPES_KEY, recipesReducer),
      provideEffects(SettingsEffects),
      provideEffects(TimersEffects),
      provideEffects(RecipesEffects),
      TimersService,
      RecipesService,
    ],
    resolve: {
      recipes: recipesResolver,
      settings: settingsResolver,
      timers: timersResolver,
    },
  },
];
