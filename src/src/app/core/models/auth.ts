export interface Url {
  url: string;
}

export interface Tokens {
  token: string;
  refresh_token: string;
}

export interface RefreshTokenData {
  token: string;
  refresh_token: string;
  isCorrect: boolean;
}

export interface TokensData {
  token: string;
  refresh_token: string;
  isCorrect: boolean;
}
