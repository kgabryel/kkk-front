export interface AuthMessages {
  authenticationError: string;
  invalidData: string;
  passwordChanged: string;
  emailSent: string;
  serverError: string;
  emailInUse: string;
}

export const messages: AuthMessages = {
  authenticationError: 'Wystąpił błąd podczas uwierzytelniania.',
  invalidData: 'Podano błędne dane.',
  passwordChanged: 'Hasło zostało zmienione.',
  emailSent: 'E-mail został wysłany.',
  serverError: 'Podany adres E-mail jest już w użyciu.',
  emailInUse: 'Wystąpił błąd po stronie serwera.'
};
