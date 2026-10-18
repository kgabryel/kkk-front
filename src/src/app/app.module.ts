import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AuthModule} from './modules/auth/auth.module';
import {AuthGuard} from './core/guards/auth/auth.guard';
import {GuestGuard} from './core/guards/guest/guest.guard';
import {AuthService} from './core/services/auth/auth.service';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {StoreModule} from '@ngrx/store';
import {EffectsModule} from '@ngrx/effects';
import {environment} from '../environments/environment';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {ServiceWorkerModule} from '@angular/service-worker';
import {SharedModule} from './modules/shared/shared.module';
import {StoreService} from './core/services/store/store.service';
import {MatTooltipModule} from '@angular/material/tooltip';
import {ToastrModule, ToastrService} from 'ngx-toastr';
import {RecipesService} from './core/services/recipes/recipes.service';
import {PhotoService} from './core/services/photo/photo.service';

let imports = [
  BrowserModule,
  AppRoutingModule,
  BrowserAnimationsModule,
  AuthModule,
  HttpClientModule,
  StoreModule.forRoot({}),
  EffectsModule.forRoot([]),
  ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production}),
  ToastrModule.forRoot()
];
if (!environment.production) {
  imports.push(StoreDevtoolsModule.instrument({
    logOnly: environment.production
  }));
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    imports,
    SharedModule,
    MatTooltipModule
  ],
  providers: [
    HttpClient,
    AuthGuard,
    GuestGuard,
    AuthService,
    StoreService,
    ToastrService,
    RecipesService,
    PhotoService
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
