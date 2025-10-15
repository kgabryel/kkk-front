import { Photo } from './photo';
import { Timer } from './timer';

export interface Recipe {
  id: number;
  name: string;
  description: string | null;
  url: string | null;
  favourite: boolean;
  toDo: boolean;
  portions: number;
  tags: number[];
  groups: RecipePositionsGroup[];
  public: boolean;
  publicId: string;
  timers: Timer[];
  photos: Photo[];
}

export interface RecipePosition {
  amount: number | null;
  measure: string;
  ingredient: number | null;
  recipe: number | null;
  additional: boolean;
}

export interface RecipePositionsGroup {
  name: string;
  positions: RecipePosition[];
}
