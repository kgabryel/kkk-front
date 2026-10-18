import {Recipe, RecipePositionsGroup} from '../../models/recipe';
import {Ingredient} from '../../models/ingredient';

export interface RecipeIngredient {
  additional: boolean;
  id: number;
  name: string;
  available: boolean;
  ozaId: number | null;
}

export class RecipeIngredientsService {
  private readonly recipe: Recipe;
  private recipes: Recipe[];
  private ingredients: Ingredient[];
  private readonly usedIngredients: RecipeIngredient[];
  private processedRecipes: number[];

  constructor(recipe: Recipe, ingredients: Ingredient[], recipes: Recipe[]) {
    this.recipe = recipe;
    this.ingredients = ingredients;
    this.recipes = recipes;
    this.processedRecipes = [];
    this.usedIngredients = [];
  }

  public process(): void {
    this.processRecipe(this.recipe);
  }

  public getIngredients(): RecipeIngredient[] {
    return this.usedIngredients;
  }

  private processRecipe(recipe: Recipe): void {
    if (this.processedRecipes.includes(recipe.id)) {
      return;
    }
    this.processedRecipes.push(recipe.id);
    recipe.groups.forEach(group => this.processGroup(group));
  }

  private processGroup(group: RecipePositionsGroup): void {
    group.positions.forEach(position => {
      if (position.recipe !== null) {
        const find = this.recipes.find(recipe => recipe.id === position.recipe);
        if (find !== undefined) {
          this.processRecipe(find);
        }
      }
      if (position.ingredient !== null) {
        const find = this.ingredients.find(ingredient => ingredient.id === position.ingredient);
        if (find !== undefined) {
          this.processIngredient(find, position.additional);
        }
      }
    });
  }

  private processIngredient(ingredient: Ingredient, additional: boolean): void {
    const found = this.usedIngredients.find(used => used.id === ingredient.id);
    if (found !== undefined) {
      if (!additional && found.additional) {
        const id = this.usedIngredients.findIndex(used => used.id === ingredient.id);
        this.usedIngredients[id] = {...ingredient, additional};
      }
      return;
    }
    this.usedIngredients.push({...ingredient, additional});
  }
}
