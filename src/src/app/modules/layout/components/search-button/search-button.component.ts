import type { Signal } from '@angular/core';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

import { ModalService } from '@/app/core/services/modal.service';
import { SearchService } from '@/app/core/services/search.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon, MatFabButton],
  selector: 'layout-search-button',
  styleUrl: './search-button.component.scss',
  templateUrl: './search-button.component.html',
})
export class SearchButtonComponent {
  public filtered: Signal<boolean>;
  private modalService: ModalService = inject(ModalService);
  public constructor() {
    const searchService = inject(SearchService);

    this.filtered = searchService.getState();
  }

  public openModal(): void {
    this.modalService.openModal();
  }
}
