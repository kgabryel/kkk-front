import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IndexComponent} from './pages/index/index.component';
import {CreateComponent} from './components/create/create.component';
import {IngredientsRoutingModule} from './ingredients-routing.module';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {IngredientContainerComponent} from './components/ingredient-container/ingredient-container.component';
import {IngredientEditComponent} from './components/ingredient-edit/ingredient-edit.component';
import {IngredientPreviewComponent} from './components/ingredient-preview/ingredient-preview.component';
import {IngredientsListComponent} from './components/ingredients-list/ingredients-list.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../shared/shared.module';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {IngredientFormFactory} from '../../core/factories/ingredient.factory';
import {SearchComponent} from './components/search/search.component';
import {RecipesComponent} from './pages/recipes/recipes.component';
import {RecipesModule} from '../recipes/recipes.module';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import {OzaEditComponent} from './components/oza-edit/oza-edit.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';


@NgModule({
  declarations: [
    IndexComponent,
    CreateComponent,
    IngredientContainerComponent,
    IngredientEditComponent,
    IngredientPreviewComponent,
    IngredientsListComponent,
    SearchComponent,
    RecipesComponent,
    OzaEditComponent
  ],
  imports: [
    CommonModule,
    IngredientsRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSlideToggleModule,
    ReactiveFormsModule,
    SharedModule,
    MatListModule,
    MatMenuModule,
    MatCheckboxModule,
    FormsModule,
    RecipesModule,
    MatDialogModule,
    MatSelectModule,
    MatAutocompleteModule
  ],
  providers: [
    IngredientFormFactory
  ]
})
export class IngredientsModule {
}
