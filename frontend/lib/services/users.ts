import { fetchApi } from "@/lib/api";
import type { SignupData } from "@/types/auth";

export interface UserResponse {
  id: number;
  username: string;
  email: string;
}

export function createUser(data: SignupData): Promise<UserResponse> {
  return fetchApi<UserResponse>("/users", {
    method: "POST",
    body: JSON.stringify(data),
  });
}