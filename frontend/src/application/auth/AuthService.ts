import { FirebaseAuthClient } from "@/infrastructure/auth/FirebaseAuthClient";
import { LaravelAuthApi } from "@/infrastructure/auth/LaravelAuthApi";
import { TokenStorage } from "@/infrastructure/auth/TokenStorage";
import { getDeviceId } from "@/utils/deviceId";
import type { User } from "firebase/auth";
import type { AuthUser } from "@/domain/auth/AuthUser";
import { sendEmailVerification, updateProfile } from "firebase/auth";

export type LoginResult = {
  user: AuthUser;
  isFirstLogin: boolean;
};

export class AuthService {
  constructor(
    private firebase: FirebaseAuthClient,
    private laravel: LaravelAuthApi,
  ) {}

  async register(name: string, email: string, password: string) {
    const user = await this.firebase.register(email, password);

    await updateProfile(user, { displayName: name });

    await sendEmailVerification(user, {
      url: "https://localhost/login?verified=1",
      handleCodeInApp: false,
    });

    return { needsEmailVerification: true };
  }

  async login({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<LoginResult> {
    const firebaseUser = await this.firebase.login(email, password);

    const result = await this.issueLaravelTokens(firebaseUser);

    return {
      user: result.user,
      isFirstLogin: result.isFirstLogin,
    };
  }

  private async issueLaravelTokens(firebaseUser: User): Promise<{
    user: AuthUser;
    isFirstLogin: boolean;
  }> {
    const firebaseToken = await this.firebase.getIdToken(firebaseUser);
    const deviceId = getDeviceId();

    const { tokens, user, isFirstLogin } =
      await this.laravel.loginWithFirebaseToken(firebaseToken, deviceId);

    TokenStorage.save(tokens);

    return { user, isFirstLogin };
  }

  async logout() {
    await this.firebase.logout?.();
    TokenStorage.clear();
  }
}
