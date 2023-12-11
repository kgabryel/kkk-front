import {TimerRequest} from './timer.request';

export interface RecipeRequest {
  name: string;
  description: string | null;
  url: string | null;
  favourite: boolean;
  public: boolean;
  toDo: boolean;
  portions: number;
  tags: string[];
  groups: PositionsGroup[],
  timers: TimerRequest[]
}

export interface PositionsGroup {
  name: string;
  positions: Position[];
}

export interface Position {
  amount: number;
  measure: string;
  additional: boolean;
  ingredient: number | null;
  recipe: number | null;
}

export interface PhotoRequest {
  photo: string;
}
