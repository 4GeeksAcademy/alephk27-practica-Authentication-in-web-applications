import { fetchApi } from "@/lib/api";
import type { Profile, ProfileUpdate } from "@/types/profile";

export function getProfile(): Promise<Profile> {
  return fetchApi<Profile>("/profile/me");
}

export function updateProfile(data: ProfileUpdate): Promise<Profile> {
  return fetchApi<Profile>("/profile/me", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}