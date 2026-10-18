import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RoutingConfig} from './config/routing.config';
import {RegisterComponent} from './modules/auth/pages/register/register.component';
import {LoginComponent} from './modules/auth/pages/login/login.component';
import {GuestGuard} from './core/guards/guest/guest.guard';
import {AuthGuard} from './core/guards/auth/auth.guard';
import {FbComponent} from './modules/auth/pages/fb/fb.component';
import {PublicRecipeComponent} from './modules/recipes/pages/public-recipe/public-recipe.component';
import {ChangePasswordComponent} from './modules/auth/pages/change-password/change-password.component';
import {ResetPasswordComponent} from './modules/auth/pages/reset-password/reset-password.component';

const routes: Routes = [
  {path: RoutingConfig.login, component: LoginComponent, canActivate: [GuestGuard]},
  {path: RoutingConfig.registration, component: RegisterComponent, canActivate: [GuestGuard]},
  {path: RoutingConfig.changePassword, component: ChangePasswordComponent, canActivate: [GuestGuard]},
  {path: RoutingConfig.resetPassword, component: ResetPasswordComponent, canActivate: [GuestGuard]},
  {path: RoutingConfig.fb, component: FbComponent, canActivate: [GuestGuard]},
  {path: RoutingConfig.publicRecipe, component: PublicRecipeComponent},
  {
    path: RoutingConfig.home,
    loadChildren: () => import('./modules/main/main.module').then(m => m.MainModule),
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
