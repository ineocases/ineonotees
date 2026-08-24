import { FormEvent, useState } from "react";
import { login, register, resetPassword } from "../services/authService";

export default function AuthScreen() {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError(""); setBusy(true);
    try {
      if (mode === "login") await login(email, password);
      else await register(email, password, name);
    } catch (err) {
      setError(err instanceof Error ? err.message.replace("Firebase: ", "") : "Ocurrió un error.");
    } finally { setBusy(false); }
  }

  async function forgot() {
    if (!email) return setError("Escribí tu email primero.");
    try { await resetPassword(email); setError("Te enviamos un correo para restablecer la contraseña."); }
    catch { setError("No se pudo enviar el correo."); }
  }

  return (
    <main className="auth">
      <div className="auth-card">
        <div className="brand-mark">✦</div>
        <h1>Notes</h1>
        <p className="muted">Tus apuntes, siempre con vos.</p>
        <form onSubmit={submit}>
          {mode === "register" && <input value={name} onChange={e => setName(e.target.value)} placeholder="Nombre" required />}
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Contraseña" minLength={6} required />
          <button className="primary" disabled={busy}>{busy ? "Cargando…" : mode === "login" ? "Iniciar sesión" : "Crear cuenta"}</button>
        </form>
        {error && <div className="error">{error}</div>}
        {mode === "login" && <button className="link" onClick={forgot}>¿Olvidaste tu contraseña?</button>}
        <button className="switch" onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(""); }}>
          {mode === "login" ? "Crear una cuenta" : "Ya tengo una cuenta"}
        </button>
      </div>
    </main>
  );
}