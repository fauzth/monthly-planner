import { Outlet } from "react-router-dom";
import BottomNav from "./BottomNav";
import Footer from "./Footer";

export default function AppLayout() {
  return (
    <div className="min-h-dvh bg-gray-50">
      <BottomNav />
      <main className="flex min-h-dvh flex-col pb-[calc(4.5rem_+_env(safe-area-inset-bottom))] md:pb-4 md:pl-56">
        <div className="mx-auto w-full max-w-md flex-1 md:max-w-3xl">
          <Outlet />
        </div>
        <Footer />
      </main>
    </div>
  );
}
