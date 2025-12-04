export interface LoginResponse {
  token: string;
  user: {
    id: number;
    name: string;
    email: string;
    user_image?: string | null;
  };
}
