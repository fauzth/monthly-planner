import { supabase } from "../lib/supabaseClient";

const messages = {
  "Invalid login credentials": "Email atau password salah.",
  "User already registered": "Email ini sudah terdaftar. Silakan masuk.",
  "Email not confirmed": "Email belum diverifikasi. Cek inbox lu.",
};

const friendly = (error) =>
  error ? (messages[error.message] ?? error.message) : null;

export async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  return {
    // session null artinya Supabase menunggu verifikasi email
    needsConfirmation: !error && !data.session,
    error: friendly(error),
  };
}

export async function signIn(email, password) {
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return { error: friendly(error) };
}

export async function signOut() {
  await supabase.auth.signOut();
}
