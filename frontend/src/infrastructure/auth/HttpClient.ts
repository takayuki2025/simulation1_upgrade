import axios, { AxiosInstance, AxiosError } from "axios";
import { TokenStorage } from "@/infrastructure/auth/TokenStorage";
import { TokenRefreshService } from "@/application/auth/TokenRefreshService";

export function createHttpClient(
  refreshService: TokenRefreshService,
): AxiosInstance {
  const client = axios.create({
    baseURL: "/api",
    withCredentials: true,
  });

  // ===== Request =====
  client.interceptors.request.use((config) => {
    // 🔴 refresh API には Authorization を付けない
    if (config.url?.includes("/auth/refresh")) {
      return config;
    }

    const { accessToken } = TokenStorage.load();
    if (accessToken) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  });

  // ===== Response =====
  client.interceptors.response.use(
    (res) => res,
    async (error: AxiosError) => {
      const status = error.response?.status;
      const original = error.config as any;

      // 🔴 refresh API 自体は interceptor 対象外
      if (original?.url?.includes("/auth/refresh")) {
        return Promise.reject(error);
      }

      if (status === 401 && !original?._retry) {
        original._retry = true;

        try {
          await refreshService.refresh();
          return client(original);
        } catch {
          TokenStorage.clear();
          return Promise.reject(error);
        }
      }

      return Promise.reject(error);
    },
  );

  return client;
}
