export interface TimersMessages {
  timerAdded: string;
  timerUpdated: string;
  timerDeleted: string;
}

export const messages: TimersMessages = {
  timerAdded: 'Minutnik został dodany.',
  timerDeleted: 'Minutnik został usunięty.',
  timerUpdated: 'Minutnik został zaktualizowany.',
};
