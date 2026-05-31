import App from "./App";
import Login from "./pages/Login";
import { useAuth } from "./store/auth";
import { StoreProvider } from "./store/store";

function Splash() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-300 border-t-brand-600" />
    </div>
  );
}

/** Entscheidet anhand der Session, ob Login oder die App (mit Datenstore) angezeigt wird. */
export default function Root() {
  const { session, loading } = useAuth();

  if (loading) return <Splash />;
  if (!session) return <Login />;

  return (
    <StoreProvider>
      <App />
    </StoreProvider>
  );
}
