import { NavLink, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { HomeIcon, TeamIcon, VisitIcon, DataIcon } from "./icons";

const navItems = [
  { to: "/", label: "Start", Icon: HomeIcon, exact: true },
  { to: "/mitarbeiter", label: "Team", Icon: TeamIcon },
  { to: "/visite/neu", label: "Visite", Icon: VisitIcon },
  { to: "/einstellungen", label: "Daten", Icon: DataIcon },
];

function Logo() {
  return (
    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 shadow-sm">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="6" y="13" width="3" height="6" rx="1" fill="white" />
        <rect x="10.5" y="9" width="3" height="10" rx="1" fill="white" />
        <rect x="15" y="5" width="3" height="14" rx="1" fill="white" />
      </svg>
    </div>
  );
}

export default function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col">
      <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-slate-200/70 bg-white/80 px-4 py-3 backdrop-blur-lg">
        <Logo />
        <div>
          <h1 className="text-base font-bold leading-tight text-slate-900">LevelUp</h1>
          <p className="text-xs font-medium text-slate-400">Mitarbeitervisiten Pflege</p>
        </div>
      </header>

      <main className="flex-1 px-4 pb-28 pt-5">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200/70 bg-white/90 backdrop-blur-lg">
        <div className="mx-auto flex max-w-2xl items-stretch justify-around">
          {navItems.map(({ to, label, Icon, exact }) => {
            const active = exact ? location.pathname === to : location.pathname.startsWith(to);
            return (
              <NavLink
                key={to}
                to={to}
                className={`flex flex-1 flex-col items-center gap-1 py-2.5 text-[0.7rem] font-medium transition ${
                  active ? "text-brand-600" : "text-slate-400 hover:text-slate-600"
                }`}
              >
                <Icon size={22} strokeWidth={active ? 2.4 : 1.9} />
                {label}
              </NavLink>
            );
          })}
        </div>
        <div className="h-[env(safe-area-inset-bottom)]" />
      </nav>
    </div>
  );
}
