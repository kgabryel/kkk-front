import { Routes } from '@angular/router';
import { provideEffects } from '@ngrx/effects';
import { provideState } from '@ngrx/store';

import { RoutingConfig } from '../../config/routing.config';
import { apiKeysResolver } from '../../core/resolvers/api-keys.resolver';
import { ApiKeysEffects } from '../../core/store/api-keys/effects';
import { API_KEYS_KEY, apiKeysReducer } from '../../core/store/api-keys/reducers';
import { IndexComponent } from './pages/index/index.component';

export const routes: Routes = [
  {
    component: IndexComponent,
    path: RoutingConfig.home,
    providers: [provideState(API_KEYS_KEY, apiKeysReducer), provideEffects(ApiKeysEffects)],
    resolve: {
      apiKeys: apiKeysResolver,
    },
  },
];
