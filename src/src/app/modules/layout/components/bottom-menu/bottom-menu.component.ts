import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatToolbar } from '@angular/material/toolbar';
import { Event, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

import { ItemNames, MenuConfig, MenuItems, Names } from '../../../../config/menu.config';
import { SearchService } from '../../../../core/services/search.service';
import { BaseComponent } from '../../../base.component';
import { BottomMenuItemComponent } from '../bottom-menu-item/bottom-menu-item.component';
import { SearchButtonComponent } from '../search-button/search-button.component';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  imports: [SearchButtonComponent, MatToolbar, BottomMenuItemComponent],
  selector: 'layout-bottom-menu',
  standalone: true,
  styleUrls: ['./bottom-menu.component.scss'],
  templateUrl: './bottom-menu.component.html',
})
export class BottomMenuComponent extends BaseComponent implements OnInit {
  public menuItems: Map<string, MenuConfig>;
  public menuNames: Names;
  public searchAvailable!: boolean;
  private router: Router;
  private searchService: SearchService;
  public constructor(router: Router, searchService: SearchService) {
    super();
    this.menuItems = MenuItems;
    this.menuNames = ItemNames;
    this.router = router;
    this.searchService = searchService;
  }

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
      this.router.events.pipe(
        filter((evt: Event): evt is NavigationEnd => evt instanceof NavigationEnd),
      ),
      undefined,
    );
  }
}
