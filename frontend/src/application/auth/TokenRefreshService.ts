import type { AuthTokens } from "@/domain/auth/AuthTokens";
import type { LaravelAuthApi } from "@/infrastructure/auth/LaravelAuthApi";
import { TokenStorage } from "@/infrastructure/auth/TokenStorage";
import { getDeviceId } from "@/utils/deviceId";

export class TokenRefreshService {
  constructor(private api: LaravelAuthApi) {}

  async refresh(): Promise<AuthTokens | null> {
    const tokens = TokenStorage.load();
    if (!tokens.refreshToken) return null;

    try {
      const newTokens = await this.api.refresh(
        tokens.refreshToken,
        getDeviceId(),
      );

      TokenStorage.save(newTokens);
      return newTokens; // ★ AuthTokens を返す（AuthUser ではない）
    } catch (e) {
      return null; // ★ 失敗したら null
    }
  }
}
