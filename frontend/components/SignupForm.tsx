import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowRight, Check, LoaderCircle } from "lucide-react";
import { createUser } from "@/lib/services/users";

export function SignupForm() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await createUser({ username: username.trim(), email: email.trim(), password });
      setCreated(true);
    } catch (signupError) {
      setError(signupError instanceof Error ? signupError.message : "No se pudo crear la cuenta.");
    } finally {
      setSubmitting(false);
    }
  }

  if (created) {
    return (
      <div className="signup-success" role="status">
        <span className="success-icon"><Check size={21} /></span>
        <h2>Ya tienes un lugar aquí.</h2>
        <p>Tu cuenta está lista. Inicia sesión para entrar a tu perfil.</p>
        <Link className="button button-primary" href="/login">Ir a iniciar sesión <ArrowRight size={17} /></Link>
      </div>
    );
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <label className="field-label" htmlFor="signup-username">Nombre de usuario</label>
      <input
        className="text-input"
        id="signup-username"
        name="username"
        type="text"
        autoComplete="username"
        minLength={1}
        maxLength={50}
        value={username}
        onChange={(event) => setUsername(event.target.value)}
        required
      />
      <label className="field-label" htmlFor="signup-email">Correo electrónico</label>
      <input
        className="text-input"
        id="signup-email"
        name="email"
        type="email"
        autoComplete="email"
        minLength={3}
        maxLength={254}
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />
      <label className="field-label" htmlFor="signup-password">Contraseña</label>
      <input
        className="text-input"
        id="signup-password"
        name="password"
        type="password"
        autoComplete="new-password"
        minLength={8}
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        required
      />
      <p className="field-hint">Usa al menos 8 caracteres.</p>
      {error && <p className="form-error" role="alert">{error}</p>}
      <button className="button button-primary form-submit" type="submit" disabled={submitting}>
        {submitting ? <LoaderCircle className="spin" size={17} /> : <>Crear cuenta <ArrowRight size={17} /></>}
      </button>
      <p className="form-switch">¿Ya tienes cuenta? <Link href="/login">Inicia sesión</Link></p>
    </form>
  );
}