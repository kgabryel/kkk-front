import {NgModule} from '@angular/core';

import {RouterModule, Routes} from '@angular/router';
import {RoutingConfig} from '../../config/routing.config';
import {IndexComponent} from './pages/index/index.component';
import {RecipesComponent} from './pages/recipes/recipes.component';

const routes: Routes = [
  {
    path: RoutingConfig.home,
    component: IndexComponent
  },
  {
    path: RoutingConfig.ingredientRecipes,
    component: RecipesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IngredientsRoutingModule {
}
