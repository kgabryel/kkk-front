import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, Signal } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { Event, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

import { ImagesConfig } from '../../../../config/images.config';
import { ItemNames, MenuConfig, MenuItems, Names } from '../../../../config/menu.config';
import { ModalService } from '../../../../core/services/modal.service';
import { SearchService } from '../../../../core/services/search.service';
import { BaseComponent } from '../../../base.component';
import { UpperMenuItemComponent } from '../upper-menu-item/upper-menu-item.component';

@Component({
  changeDetection: ChangeDetectionStrategy.Default,
  imports: [MatToolbar, UpperMenuItemComponent, NgClass, MatButton, MatIcon],
  selector: 'layout-upper-menu',
  standalone: true,
  styleUrls: ['./upper-menu.component.scss'],
  templateUrl: './upper-menu.component.html',
})
export class UpperMenuComponent extends BaseComponent implements OnInit {
  public filtered: Signal<boolean>;
  public logoPath: string;
  public menuItems: Map<string, MenuConfig>;
  public menuNames: Names;
  public searchAvailable!: boolean;
  private modalService: ModalService;
  private router: Router;
  private searchService: SearchService;
  public constructor(modalService: ModalService, router: Router, searchService: SearchService) {
    super();
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
    this.onObservableValue<NavigationEnd | undefined>(
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

  public openModal(): void {
    this.modalService.openModal();
  }
}
