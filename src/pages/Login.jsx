import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { signIn, signUp } from "../services/authService";

const field =
  "w-full rounded-xl border border-line bg-surface p-3 outline-none focus:ring-2 focus:ring-primary";
const label = "mb-1 block text-sm text-fg-muted";

export default function Login() {
  const { user, loading } = useAuth();
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!loading && user) return <Navigate to="/" replace />;

  const isLogin = mode === "login";

  const switchMode = () => {
    setMode(isLogin ? "register" : "login");
    setError("");
    setInfo("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");

    if (!isLogin && password.length < 6)
      return setError("Password minimal 6 karakter.");

    setSubmitting(true);
    if (isLogin) {
      const { error } = await signIn(email.trim(), password);
      if (error) setError(error);
      // kalau sukses, AuthProvider update session lalu halaman ini redirect sendiri
    } else {
      const { error, needsConfirmation } = await signUp(email.trim(), password);
      if (error) setError(error);
      else if (needsConfirmation) {
        setInfo(
          "Pendaftaran berhasil. Cek email lu untuk verifikasi, lalu masuk.",
        );
        setMode("login");
      }
    }
    setSubmitting(false);
  };

  return (
    <main className="flex min-h-dvh items-center justify-center bg-page p-4">
      <title>{`${isLogin ? "Masuk" : "Daftar"} | Monthly Planner`}</title>

      <div className="w-full max-w-sm space-y-6">
        <header className="text-center">
          <h1 className="text-2xl font-bold text-primary">Monthly Planner</h1>
          <p className="mt-1 text-sm text-fg-muted">
            {isLogin ? "Masuk untuk melanjutkan" : "Buat akun baru"}
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          aria-label={isLogin ? "Form masuk" : "Form daftar"}
          className="space-y-4 rounded-2xl border border-line bg-surface p-5 shadow-sm"
        >
          <div>
            <label htmlFor="auth-email" className={label}>
              Email
            </label>
            <input
              id="auth-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={field}
            />
          </div>

          <div>
            <label htmlFor="auth-password" className={label}>
              Password
            </label>
            <input
              id="auth-password"
              type="password"
              required
              autoComplete={isLogin ? "current-password" : "new-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={field}
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-danger">
              {error}
            </p>
          )}
          {info && (
            <p role="status" className="text-sm text-primary">
              {info}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            aria-busy={submitting}
            className="w-full rounded-xl bg-primary py-3 font-semibold text-on-primary hover:bg-primary-hover active:bg-primary-hover disabled:opacity-60"
          >
            {submitting ? "Memproses..." : isLogin ? "Masuk" : "Daftar"}
          </button>
        </form>

        <p className="text-center text-sm text-fg-muted">
          {isLogin ? "Belum punya akun?" : "Sudah punya akun?"}{" "}
          <button
            type="button"
            onClick={switchMode}
            className="font-semibold text-primary"
          >
            {isLogin ? "Daftar" : "Masuk"}
          </button>
        </p>
      </div>
    </main>
  );
}
