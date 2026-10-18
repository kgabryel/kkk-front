import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IndexComponent} from './pages/index/index.component';
import {CreateComponent} from './components/create/create.component';
import {RecipesRoutingModule} from './recipes-routing.module';
import {NavigationComponent} from './components/navigation/navigation.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {FavouritesComponent} from './pages/favourites/favourites.component';
import {ToDoComponent} from './pages/to-do/to-do.component';
import {CreateComponent as CreatePageComponent} from './pages/create/create.component';
import {MainComponent} from './components/main/main.component';
import {NavigationItemComponent} from './components/navigation-item/navigation-item.component';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {RecipePreviewComponent} from './components/recipe-preview/recipe-preview.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {AngularEditorModule} from '@kolkov/angular-editor';
import {PositionsPartComponent} from './components/positions-part/positions-part.component';
import {MatStepperModule} from '@angular/material/stepper';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {RecipesListComponent} from './components/recipes-list/recipes-list.component';
import {NgxMasonryModule} from 'ngx-masonry';
import {MatExpansionModule} from '@angular/material/expansion';
import {SharedModule} from '../shared/shared.module';
import {MatChipsModule} from '@angular/material/chips';
import {TagsSelectComponent} from './components/tags-select/tags-select.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {GroupPositionsPartComponent} from './components/group-positions-part/group-positions-part.component';
import {MatListModule} from '@angular/material/list';
import {RecipeComponent} from './pages/recipe/recipe.component';
import {SearchComponent} from './components/search/search.component';
import {RecipeFormFactory} from '../../core/factories/recipe.factory';
import {EditComponent as EditPageComponent} from './pages/edit/edit.component';
import {EditComponent} from './components/edit/edit.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import {NgxMatSelectSearchModule} from 'ngx-mat-select-search';
import {FormComponent} from './components/form/form.component';
import {SwiperModule} from 'swiper/angular';
import SwiperCore, {Navigation, Pagination} from 'swiper';
import {MatTabsModule} from '@angular/material/tabs';
import {DragDropModule} from '@angular/cdk/drag-drop';
import {NgxMatFileInputModule} from '@angular-material-components/file-input';
import {PublicRecipeComponent} from './pages/public-recipe/public-recipe.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import {FullRecipeComponent} from './components/full-recipe/full-recipe.component';
import {IngredientPositionComponent} from './components/ingredient-position/ingredient-position.component';
import {RecipePositionComponent} from './components/recipe-position/recipe-position.component';
import {RecipeDialogComponent} from './components/recipe-dialog/recipe-dialog.component';
import {TimersModule} from '../timers/timers.module';
import {TimerComponent} from './components/timer/timer.component';
import {MatCarouselModule} from '@ngmodule/material-carousel';
import {ImageCropperModule} from 'ngx-image-cropper';
import {GalleryComponent} from './components/gallery/gallery.component';
import {AddPhotoDialogComponent} from './components/add-photo/add-photo-dialog.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatCardModule} from '@angular/material/card';
import {FullPhotoComponent} from './components/full-photo/full-photo.component';

SwiperCore.use([Pagination, Navigation]);

@NgModule({
  declarations: [
    IndexComponent,
    CreateComponent,
    NavigationComponent,
    FavouritesComponent,
    ToDoComponent,
    CreatePageComponent,
    MainComponent,
    NavigationItemComponent,
    RecipePreviewComponent,
    PositionsPartComponent,
    RecipesListComponent,
    TagsSelectComponent,
    GroupPositionsPartComponent,
    RecipeComponent,
    SearchComponent,
    EditComponent,
    EditPageComponent,
    FormComponent,
    PublicRecipeComponent,
    FullRecipeComponent,
    IngredientPositionComponent,
    RecipePositionComponent,
    RecipeDialogComponent,
    TimerComponent,
    GalleryComponent,
    AddPhotoDialogComponent,
    FullPhotoComponent
  ],
  exports: [
    RecipesListComponent
  ],
  imports: [
    CommonModule,
    RecipesRoutingModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    AngularEditorModule,
    MatStepperModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    NgxMasonryModule,
    MatExpansionModule,
    SharedModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatListModule,
    MatDialogModule,
    FormsModule,
    MatSelectModule,
    NgxMatSelectSearchModule,
    SwiperModule,
    MatTabsModule,
    DragDropModule,
    NgxMatFileInputModule,
    MatTooltipModule,
    TimersModule,
    MatCarouselModule,
    ImageCropperModule,
    MatProgressBarModule,
    MatCardModule
  ],
  providers: [
    RecipeFormFactory
  ]
})
export class RecipesModule {
}
