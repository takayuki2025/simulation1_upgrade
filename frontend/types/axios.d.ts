import "axios";

// Axios の Request Config 型を拡張する
declare module "axios" {
  // AxiosRequestConfig と InternalAxiosRequestConfig の両方を拡張する
  export interface AxiosRequestConfig {
    /** トークンリフレッシュ後にリトライされたかどうかのフラグ */
    _retry?: boolean;
  }

  // InternalAxiosRequestConfig (Interceptorが受け取る型) も同様に拡張する
  export interface InternalAxiosRequestConfig {
    /** トークンリフレッシュ後にリトライされたかどうかのフラグ */
    _retry?: boolean;
  }
}
