import Link from "next/link";
import { useRouter } from "next/router";
import { LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export function AuthNavigation() {
  const router = useRouter();
  const { status, user, logout } = useAuth();

  const isCurrent = (path: string) => router.pathname === path;

  function handleLogout() {
    logout();
    void router.push("/");
  }

  return (
    <nav className="navigation" aria-label="Navegación principal">
      <Link className={isCurrent("/") ? "nav-link is-current" : "nav-link"} href="/">
        Inicio
      </Link>
      <Link className={isCurrent("/books") ? "nav-link is-current" : "nav-link"} href="/books">
        Catálogo
      </Link>
      {status === "loading" && <span className="nav-status">Comprobando sesión</span>}
      {status === "authenticated" && (
        <>
          <Link
            className={isCurrent("/profile") ? "nav-link is-current" : "nav-link"}
            href="/profile"
          >
            Mi perfil
          </Link>
          <span className="nav-divider" aria-hidden="true" />
          <button
            className="icon-button logout-button"
            type="button"
            title="Cerrar sesión"
            aria-label={`Cerrar sesión de ${user?.profile.full_name ?? "tu cuenta"}`}
            onClick={handleLogout}
          >
            <LogOut size={17} strokeWidth={1.8} />
          </button>
        </>
      )}
      {status === "anonymous" && (
        <>
          <Link
            className={isCurrent("/login") ? "nav-link is-current" : "nav-link"}
            href="/login"
          >
            Acceder
          </Link>
          <Link className="nav-join" href="/signup">
            Crear cuenta <span aria-hidden="true">↗</span>
          </Link>
        </>
      )}
      {status === "error" && <span className="nav-status">Sesión sin conexión</span>}
    </nav>
  );
}