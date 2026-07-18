import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle2, Instagram, MapPin, ShieldCheck, Users, Camera, Building2 } from "lucide-react";
import { SiteShell } from "@/components/site-chrome";
import { supabase } from "@/integrations/supabase/client";
import { computeCreatorBadge, type CreatorProfile } from "@/lib/creator";
import type { Trip } from "@/lib/trips";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/creator/$handle")({
  head: ({ params }) => ({
    meta: [
      { title: `@${params.handle} — Yatravo creator` },
      { name: "description", content: `Verified travel creator on Yatravo. Real destinations, real trips.` },
      { property: "og:title", content: `@${params.handle} on Yatravo` },
      { property: "og:description", content: "Verified travel creator with real destinations logged on Yatravo." },
    ],
  }),
  component: CreatorProfilePage,
});

function CreatorProfilePage() {
  const { handle } = useParams({ from: "/creator/$handle" });
  const { user } = useAuth();
  const [profile, setProfile] = useState<CreatorProfile | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [trustScore, setTrustScore] = useState(0);
  const [followers, setFollowers] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: prof } = await supabase.from("creator_profiles").select("*").eq("handle", handle).maybeSingle();
      if (cancelled) return;
      if (!prof) { setLoading(false); return; }
      const p = prof as CreatorProfile;
      setProfile(p);

      const [{ data: tripsData }, { data: score }, { count: fCount }] = await Promise.all([
        supabase.from("trips").select("*").eq("user_id", p.user_id).eq("is_public", true).order("start_date", { ascending: false }),
        supabase.from("user_trust_scores").select("trust_score").eq("user_id", p.user_id).maybeSingle(),
        supabase.from("creator_followers").select("*", { count: "exact", head: true }).eq("creator_id", p.id),
      ]);
      if (cancelled) return;
      setTrips((tripsData as Trip[]) ?? []);
      setTrustScore(score?.trust_score ?? 0);
      setFollowers(fCount ?? 0);

      // log a view
      await supabase.from("creator_profile_views").insert({ creator_id: p.id, viewer_user_id: user?.id ?? null });

      if (user) {
        const { data: fol } = await supabase.from("creator_followers").select("id").eq("creator_id", p.id).eq("follower_user_id", user.id).maybeSingle();
        if (!cancelled) setIsFollowing(!!fol);
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [handle, user]);

  async function toggleFollow() {
    if (!user || !profile) return;
    if (isFollowing) {
      await supabase.from("creator_followers").delete().eq("creator_id", profile.id).eq("follower_user_id", user.id);
      setIsFollowing(false); setFollowers((n) => Math.max(0, n - 1));
    } else {
      await supabase.from("creator_followers").insert({ creator_id: profile.id, follower_user_id: user.id });
      setIsFollowing(true); setFollowers((n) => n + 1);
    }
  }

  if (loading) return <SiteShell><div className="max-w-4xl mx-auto p-10"><div className="h-40 bg-sand/40 rounded-2xl animate-pulse" /></div></SiteShell>;
  if (!profile) return (
    <SiteShell>
      <div className="max-w-2xl mx-auto p-12 text-center">
        <h1 className="font-display text-3xl">Creator not found</h1>
        <p className="mt-2 text-mute">No Yatravo creator with the handle @{handle}.</p>
        <Link to="/creators" className="mt-6 inline-block pill-cta pill-primary">Browse creators</Link>
      </div>
    </SiteShell>
  );

  const badge = computeCreatorBadge(profile, trips.length, trustScore);
  const pastTrips = trips.filter((t) => t.trip_type !== "upcoming");
  const upcoming = trips.filter((t) => t.trip_type === "upcoming");
  const photos = pastTrips.filter((t) => t.best_photo_url).slice(0, 9);
  const destinations = Array.from(new Map(pastTrips.map((t) => [t.destination, t])).values()).slice(0, 12);

  return (
    <SiteShell>
      {/* Cover */}
      <div className="w-full h-[140px] md:h-[180px] relative" style={{ background: "linear-gradient(135deg, #0D2622 0%, #0E7C6B 100%)" }}>
        {profile.cover_photo_url && <img src={profile.cover_photo_url} alt="" className="absolute inset-0 w-full h-full object-cover opacity-70" />}
      </div>

      <section className="px-6 lg:px-10 max-w-4xl mx-auto -mt-9 pb-20">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div className="flex items-end gap-4">
            <div className="w-[72px] h-[72px] rounded-full bg-sand border-4 border-white flex items-center justify-center font-display text-2xl text-teal">
              {profile.creator_name[0]?.toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-2xl md:text-3xl">{profile.creator_name}</h1>
                {profile.verified_creator && (
                  <span className="inline-flex items-center gap-1 text-xs text-teal font-medium">
                    <CheckCircle2 className="w-4 h-4 fill-teal/10" /> Verified Creator
                  </span>
                )}
              </div>
              <div className="font-mono-accent text-sm text-mute">@{profile.handle}</div>
              {profile.instagram_username && profile.show_instagram_count && profile.instagram_followers ? (
                <div className="mt-1 inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-ember/10 text-ember">
                  <Instagram className="w-3 h-3" /> {formatCount(profile.instagram_followers)} on Instagram
                </div>
              ) : null}
              {profile.bio && <p className="mt-2 text-sm text-ink max-w-md">{profile.bio}</p>}
            </div>
          </div>
          <div>
            {user ? (
              user.id === profile.user_id ? (
                <Link to="/creator/dashboard" className="pill-cta bg-white border border-sand text-ink hover:border-teal">Manage profile</Link>
              ) : (
                <button onClick={toggleFollow} className={`pill-cta ${isFollowing ? "bg-white border border-teal text-teal" : "pill-primary"}`}>
                  {isFollowing ? "Following" : "Follow on Yatravo"}
                </button>
              )
            ) : (
              <Link to="/auth" className="pill-cta pill-primary">Join Yatravo free to follow</Link>
            )}
          </div>
        </div>

        {/* Stats bar */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 pb-6 border-b border-sand">
          <Stat icon={<Camera className="w-4 h-4" />} label="Trips logged" value={pastTrips.length} />
          <Stat icon={<MapPin className="w-4 h-4" />} label="Destinations" value={destinations.length} />
          <Stat icon={<ShieldCheck className="w-4 h-4" />} label="Trust score" value={`${trustScore}/100`} />
          <Stat icon={<Users className="w-4 h-4" />} label="Tribe followers" value={followers} />
        </div>

        {/* Badge */}
        <div className={`mt-8 p-5 rounded-2xl ${badge.earned ? "bg-[#E1F5EE] border border-teal/30" : "bg-sand/40 border border-sand"}`}>
          <div className="flex items-start gap-4">
            <CheckCircle2 className={`w-10 h-10 shrink-0 ${badge.earned ? "text-teal fill-teal/20" : "text-mute"}`} />
            <div className="flex-1">
              <div className="font-display text-lg">{badge.earned ? "Verified Creator" : "Verification pending — building trip history"}</div>
              {badge.earned ? (
                <>
                  <p className="mt-1 text-sm text-ink/80">
                    This creator has connected a social account with verified followers AND logged 5+ real trips on Yatravo with a trust score above 70. Both numbers are independently verified.
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Pill>✓ Real followers</Pill><Pill>✓ Real trips</Pill><Pill>✓ Real destinations</Pill>
                  </div>
                </>
              ) : (
                <div className="mt-2 space-y-1 text-sm text-mute">
                  <div>{badge.tripsLogged ? "✓" : "○"} {badge.tripCount} of 5 trips logged</div>
                  <div>{badge.trustScoreQualified ? "✓" : "○"} trust score {trustScore}/70 required</div>
                  <div>{badge.instagramConnected ? "✓" : "○"} Instagram connected</div>
                  <div>{badge.instagramFollowers ? "✓" : "○"} 1,000+ followers</div>
                </div>
              )}
            </div>
          </div>
        </div>

        {(profile.content_styles ?? []).length > 0 && (
          <div className="mt-8">
            <div className="eyebrow mb-2">what I create content about</div>
            <div className="flex flex-wrap gap-2">
              {(profile.content_styles ?? []).map((s) => (
                <span key={s} className="text-xs font-mono-accent px-3 py-1 rounded-full bg-teal/10 text-teal">{s}</span>
              ))}
            </div>
          </div>
        )}

        {/* Destinations */}
        <div className="mt-10">
          <h2 className="font-display text-2xl">Where I've actually been</h2>
          <p className="mt-1 text-sm text-mute">Every destination below is logged and verified on Yatravo — not just posted about.</p>
          {destinations.length === 0 ? (
            <p className="mt-4 text-sm text-mute">No public trips yet.</p>
          ) : (
            <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-3">
              {destinations.map((t) => (
                <div key={t.id} className="rounded-xl p-3 text-white" style={{ background: "#0D2622" }}>
                  <div className="font-mono-accent text-sm">{t.destination}</div>
                  {t.state && <div className="text-[11px] text-teal/70 mt-0.5">{t.state}</div>}
                  <div className="mt-2 flex gap-1">
                    {t.best_photo_url && <Camera className="w-3 h-3 text-teal/80" />}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming */}
        {profile.show_upcoming_trips && upcoming.length > 0 && (
          <div className="mt-10">
            <h2 className="font-display text-2xl">Where I'm heading next</h2>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcoming.map((t) => (
                <div key={t.id} className="bg-white border border-sand rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <div className="font-display text-lg">{t.destination}</div>
                    <div className="text-xs text-mute">{new Date(t.start_date).toLocaleDateString()} — {new Date(t.end_date).toLocaleDateString()}</div>
                  </div>
                  {profile.allow_join_requests && user && user.id !== profile.user_id && (
                    <button className="pill-cta pill-primary text-sm">Request to join</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Photo grid */}
        {photos.length > 0 && (
          <div className="mt-10">
            <h2 className="font-display text-2xl">From my journeys</h2>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {photos.map((t) => (
                <div key={t.id} className="aspect-square rounded-lg overflow-hidden bg-sand">
                  <img src={t.best_photo_url!} alt={t.destination} loading="lazy" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Socials */}
        {(profile.instagram_username || profile.youtube_username || profile.website_url) && (
          <div className="mt-10 pt-6 border-t border-sand flex flex-wrap gap-4 text-sm">
            {profile.instagram_username && (
              <a href={`https://instagram.com/${profile.instagram_username}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-ember hover:underline">
                <Instagram className="w-4 h-4" /> @{profile.instagram_username}
              </a>
            )}
            {profile.website_url && (
              <a href={profile.website_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-teal hover:underline">
                <Building2 className="w-4 h-4" /> Website
              </a>
            )}
          </div>
        )}
      </section>
    </SiteShell>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: number | string }) {
  return (
    <div>
      <div className="flex items-center gap-1 text-mute">{icon}<span className="text-[11px] uppercase font-mono-accent tracking-wider">{label}</span></div>
      <div className="font-mono-accent text-2xl font-medium mt-1">{value}</div>
    </div>
  );
}
function Pill({ children }: { children: React.ReactNode }) {
  return <span className="text-[11px] font-mono-accent px-2 py-1 rounded-full bg-white text-teal border border-teal/20">{children}</span>;
}
function formatCount(n: number) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
  if (n >= 1000) return (n / 1000).toFixed(n >= 10000 ? 0 : 1) + "K";
  return String(n);
}
