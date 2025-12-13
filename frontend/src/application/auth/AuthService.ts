import { FirebaseAuthClient } from "@/infrastructure/auth/FirebaseAuthClient";
import { LaravelAuthApi } from "@/infrastructure/auth/LaravelAuthApi";
import { TokenStorage } from "@/infrastructure/auth/TokenStorage";
import { getDeviceId } from "@/utils/deviceId";
import type { User } from "firebase/auth";
import type { AuthUser } from "@/domain/auth/AuthUser";
import { sendEmailVerification, updateProfile } from "firebase/auth";

export class AuthService {
  constructor(
    private firebase: FirebaseAuthClient,
    private laravel: LaravelAuthApi,
  ) {}

  async register(name: string, email: string, password: string) {
    const user = await this.firebase.register(email, password);
    await updateProfile(user, { displayName: name });
    await sendEmailVerification(user);
    return { needsEmailVerification: true };
  }

  async login({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<AuthUser> {
    console.log("[AuthService.login] START", email);

    const firebaseUser = await this.firebase.login(email, password);

    console.log("[AuthService.login] firebaseUser.uid =", firebaseUser?.uid);

    const result = await this.issueLaravelTokens(firebaseUser);

    console.log("[AuthService.login] RESULT FROM issueLaravelTokens:", result);

    return result;
  }

  private async issueLaravelTokens(firebaseUser: User): Promise<AuthUser> {
    const firebaseToken = await this.firebase.getIdToken(firebaseUser);
    const deviceId = getDeviceId();

    const { tokens, user } = await this.laravel.loginWithFirebaseToken(
      firebaseToken,
      deviceId,
    );

    TokenStorage.save(tokens);

    // ★ /me を呼ばない
    return user;

    // const me = await this.laravel.me();

    // console.log("[AuthService.issue] laravel.me() returned:", me);

    // return me;
  }

  async logout() {
    if (typeof this.firebase.logout === "function") {
      await this.firebase.logout();
    }
    TokenStorage.clear();
  }
}
