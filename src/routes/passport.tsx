import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Plus, Camera, Sparkles, Star } from "lucide-react";
import { SiteShell } from "@/components/site-chrome";
import { PassportSummary } from "@/components/passport-summary";
import { TripList } from "@/components/trip-list";
import { LogTripModal } from "@/components/log-trip-modal";
import { PhotoDropModal } from "@/components/photo-drop-modal";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { computeBadges, computeTrustScore, type Trip } from "@/lib/trips";

export const Route = createFileRoute("/passport")({
  head: () => ({
    meta: [
      { title: "Travel Passport — Yatravo" },
      { name: "description", content: "Your travel life, in one place. Log trips, earn verified badges, build your travel identity." },
      { property: "og:title", content: "Travel Passport — Yatravo" },
      { property: "og:description", content: "Log every trip. Earn verified badges. Build your travel identity." },
      { property: "og:url", content: "/passport" },
    ],
    links: [{ rel: "canonical", href: "/passport" }],
  }),
  component: PassportPage,
});

function PassportPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [trips, setTrips] = useState<Trip[] | null>(null);
  const [confirmedIds, setConfirmedIds] = useState<Set<string>>(new Set());
  const [displayName, setDisplayName] = useState("Traveler");
  const [modalOpen, setModalOpen] = useState(false);
  const [photoOpen, setPhotoOpen] = useState(false);
  const [creatorSetupOpen, setCreatorSetupOpen] = useState(false);
  const [creatorHandle, setCreatorHandle] = useState<string | null>(null);

  const loadAll = useCallback(async (uid: string) => {
    const [{ data: tripsData }, { data: profile }, { data: creator }] = await Promise.all([
      supabase.from("trips").select("*").eq("user_id", uid).order("start_date", { ascending: false }),
      supabase.from("profiles").select("display_name").eq("user_id", uid).maybeSingle(),
      supabase.from("creator_profiles").select("handle").eq("user_id", uid).maybeSingle(),
    ]);
    const t = (tripsData ?? []) as Trip[];
    setTrips(t);
    if (profile?.display_name) setDisplayName(profile.display_name);
    setCreatorHandle(creator?.handle ?? null);
    if (t.length > 0) {
      const { data: confs } = await supabase
        .from("trip_confirmations")
        .select("trip_id")
        .in("trip_id", t.map((x) => x.id));
      setConfirmedIds(new Set((confs ?? []).map((c) => c.trip_id)));
    } else {
      setConfirmedIds(new Set());
    }
  }, []);

  useEffect(() => {
    if (loading) return;
    if (!user) { navigate({ to: "/auth" }); return; }
    loadAll(user.id);
  }, [user, loading, loadAll, navigate]);

  if (loading || !user || trips === null) {
    return (
      <SiteShell>
        <section className="px-6 lg:px-10 pt-12 pb-20 max-w-5xl mx-auto">
          <div className="h-48 rounded-2xl bg-sand/40 animate-pulse" />
          <div className="mt-8 h-12 rounded-lg bg-sand/40 animate-pulse" />
          <div className="mt-3 h-12 rounded-lg bg-sand/40 animate-pulse" />
        </section>
      </SiteShell>
    );
  }

  const trustScore = computeTrustScore(trips, confirmedIds);
  const earnedBadges = computeBadges(trips);

  return (
    <SiteShell>
      <section className="px-6 lg:px-10 pt-10 pb-24 max-w-5xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <div className="eyebrow">your passport</div>
            <h1 className="mt-2 font-display text-3xl md:text-4xl">Travel Passport</h1>
          </div>
          <div className="hidden sm:flex flex-col items-end gap-2">
            <button onClick={() => setPhotoOpen(true)} className="pill-cta pill-primary text-base px-6 py-3">
              <Sparkles className="w-4 h-4" /> Log a trip from photos
            </button>
            <button onClick={() => setModalOpen(true)} className="text-xs text-mute hover:text-teal inline-flex items-center gap-1">
              <Plus className="w-3 h-3" /> or log a trip manually
            </button>
          </div>
        </div>

        <PassportSummary name={displayName} trips={trips} trustScore={trustScore} />

        {earnedBadges.length > 0 && (
          <div className="mt-6">
            <div className="eyebrow mb-3">earned badges</div>
            <div className="flex flex-wrap gap-2">
              {earnedBadges.map((b) => (
                <span key={b.key} className="font-mono-accent text-xs px-3 py-1.5 rounded-full"
                      style={{ background: "#E1F5EE", color: "#085041" }}>
                  {b.label}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="mt-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display text-2xl">Trip history</h2>
            <Link to="/" className="text-xs text-mute hover:text-teal hidden md:block">
              ← Back to home
            </Link>
          </div>

          {trips.length === 0 ? (
            <div className="bg-white border border-sand rounded-xl p-10 text-center">
              <div className="font-display text-xl">Your passport is empty.</div>
              <p className="mt-2 text-mute max-w-sm mx-auto">
                Log your first trip to start earning badges.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-2 justify-center">
                <button onClick={() => setPhotoOpen(true)} className="pill-cta pill-primary">
                  <Sparkles className="w-4 h-4" /> Log a trip from photos
                </button>
                <button onClick={() => setModalOpen(true)} className="pill-cta bg-white border border-sand text-ink hover:border-teal">
                  <Plus className="w-4 h-4" /> Log manually
                </button>
              </div>
            </div>
          ) : (
            <TripList trips={trips} />
          )}
        </div>

        <div className="sm:hidden fixed bottom-6 right-6 z-40 flex flex-col gap-3 items-end">
          <button
            onClick={() => setModalOpen(true)}
            className="w-12 h-12 rounded-full bg-white border border-sand text-ink shadow-md flex items-center justify-center"
            aria-label="Log a trip manually"
          >
            <Plus className="w-5 h-5" />
          </button>
          <button
            onClick={() => setPhotoOpen(true)}
            className="w-14 h-14 rounded-full bg-teal text-white shadow-lg flex items-center justify-center"
            aria-label="Log a trip from photos"
          >
            <Camera className="w-6 h-6" />
          </button>
        </div>

        {/* Become a creator */}
        <div className="mt-10 bg-white border border-sand rounded-2xl p-5 flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-teal/10 text-teal flex items-center justify-center shrink-0">
            <Star className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="font-display text-lg">Are you a travel creator?</div>
            <p className="text-sm text-mute mt-1">
              {creatorHandle
                ? "Your creator profile is live — manage it from your dashboard."
                : "Activate your creator profile — show your audience the destinations you've actually been to."}
            </p>
          </div>
          {creatorHandle ? (
            <Link to="/creator/dashboard" className="pill-cta bg-white border border-sand text-ink hover:border-teal text-sm shrink-0">Dashboard</Link>
          ) : (
            <button onClick={() => setCreatorSetupOpen(true)} className="pill-cta pill-ghost text-sm shrink-0">Activate creator profile</button>
          )}
        </div>
      </section>

      <LogTripModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSaved={() => loadAll(user.id)}
        userId={user.id}
      />
      <PhotoDropModal
        open={photoOpen}
        onClose={() => setPhotoOpen(false)}
        onSaved={() => loadAll(user.id)}
        userId={user.id}
      />
      <CreatorSetupModal
        open={creatorSetupOpen}
        onClose={() => setCreatorSetupOpen(false)}
        userId={user.id}
        seedDestinations={trips.map((t) => t.destination)}
        onDone={(h) => { setCreatorSetupOpen(false); setCreatorHandle(h); navigate({ to: "/creator/$handle", params: { handle: h } }); }}
      />
    </SiteShell>
  );
}
