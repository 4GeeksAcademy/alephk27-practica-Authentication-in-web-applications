import { fetchApi } from "@/lib/api";
import type { Book } from "@/types/book";

export function getBooks(): Promise<Book[]> {
  return fetchApi<Book[]>("/books");
}