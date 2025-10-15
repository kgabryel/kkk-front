import { ChangeDetectionStrategy, Component, input, InputSignal } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';

import { MenuConfig } from '../../../../config/menu.config';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, MatButton, MatIcon, MatTooltip, MatIconButton],
  selector: 'recipes-navigation-item',
  standalone: true,
  styleUrls: ['./navigation-item.component.scss'],
  templateUrl: './navigation-item.component.html',
})
export class NavigationItemComponent {
  public menuItem: InputSignal<MenuConfig> = input.required<MenuConfig>();
  public disabled: InputSignal<boolean> = input<boolean>(false);
}
