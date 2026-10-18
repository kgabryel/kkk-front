import type { OnInit, Signal } from '@angular/core';

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';

import type { Recipe } from '@/app/core/models/recipe';
import type { Search } from '@/app/core/services/recipes-search.service';
import type { State } from '@/app/core/store/recipes/reducers';

import { ModalService } from '@/app/core/services/modal.service';
import { RecipesSearchService } from '@/app/core/services/recipes-search.service';
import { searchRecipes } from '@/app/core/store/recipes/selectors';
import { SearchUtils } from '@/app/core/utils/search.utils';
import { BaseComponent } from '@/app/modules/base.component';
import { RecipesListComponent } from '@/app/modules/recipes/components/recipes-list/recipes-list.component';
import { SearchComponent } from '@/app/modules/recipes/components/search/search.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RecipesListComponent],
  selector: 'recipes-pages-index',
  templateUrl: './index.component.html',
})
export class IndexComponent extends BaseComponent implements OnInit {
  public recipes!: Signal<Recipe[]>;
  private dialog: MatDialog = inject(MatDialog);
  private readonly modal: Signal<boolean>;
  private readonly recipesSearchService: RecipesSearchService = inject(RecipesSearchService);
  private readonly store: Store<State> = inject<Store<State>>(Store);
  private modalService: ModalService = inject(ModalService);
  public constructor() {
    super();
    this.modal = this.modalService.getState();
  }

  public ngOnInit(): void {
    this.recipes = SearchUtils.search<Search, Recipe, State>(this.recipesSearchService, this.store, (search: Search) =>
      searchRecipes(search),
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
