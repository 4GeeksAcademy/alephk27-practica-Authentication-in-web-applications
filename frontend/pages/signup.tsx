import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import { SignupForm } from "@/components/SignupForm";

export default function SignupPage() {
  return (
    <div className="page-enter auth-page">
      <Link className="back-link" href="/"><ArrowLeft size={15} /> Volver a la biblioteca</Link>
      <section className="auth-panel signup-panel">
        <div className="auth-aside auth-aside-signup">
          <span className="auth-aside-mark"><BookOpen size={22} /></span>
          <span className="section-label">UN LUGAR PARA LEER</span>
          <p>Haz espacio<br />para otra idea.</p>
          <span className="aside-edition">MARGEN · DESDE LA PRIMERA PÁGINA</span>
        </div>
        <div className="auth-content">
          <span className="section-label">CREAR CUENTA</span>
          <h1>Una cuenta,<br /><em>muchas historias.</em></h1>
          <p className="auth-description">Regístrate para guardar tu perfil y continuar explorando.</p>
          <SignupForm />
        </div>
      </section>
    </div>
  );
}