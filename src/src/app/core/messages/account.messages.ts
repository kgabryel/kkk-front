export interface AccountMessages {
  keyCopied: string;
  passwordChanged: string;
  settingsUpdated: string;
  invalidData: string;
}

export const messages: AccountMessages = {
  invalidData: 'Przesłano błędne dane.',
  keyCopied: 'Skopiowano klucz',
  passwordChanged: 'Hasło zostało zmienione.',
  settingsUpdated: 'Ustawienia zostały zaktualizowane.',
};
