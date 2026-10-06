import { useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/hooks/useAuth";

export function useRequireAuth(): boolean {
  const router = useRouter();
  const { status } = useAuth();

  useEffect(() => {
    if (status === "anonymous") void router.replace("/login");
  }, [router, status]);

  return status === "authenticated";
}