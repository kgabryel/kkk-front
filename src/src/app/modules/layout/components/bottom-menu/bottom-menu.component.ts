import type { OnInit } from '@angular/core';
import type { Event } from '@angular/router';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

import type { MenuConfig, Names } from '@/app/config/menu.config';

import { ItemNames, MenuItems } from '@/app/config/menu.config';
import { SearchService } from '@/app/core/services/search.service';
import { BaseComponent } from '@/app/modules/base.component';
import { BottomMenuItemComponent } from '@/app/modules/layout/components/bottom-menu-item/bottom-menu-item.component';
import { SearchButtonComponent } from '@/app/modules/layout/components/search-button/search-button.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SearchButtonComponent, MatToolbar, BottomMenuItemComponent],
  selector: 'layout-bottom-menu',
  styleUrl: './bottom-menu.component.scss',
  templateUrl: './bottom-menu.component.html',
})
export class BottomMenuComponent extends BaseComponent implements OnInit {
  public menuItems: Map<string, MenuConfig> = MenuItems;
  public menuNames: Names = ItemNames;
  public searchAvailable!: boolean;
  private router: Router = inject(Router);
  private searchService: SearchService = inject(SearchService);

  public ngOnInit(): void {
    this.searchService.updateSearch(false);
    this.searchAvailable = SearchService.searchIsActive(this.router.routerState.snapshot.url);
    this.onObservableValue(
      (redirect: NavigationEnd | undefined) => {
        if (!redirect) {
          return;
        }
        this.searchService.updateSearch(false);
        this.searchAvailable = SearchService.searchIsActive(redirect.url);
      },
      this.router.events.pipe(filter((evt: Event): evt is NavigationEnd => evt instanceof NavigationEnd)),
      undefined,
    );
  }
}
