import axios, {
  AxiosHeaders,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosError,
} from "axios";

let _token: string | null = null;

export const apiToken = {
  set(token: string | null) {
    _token = token;
  },
  get() {
    return _token;
  },
  clear() {
    _token = null;
  },
};

export const apiClient: AxiosInstance = axios.create({
  baseURL: "/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = apiToken.get();

    if (token) {
      // ★ AxiosHeaders を強制的に使用
      if (!(config.headers instanceof AxiosHeaders)) {
        config.headers = new AxiosHeaders(config.headers);
      }

      config.headers.set("Authorization", `Bearer ${token}`);
    }

    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (res) => res,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.warn("⚠ 401 detected → token cleared");
      apiToken.clear();
    }
    return Promise.reject(error);
  },
);

export default apiClient;
