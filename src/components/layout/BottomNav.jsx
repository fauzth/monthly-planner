import { NavLink } from "react-router-dom";

const items = [
  { to: "/", label: "Home" },
  { to: "/pockets", label: "Pocket" },
  { to: "/add", label: "Tambah" },
  { to: "/history", label: "History" },
  { to: "/summary", label: "Ringkasan" },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-1/2 w-full max-w-md -translate-x-1/2 border-t bg-white">
      <ul className="flex justify-around py-3">
        {items.map((item) => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                `text-sm ${isActive ? "font-semibold text-emerald-600" : "text-gray-500"}`
              }
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
