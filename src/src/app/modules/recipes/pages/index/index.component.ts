import {ChangeDetectionStrategy, Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subscription} from 'rxjs';
import {Recipe} from '../../../../core/models/recipe';
import {Store} from '@ngrx/store';
import {State} from '../../../../core/store/recipes/reducers';
import {searchRecipes} from '../../../../core/store/recipes/selectors';
import {MatDialog} from '@angular/material/dialog';
import {ModalService} from '../../../../core/services/modal/modal.service';
import {SearchComponent} from '../../components/search/search.component';
import {filter, switchMap} from 'rxjs/operators';
import {RecipesSearchService} from '../../../../core/services/recipes-search/recipes-search.service';

@Component({
  selector: 'recipes-pages-index',
  templateUrl: './index.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IndexComponent implements OnInit, OnDestroy {

  public recipes$: Observable<Recipe[]>;
  private dialog: MatDialog;
  private modal: Observable<boolean>;
  private subscription: Subscription;
  private store: Store<State>;
  private recipesSearchService: RecipesSearchService;

  public constructor(
    store: Store<State>,
    dialog: MatDialog,
    modalService: ModalService,
    recipesSearchService: RecipesSearchService
  ) {
    this.store = store;
    this.recipesSearchService = recipesSearchService;
    this.dialog = dialog;
    this.modal = modalService.getState();
  }

  public ngOnInit(): void {
    this.recipes$ = this.recipesSearchService.getState().pipe(
      switchMap(search => this.store.select(searchRecipes(search)))
    );
    this.subscription = this.modal.pipe(filter(data => data))
      .subscribe(() => this.dialog.open(SearchComponent));
    this.dialog.closeAll();
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
