import { fetchApi } from "@/lib/api";
import type { CurrentUser, LoginCredentials, TokenResponse } from "@/types/auth";

export function login(credentials: LoginCredentials): Promise<TokenResponse> {
  return fetchApi<TokenResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });
}

export function getCurrentUser(): Promise<CurrentUser> {
  return fetchApi<CurrentUser>("/auth/me");
}