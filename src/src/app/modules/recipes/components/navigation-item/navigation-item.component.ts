import type { InputSignal } from '@angular/core';

import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';

import type { MenuConfig } from '@/app/config/menu.config';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, MatButton, MatIcon, MatTooltip, MatIconButton],
  selector: 'recipes-navigation-item',
  styleUrl: './navigation-item.component.scss',
  templateUrl: './navigation-item.component.html',
})
export class NavigationItemComponent {
  public menuItem: InputSignal<MenuConfig> = input.required<MenuConfig>();
  public disabled: InputSignal<boolean> = input<boolean>(false);
}
