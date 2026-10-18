import {Injectable} from '@angular/core';
import {Store} from '@ngrx/store';
import {State as IngredientsState} from '../../store/ingredients/reducers';
import {State as RecipesState} from '../../store/recipes/reducers';
import {State as SeasonsState} from '../../store/seasons/reducers';
import {State as TagsState} from '../../store/tags/reducers';
import {State as SettingsState} from '../../store/settings/reducers';
import {State as KeysState} from '../../store/api-keys/reducers';
import {State as SuppliesState} from '../../store/oza-supplies/reducers';
import {tagsReset} from '../../store/tags/actions';
import {ingredientsReset} from '../../store/ingredients/actions';
import {recipesReset} from '../../store/recipes/actions';
import {seasonsReset} from '../../store/seasons/actions';
import {settingsReset} from '../../store/settings/actions';
import {keysReset} from '../../store/api-keys/actions';
import {suppliesReset} from '../../store/oza-supplies/actions';

@Injectable()
export class StoreService {
  private readonly ingredientStore: Store<IngredientsState>;
  private readonly recipesStore: Store<RecipesState>;
  private readonly seasonsStore: Store<SeasonsState>;
  private readonly tagsStore: Store<TagsState>;
  private readonly settingsStore: Store<SettingsState>;
  private readonly keysStore: Store<KeysState>;
  private readonly suppliesStore: Store<SuppliesState>;

  constructor(
    ingredientStore: Store<IngredientsState>,
    recipesStore: Store<RecipesState>,
    seasonsStore: Store<SeasonsState>,
    tagsStore: Store<TagsState>,
    settingsStore: Store<SettingsState>,
    keysStore: Store<KeysState>,
    suppliesStore: Store<SuppliesState>
  ) {
    this.ingredientStore = ingredientStore;
    this.recipesStore = recipesStore;
    this.seasonsStore = seasonsStore;
    this.tagsStore = tagsStore;
    this.settingsStore = settingsStore;
    this.keysStore = keysStore;
    this.suppliesStore = suppliesStore;
  }

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
