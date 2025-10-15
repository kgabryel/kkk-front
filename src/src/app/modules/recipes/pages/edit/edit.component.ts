import { ChangeDetectionStrategy, Component, OnInit, Signal } from '@angular/core';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { Recipe } from '../../../../core/models/recipe';
import { State } from '../../../../core/store/recipes/reducers';
import { selectById } from '../../../../core/store/recipes/selectors';
import { RouterUtils } from '../../../../core/utils/router.utils';
import { BaseComponent } from '../../../base.component';
import { DividerComponent } from '../../../layout/components/divider/divider.component';
import { EditComponent as EditFormComponent } from '../../components/edit/edit.component';
import { GalleryComponent } from '../../components/gallery/gallery.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatTabGroup, MatTab, EditFormComponent, GalleryComponent, DividerComponent],
  selector: 'recipes-pages-edit',
  standalone: true,
  styleUrls: ['./edit.component.scss'],
  templateUrl: './edit.component.html',
})
export class EditComponent extends BaseComponent implements OnInit {
  public recipe!: Signal<Recipe | undefined>;
  private route: ActivatedRoute;
  private readonly router: Router;
  private store: Store<State>;
  public constructor(route: ActivatedRoute, recipesStore: Store<State>, router: Router) {
    super();
    this.route = route;
    this.store = recipesStore;
    this.router = router;
  }

  public ngOnInit(): void {
    const recipeId = parseInt(this.route.snapshot.paramMap.get('id') ?? '') || 0;
    this.recipe = this.store.selectSignal(selectById(recipeId));
    RouterUtils.redirectIfMissing<Recipe>(this.injector, this.recipe, this.router);
  }
}
