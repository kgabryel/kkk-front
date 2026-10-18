export interface TimersMessages {
  timerAdded: string;
  timerUpdated: string;
  timerDeleted: string;
}

export const messages: TimersMessages = {
  timerAdded: 'Minutnik został dodany.',
  timerUpdated: 'Minutnik został zaktualizowany.',
  timerDeleted: 'Minutnik został usunięty.'
};
