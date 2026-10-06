export type ApiErrorDetail = string | Array<{ msg?: string; loc?: Array<string | number> }>;

export interface ApiErrorPayload {
  detail?: ApiErrorDetail;
}