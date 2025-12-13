export interface UserRole {
  id: number;
  slug: string;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  shop_id?: number | null;
  email_verified_at?: string | null;
  roles?: UserRole[];
}
