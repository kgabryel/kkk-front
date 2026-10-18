export interface RecipesMessages {
  copied: string;
  timerAdded: string;
  timersAdded: string;
  recipeAdded: string;
  recipeUpdated: string;
  recipeDeleted: string;
  invalidPhotoDimensions: string;
  photoAdded: string;
  photosReordered: string;
  photoDeleted: string;
}

export const messages: RecipesMessages = {
  copied: 'Skopiowano',
  invalidPhotoDimensions: 'Zdjęcie ma błędne wymiary',
  photoAdded: 'Zdjęcie zostało dodane.',
  photoDeleted: 'Zdjęcie zostało usunięte.',
  photosReordered: 'Kolejność zdjęć została zmodyfikowana',
  recipeAdded: 'Przepis został dodany.',
  recipeDeleted: 'Przepis został usunięty.',
  recipeUpdated: 'Przepis został zaktualizowany.',
  timerAdded: 'Minutnik został dodany.',
  timersAdded: 'Wszystkie minutniki zostały dodane.',
};
