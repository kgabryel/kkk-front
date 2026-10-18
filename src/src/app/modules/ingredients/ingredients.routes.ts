import type { Routes } from '@angular/router';

import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';

import { RoutingConfig } from '@/app/config/routing.config';
import { tagsResolver } from '@/app/core/resolvers/tags.resolver';
import { TagsService } from '@/app/core/services/tags.service';
import { TagsEffects } from '@/app/core/store/tags/effects';
import { TAGS_KEY, tagsReducer } from '@/app/core/store/tags/reducers';

import { IndexComponent } from './pages/index/index.component';
import { RecipesComponent } from './pages/recipes/recipes.component';

export const routes: Routes = [
  {
    component: IndexComponent,
    path: RoutingConfig.home,
  },
  {
    component: RecipesComponent,
    path: RoutingConfig.ingredientRecipes,
    providers: [provideState(TAGS_KEY, tagsReducer), provideEffects(TagsEffects), TagsService],
    resolve: {
      tags: tagsResolver,
    },
  },
];
