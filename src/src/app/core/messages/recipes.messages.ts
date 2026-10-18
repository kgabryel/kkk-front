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
  timerAdded: 'Minutnik został dodany.',
  timersAdded: 'Wszystki minutniki zostały dodane.',
  recipeAdded: 'Przepis został dodany.',
  recipeUpdated: 'Przepis został zaktualizowny.',
  recipeDeleted: 'Przepis został usunięty.',
  invalidPhotoDimensions: 'Zdjęcie ma błędne wymiary.',
  photoAdded: 'Zdjęcie zostało dodane.',
  photosReordered: 'Kolejność zdjęć została zmodyfikowana',
  photoDeleted: 'Zdjęcie zostało usunięte.'
};
