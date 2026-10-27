import { Outlet } from "react-router-dom";
import BottomNav from "./BottomNav";
import Footer from "./Footer";
import { useFinance } from "../../hooks/useFinance";

export default function AppLayout() {
  const { loading, error, clearError } = useFinance();

  return (
    <div className="min-h-dvh bg-page">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-on-primary"
      >
        Lewati ke konten
      </a>

      <BottomNav />

      <div className="flex min-h-dvh flex-col pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:pb-4 md:pl-56">
        <main
          id="main-content"
          tabIndex={-1}
          className="mx-auto w-full max-w-md flex-1 outline-none md:max-w-3xl"
        >
          {error && (
            <div
              role="alert"
              className="m-4 mb-0 flex items-start justify-between gap-3 rounded-xl bg-danger-soft p-3 text-sm text-danger-soft-fg"
            >
              <p>{error}</p>
              <button
                type="button"
                onClick={clearError}
                aria-label="Tutup pesan kesalahan"
                className="shrink-0 font-semibold"
              >
                Tutup
              </button>
            </div>
          )}

          {loading ? (
            <p role="status" className="p-8 text-center text-sm text-fg-muted">
              Memuat data...
            </p>
          ) : (
            <Outlet />
          )}
        </main>

        <Footer />
      </div>
    </div>
  );
}
