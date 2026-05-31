import { createClient } from "@supabase/supabase-js";

// Verbindung zum Supabase-Projekt "LevelUp" (EU/Frankfurt).
// Hinweis: Der publishable Key ist – wie von Supabase vorgesehen – für den Client-Einsatz
// gedacht und ungefährlich offenzulegen. Der Zugriff auf Daten wird ausschließlich über
// Row-Level-Security (RLS) + Login geschützt, nicht über die Geheimhaltung dieses Keys.
// (Der service_role-Key wird NIEMALS im Client verwendet.)
const SUPABASE_URL =
  import.meta.env.VITE_SUPABASE_URL ?? "https://nxzxyoipywixovldhtfp.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  import.meta.env.VITE_SUPABASE_ANON_KEY ?? "sb_publishable_uMhuLUIZf2hV4Cm0b-7n-A_IijUA5Nc";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
