import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {MenuConfig} from '../../../../config/menu.config';

@Component({
  selector: 'recipes-navigation-item',
  templateUrl: './navigation-item.component.html',
  styleUrls: ['./navigation-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavigationItemComponent {
  @Input() public menuItem: MenuConfig | undefined;
  @Input() public disabled: boolean = false;
}
