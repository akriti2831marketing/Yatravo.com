import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Copy, ExternalLink, CheckCircle2, Instagram, Users, Eye } from "lucide-react";
import { SiteShell } from "@/components/site-chrome";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { computeCreatorBadge, type CreatorProfile } from "@/lib/creator";
import type { Trip } from "@/lib/trips";

export const Route = createFileRoute("/creator/dashboard")({
  head: () => ({ meta: [{ title: "Creator dashboard — Yatravo" }, { name: "robots", content: "noindex" }] }),
  component: Dashboard,
});

function Dashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<CreatorProfile | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [trustScore, setTrustScore] = useState(0);
  const [followers, setFollowers] = useState(0);
  const [viewsWeek, setViewsWeek] = useState(0);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) { navigate({ to: "/auth" }); return; }
    (async () => {
      const { data: prof } = await supabase.from("creator_profiles").select("*").eq("user_id", user.id).maybeSingle();
      if (!prof) { navigate({ to: "/passport" }); return; }
      const p = prof as CreatorProfile;
      setProfile(p);
      const [{ data: t }, { data: s }, { count: fc }, { count: vc }] = await Promise.all([
        supabase.from("trips").select("*").eq("user_id", user.id).order("start_date", { ascending: false }),
        supabase.from("user_trust_scores").select("trust_score").eq("user_id", user.id).maybeSingle(),
        supabase.from("creator_followers").select("*", { count: "exact", head: true }).eq("creator_id", p.id),
        supabase.from("creator_profile_views").select("*", { count: "exact", head: true }).eq("creator_id", p.id)
          .gte("viewed_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()),
      ]);
      setTrips((t as Trip[]) ?? []);
      setTrustScore(s?.trust_score ?? 0);
      setFollowers(fc ?? 0);
      setViewsWeek(vc ?? 0);
    })();
  }, [user, loading, navigate]);

  async function toggleTripPublic(tripId: string, isPublic: boolean) {
    setBusy(true);
    await supabase.from("trips").update({ is_public: isPublic }).eq("id", tripId);
    setTrips((cur) => cur.map((t) => t.id === tripId ? { ...t, is_public: isPublic } as Trip : t));
    setBusy(false);
  }

  async function updateSetting(key: keyof CreatorProfile, value: boolean | string | null) {
    if (!profile) return;
    await supabase.from("creator_profiles").update({ [key]: value } as any).eq("id", profile.id);
    setProfile({ ...profile, [key]: value } as CreatorProfile);
  }

  if (!profile) return <SiteShell><div className="max-w-4xl mx-auto p-10 h-40 bg-sand/40 rounded-2xl animate-pulse" /></SiteShell>;

  const badge = computeCreatorBadge(profile, trips.filter((t) => t.trip_type !== "upcoming").length, trustScore);
  const upcoming = trips.filter((t) => t.trip_type === "upcoming");
  const profileUrl = `${window.location.origin}/creator/${profile.handle}`;

  return (
    <SiteShell>
      <section className="px-6 lg:px-10 pt-10 pb-20 max-w-5xl mx-auto">
        <div className="eyebrow">creator dashboard</div>
        <h1 className="mt-2 font-display text-3xl md:text-4xl">Welcome back, {profile.creator_name}</h1>
        <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
          <span className="text-mute">Your profile:</span>
          <span className="font-mono-accent text-teal">yatravo.com/creator/{profile.handle}</span>
          <button onClick={() => { navigator.clipboard.writeText(profileUrl); toast.success("Link copied"); }} className="inline-flex items-center gap-1 text-mute hover:text-teal">
            <Copy className="w-3.5 h-3.5" /> Copy
          </button>
          <Link to="/creator/$handle" params={{ handle: profile.handle }} className="inline-flex items-center gap-1 text-mute hover:text-teal">
            <ExternalLink className="w-3.5 h-3.5" /> Preview
          </Link>
        </div>

        {/* Metric cards */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          <Metric icon={<Eye className="w-4 h-4" />} label="Views this week" value={viewsWeek} />
          <Metric icon={<Users className="w-4 h-4" />} label="Tribe followers" value={followers} />
          <Metric icon={<CheckCircle2 className="w-4 h-4" />} label="Trips logged" value={trips.filter((t) => t.trip_type !== "upcoming").length} />
          <Metric icon={<CheckCircle2 className="w-4 h-4" />} label="Trust score" value={`${trustScore}/100`} />
        </div>

        {/* Badge */}
        <div className={`mt-8 p-5 rounded-2xl ${badge.earned ? "bg-[#E1F5EE] border border-teal/30" : "bg-white border border-sand"}`}>
          {badge.earned ? (
            <div className="flex items-start gap-4">
              <CheckCircle2 className="w-10 h-10 text-teal fill-teal/20" />
              <div>
                <h2 className="font-display text-xl">You're a Verified Creator</h2>
                <p className="mt-1 text-sm text-ink/80">Your badge is active and visible across Yatravo.</p>
              </div>
            </div>
          ) : (
            <div>
              <h2 className="font-display text-xl">Your path to Verified Creator</h2>
              <div className="mt-4 space-y-2 text-sm">
                <Check on={badge.instagramConnected}>Connect Instagram account {!badge.instagramConnected && <span className="text-teal">— add below</span>}</Check>
                <Check on={badge.instagramFollowers}>Reach 1,000+ followers ({badge.followerCount} so far)</Check>
                <Check on={badge.tripsLogged}>Log 5 verified trips ({badge.tripCount} of 5 done)</Check>
                <Check on={badge.trustScoreQualified}>Reach trust score of 70+ ({trustScore}/100)</Check>
                <Check on={badge.commitmentAgreed}>Complete creator commitment</Check>
              </div>
            </div>
          )}
        </div>

        {/* Instagram */}
        <div className="mt-6 bg-white border border-sand rounded-2xl p-5">
          <h3 className="font-display text-lg inline-flex items-center gap-2"><Instagram className="w-5 h-5 text-ember" /> Instagram</h3>
          {profile.instagram_username ? (
            <div className="mt-3 flex items-center justify-between">
              <div>
                <div className="text-sm">@{profile.instagram_username} · {profile.instagram_followers?.toLocaleString() ?? 0} followers</div>
                {profile.instagram_connected_at && <div className="text-xs text-mute">Connected {new Date(profile.instagram_connected_at).toLocaleDateString()}</div>}
              </div>
              <button onClick={async () => {
                await supabase.from("creator_profiles").update({ instagram_username: null, instagram_followers: null, instagram_connected_at: null }).eq("id", profile.id);
                setProfile({ ...profile, instagram_username: null, instagram_followers: null, instagram_connected_at: null });
              }} className="text-xs text-mute hover:text-ink">Disconnect</button>
            </div>
          ) : (
            <div className="mt-3 flex items-center gap-2">
              <input placeholder="@handle" onKeyDown={async (e) => {
                if (e.key === "Enter") {
                  const v = (e.target as HTMLInputElement).value.replace(/^@/, "").trim();
                  if (!v) return;
                  await supabase.from("creator_profiles").update({ instagram_username: v, instagram_connected_at: new Date().toISOString() }).eq("id", profile.id);
                  setProfile({ ...profile, instagram_username: v, instagram_connected_at: new Date().toISOString() });
                }
              }} className="flex-1 px-3 py-2 border border-sand rounded-lg text-sm" />
              <span className="text-xs text-mute">Press Enter</span>
            </div>
          )}
        </div>

        {/* Upcoming trips */}
        <div className="mt-6 bg-white border border-sand rounded-2xl p-5">
          <h3 className="font-display text-lg">Your upcoming trips</h3>
          {upcoming.length === 0 ? (
            <p className="mt-2 text-sm text-mute">No upcoming trips yet. Log one from your <Link to="/passport" className="text-teal underline">Passport</Link>.</p>
          ) : (
            <div className="mt-3 space-y-2">
              {upcoming.map((t) => (
                <div key={t.id} className="flex items-center justify-between p-3 border border-sand rounded-lg">
                  <div>
                    <div className="font-medium">{t.destination}</div>
                    <div className="text-xs text-mute">{new Date(t.start_date).toLocaleDateString()}</div>
                  </div>
                  <label className="text-xs inline-flex items-center gap-2">
                    <input type="checkbox" checked={(t as any).is_public ?? false} disabled={busy}
                      onChange={(e) => toggleTripPublic(t.id, e.target.checked)} className="accent-teal" />
                    Public on profile
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Settings */}
        <div className="mt-6 bg-white border border-sand rounded-2xl p-5">
          <h3 className="font-display text-lg">Profile settings</h3>
          <div className="mt-3 space-y-3 text-sm">
            <Toggle label="Show upcoming trips on my public profile" value={profile.show_upcoming_trips} onChange={(v) => updateSetting("show_upcoming_trips", v)} />
            <Toggle label="Allow trip join requests" value={profile.allow_join_requests} onChange={(v) => updateSetting("allow_join_requests", v)} />
            <Toggle label="Show Instagram follower count" value={profile.show_instagram_count} onChange={(v) => updateSetting("show_instagram_count", v)} />
            <div>
              <label className="text-xs text-mute">Bio</label>
              <input defaultValue={profile.bio ?? ""} onBlur={(e) => updateSetting("bio", e.target.value)} className="mt-1 w-full px-3 py-2 border border-sand rounded-lg" />
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: number | string }) {
  return (
    <div className="bg-white border border-sand rounded-xl p-4">
      <div className="flex items-center gap-1 text-mute"><span>{icon}</span><span className="text-[11px] uppercase font-mono-accent tracking-wider">{label}</span></div>
      <div className="mt-2 font-mono-accent text-2xl">{value}</div>
    </div>
  );
}
function Check({ on, children }: { on: boolean; children: React.ReactNode }) {
  return <div className={`flex items-center gap-2 ${on ? "text-ink" : "text-mute"}`}>{on ? "✓" : "○"} {children}</div>;
}
function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex items-center justify-between gap-4 cursor-pointer">
      <span>{label}</span>
      <button type="button" onClick={() => onChange(!value)} className={`w-10 h-6 rounded-full transition-colors relative ${value ? "bg-teal" : "bg-sand"}`}>
        <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white transition-all ${value ? "left-[18px]" : "left-0.5"}`} />
      </button>
    </label>
  );
}
