import type { AuthUser } from "@/domain/auth/AuthUser";

export type RegisterResult = {
  needsEmailVerification: boolean;
};

export type LoginResult = {
  user: AuthUser;
  isFirstLogin: boolean;
};

export interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (args: { email: string; password: string }) => Promise<LoginResult>;

  register: (args: {
    name: string;
    email: string;
    password: string;
  }) => Promise<RegisterResult>;

  logout: () => Promise<void>;
  reloadUser: () => Promise<void>;
  reloginWithFirebaseToken: (idToken: string) => Promise<void>;

  apiClient: any;
}
