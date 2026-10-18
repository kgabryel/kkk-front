import {createEntityAdapter, EntityAdapter, EntityState} from '@ngrx/entity';
import {Tag} from '../../models/tag';
import {createReducer, on} from '@ngrx/store';
import {
  tagAdd,
  tagAddError,
  tagAddFromRecipe,
  tagAddSuccess,
  tagDelete,
  tagDeleteError,
  tagDeleteSuccess,
  tagsLoad,
  tagsLoadError,
  tagsLoadSuccess,
  tagsReset,
  tagUpdate,
  tagUpdateError,
  tagUpdateSuccess
} from './actions';

export interface State {
  tags: EntityState<Tag>;
  loaded: boolean;
}

export const TAGS_KEY = 'tags';

export const adapter: EntityAdapter<Tag> = createEntityAdapter<Tag>();

const initialState: State = {
  tags: adapter.getInitialState(),
  loaded: false
};

export const tagsReducer = createReducer(
  initialState,
  on(tagsLoad, state => state),
  on(tagsLoadError, state => state),
  on(tagsLoadSuccess, (state, action) => ({
    ...state,
    loaded: true,
    tags: adapter.addMany(action.tags, state.tags)
  })),
  on(tagAdd, state => state),
  on(tagAddFromRecipe, state => state),
  on(tagAddError, state => state),
  on(tagAddSuccess, (state, action) => ({
    ...state,
    tags: adapter.addOne(action.tag, state.tags)
  })),
  on(tagDelete, state => state),
  on(tagDeleteError, state => state),
  on(tagDeleteSuccess, (state, action) => ({
    ...state,
    tags: adapter.removeOne(action.id, state.tags)
  })),
  on(tagUpdate, state => state),
  on(tagUpdateError, state => state),
  on(tagUpdateSuccess, (state, action) => ({
    ...state,
    tags: adapter.updateOne(action.tag, state.tags)
  })),
  on(tagsReset, () => initialState)
);
