import axios, { type AxiosInstance, type CreateAxiosDefaults } from "axios";

export function createApiClient(token: string): AxiosInstance {
  const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (!baseURL) {
    console.error("❌ NEXT_PUBLIC_API_BASE_URL が定義されていません。");
  }

  const config: CreateAxiosDefaults = {
    baseURL,
    withCredentials: false, // Sanctum API（Bearer Token方式）は false
    timeout: 15000,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  };

  return axios.create(config);
}
