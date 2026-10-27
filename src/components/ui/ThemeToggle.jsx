import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";

const order = ["light", "dark", "system"];
const meta = {
  light: { icon: Sun, label: "Terang" },
  dark: { icon: Moon, label: "Gelap" },
  system: { icon: Monitor, label: "Otomatis" },
};

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const { icon: Icon, label } = meta[theme];
  const next = order[(order.indexOf(theme) + 1) % order.length];

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={`Tema: ${label}. Ketuk untuk ganti ke ${meta[next].label}.`}
      className="flex shrink-0 items-center gap-1 text-sm text-fg-muted"
    >
      <Icon size={16} aria-hidden="true" /> {label}
    </button>
  );
}
