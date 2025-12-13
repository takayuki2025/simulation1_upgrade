import axios, { AxiosInstance } from "axios";
import { TokenStorage } from "@/infrastructure/auth/TokenStorage";

export function createHttpClient(on401: () => Promise<void>): AxiosInstance {
  const client = axios.create({
    baseURL: "/api", // ★★★ ここが超重要：/api 固定
    withCredentials: true, // 同一オリジンなので true で問題なし（JWTでもOK）
  });

  client.interceptors.request.use((config) => {
    const { accessToken } = TokenStorage.load();

    if (accessToken) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  });

  client.interceptors.response.use(
    (res) => res,
    async (error) => {
      if (error?.response?.status === 401) {
        await on401();
      }
      throw error;
    },
  );

  return client;
}
