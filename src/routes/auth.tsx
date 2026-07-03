import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Yatravo" },
      { name: "description", content: "Sign in or create your Yatravo passport account." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [accountType, setAccountType] = useState<"customer" | "vendor">("customer");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  const destination = accountType === "vendor" ? "/vendors" : "/passport";


  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        const t = (data.session.user.user_metadata as any)?.account_type;
        navigate({ to: t === "vendor" ? "/vendors" : "/passport" });
      }
    });
  }, [navigate]);

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: {
            emailRedirectTo: `${window.location.origin}${destination}`,
            data: { display_name: name || email.split("@")[0], account_type: accountType },
          },
        });
        if (error) throw error;
        toast.success("Account created — you're in!");
        navigate({ to: destination });
      } else {
        const { error, data } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        // Update account_type on sign-in if user chose a different one
        const existing = (data.user?.user_metadata as any)?.account_type;
        if (existing !== accountType) {
          await supabase.auth.updateUser({ data: { account_type: accountType } });
        }
        toast.success("Welcome back");
        navigate({ to: destination });
      }
    } catch (err: any) {
      toast.error(err.message ?? "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setBusy(true);
    // Stash chosen account type so we can persist it after OAuth returns
    try { sessionStorage.setItem("yatravo_account_type", accountType); } catch {}
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: `${window.location.origin}${destination}`,
    });
    if (result.error) {
      toast.error("Google sign-in failed");
      setBusy(false);
      return;
    }
    if (result.redirected) return;
    await supabase.auth.updateUser({ data: { account_type: accountType } });
    navigate({ to: destination });
  }


  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="font-display font-semibold text-2xl tracking-tight">
          Yatravo<span className="text-teal">.</span>
        </Link>
        <h1 className="mt-8 font-display text-3xl">
          {mode === "signin" ? "Welcome back." : "Start your passport."}
        </h1>
        <p className="mt-2 text-mute">
          {mode === "signin" ? "Sign in to log trips and earn badges." : "It's free. Forever."}
        </p>

        <button
          onClick={handleGoogle}
          disabled={busy}
          className="mt-8 w-full pill-cta pill-ghost"
        >
          Continue with Google
        </button>

        <div className="my-6 flex items-center gap-3 text-xs text-mute font-mono-accent">
          <div className="flex-1 h-px bg-sand" /> OR <div className="flex-1 h-px bg-sand" />
        </div>

        <form onSubmit={handleEmail} className="space-y-3">
          {mode === "signup" && (
            <input
              type="text" placeholder="Your name"
              value={name} onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-sand bg-white focus:outline-none focus:border-teal"
            />
          )}
          <input
            type="email" required placeholder="Email"
            value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-sand bg-white focus:outline-none focus:border-teal"
          />
          <input
            type="password" required minLength={6} placeholder="Password (min 6 chars)"
            value={password} onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-sand bg-white focus:outline-none focus:border-teal"
          />
          <button disabled={busy} className="w-full pill-cta pill-primary">
            {busy ? "..." : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <button
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          className="mt-6 text-sm text-mute hover:text-teal w-full text-center"
        >
          {mode === "signin" ? "No account? Sign up" : "Have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}
