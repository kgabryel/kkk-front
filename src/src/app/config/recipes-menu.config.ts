import {PathUtils} from '../core/utils/path.utils';
import {RoutingConfig} from './routing.config';
import {MenuConfig} from './menu.config';

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
  toDo: 'tags'
};

export const MenuItems: Map<string, MenuConfig> = new Map([
  [
    ItemNames.all, {
    icon: 'menu_book',
    name: 'Wszystkie',
    href: PathUtils.concatPath(RoutingConfig.recipes, RoutingConfig.home)
  }],
  [
    ItemNames.create, {
    icon: 'add_circle_outline',
    name: 'Utwórz',
    href: PathUtils.concatPath(RoutingConfig.recipes, RoutingConfig.create)
  }],
  [
    ItemNames.favourite, {
    icon: 'star',
    name: 'Ulubione',
    href: PathUtils.concatPath(RoutingConfig.recipes, RoutingConfig.favourite)
  }],
  [
    ItemNames.toDo, {
    icon: 'turned_in',
    name: 'Do zrobienia',
    href: PathUtils.concatPath(RoutingConfig.recipes, RoutingConfig.toDo)
  }]
]);
