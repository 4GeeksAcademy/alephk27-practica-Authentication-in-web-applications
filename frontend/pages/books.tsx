import { BookList } from "@/components/BookList";
import { useAuth } from "@/hooks/useAuth";
import { useRequireAuth } from "@/hooks/useRequireAuth";

export default function BooksPage() {
  const ready = useRequireAuth();
  const { status, error, retry } = useAuth();

  if (!ready) {
    return (
      <div className="access-state" role={status === "error" ? "alert" : "status"}>
        {status === "error" ? (
          <><p>{error}</p><button className="text-button" onClick={() => void retry()} type="button">Volver a conectar</button></>
        ) : <><span className="loading-mark" /> Preparando tu biblioteca</>}
      </div>
    );
  }

  return (
    <div className="page-enter inner-page">
      <section className="page-heading">
        <span className="section-label">CATÁLOGO</span>
        <h1>Explorar <em>los estantes.</em></h1>
        <p>Una selección para seguir una idea, descubrir otra o simplemente perderse un rato.</p>
      </section>
      <section className="catalog-section catalog-full" aria-label="Libros disponibles">
        <BookList />
      </section>
    </div>
  );
}