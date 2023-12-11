import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {ItemNames, MenuConfig, MenuItems, Names} from '../../../../config/menu.config';
import {SearchService} from '../../../../core/services/search/search.service';
import {NavigationEnd, Router} from '@angular/router';
import {Subscription} from 'rxjs';

@Component({
  selector: 'layout-bottom-menu',
  templateUrl: './bottom-menu.component.html',
  styleUrls: ['./bottom-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class BottomMenuComponent implements OnInit, OnDestroy {

  public menuItems: Map<string, MenuConfig>;
  public menuNames: Names;
  public searchAvailable: boolean;
  private router: Router;
  private subscription: Subscription;
  private searchService: SearchService;

  public constructor(router: Router, searchService: SearchService) {
    this.menuItems = MenuItems;
    this.menuNames = ItemNames;
    this.router = router;
    this.searchService = searchService;
  }

  public ngOnInit(): void {
    this.searchService.updateSearch(false);
    this.searchAvailable = SearchService.searchIsActive(this.router.routerState.snapshot.url);
    this.subscription = this.router.events.subscribe(redirect => {
      if (redirect instanceof NavigationEnd) {
        this.searchService.updateSearch(false);
        this.searchAvailable = SearchService.searchIsActive(redirect.url);
      }
    });
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
