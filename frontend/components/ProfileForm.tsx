import { useEffect, useState, type FormEvent } from "react";
import { Check, LoaderCircle, RefreshCw } from "lucide-react";
import { useRouter } from "next/router";
import { ApiError } from "@/lib/api";
import { getProfile, updateProfile } from "@/lib/services/profile";
import { useAuth } from "@/hooks/useAuth";
import type { Profile } from "@/types/profile";

export function ProfileForm({ email }: { email: string }) {
  const router = useRouter();
  const { logout } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    let active = true;
    getProfile()
      .then((result) => {
        if (!active) return;
        setProfile(result);
        setFullName(result.full_name);
        setPhone(result.phone ?? "");
        setAddress(result.address ?? "");
      })
      .catch((loadError: unknown) => {
        if (!active) return;
        if (loadError instanceof ApiError && loadError.status === 401) {
          logout();
          void router.replace("/login");
        } else {
          setError(loadError instanceof Error ? loadError.message : "No se pudo cargar el perfil.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [logout, router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSaved(false);
    setSaving(true);
    try {
      const updated = await updateProfile({
        full_name: fullName.trim(),
        phone: phone.trim() || null,
        address: address.trim() || null,
      });
      setProfile(updated);
      setSaved(true);
    } catch (saveError) {
      if (saveError instanceof ApiError && saveError.status === 401) {
        logout();
        void router.replace("/login");
      } else {
        setError(saveError instanceof Error ? saveError.message : "No se pudieron guardar los cambios.");
      }
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="profile-state" role="status"><span className="loading-mark" /> Cargando tu perfil</div>;
  }

  if (!profile) {
    return (
      <div className="profile-state profile-error" role="alert">
        <p>{error ?? "No se encontró el perfil asociado a esta cuenta."}</p>
        <button className="text-button" type="button" onClick={() => void router.reload()}>
          <RefreshCw size={15} /> Volver a intentar
        </button>
      </div>
    );
  }

  return (
    <form className="profile-form" onSubmit={handleSubmit}>
      <div className="profile-form-heading">
        <div>
          <span className="section-label">DATOS PERSONALES</span>
          <h2>Tu perfil</h2>
        </div>
        {saved && <span className="saved-note"><Check size={15} /> Cambios guardados</span>}
      </div>
      <label className="field-label" htmlFor="profile-email">Correo electrónico <span>(solo lectura)</span></label>
      <input
        className="text-input readonly-input"
        id="profile-email"
        name="email"
        type="email"
        value={email}
        readOnly
      />
      <label className="field-label" htmlFor="profile-name">Nombre completo</label>
      <input
        className="text-input"
        id="profile-name"
        name="full_name"
        type="text"
        minLength={1}
        maxLength={100}
        value={fullName}
        onChange={(event) => setFullName(event.target.value)}
        required
      />
      <label className="field-label" htmlFor="profile-phone">Teléfono <span>(opcional)</span></label>
      <input
        className="text-input"
        id="profile-phone"
        name="phone"
        type="tel"
        maxLength={30}
        value={phone}
        onChange={(event) => setPhone(event.target.value)}
      />
      <label className="field-label" htmlFor="profile-address">Dirección <span>(opcional)</span></label>
      <input
        className="text-input"
        id="profile-address"
        name="address"
        type="text"
        maxLength={250}
        value={address}
        onChange={(event) => setAddress(event.target.value)}
      />
      <label className="field-label" htmlFor="profile-bio">Presentación <span>(solo lectura)</span></label>
      <textarea
        className="text-input readonly-input profile-bio"
        id="profile-bio"
        name="bio"
        value={profile.bio ?? ""}
        placeholder="Aún no hay una presentación registrada."
        readOnly
      />
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="profile-form-footer">
        <span>Los cambios se guardan en tu cuenta.</span>
        <button className="button button-primary" type="submit" disabled={saving}>
          {saving ? <LoaderCircle className="spin" size={17} /> : "Guardar cambios"}
        </button>
      </div>
    </form>
  );
}