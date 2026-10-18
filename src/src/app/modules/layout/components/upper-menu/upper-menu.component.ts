import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {ImagesConfig} from '../../../../config/images.config';
import {ItemNames, MenuConfig, MenuItems, Names} from '../../../../config/menu.config';
import {ModalService} from '../../../../core/services/modal/modal.service';
import {NavigationEnd, Router} from '@angular/router';
import {Observable, Subscription} from 'rxjs';
import {SearchService} from '../../../../core/services/search/search.service';

@Component({
  selector: 'layout-upper-menu',
  templateUrl: './upper-menu.component.html',
  styleUrls: ['./upper-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class UpperMenuComponent implements OnInit, OnDestroy {
  public logoPath: string;
  public menuItems: Map<string, MenuConfig>;
  public menuNames: Names;
  public filtered: Observable<boolean>;
  public searchAvailable: boolean;
  private modalService: ModalService;
  private router: Router;
  private subscription: Subscription;
  private searchService: SearchService;

  public constructor(modalService: ModalService, router: Router, searchService: SearchService) {
    this.modalService = modalService;
    this.logoPath = ImagesConfig.logoPath;
    this.menuItems = MenuItems;
    this.menuNames = ItemNames;
    this.router = router;
    this.filtered = searchService.getState();
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

  public openModal(): void {
    this.modalService.openModal();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
