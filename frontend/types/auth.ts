import type { Profile } from "@/types/profile";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData extends LoginCredentials {
  username: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: "bearer";
}

export interface CurrentUser {
  email: string;
  profile: Profile;
}

export type AuthStatus = "loading" | "authenticated" | "anonymous" | "error";