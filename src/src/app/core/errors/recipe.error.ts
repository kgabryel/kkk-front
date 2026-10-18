export interface RecipeErrors {
  name: Map<string, string>,
  portions: Map<string, string>,
  url: Map<string, string>,
  groupName: Map<string, string>;
  amount: Map<string, string>,
  measure: Map<string, string>,
  ingredient: Map<string, string>
}

export const recipeErrors: RecipeErrors = {
  name: new Map([
    ['required', 'Nazwa jest wymagana.'],
    ['maxlength', 'Nazwa jest za długa.'],
    ['notUnique', 'Nazwa już wykorzystywana']
  ]),
  portions: new Map([
    ['required', 'Ilość porcji jest wymagana.'],
    ['min', 'Ilość porcji nie może być mniejsze niż 1.']
  ]),
  url: new Map([
    ['url', 'Adres ma nieprawidłową postać.']
  ]),
  groupName: new Map([
    ['maxlength', 'Nazwa jest za długa.']
  ]),
  amount: new Map([
    ['min', 'Ilość nie może być mniejsze niż 1.']
  ]),
  measure: new Map([
    ['required', 'Jednostka jest wymagana.'],
    ['maxlength', 'Jednostka jest za długa.']
  ]),
  ingredient: new Map([
    ['required', 'Składnik jest wymagany.'],
    ['notExists', 'Nazwa nie została rozpoznana.']
  ])
};
