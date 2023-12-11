import {NgModule} from '@angular/core';

import {RouterModule, Routes} from '@angular/router';
import {RoutingConfig} from '../../config/routing.config';
import {IndexComponent} from './pages/index/index.component';
import {ApiKeysResolver} from '../../core/resolvers/api-keys.resolver';

const routes: Routes = [
  {
    path: RoutingConfig.home,
    component: IndexComponent,
    resolve: {
      apiKeys: ApiKeysResolver
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountRoutingModule {
}
