import { useEffect, useState } from "react";
import { ArrowUpRight, BookOpen, RefreshCw } from "lucide-react";
import { ApiError } from "@/lib/api";
import { getBooks } from "@/lib/services/books";
import type { Book, BookGenre } from "@/types/book";

const genreLabels: Record<BookGenre, string> = {
  fiction: "Ficción",
  "non-fiction": "No ficción",
  mystery: "Misterio",
  "sci-fi": "Ciencia ficción",
};

const genreStyles: Record<BookGenre, string> = {
  fiction: "cover-fiction",
  "non-fiction": "cover-nonfiction",
  mystery: "cover-mystery",
  "sci-fi": "cover-scifi",
};

function messageFor(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  return "No se pudo cargar el catálogo.";
}

export function BookList({ limit }: { limit?: number }) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getBooks()
      .then((result) => {
        if (active) setBooks(result);
      })
      .catch((loadError: unknown) => {
        if (active) setError(messageFor(loadError));
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="catalog-state" role="status">
        <span className="loading-mark" /> Cargando libros
      </div>
    );
  }

  if (error) {
    return (
      <div className="catalog-state catalog-error" role="alert">
        <p>{error}</p>
        <button className="text-button" onClick={() => window.location.reload()} type="button">
          <RefreshCw size={15} /> Volver a intentar
        </button>
      </div>
    );
  }

  if (books.length === 0) {
    return (
      <div className="catalog-state empty-state">
        <BookOpen size={23} strokeWidth={1.5} />
        <p>El catálogo está esperando sus primeros libros.</p>
      </div>
    );
  }

  const visibleBooks = typeof limit === "number" ? books.slice(0, limit) : books;

  return (
    <div className="book-grid">
      {visibleBooks.map((book, index) => (
        <article className="book-item" key={book.id} style={{ animationDelay: `${index * 70}ms` }}>
          <div className={`book-cover ${genreStyles[book.genre]}`} aria-hidden="true">
            <span className="cover-kicker">MARGEN · {genreLabels[book.genre]}</span>
            <span className="cover-title">{book.title}</span>
            <span className="cover-author">{book.author}</span>
            <span className="cover-decoration" />
          </div>
          <div className="book-details">
            <div className="book-meta">
              <span>{genreLabels[book.genre]}</span>
              <span>{book.pages} págs.</span>
            </div>
            <h3>{book.title}</h3>
            <p className="book-author">{book.author}</p>
            <div className="book-bottomline">
              <span
                className={book.status === "available" ? "availability available" : "availability checked-out"}
              >
                <span className="availability-dot" />
                {book.status === "available" ? "Disponible" : "En préstamo"}
              </span>
              <ArrowUpRight size={16} aria-hidden="true" />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}