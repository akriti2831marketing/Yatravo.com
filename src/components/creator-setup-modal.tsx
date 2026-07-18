import { useState } from "react";
import { X, Instagram, Check, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { CONTENT_STYLES, PLATFORMS, YEARS_OPTIONS, slugifyHandle } from "@/lib/creator";
import { generateCreatorBios } from "@/lib/creator-bio.functions";
import { useServerFn } from "@tanstack/react-start";

type Props = {
  open: boolean;
  onClose: () => void;
  userId: string;
  onDone: (handle: string) => void;
  seedDestinations?: string[];
};

export function CreatorSetupModal({ open, onClose, userId, onDone, seedDestinations = [] }: Props) {
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [handle, setHandle] = useState("");
  const [platform, setPlatform] = useState<string>("Instagram");
  const [styles, setStyles] = useState<string[]>([]);
  const [bio, setBio] = useState("");
  const [years, setYears] = useState<string>("1–3 years");
  const [igUser, setIgUser] = useState("");
  const [igFollowers, setIgFollowers] = useState<string>("");
  const [commit, setCommit] = useState([false, false, false]);
  const [bios, setBios] = useState<string[]>([]);
  const [genLoading, setGenLoading] = useState(false);
  const genBios = useServerFn(generateCreatorBios);

  if (!open) return null;

  const toggleStyle = (s: string) => {
    setStyles((cur) => cur.includes(s) ? cur.filter((x) => x !== s) : cur.length >= 3 ? cur : [...cur, s]);
  };

  async function suggestBio() {
    setGenLoading(true);
    try {
      const { bios } = await genBios({ data: { destinations: seedDestinations, contentStyles: styles, yearsTravelling: years } });
      setBios(bios);
    } catch (e: any) {
      toast.error(e?.message ?? "Couldn't generate bios");
    } finally {
      setGenLoading(false);
    }
  }

  async function finish() {
    if (!commit.every(Boolean)) return;
    setSaving(true);
    const finalHandle = slugifyHandle(handle || name);
    if (!finalHandle) { toast.error("Choose a handle"); setSaving(false); return; }
    const followers = igUser.trim() && igFollowers ? parseInt(igFollowers.replace(/[^0-9]/g, ""), 10) || 0 : null;
    const { error } = await supabase.from("creator_profiles").insert({
      user_id: userId,
      handle: finalHandle,
      creator_name: name.trim() || finalHandle,
      bio: bio.trim() || null,
      primary_platform: platform,
      content_styles: styles,
      years_travelling: years,
      instagram_username: igUser.trim() || null,
      instagram_followers: followers,
      instagram_connected_at: igUser.trim() ? new Date().toISOString() : null,
      commitment_agreed: true,
      commitment_agreed_at: new Date().toISOString(),
    });
    setSaving(false);
    if (error) { toast.error(error.message.includes("duplicate") ? "That handle is taken" : error.message); return; }
    onDone(finalHandle);
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-6" onClick={onClose}>
      <div className="bg-white w-full max-w-lg rounded-t-2xl sm:rounded-2xl max-h-[92vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 pt-5 pb-3 sticky top-0 bg-white border-b border-sand">
          <div>
            <div className="eyebrow">step {step} of 3</div>
            <h2 className="font-display text-xl mt-1">Activate your creator profile</h2>
          </div>
          <button onClick={onClose} className="text-mute hover:text-ink" aria-label="Close"><X className="w-5 h-5" /></button>
        </div>

        <div className="px-6 py-5">
          {step === 1 && (
            <div className="space-y-5">
              <h3 className="font-display text-lg">Tell us about your content</h3>
              <div>
                <label className="text-xs text-mute">Creator name</label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="How your audience knows you"
                  className="mt-1 w-full px-3 py-2 border border-sand rounded-lg" />
              </div>
              <div>
                <label className="text-xs text-mute">Handle (letters, numbers, underscore)</label>
                <div className="mt-1 flex items-center border border-sand rounded-lg px-3 py-2">
                  <span className="text-mute text-sm mr-1">yatravo.com/creator/</span>
                  <input value={handle} onChange={(e) => setHandle(slugifyHandle(e.target.value))} placeholder="yourhandle" className="flex-1 outline-none" />
                </div>
              </div>
              <div>
                <label className="text-xs text-mute">Primary platform</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {PLATFORMS.map((p) => (
                    <button key={p} onClick={() => setPlatform(p)}
                      className={`px-3 py-1.5 rounded-full text-sm border ${platform === p ? "bg-teal text-white border-teal" : "border-sand text-ink hover:border-teal"}`}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-mute">Content style (pick up to 3)</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {CONTENT_STYLES.map((s) => {
                    const on = styles.includes(s);
                    return (
                      <button key={s} onClick={() => toggleStyle(s)}
                        className={`px-3 py-1.5 rounded-full text-sm border ${on ? "bg-teal text-white border-teal" : "border-sand text-ink hover:border-teal"}`}>
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-xs text-mute">One-line bio (max 120)</label>
                  <button onClick={suggestBio} disabled={genLoading} className="text-xs text-teal inline-flex items-center gap-1 hover:underline disabled:opacity-50">
                    {genLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />} Generate bio
                  </button>
                </div>
                <input value={bio} onChange={(e) => setBio(e.target.value.slice(0, 120))} placeholder="Honest travel. No scripts. 23 states and counting."
                  className="mt-1 w-full px-3 py-2 border border-sand rounded-lg" />
                {bios.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {bios.map((b, i) => (
                      <button key={i} onClick={() => { setBio(b); setBios([]); }}
                        className="w-full text-left text-sm p-2 border border-sand rounded-lg hover:border-teal">{b}</button>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <label className="text-xs text-mute">Years travelling seriously</label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {YEARS_OPTIONS.map((y) => (
                    <button key={y} onClick={() => setYears(y)}
                      className={`px-3 py-1.5 rounded-full text-sm border ${years === y ? "bg-teal text-white border-teal" : "border-sand text-ink hover:border-teal"}`}>
                      {y}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={() => setStep(2)} disabled={!name.trim() || !handle.trim() || styles.length === 0}
                className="pill-cta pill-primary w-full disabled:opacity-50">Continue</button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <h3 className="font-display text-lg">Connect your Instagram</h3>
              <p className="text-sm text-mute">
                We show your verified follower count next to your verified trip count — so your audience knows both numbers are real.
              </p>
              <div className="p-4 rounded-xl border border-ember/30 bg-ember/5">
                <div className="flex items-center gap-2 text-ember font-medium"><Instagram className="w-5 h-5" /> Instagram</div>
                <div className="mt-3 space-y-2">
                  <input value={igUser} onChange={(e) => setIgUser(e.target.value.replace(/^@/, ""))} placeholder="@your_handle"
                    className="w-full px-3 py-2 border border-sand rounded-lg bg-white" />
                  <input value={igFollowers} onChange={(e) => setIgFollowers(e.target.value)} placeholder="Follower count (e.g. 82000)" inputMode="numeric"
                    className="w-full px-3 py-2 border border-sand rounded-lg bg-white" />
                  <p className="text-xs text-mute">We'll verify by asking you to add a temporary code to your IG bio (rolling out soon). Fake counts will remove your Verified badge.</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <button onClick={() => setStep(1)} className="text-sm text-mute hover:text-ink">← Back</button>
                <div className="flex items-center gap-3">
                  <button onClick={() => setStep(3)} className="text-sm text-mute hover:text-ink">Skip for now</button>
                  <button onClick={() => setStep(3)} className="pill-cta pill-primary">Continue</button>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5">
              <h3 className="font-display text-lg">Your creator commitment</h3>
              <p className="text-sm text-mute">Yatravo Creator Profiles are built on real travel. We ask every creator to agree to this:</p>
              <div className="space-y-2">
                {[
                  "I will only log trips I have genuinely taken",
                  "I will not misrepresent destinations or experiences on my profile",
                  "I understand that fake or misleading trip data will result in my Creator badge being removed",
                ].map((label, i) => (
                  <label key={i} className="flex items-start gap-3 p-3 border border-sand rounded-lg cursor-pointer hover:border-teal">
                    <input type="checkbox" checked={commit[i]}
                      onChange={(e) => setCommit((c) => c.map((v, j) => j === i ? e.target.checked : v))}
                      className="mt-0.5 w-4 h-4 accent-teal" />
                    <span className="text-sm text-ink">{label}</span>
                  </label>
                ))}
              </div>
              <p className="text-xs text-mute">This keeps Yatravo trustworthy for everyone — travelers, vendors, and creators.</p>
              <div className="flex items-center justify-between">
                <button onClick={() => setStep(2)} className="text-sm text-mute hover:text-ink">← Back</button>
                <button onClick={finish} disabled={!commit.every(Boolean) || saving}
                  className="pill-cta pill-primary disabled:opacity-50 inline-flex items-center gap-2">
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  Activate my creator profile
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
