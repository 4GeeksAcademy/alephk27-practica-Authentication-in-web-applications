import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { useRouter } from "next/router";
import { useAuth } from "@/hooks/useAuth";

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login({ email: email.trim(), password });
      await router.replace("/profile");
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "No se pudo iniciar sesión.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <label className="field-label" htmlFor="login-email">Correo electrónico</label>
      <input
        className="text-input"
        id="login-email"
        name="email"
        type="email"
        autoComplete="email"
        maxLength={254}
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />
      <label className="field-label" htmlFor="login-password">Contraseña</label>
      <input
        className="text-input"
        id="login-password"
        name="password"
        type="password"
        autoComplete="current-password"
        minLength={1}
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
      />
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="button button-primary form-submit" type="submit" disabled={submitting}>
        {submitting ? <LoaderCircle className="spin" size={17} /> : <>Entrar <ArrowRight size={17} /></>}
      </button>
      <p className="form-switch">¿Aún no tienes cuenta? <Link href="/signup">Regístrate</Link></p>
    </form>
  );
}