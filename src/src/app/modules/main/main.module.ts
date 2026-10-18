import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NotFoundComponent} from './pages/not-found/not-found.component';
import {MainRoutingModule} from './main-routing.modules';
import {MainComponent} from './components/main/main.component';
import {LayoutModule} from '../layout/layout.module';
import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule} from '@angular/common/http';
import {TokenInterceptor} from '../../core/interceptors/token/token.interceptor';
import {AuthInterceptor} from '../../core/interceptors/auth/auth.interceptor';
import {TagsService} from '../../core/services/tags/tags.service';
import {TagsResolver} from '../../core/resolvers/tags.resolver';
import {NotificationService} from '../../core/services/notification/notification.service';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {IngredientsService} from '../../core/services/ingredients/ingredients.service';
import {IngredientsResolver} from '../../core/resolvers/ingredients.resolver';
import {SeasonsService} from '../../core/services/seasons/seasons.service';
import {SeasonsResolver} from '../../core/resolvers/seasons.resolver';
import {RecipesResolver} from '../../core/resolvers/recipes.resolver';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {RECIPES_KEY, recipesReducer} from '../../core/store/recipes/reducers';
import {RecipesEffects} from '../../core/store/recipes/effects';
import {TagsEffects} from '../../core/store/tags/effects';
import {TAGS_KEY, tagsReducer} from '../../core/store/tags/reducers';
import {SEASONS_KEY, seasonsReducer} from '../../core/store/seasons/reducers';
import {SeasonsEffects} from '../../core/store/seasons/effects';
import {INGREDIENTS_KEY, ingredientsReducer} from '../../core/store/ingredients/reducers';
import {SETTINGS_KEY, settingsReducer} from '../../core/store/settings/reducers';
import {IngredientsEffects} from '../../core/store/ingredients/effects';
import {ModalService} from '../../core/services/modal/modal.service';
import {MatDialogModule} from '@angular/material/dialog';
import {TagsSearchService} from '../../core/services/tags-search/tags-search.service';
import {IngredientsSearchService} from '../../core/services/ingredients-search/ingredients-search.service';
import {MatSelectModule} from '@angular/material/select';
import {SeasonsSearchService} from '../../core/services/seasons-search/seasons-search.service';
import {SearchService} from '../../core/services/search/search.service';
import {RecipesSearchService} from '../../core/services/recipes-search/recipes-search.service';
import {SettingsEffects} from '../../core/store/settings/effects';
import {UserService} from '../../core/services/user/user.service';
import {SettingsResolver} from '../../core/resolvers/settings.resolver';
import {RecipesService} from '../../core/services/recipes/recipes.service';
import {SuppliesResolver} from '../../core/resolvers/supplies.resolver';
import {SUPPLIES_KEY, suppliesReducer} from '../../core/store/oza-supplies/reducers';
import {OzaSuppliesEffects} from '../../core/store/oza-supplies/effects';
import {TIMERS_KEY, timersReducer} from '../../core/store/timers/reducers';
import {TimersEffects} from '../../core/store/timers/effects';
import {TimersService} from '../../core/services/timers/timers.service';
import {TimersResolver} from '../../core/resolvers/timers.resolver';
import {TimersModule} from '../timers/timers.module';
import {TimersListService} from '../../core/services/timers-list/timers-list.service';


@NgModule({
  declarations: [
    NotFoundComponent,
    MainComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    LayoutModule,
    HttpClientModule,
    MatSnackBarModule,
    StoreModule.forFeature(RECIPES_KEY, recipesReducer),
    EffectsModule.forFeature([RecipesEffects]),
    StoreModule.forFeature(TAGS_KEY, tagsReducer),
    EffectsModule.forFeature([TagsEffects]),
    StoreModule.forFeature(SEASONS_KEY, seasonsReducer),
    EffectsModule.forFeature([SeasonsEffects]),
    StoreModule.forFeature(INGREDIENTS_KEY, ingredientsReducer),
    EffectsModule.forFeature([IngredientsEffects]),
    StoreModule.forFeature(SETTINGS_KEY, settingsReducer),
    EffectsModule.forFeature([SettingsEffects]),
    StoreModule.forFeature(SUPPLIES_KEY, suppliesReducer),
    EffectsModule.forFeature([OzaSuppliesEffects]),
    StoreModule.forFeature(TIMERS_KEY, timersReducer),
    EffectsModule.forFeature([TimersEffects]),
    MatDialogModule,
    MatSelectModule,
    TimersModule
  ],
  providers: [
    TagsService,
    TagsResolver,
    HttpClient,
    NotificationService,
    IngredientsService,
    IngredientsResolver,
    SeasonsService,
    SeasonsResolver,
    RecipesResolver,
    SettingsResolver,
    SuppliesResolver,
    {provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    ModalService,
    TagsSearchService,
    IngredientsSearchService,
    SeasonsSearchService,
    SearchService,
    RecipesSearchService,
    UserService,
    RecipesService,
    TimersService,
    TimersResolver,
    TimersListService
  ]
})
export class MainModule {
}
