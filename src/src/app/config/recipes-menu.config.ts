import { PathUtils } from '../core/utils/path.utils';
import { MenuConfig } from './menu.config';
import { RoutingConfig } from './routing.config';

export interface Names {
  all: string;
  create: string;
  favourite: string;
  toDo: string;
}

export const ItemNames: Names = {
  all: 'recipes',
  create: 'seasons',
  favourite: 'ingredients',
  toDo: 'tags',
};

export const MenuItems = new Map<string, MenuConfig>([
  [
    ItemNames.all,
    {
      href: PathUtils.concatPath(RoutingConfig.recipes, RoutingConfig.home),
      icon: 'menu_book',
      name: 'Wszystkie',
    },
  ],
  [
    ItemNames.create,
    {
      href: PathUtils.concatPath(RoutingConfig.recipes, RoutingConfig.create),
      icon: 'add_circle_outline',
      name: 'Utwórz',
    },
  ],
  [
    ItemNames.favourite,
    {
      href: PathUtils.concatPath(RoutingConfig.recipes, RoutingConfig.favourite),
      icon: 'star',
      name: 'Ulubione',
    },
  ],
  [
    ItemNames.toDo,
    {
      href: PathUtils.concatPath(RoutingConfig.recipes, RoutingConfig.toDo),
      icon: 'turned_in',
      name: 'Do zrobienia',
    },
  ],
]);
