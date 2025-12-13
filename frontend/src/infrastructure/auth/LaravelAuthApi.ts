import type { AxiosInstance } from "axios";
import type { AuthTokens } from "@/domain/auth/AuthTokens";
import type { AuthUser } from "@/domain/auth/AuthUser";

export class LaravelAuthApi {
  constructor(private _client: AxiosInstance) {}

  // ★ これを追加（private を外から読み取れるようにする）
  public get client(): AxiosInstance {
    return this._client;
  }

  async loginWithFirebaseToken(
    firebaseToken: string,
    deviceId: string,
  ): Promise<{ tokens: AuthTokens; user: AuthUser }> {
    const res = await this._client.post("/login_or_register", {
      firebase_token: firebaseToken,
      device_id: deviceId,
    });

    return {
      tokens: {
        accessToken: res.data.token,
        refreshToken: res.data.refresh_token,
        tokenType: "Bearer",
        expiresIn: res.data.expires_in,
      },
      user: res.data.user,
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
      tokenType: "Bearer",
      expiresIn: res.data.expires_in,
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
