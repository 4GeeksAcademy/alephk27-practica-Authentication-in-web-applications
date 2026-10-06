import Link from "next/link";
import { BookOpen } from "lucide-react";
import type { ReactNode } from "react";
import { AuthNavigation } from "@/components/AuthNavigation";

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="site-shell flex min-h-screen flex-col">
      <header className="site-header">
        <div className="header-inner">
          <Link href="/" className="brand" aria-label="Margen, ir al inicio">
            <span className="brand-mark"><BookOpen size={19} strokeWidth={1.8} /></span>
            <span>MARGEN<span className="brand-period">.</span></span>
          </Link>
          <AuthNavigation />
        </div>
      </header>
      <main id="main-content" className="main-content">{children}</main>
      <footer className="site-footer">
        <span>Margen · Biblioteca</span>
        <span>Un buen libro siempre deja espacio.</span>
      </footer>
    </div>
  );
}