import { ChangeDetectionStrategy, Component, input, InputSignal } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

import { MenuConfig } from '../../../../config/menu.config';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon, RouterLink, MatIconButton],
  selector: 'layout-bottom-menu-item',
  standalone: true,
  styleUrls: ['./bottom-menu-item.component.scss'],
  templateUrl: './bottom-menu-item.component.html',
})
export class BottomMenuItemComponent {
  public menuItem: InputSignal<MenuConfig> = input.required<MenuConfig>();
}
