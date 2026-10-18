export enum Prefixes {
  ingredients = '[Ingredients]',
  recipes = '[Recipes]',
  seasons = '[Seasons]',
  tags = '[Tags]',
  settings = '[Settings]',
  apiKeys = '[ApiKeys]',
  ozaSupplies = '[OzaSupplies]',
  timers = '[Timers]',
  photos = '[Photos]'
}

export enum Actions {
  load = 'Load',
  loadError = 'Load Error',
  loadSuccess = 'Load Success',
  add = 'Add',
  addError = 'Add Error',
  addSuccess = 'Add Success',
  delete = 'Delete',
  deleteError = 'Delete Error',
  deleteSuccess = 'Delete Success',
  updateName = 'Update Name',
  updateOzaId = 'Update Oza Id',
  updateAvailable = 'Update Available',
  updateFavourite = 'Update Favourite',
  updateToDo = 'Update ToDo',
  update = 'Update',
  updateError = 'Update Error',
  updateSuccess = 'Update Success',
  reset = 'Reset',
  addFromRecipe = 'Add From Recipe',
  switchAutocomplete = 'Switch Autocomplete',
  changeOzaKey = 'Change OZA Key',
  keyNotExists = 'Key not exists',
  reorder = 'Reorder'
}
