import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HeaderComponent} from './components/header/header.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {BottomMenuComponent} from './components/bottom-menu/bottom-menu.component';
import {UpperMenuComponent} from './components/upper-menu/upper-menu.component';
import {SearchButtonComponent} from './components/search-button/search-button.component';
import {UpperMenuItemComponent} from './components/upper-menu-item/upper-menu-item.component';
import {BottomMenuItemComponent} from './components/bottom-menu-item/bottom-menu-item.component';
import {RouterModule} from '@angular/router';


@NgModule({
  declarations: [
    HeaderComponent,
    BottomMenuComponent,
    UpperMenuComponent,
    SearchButtonComponent,
    UpperMenuItemComponent,
    BottomMenuItemComponent
  ],
  exports: [
    HeaderComponent,
    BottomMenuComponent,
    UpperMenuComponent
  ],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    RouterModule
  ]
})
export class LayoutModule {
}
