import { NavLink } from "react-router-dom";
import { Home, Wallet, PlusCircle, History, PieChart } from "lucide-react";

const items = [
  { to: "/", label: "Home", icon: Home },
  { to: "/pockets", label: "Pocket", icon: Wallet },
  { to: "/add", label: "Tambah", icon: PlusCircle },
  { to: "/history", label: "History", icon: History },
  { to: "/summary", label: "Ringkasan", icon: PieChart },
];

export default function BottomNav() {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-gray-200 bg-white md:inset-x-auto md:inset-y-0 md:left-0 md:w-56 md:border-r md:border-t-0"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <p className="hidden px-5 pb-4 pt-6 text-lg font-bold text-emerald-600 md:block">
        Monthly Planner
      </p>

      <ul className="flex md:flex-col md:gap-1 md:px-3">
        {items.map(({ to, label, icon: Icon }) => (
          <li key={to} className="flex-1 md:flex-none">
            <NavLink
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 py-2 text-[11px] md:flex-row md:gap-3 md:rounded-xl md:px-3 md:py-2.5 md:text-sm ${
                  isActive
                    ? "font-semibold text-emerald-600 md:bg-emerald-50"
                    : "text-gray-500"
                }`
              }
            >
              <Icon size={22} />
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
