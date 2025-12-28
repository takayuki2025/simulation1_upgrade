// src/lib/api.tsファイル;
import axios, { AxiosInstance } from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export function createApiClient(token: string): AxiosInstance {
  return axios.create({
    baseURL: API_BASE_URL,
    withCredentials: false, // Token 認証では不要
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`, // ★ ここが重要
    },
    timeout: 15000,
  });
}
