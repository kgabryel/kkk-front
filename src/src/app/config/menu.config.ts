import { PathUtils } from '../core/utils/path.utils';
import { RoutingConfig } from './routing.config';

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
  account: 'account',
  ingredients: 'ingredients',
  recipes: 'recipes',
  seasons: 'seasons',
  tags: 'tags',
};

export const MenuItems = new Map<string, MenuConfig>([
  [
    ItemNames.recipes,
    { href: PathUtils.concatPath(RoutingConfig.recipes), icon: 'menu_book', name: 'Przepisy' },
  ],
  [
    ItemNames.seasons,
    { href: PathUtils.concatPath(RoutingConfig.seasons), icon: 'calendar_today', name: 'Sezony' },
  ],
  [
    ItemNames.ingredients,
    { href: PathUtils.concatPath(RoutingConfig.ingredients), icon: 'kitchen', name: 'Składniki' },
  ],
  [
    ItemNames.tags,
    { href: PathUtils.concatPath(RoutingConfig.tags), icon: 'local_offer', name: 'Tagi' },
  ],
  [
    ItemNames.account,
    { href: PathUtils.concatPath(RoutingConfig.account), icon: 'account_circle', name: 'Konto' },
  ],
]);
