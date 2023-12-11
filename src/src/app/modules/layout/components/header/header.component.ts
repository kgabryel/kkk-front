import {ChangeDetectionStrategy, Component} from '@angular/core';
import {ImagesConfig} from '../../../../config/images.config';
import {ItemNames, MenuConfig, MenuItems, Names} from '../../../../config/menu.config';

@Component({
  selector: 'layout-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
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
