import {environment} from '../../environments/environment';
import {PhotosConfig} from './photos.config';

export const authRoutes = {
  login: environment.baseUrl + 'login_check',
  register: environment.baseUrl + 'register',
  refreshToken: environment.baseUrl + 'refresh_token',
  fbRedirect: environment.baseUrl + 'facebook/redirect',
  fbLogin: environment.baseUrl + 'facebook/login',
  resetPassword: environment.baseUrl + 'reset-password',
  checkToken: (token: string) => environment.baseUrl + `check-token/${token}`,
  changePassword: (token: string) => environment.baseUrl + `change-password/${token}`
};

export const tagsRoutes = {
  index: environment.baseUrl + 'tags',
  byId: (id: number) => environment.baseUrl + `tags/${id}`
};

export const ingredientsRoutes = {
  index: environment.baseUrl + 'ingredients',
  ozaSupplies: environment.baseUrl + 'ingredients/oza-supplies',
  byId: (id: number) => environment.baseUrl + `ingredients/${id}`
};

export const seasonsRoutes = {
  index: environment.baseUrl + 'seasons',
  byId: (id: number) => environment.baseUrl + `seasons/${id}`
};

export const recipesRoutes = {
  index: environment.baseUrl + 'recipes',
  byId: (id: number) => environment.baseUrl + `recipes/${id}`,
  byPublicId: (id: string) => environment.baseUrl + `public/recipes/${id}`,
  photos: (id: number) => environment.baseUrl + `recipes/${id}/photos`,
  getPhoto: (recipeId: number,
    photoId: number,
    type: PhotosConfig) => environment.baseUrl + `recipes/${recipeId}/photos/${photoId}/${type}`,
  photoById: (recipeId: number, photoId: number) => environment.baseUrl + `recipes/${recipeId}/photos/${photoId}`
};

export const settingsRoutes = {
  index: environment.baseUrl + 'settings',
  switchAutocomplete: environment.baseUrl + 'settings/switch-autocomplete',
  changeOzaKey: environment.baseUrl + 'settings/change-oza-key',
  changePassword: environment.baseUrl + 'settings/change-password'
};

export const apiKeysRoutes = {
  index: environment.baseUrl + 'api-keys',
  byId: (id: number) => environment.baseUrl + `api-keys/${id}`
};

export const timersRoutes = {
  index: environment.baseUrl + 'timers',
  byId: (id: number) => environment.baseUrl + `timers/${id}`
};
