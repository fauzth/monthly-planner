import { Outlet } from "react-router-dom";
import BottomNav from "./BottomNav";
import Footer from "./Footer";
import { useFinance } from "../../hooks/useFinance";

export default function AppLayout() {
  const { loading, error, clearError } = useFinance();

  return (
    <div className="min-h-dvh bg-gray-50">
      <BottomNav />
      <main className="flex min-h-dvh flex-col pb-[calc(4.5rem_+_env(safe-area-inset-bottom))] md:pb-4 md:pl-56">
        <div className="mx-auto w-full max-w-md flex-1 md:max-w-3xl">
          {error && (
            <div className="m-4 mb-0 flex items-start justify-between gap-3 rounded-xl bg-red-50 p-3 text-sm text-red-700">
              <p>{error}</p>
              <button onClick={clearError} className="shrink-0 font-semibold">
                Tutup
              </button>
            </div>
          )}

          {loading ? (
            <p className="p-8 text-center text-sm text-gray-500">
              Memuat data...
            </p>
          ) : (
            <Outlet />
          )}
        </div>
        <Footer />
      </main>
    </div>
  );
}
