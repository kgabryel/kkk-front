import {PathUtils} from '../core/utils/path.utils';
import {RoutingConfig} from './routing.config';

export interface MenuConfig {
  icon: string;
  name: string;
  href: string;
}

export interface Names {
  recipes: string;
  seasons: string;
  ingredients: string;
  tags: string;
  account: string;
}

export const ItemNames: Names = {
  recipes: 'recipes',
  seasons: 'seasons',
  ingredients: 'ingredients',
  tags: 'tags',
  account: 'account'
};

export const MenuItems: Map<string, MenuConfig> = new Map([
  [ItemNames.recipes, {icon: 'menu_book', name: 'Przepisy', href: PathUtils.concatPath(RoutingConfig.recipes)}],
  [ItemNames.seasons, {icon: 'calendar_today', name: 'Sezony', href: PathUtils.concatPath(RoutingConfig.seasons)}],
  [ItemNames.ingredients, {icon: 'kitchen', name: 'Składniki', href: PathUtils.concatPath(RoutingConfig.ingredients)}],
  [ItemNames.tags, {icon: 'local_offer', name: 'Tagi', href: PathUtils.concatPath(RoutingConfig.tags)}],
  [ItemNames.account, {icon: 'account_circle', name: 'Konto', href: PathUtils.concatPath(RoutingConfig.account)}]
]);
