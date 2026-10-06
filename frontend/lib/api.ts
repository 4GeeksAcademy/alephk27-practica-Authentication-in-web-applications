import { getAccessToken } from "@/lib/auth-token";
import type { ApiErrorDetail } from "@/types/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function describeDetail(detail: ApiErrorDetail | undefined): string | null {
  if (typeof detail === "string") return detail;
  if (!Array.isArray(detail) || detail.length === 0) return null;

  return detail
    .map((issue) => {
      const field = issue.loc?.filter((part) => part !== "body").join(" ");
      return field ? `${field}: ${issue.msg ?? "Invalid value"}` : issue.msg;
    })
    .filter(Boolean)
    .join(". ");
}

export async function fetchApi<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers);
  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const token = getAccessToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      headers,
    });
  } catch {
    throw new ApiError("No se pudo conectar con el servidor. Inténtalo de nuevo.", 0);
  }

  if (response.status === 204) return undefined as T;

  const responseText = await response.text();
  let payload: unknown;
  if (responseText) {
    try {
      payload = JSON.parse(responseText);
    } catch {
      payload = responseText;
    }
  }

  if (!response.ok) {
    const detail =
      typeof payload === "object" && payload !== null && "detail" in payload
        ? describeDetail((payload as { detail?: ApiErrorDetail }).detail)
        : null;
    throw new ApiError(detail || `Error del servidor (${response.status}).`, response.status);
  }

  return payload as T;
}