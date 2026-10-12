// ============================================================
// King Decantes - Conexão Supabase Client (supabaseClient.js)
// ============================================================

const SUPABASE_URL = "https://nsvasuapyspighyvrrdr.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5zdmFzdWFweXNwaWdoeXZycmRyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDAxODIxOTUsImV4cCI6MjEwNzM4ODE5NX0.L3I_EBQI7WwnQLWHYlCoxS4LHGPA3MfYfyfgjDFpiaw";

// Inicialização segura do cliente global Supabase
window.supabase = window.supabase?.createClient 
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : (typeof createClient !== 'undefined' ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null);
