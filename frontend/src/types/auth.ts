export type ShopRoleName = "owner" | "manager" | "staff";

export interface ShopRole {
  shop_id: number;
  shop_code: string; // "shop-a"
  role: ShopRoleName;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;

  /** 旧互換（将来削除可） */
  shop_id?: number | null;

  email_verified_at: string | null;
  first_login_at: string | null;

  /** グローバルロール */
  roles: string[];

  /** 店舗ロール（UI・権限制御の主役） */
  shop_roles: ShopRole[];
}
