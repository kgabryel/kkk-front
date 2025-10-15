import { ChangeDetectionStrategy, Component, OnInit, Signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';

import { Recipe } from '../../../../core/models/recipe';
import { ModalService } from '../../../../core/services/modal.service';
import { RecipesSearchService, Search } from '../../../../core/services/recipes-search.service';
import { State } from '../../../../core/store/recipes/reducers';
import { searchRecipes } from '../../../../core/store/recipes/selectors';
import { SearchUtils } from '../../../../core/utils/search.utils';
import { BaseComponent } from '../../../base.component';
import { RecipesListComponent } from '../../components/recipes-list/recipes-list.component';
import { SearchComponent } from '../../components/search/search.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RecipesListComponent],
  selector: 'recipes-pages-index',
  standalone: true,
  styleUrls: [],
  templateUrl: './index.component.html',
})
export class IndexComponent extends BaseComponent implements OnInit {
  public recipes!: Signal<Recipe[]>;
  private dialog: MatDialog;
  private readonly modal: Signal<boolean>;
  private readonly recipesSearchService: RecipesSearchService;
  private readonly store: Store<State>;
  private modalService: ModalService;
  public constructor(
    store: Store<State>,
    dialog: MatDialog,
    modalService: ModalService,
    recipesSearchService: RecipesSearchService,
  ) {
    super();
    this.store = store;
    this.recipesSearchService = recipesSearchService;
    this.dialog = dialog;
    this.modal = modalService.getState();
    this.modalService = modalService;
  }

  public ngOnInit(): void {
    this.recipes = SearchUtils.search<Search, Recipe, State>(
      this.recipesSearchService,
      this.store,
      (search: Search) => searchRecipes(search),
    );
    this.onSignalValue((data: boolean) => {
      if (data) {
        this.dialog.open(SearchComponent);
        this.modalService.reset();
      }
    }, this.modal);

    this.dialog.closeAll();
  }
}
