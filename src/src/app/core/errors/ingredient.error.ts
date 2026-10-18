export interface IngredientErrors {
  name: Map<string, string>;
  available: Map<string, string>;
}

export const ingredientErrors: IngredientErrors = {
  available: new Map([['required', 'Pole dostępność jest wymagana.']]),
  name: new Map([
    ['required', 'Nazwa jest wymagana.'],
    ['maxLength', 'Nazwa jest za długa.'],
    ['notUnique', 'Nazwa już wykorzystywana'],
  ]),
};
