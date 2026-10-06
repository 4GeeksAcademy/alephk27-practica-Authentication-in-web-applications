import { useRequireAuth } from "@/hooks/useRequireAuth";
import { useAuth } from "@/hooks/useAuth";
import { ProfileForm } from "@/components/ProfileForm";

export default function ProfilePage() {
  const ready = useRequireAuth();
  const { status, error, retry, user } = useAuth();

  if (!ready) {
    return (
      <div className="access-state" role={status === "error" ? "alert" : "status"}>
        {status === "error" ? (
          <><p>{error}</p><button className="text-button" onClick={() => void retry()} type="button">Volver a conectar</button></>
        ) : <><span className="loading-mark" /> Abriendo tu perfil</>}
      </div>
    );
  }

  return (
    <div className="page-enter inner-page profile-page">
      <section className="profile-welcome">
        <span className="section-label">TU ESPACIO</span>
        <h1>Hola, <em>{user?.profile.full_name || "lector"}.</em></h1>
        <p>Un buen lugar para guardar tus datos y volver a lo que importa.</p>
      </section>
      <ProfileForm email={user?.email ?? ""} />
    </div>
  );
}