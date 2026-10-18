import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IndexComponent} from './pages/index/index.component';
import {TagsRoutingModule} from './tags-routing.module';
import {CreateComponent} from './components/create/create.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../shared/shared.module';
import {TagsListComponent} from './components/tags-list/tags-list.component';
import {TagEditComponent} from './components/tag-edit/tag-edit.component';
import {TagPreviewComponent} from './components/tag-preview/tag-preview.component';
import {TagContainerComponent} from './components/tag-container/tag-container.component';
import {MatListModule} from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatChipsModule} from '@angular/material/chips';
import {RecipesComponent} from './pages/recipes/recipes.component';
import {RecipesModule} from '../recipes/recipes.module';
import {TagFormFactory} from '../../core/factories/tag.factory';
import {SearchComponent} from './components/search/search.component';
import {MatDialogModule} from '@angular/material/dialog';


@NgModule({
  declarations: [
    IndexComponent,
    CreateComponent,
    TagsListComponent,
    TagEditComponent,
    TagPreviewComponent,
    TagContainerComponent,
    RecipesComponent,
    SearchComponent
  ],
  imports: [
    CommonModule,
    TagsRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    SharedModule,
    MatListModule,
    MatMenuModule,
    MatChipsModule,
    RecipesModule,
    FormsModule,
    MatDialogModule
  ],
  providers: [
    TagFormFactory
  ]
})
export class TagsModule {
}
