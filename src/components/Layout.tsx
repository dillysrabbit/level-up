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
    <img
      src="/logo-mark.png"
      alt=""
      aria-hidden
      className="h-8 w-auto shrink-0 select-none"
      draggable={false}
    />
  );
}

export default function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-2xl flex-col">
      <header
        className="sticky top-0 z-10 flex items-center gap-3 border-b border-slate-200 bg-slate-50/90 px-4 pb-3 backdrop-blur-lg"
        style={{ paddingTop: "calc(env(safe-area-inset-top) + 0.75rem)" }}
      >
        <Logo />
        <div>
          <h1 className="font-serif text-lg font-medium leading-tight text-slate-900">LevelUp</h1>
          <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-slate-400">
            Mitarbeitervisiten Pflege
          </p>
        </div>
      </header>

      <main className="flex-1 px-4 pb-28 pt-5">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/95 backdrop-blur-lg">
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
