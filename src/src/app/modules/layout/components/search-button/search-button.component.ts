import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, Signal } from '@angular/core';
import { MatFabButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

import { ModalService } from '../../../../core/services/modal.service';
import { SearchService } from '../../../../core/services/search.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatIcon, NgClass, MatFabButton],
  selector: 'layout-search-button',
  standalone: true,
  styleUrls: ['./search-button.component.scss'],
  templateUrl: './search-button.component.html',
})
export class SearchButtonComponent {
  public filtered: Signal<boolean>;
  private modalService: ModalService;
  public constructor(modalService: ModalService, searchService: SearchService) {
    this.modalService = modalService;
    this.filtered = searchService.getState();
  }

  public openModal(): void {
    this.modalService.openModal();
  }
}
