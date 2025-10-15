import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';

import { ImagesConfig } from '../../../../config/images.config';
import { ItemNames, MenuConfig, MenuItems, Names } from '../../../../config/menu.config';
import { UpperMenuItemComponent } from '../upper-menu-item/upper-menu-item.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatToolbar, UpperMenuItemComponent],
  selector: 'layout-header',
  standalone: true,
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  public logoPath: string;
  public menuItems: Map<string, MenuConfig>;
  public menuNames: Names;
  public constructor() {
    this.logoPath = ImagesConfig.logoPath;
    this.menuItems = MenuItems;
    this.menuNames = ItemNames;
  }
}
