import { NavLink, useLocation } from "react-router-dom";
import type { ReactNode } from "react";

const navItems = [
  { to: "/", label: "Start", icon: "🏠", exact: true },
  { to: "/mitarbeiter", label: "Team", icon: "👥" },
  { to: "/visite/neu", label: "Visite", icon: "📋" },
  { to: "/einstellungen", label: "Daten", icon: "⚙️" },
];

export default function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col">
      <header className="sticky top-0 z-10 flex items-center gap-2 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur">
        <span className="text-2xl">📋</span>
        <div>
          <h1 className="text-lg font-bold leading-tight text-slate-900">LevelUp</h1>
          <p className="text-xs text-slate-500">Mitarbeitervisiten Pflege</p>
        </div>
      </header>

      <main className="flex-1 px-4 pb-28 pt-4">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-2xl items-stretch justify-around">
          {navItems.map((item) => {
            const active = item.exact
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to);
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={`flex flex-1 flex-col items-center gap-0.5 py-2.5 text-xs font-medium transition ${
                  active ? "text-brand-600" : "text-slate-400"
                }`}
              >
                <span className="text-xl leading-none">{item.icon}</span>
                {item.label}
              </NavLink>
            );
          })}
        </div>
        <div className="h-[env(safe-area-inset-bottom)]" />
      </nav>
    </div>
  );
}
