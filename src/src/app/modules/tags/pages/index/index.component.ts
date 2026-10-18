import { ChangeDetectionStrategy, Component, OnInit, Signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ModalService } from '../../../../core/services/modal.service';
import { BaseComponent } from '../../../base.component';
import { DividerComponent } from '../../../layout/components/divider/divider.component';
import { CreateComponent } from '../../components/create/create.component';
import { SearchComponent } from '../../components/search/search.component';
import { TagsListComponent } from '../../components/tags-list/tags-list.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CreateComponent, TagsListComponent, DividerComponent],
  selector: 'tags-pages-index',
  standalone: true,
  styleUrls: [],
  templateUrl: './index.component.html',
})
export class IndexComponent extends BaseComponent implements OnInit {
  private dialog: MatDialog;
  private readonly modal: Signal<boolean>;
  private modalService: ModalService;
  public constructor(dialog: MatDialog, modalService: ModalService) {
    super();
    this.dialog = dialog;
    this.modal = modalService.getState();
    this.modalService = modalService;
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
