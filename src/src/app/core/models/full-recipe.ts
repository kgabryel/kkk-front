import { Photo } from './photo';

export interface FullRecipe {
  name: string;
  description: string | null;
  url: string | null;
  portions: number;
  tags: string[];
  groups: RecipePositionsGroup[];
  photos: Photo[];
  id: number;
}

export interface RecipePosition {
  amount: number | null;
  measure: string;
  ingredient: string;
  additional: boolean;
}

export interface RecipePositionsGroup {
  name: string;
  positions: RecipePosition[];
}
