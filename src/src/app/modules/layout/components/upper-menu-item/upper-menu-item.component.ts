import type { InputSignal } from '@angular/core';

import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

import type { MenuConfig } from '@/app/config/menu.config';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, MatIcon, MatButton],
  selector: 'layout-upper-menu-item',
  styleUrl: './upper-menu-item.component.scss',
  templateUrl: './upper-menu-item.component.html',
})
export class UpperMenuItemComponent {
  public menuItem: InputSignal<MenuConfig> = input.required<MenuConfig>();
}
