import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';

import { RoutingConfig } from '../../config/routing.config';
import { tagsResolver } from '../../core/resolvers/tags.resolver';
import { TagsService } from '../../core/services/tags.service';
import { TagsEffects } from '../../core/store/tags/effects';
import { TAGS_KEY, tagsReducer } from '../../core/store/tags/reducers';
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
