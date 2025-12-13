export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  tokenType: "Bearer"; // リテラル型
  expiresIn: number;
}
