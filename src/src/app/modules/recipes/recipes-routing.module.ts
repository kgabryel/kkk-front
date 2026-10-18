import {NgModule} from '@angular/core';

import {RouterModule, Routes} from '@angular/router';
import {RoutingConfig} from '../../config/routing.config';
import {IndexComponent} from './pages/index/index.component';
import {ToDoComponent} from './pages/to-do/to-do.component';
import {FavouritesComponent} from './pages/favourites/favourites.component';
import {CreateComponent} from './pages/create/create.component';
import {MainComponent} from './components/main/main.component';
import {RecipeComponent} from './pages/recipe/recipe.component';
import {EditComponent} from './pages/edit/edit.component';

const routes: Routes = [
  {
    path: RoutingConfig.home, component: MainComponent, children: [
      {
        path: RoutingConfig.home,
        component: IndexComponent
      },
      {
        path: RoutingConfig.create,
        component: CreateComponent
      },
      {
        path: RoutingConfig.favourite,
        component: FavouritesComponent
      },
      {
        path: RoutingConfig.toDo,
        component: ToDoComponent
      },
      {
        path: RoutingConfig.recipe,
        component: RecipeComponent
      },
      {
        path: RoutingConfig.recipeEdit,
        component: EditComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecipesRoutingModule {
}
