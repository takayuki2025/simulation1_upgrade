import type { AxiosInstance } from "axios";
import type { AuthTokens } from "@/domain/auth/AuthTokens";
import type { AuthUser } from "@/domain/auth/AuthUser";

/**
 * ★ クラスの外で export type
 */
export type LoginWithFirebaseResult = {
  tokens: AuthTokens;
  user: AuthUser;
  isFirstLogin: boolean;
};

export class LaravelAuthApi {
  constructor(private _client: AxiosInstance) {}

  public get client(): AxiosInstance {
    return this._client;
  }

  async loginWithFirebaseToken(
    firebaseToken: string,
    deviceId: string,
  ): Promise<LoginWithFirebaseResult> {
    const res = await this._client.post("/login_or_register", {
      firebase_token: firebaseToken,
      device_id: deviceId,
    });

    return {
      tokens: {
        accessToken: res.data.token,
        refreshToken: res.data.refreshToken,
      },
      user: res.data.user,
      isFirstLogin: res.data.isFirstLogin, // ← Laravel の値
    };
  }

  async refresh(refreshToken: string, deviceId: string): Promise<AuthTokens> {
    const res = await this._client.post("/auth/refresh", {
      refresh_token: refreshToken,
      device_id: deviceId,
    });

    return {
      accessToken: res.data.access_token,
      refreshToken: res.data.refresh_token,
    };
  }

  async me(): Promise<AuthUser> {
    const res = await this._client.get("/me");
    return res.data.user;
  }

  async logout() {
    await this._client.post("/logout");
  }
}
