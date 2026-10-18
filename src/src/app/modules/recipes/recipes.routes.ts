import { Routes } from '@angular/router';

import { RoutingConfig } from '../../config/routing.config';
import { MainComponent } from './components/main/main.component';
import { CreateComponent } from './pages/create/create.component';
import { EditComponent } from './pages/edit/edit.component';
import { FavouritesComponent } from './pages/favourites/favourites.component';
import { IndexComponent } from './pages/index/index.component';
import { RecipeComponent } from './pages/recipe/recipe.component';
import { ToDoComponent } from './pages/to-do/to-do.component';

export const routes: Routes = [
  {
    children: [
      {
        component: IndexComponent,
        path: RoutingConfig.home,
      },
      {
        component: CreateComponent,
        path: RoutingConfig.create,
      },
      {
        component: FavouritesComponent,
        path: RoutingConfig.favourite,
      },
      {
        component: ToDoComponent,
        path: RoutingConfig.toDo,
      },
      {
        component: RecipeComponent,
        path: RoutingConfig.recipe,
      },
      {
        component: EditComponent,
        path: RoutingConfig.recipeEdit,
      },
    ],
    component: MainComponent,
    path: RoutingConfig.home,
  },
];
