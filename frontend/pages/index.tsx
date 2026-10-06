import Link from "next/link";
import { ArrowRight, BookOpen, Sparkles } from "lucide-react";
import { BookList } from "@/components/BookList";
import { useAuth } from "@/hooks/useAuth";

export default function HomePage() {
  const { status, user } = useAuth();

  return (
    <div className="page-enter home-page">
      <section className="home-intro">
        <div className="home-copy">
          <span className="section-label"><Sparkles size={14} /> UNA BIBLIOTECA PARA CURIOSOS</span>
          <h1>Hay mundos<br /><em>entre líneas.</em></h1>
          <p>Encuentra tu próxima lectura, vuelve a tus favoritas y guarda tu espacio en la biblioteca.</p>
          <div className="home-actions">
            <Link className="button button-primary" href="/books">Explorar catálogo <ArrowRight size={17} /></Link>
            {status === "authenticated" ? (
              <Link className="quiet-link" href="/profile">Hola, {user?.profile.full_name} <span aria-hidden="true">↗</span></Link>
            ) : status === "anonymous" ? (
              <Link className="quiet-link" href="/signup">Crear una cuenta <span aria-hidden="true">↗</span></Link>
            ) : null}
          </div>
        </div>
        <div className="home-art" aria-label="Composición de libros de la biblioteca">
          <div className="art-note"><BookOpen size={16} /> LEE A TU RITMO</div>
          <div className="art-book art-book-one"><span>THE<br />PRAGMATIC<br />PROGRAMMER</span><small>HUNT & THOMAS</small></div>
          <div className="art-book art-book-two"><span>DUNE</span><small>FRANK HERBERT</small></div>
          <div className="art-book art-book-three"><span>THE BIG<br />SLEEP</span><small>RAYMOND CHANDLER</small></div>
          <span className="art-spark art-spark-one">✳</span>
          <span className="art-spark art-spark-two">✳</span>
          <div className="art-caption">LEE ALGO<br />INESPERADO.</div>
        </div>
      </section>

      <section className="catalog-section">
        <div className="section-heading">
          <div>
            <span className="section-label">PARA EMPEZAR</span>
            <h2>En los estantes</h2>
          </div>
          <Link className="quiet-link" href="/books">Ver todo el catálogo <ArrowRight size={16} /></Link>
        </div>
        <BookList limit={3} />
      </section>
    </div>
  );
}