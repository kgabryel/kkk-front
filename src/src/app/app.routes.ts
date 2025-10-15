import { Routes } from '@angular/router';

import { RoutingConfig } from './config/routing.config';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';
import { ChangePasswordComponent } from './modules/auth/pages/change-password/change-password.component';
import { FbComponent } from './modules/auth/pages/fb/fb.component';
import { LoginComponent } from './modules/auth/pages/login/login.component';
import { RegisterComponent } from './modules/auth/pages/register/register.component';
import { ResetPasswordComponent } from './modules/auth/pages/reset-password/reset-password.component';
import { PublicRecipeComponent } from './modules/recipes/pages/public-recipe/public-recipe.component';

export const routes: Routes = [
  { canActivate: [guestGuard], component: LoginComponent, path: RoutingConfig.login },
  { canActivate: [guestGuard], component: RegisterComponent, path: RoutingConfig.registration },
  {
    canActivate: [guestGuard],
    component: ChangePasswordComponent,
    path: RoutingConfig.changePassword,
  },
  {
    canActivate: [guestGuard],
    component: ResetPasswordComponent,
    path: RoutingConfig.resetPassword,
  },
  { canActivate: [guestGuard], component: FbComponent, path: RoutingConfig.fb },
  { component: PublicRecipeComponent, path: RoutingConfig.publicRecipe },
  {
    canActivate: [authGuard],
    loadChildren: () =>
      import('./modules/main/main.routes').then((m: { routes: Routes }) => m.routes),
    path: RoutingConfig.home,
  },
];
