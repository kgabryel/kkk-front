import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';

import type { MenuConfig, Names } from '@/app/config/menu.config';

import { ImagesConfig } from '@/app/config/images.config';
import { ItemNames, MenuItems } from '@/app/config/menu.config';
import { UpperMenuItemComponent } from '@/app/modules/layout/components/upper-menu-item/upper-menu-item.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatToolbar, UpperMenuItemComponent],
  selector: 'layout-header',
  styleUrl: './header.component.scss',
  templateUrl: './header.component.html',
})
export class HeaderComponent {
  public logoPath: string = ImagesConfig.logoPath;
  public menuItems: Map<string, MenuConfig> = MenuItems;
  public menuNames: Names = ItemNames;
}
