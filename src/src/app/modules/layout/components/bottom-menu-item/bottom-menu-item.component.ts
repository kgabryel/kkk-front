import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {MenuConfig} from '../../../../config/menu.config';

@Component({
  selector: 'layout-bottom-menu-item',
  templateUrl: './bottom-menu-item.component.html',
  styleUrls: ['./bottom-menu-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BottomMenuItemComponent {

  @Input() public menuItem: MenuConfig | undefined;
}
