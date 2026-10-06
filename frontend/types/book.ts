export type BookGenre = "fiction" | "non-fiction" | "mystery" | "sci-fi";
export type BookStatusValue = "available" | "checked_out";

export interface Book {
  id: number;
  title: string;
  author: string;
  genre: BookGenre;
  pages: number;
  status: BookStatusValue;
}