import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { ArrowLeft, BookOpen } from "lucide-react";
import { LoginForm } from "@/components/LoginForm";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const { status } = useAuth();

  useEffect(() => {
    if (status === "authenticated") void router.replace("/profile");
  }, [router, status]);

  return (
    <div className="page-enter auth-page">
      <Link className="back-link" href="/"><ArrowLeft size={15} /> Volver a la biblioteca</Link>
      <section className="auth-panel">
        <div className="auth-aside auth-aside-login">
          <span className="auth-aside-mark"><BookOpen size={22} /></span>
          <span className="section-label">QUÉ BUENO VERTE</span>
          <p>Tu próxima página<br />empieza aquí.</p>
          <span className="aside-edition">MARGEN · LECTURA ABIERTA</span>
        </div>
        <div className="auth-content">
          <span className="section-label">INICIAR SESIÓN</span>
          <h1>Volvamos<br /><em>a la historia.</em></h1>
          <p className="auth-description">Entra con el correo y la contraseña de tu cuenta.</p>
          <LoginForm />
        </div>
      </section>
    </div>
  );
}