import { Routes } from '@angular/router';

import { RoutingConfig } from '../../config/routing.config';
import { IndexComponent } from './pages/index/index.component';

export const routes: Routes = [
  {
    component: IndexComponent,
    path: RoutingConfig.home,
  },
];
