export interface TagErrors {
  name: Map<string, string>;
}

export const tagErrors: TagErrors = {
  name: new Map([
    ['required', 'Nazwa jest wymagana.'],
    ['maxlength', 'Nazwa jest za długa.'],
    ['notUnique', 'Nazwa już wykorzystywana']
  ])
};
