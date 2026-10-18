import type { OnInit, Signal } from '@angular/core';
import type { Event } from '@angular/router';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatToolbar } from '@angular/material/toolbar';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

import type { MenuConfig, Names } from '@/app/config/menu.config';

import { ImagesConfig } from '@/app/config/images.config';
import { ItemNames, MenuItems } from '@/app/config/menu.config';
import { ModalService } from '@/app/core/services/modal.service';
import { SearchService } from '@/app/core/services/search.service';
import { BaseComponent } from '@/app/modules/base.component';
import { UpperMenuItemComponent } from '@/app/modules/layout/components/upper-menu-item/upper-menu-item.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatToolbar, UpperMenuItemComponent, MatButton, MatIcon],
  selector: 'layout-upper-menu',
  styleUrl: './upper-menu.component.scss',
  templateUrl: './upper-menu.component.html',
})
export class UpperMenuComponent extends BaseComponent implements OnInit {
  public filtered: Signal<boolean>;
  public logoPath: string = ImagesConfig.logoPath;
  public menuItems: Map<string, MenuConfig> = MenuItems;
  public menuNames: Names = ItemNames;
  public searchAvailable!: boolean;
  private modalService: ModalService = inject(ModalService);
  private router: Router = inject(Router);
  private searchService: SearchService = inject(SearchService);
  public constructor() {
    super();
    this.filtered = this.searchService.getState();
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
      this.router.events.pipe(filter((evt: Event): evt is NavigationEnd => evt instanceof NavigationEnd)),
      undefined,
    );
  }

  public openModal(): void {
    this.modalService.openModal();
  }
}
