import { Ingredient } from '../models/ingredient';
import { Recipe, RecipePosition, RecipePositionsGroup } from '../models/recipe';

export interface RecipeIngredient {
  additional: boolean;
  id: number;
  name: string;
  available: boolean;
  ozaId: number | null;
}

export class RecipeIngredientsService {
  private ingredients: Ingredient[];
  private processedRecipes: number[];
  private readonly recipe: Recipe;
  private recipes: Recipe[];
  private readonly usedIngredients: RecipeIngredient[];
  public constructor(recipe: Recipe, ingredients: Ingredient[], recipes: Recipe[]) {
    this.recipe = recipe;
    this.ingredients = ingredients;
    this.recipes = recipes;
    this.processedRecipes = [];
    this.usedIngredients = [];
  }

  public getIngredients(): RecipeIngredient[] {
    return this.usedIngredients;
  }

  public process(): void {
    this.processRecipe(this.recipe);
  }

  private processGroup(group: RecipePositionsGroup): void {
    group.positions.forEach((position: RecipePosition) => {
      if (position.recipe !== null) {
        const find = this.recipes.find((recipe: Recipe) => recipe.id === position.recipe);

        if (find !== undefined) {
          this.processRecipe(find);
        }
      }
      if (position.ingredient !== null) {
        const find = this.ingredients.find(
          (ingredient: Ingredient) => ingredient.id === position.ingredient,
        );

        if (find !== undefined) {
          this.processIngredient(find, position.additional);
        }
      }
    });
  }

  private processIngredient(ingredient: Ingredient, additional: boolean): void {
    const found = this.usedIngredients.find((used: RecipeIngredient) => used.id === ingredient.id);

    if (found !== undefined) {
      if (!additional && found.additional) {
        const id = this.usedIngredients.findIndex(
          (used: RecipeIngredient) => used.id === ingredient.id,
        );
        this.usedIngredients[id] = { ...ingredient, additional };
      }

      return;
    }
    this.usedIngredients.push({ ...ingredient, additional });
  }

  private processRecipe(recipe: Recipe): void {
    if (this.processedRecipes.includes(recipe.id)) {
      return;
    }
    this.processedRecipes.push(recipe.id);
    recipe.groups.forEach((group: RecipePositionsGroup) => this.processGroup(group));
  }
}
