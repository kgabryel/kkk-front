import type { OnInit, Signal } from '@angular/core';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ModalService } from '@/app/core/services/modal.service';
import { BaseComponent } from '@/app/modules/base.component';
import { CreateComponent } from '@/app/modules/ingredients/components/create/create.component';
import { IngredientsListComponent } from '@/app/modules/ingredients/components/ingredients-list/ingredients-list.component';
import { SearchComponent } from '@/app/modules/ingredients/components/search/search.component';
import { DividerComponent } from '@/app/modules/layout/components/divider/divider.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CreateComponent, IngredientsListComponent, DividerComponent],
  selector: 'ingredients-pages-index',
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
