import axios from "axios";
import type { AxiosInstance } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export function createApiClient(): AxiosInstance {
  console.log("[createApiClient] BASE =", API_BASE_URL);

  return axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true, // ← Sanctum Cookie 認証の要
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    timeout: 15000,
  });
}