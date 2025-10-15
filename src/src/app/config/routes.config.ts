import { environment } from '../../environments/environment';
import { PhotosConfig } from './photos.config';

export const authRoutes = {
  changePassword: (token: string): string => environment.baseUrl + `change-password/${token}`,
  checkToken: (token: string): string => environment.baseUrl + `check-token/${token}`,
  fbLogin: environment.baseUrl + 'facebook/login',
  fbRedirect: environment.baseUrl + 'facebook/redirect',
  login: environment.baseUrl + 'login_check',
  refreshToken: environment.baseUrl + 'refresh_token',
  register: environment.baseUrl + 'register',
  resetPassword: environment.baseUrl + 'reset-password',
};

export const tagsRoutes = {
  byId: (id: number): string => environment.baseUrl + `tags/${id}`,
  index: environment.baseUrl + 'tags',
};

export const ingredientsRoutes = {
  byId: (id: number): string => environment.baseUrl + `ingredients/${id}`,
  index: environment.baseUrl + 'ingredients',
  ozaSupplies: environment.baseUrl + 'ingredients/oza-supplies',
};

export const seasonsRoutes = {
  byId: (id: number): string => environment.baseUrl + `seasons/${id}`,
  index: environment.baseUrl + 'seasons',
};

export const recipesRoutes = {
  byId: (id: number): string => environment.baseUrl + `recipes/${id}`,
  byPublicId: (id: string): string => environment.baseUrl + `public/recipes/${id}`,
  getPhoto: (recipeId: number, photoId: number, type: PhotosConfig): string =>
    environment.baseUrl + `recipes/${recipeId}/photos/${photoId}/${type}`,
  index: environment.baseUrl + 'recipes',
  photoById: (recipeId: number, photoId: number): string =>
    environment.baseUrl + `recipes/${recipeId}/photos/${photoId}`,
  photos: (id: number): string => environment.baseUrl + `recipes/${id}/photos`,
};

export const settingsRoutes = {
  changeOzaKey: environment.baseUrl + 'settings/change-oza-key',
  changePassword: environment.baseUrl + 'settings/change-password',
  index: environment.baseUrl + 'settings',
  switchAutocomplete: environment.baseUrl + 'settings/switch-autocomplete',
};

export const apiKeysRoutes = {
  byId: (id: number): string => environment.baseUrl + `api-keys/${id}`,
  index: environment.baseUrl + 'api-keys',
};

export const timersRoutes = {
  byId: (id: number): string => environment.baseUrl + `timers/${id}`,
  index: environment.baseUrl + 'timers',
};
