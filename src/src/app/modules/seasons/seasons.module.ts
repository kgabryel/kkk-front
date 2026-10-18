import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IndexComponent} from './pages/index/index.component';
import {CreateComponent} from './components/create/create.component';
import {SeasonsRoutingModule} from './seasons-routing.module';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatOptionModule} from '@angular/material/core';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {SeasonsListComponent} from './components/seasons-list/seasons-list.component';
import {MatListModule} from '@angular/material/list';
import {SeasonContainerComponent} from './components/season-container/season-container.component';
import {SeasonEditComponent} from './components/season-edit/season-edit.component';
import {SeasonPreviewComponent} from './components/season-preview/season-preview.component';
import {MatMenuModule} from '@angular/material/menu';
import {SearchComponent} from './components/search/search.component';
import {SharedModule} from '../shared/shared.module';
import {SeasonsFormFactory} from '../../core/factories/seasons.factory';
import {MatDialogModule} from '@angular/material/dialog';
import {NgxMatSelectSearchModule} from 'ngx-mat-select-search';


@NgModule({
  declarations: [
    IndexComponent,
    CreateComponent,
    SeasonsListComponent,
    SeasonContainerComponent,
    SeasonEditComponent,
    SeasonPreviewComponent,
    SearchComponent
  ],
  imports: [
    CommonModule,
    SeasonsRoutingModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatOptionModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatListModule,
    MatMenuModule,
    SharedModule,
    FormsModule,
    MatDialogModule,
    NgxMatSelectSearchModule
  ],
  providers: [
    SeasonsFormFactory
  ]
})
export class SeasonsModule {
}
