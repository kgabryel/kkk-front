import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {Observable, Subscription} from 'rxjs';
import {ModalService} from '../../../../core/services/modal/modal.service';
import {SearchComponent} from '../../components/search/search.component';
import {filter} from 'rxjs/operators';

@Component({
  selector: 'ingredients-pages-index',
  templateUrl: './index.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IndexComponent implements OnInit, OnDestroy {

  private dialog: MatDialog;
  private modal: Observable<boolean>;
  private subscription: Subscription;

  public constructor(dialog: MatDialog, modalService: ModalService) {
    this.dialog = dialog;
    this.modal = modalService.getState();
  }

  public ngOnInit(): void {
    this.subscription = this.modal.pipe(filter(data => data))
      .subscribe(() => this.dialog.open(SearchComponent));
    this.dialog.closeAll();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
