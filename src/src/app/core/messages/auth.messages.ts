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
  emailInUse: 'Podany adres E-mail jest już w użyciu.',
  emailSent: 'E-mail został wysłany.',
  invalidData: 'Podano błędne dane.',
  passwordChanged: 'Hasło zostało zmienione.',
  serverError: 'Wystąpił błąd po stronie serwera.',
};
