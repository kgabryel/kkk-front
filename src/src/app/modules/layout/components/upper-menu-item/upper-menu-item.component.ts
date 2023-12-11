import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {MenuConfig} from '../../../../config/menu.config';

@Component({
  selector: 'layout-upper-menu-item',
  templateUrl: './upper-menu-item.component.html',
  styleUrls: ['./upper-menu-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UpperMenuItemComponent {

  @Input() public menuItem: MenuConfig | undefined;
}
