import useSWR from "swr";
import { useAuth } from "@/ui/auth/useAuth";

export type UserProfile = {
  postNumber: string | null;
  address: string | null;
  building: string | null;
};

export function useUserProfileSWR() {
  const { apiClient, isAuthenticated } = useAuth();

  const { data, error, isLoading } = useSWR(
    isAuthenticated && apiClient ? "/mypage/profile" : null,
    async (url) => {
      const res = await apiClient!.get(url);
      const u = res.data.user ?? res.data;

      return {
        postNumber: u.post_number ?? null,
        address: u.address ?? null,
        building: u.building ?? null,
      };
    },
  );

  return {
    profile: data ?? null,
    isLoading,
    isError: !!error,
  };
}