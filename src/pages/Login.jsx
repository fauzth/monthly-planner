import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { signIn, signUp } from "../services/authService";

const field =
  "w-full rounded-xl border border-gray-300 bg-white p-3 outline-none focus:ring-2 focus:ring-emerald-500";

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
    <div className="flex min-h-dvh items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-emerald-600">
            Monthly Planner
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {isLogin ? "Masuk untuk melanjutkan" : "Buat akun baru"}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl bg-white p-5 shadow-sm"
        >
          <div>
            <label className="mb-1 block text-sm text-gray-600">Email</label>
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={field}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-gray-600">Password</label>
            <input
              type="password"
              required
              autoComplete={isLogin ? "current-password" : "new-password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={field}
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {info && <p className="text-sm text-emerald-700">{info}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-emerald-600 py-3 font-semibold text-white active:bg-emerald-700 disabled:opacity-60"
          >
            {submitting ? "Memproses..." : isLogin ? "Masuk" : "Daftar"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          {isLogin ? "Belum punya akun?" : "Sudah punya akun?"}{" "}
          <button
            onClick={switchMode}
            className="font-semibold text-emerald-600"
          >
            {isLogin ? "Daftar" : "Masuk"}
          </button>
        </p>
      </div>
    </div>
  );
}
