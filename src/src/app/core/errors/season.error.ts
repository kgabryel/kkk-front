export interface SeasonErrors {
  ingredient: Map<string, string>,
  startMonth: Map<string, string>,
  endMonth: Map<string, string>
}

export const seasonErrors: SeasonErrors = {
  ingredient: new Map([
    ['required', 'Składnik jest wymagany.'],
    ['notExists', 'Nazwa nie została rozpoznana.']
  ]),
  startMonth: new Map([
    ['required', 'Początek jest wymagany.']
  ]),
  endMonth: new Map([
    ['required', 'Koniec jest wymagany.']
  ])
};
