export interface AccountMessages {
  keyCopied: string;
  passwordChanged: string;
  settingsUpdated: string;
  invalidData: string;
}

export const messages: AccountMessages = {
  keyCopied: 'Skopiowano klucz',
  passwordChanged: 'Hasło zostało zmienione.',
  settingsUpdated: 'Ustawienia zostały zaktualizowane.',
  invalidData: 'Przesłano błędne dane.'
};
