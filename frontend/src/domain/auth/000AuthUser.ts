export interface UserRole {
  id: number;
  slug: string;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;

  /** 旧構造（互換維持） */
  shop_id?: number | null;

  email_verified_at: string | null;
  first_login_at: string | null;

  /** グローバルロール */
  roles: string[];
  shop_roles: ShopRole[];
}