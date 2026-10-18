import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ErrorsContainerComponent} from './components/errors-container/errors-container.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {EmptyStringPipe} from './pipes/empty-string/empty-string.pipe';
import {FindIngredientPipe} from './pipes/find-ingredient/find-ingredient.pipe';
import {CalculateAmountPipe} from './pipes/calculate-amount/calculate-amount.pipe';
import {TagRecipesHrefPipe} from './pipes/tag-recipes-href/tag-recipes-href.pipe';
import {IngredientRecipesHrefPipe} from './pipes/ingredient-recipes-href/ingredient-recipes-href.pipe';
import {RecipePreviewHrefPipe} from './pipes/recipe-preview-href/recipe-preview-href.pipe';
import {RecipeEditHrefPipe} from './pipes/recipe-edit-href/recipe-edit-href.pipe';
import {LoaderComponent} from './components/loader/loader.component';
import {FindRecipePipe} from './pipes/find-recipe/find-recipe.pipe';
import {AutocompletePipe} from './pipes/autocomplete/autocomplete.pipe';
import {OzaSuccessPipe} from './pipes/oza-success/oza-success.pipe';
import {OzaSupplyPipe} from './pipes/oza-supply/oza-supply.pipe';
import {TimerTimePipe} from './pipes/timer-time/timer-time.pipe';
import {DeleteDialogComponent} from './components/delete-dialog/delete-dialog.component';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';


@NgModule({
  declarations: [
    ErrorsContainerComponent,
    EmptyStringPipe,
    FindIngredientPipe,
    CalculateAmountPipe,
    TagRecipesHrefPipe,
    IngredientRecipesHrefPipe,
    RecipePreviewHrefPipe,
    RecipeEditHrefPipe,
    LoaderComponent,
    FindRecipePipe,
    AutocompletePipe,
    OzaSuccessPipe,
    OzaSupplyPipe,
    TimerTimePipe,
    DeleteDialogComponent
  ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule
  ],
  exports: [
    ErrorsContainerComponent,
    EmptyStringPipe,
    FindIngredientPipe,
    CalculateAmountPipe,
    TagRecipesHrefPipe,
    IngredientRecipesHrefPipe,
    RecipePreviewHrefPipe,
    RecipeEditHrefPipe,
    LoaderComponent,
    FindRecipePipe,
    AutocompletePipe,
    OzaSuccessPipe,
    OzaSupplyPipe,
    TimerTimePipe
  ]
})
export class SharedModule {
}

