import { Injectable, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import type { State as KeysState } from '@/app/core/store/api-keys/reducers';
import type { State as IngredientsState } from '@/app/core/store/ingredients/reducers';
import type { State as SuppliesState } from '@/app/core/store/oza-supplies/reducers';
import type { State as RecipesState } from '@/app/core/store/recipes/reducers';
import type { State as SeasonsState } from '@/app/core/store/seasons/reducers';
import type { State as SettingsState } from '@/app/core/store/settings/reducers';
import type { State as TagsState } from '@/app/core/store/tags/reducers';

import { keysReset } from '@/app/core/store/api-keys/actions';
import { ingredientsReset } from '@/app/core/store/ingredients/actions';
import { suppliesReset } from '@/app/core/store/oza-supplies/actions';
import { recipesReset } from '@/app/core/store/recipes/actions';
import { seasonsReset } from '@/app/core/store/seasons/actions';
import { settingsReset } from '@/app/core/store/settings/actions';
import { tagsReset } from '@/app/core/store/tags/actions';

@Injectable({ providedIn: 'root' })
export class StoreService {
  private readonly ingredientStore: Store<IngredientsState> = inject<Store<IngredientsState>>(Store);
  private readonly keysStore: Store<KeysState> = inject<Store<KeysState>>(Store);
  private readonly recipesStore: Store<RecipesState> = inject<Store<RecipesState>>(Store);
  private readonly seasonsStore: Store<SeasonsState> = inject<Store<SeasonsState>>(Store);
  private readonly settingsStore: Store<SettingsState> = inject<Store<SettingsState>>(Store);
  private readonly suppliesStore: Store<SuppliesState> = inject<Store<SuppliesState>>(Store);
  private readonly tagsStore: Store<TagsState> = inject<Store<TagsState>>(Store);

  public clearStores(): void {
    this.ingredientStore.dispatch(ingredientsReset());
    this.recipesStore.dispatch(recipesReset());
    this.seasonsStore.dispatch(seasonsReset());
    this.tagsStore.dispatch(tagsReset());
    this.settingsStore.dispatch(settingsReset());
    this.keysStore.dispatch(keysReset());
    this.suppliesStore.dispatch(suppliesReset());
  }
}
