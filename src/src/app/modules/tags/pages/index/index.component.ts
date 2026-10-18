import type { OnInit, Signal } from '@angular/core';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ModalService } from '@/app/core/services/modal.service';
import { BaseComponent } from '@/app/modules/base.component';
import { DividerComponent } from '@/app/modules/layout/components/divider/divider.component';
import { CreateComponent } from '@/app/modules/tags/components/create/create.component';
import { SearchComponent } from '@/app/modules/tags/components/search/search.component';
import { TagsListComponent } from '@/app/modules/tags/components/tags-list/tags-list.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CreateComponent, TagsListComponent, DividerComponent],
  selector: 'tags-pages-index',
  templateUrl: './index.component.html',
})
export class IndexComponent extends BaseComponent implements OnInit {
  private dialog: MatDialog = inject(MatDialog);
  private readonly modal: Signal<boolean>;
  private modalService: ModalService = inject(ModalService);
  public constructor() {
    super();
    this.modal = this.modalService.getState();
  }

  public ngOnInit(): void {
    this.onSignalValue((data: boolean) => {
      if (data) {
        this.dialog.open(SearchComponent);
        this.modalService.reset();
      }
    }, this.modal);
    this.dialog.closeAll();
  }
}
