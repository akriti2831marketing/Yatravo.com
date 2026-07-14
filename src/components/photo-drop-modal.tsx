import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Camera, Upload, X, Check, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { analyzeTripPhotos, type PhotoTripAnalysis } from "@/lib/photo-analyze.functions";
import type { TravelStyle } from "@/lib/trips";

type Step = "upload" | "processing" | "confirm" | "success";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

const VIBES: PhotoTripAnalysis["travel_vibe"][] = [
  "solo adventure", "group fun", "family trip", "couple getaway", "backpacker",
];

function vibeToStyle(v: PhotoTripAnalysis["travel_vibe"]): TravelStyle {
  if (v === "solo adventure" || v === "backpacker") return "solo";
  if (v === "family trip") return "family";
  if (v === "couple getaway") return "couple";
  return "friends";
}

function monthIndex(name: string): number {
  const i = MONTHS.findIndex((m) => m.toLowerCase() === name.trim().toLowerCase());
  return i >= 0 ? i : new Date().getMonth();
}

function dateRangeForMonth(monthName: string, year: number): { start: string; end: string } {
  const m = monthIndex(monthName);
  const start = new Date(year, m, 1);
  const end = new Date(year, m + 1, 0);
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  return { start: fmt(start), end: fmt(end) };
}

export function PhotoDropModal({
  open,
  onClose,
  onSaved,
  userId,
}: {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
  userId: string;
}) {
  const [step, setStep] = useState<Step>("upload");
  const [files, setFiles] = useState<File[]>([]);
  const [uploadPct, setUploadPct] = useState(0);
  const [busy, setBusy] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [analysis, setAnalysis] = useState<PhotoTripAnalysis | null>(null);

  // editable confirm state
  const [destination, setDestination] = useState("");
  const [monthName, setMonthName] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [vibe, setVibe] = useState<PhotoTripAnalysis["travel_vibe"]>("solo adventure");
  const [moodTags, setMoodTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  const [processingLine, setProcessingLine] = useState(0);
  const processingLines = [
    "Reading your photos...",
    "Finding your destination...",
    "Building your trip card...",
  ];

  const reset = useCallback(() => {
    setStep("upload"); setFiles([]); setUploadPct(0); setPhotoUrls([]);
    setAnalysis(null); setDestination(""); setMonthName(""); setYear(new Date().getFullYear());
    setVibe("solo adventure"); setMoodTags([]); setNewTag(""); setBusy(false);
  }, []);

  useEffect(() => {
    if (step !== "processing") return;
    const id = setInterval(() => setProcessingLine((p) => (p + 1) % processingLines.length), 1500);
    return () => clearInterval(id);
  }, [step]);

  if (!open) return null;

  function handleClose() {
    if (busy) return;
    reset();
    onClose();
  }

  function addFiles(list: FileList | File[]) {
    const arr = Array.from(list).filter((f) => f.type.startsWith("image/") || /\.(heic|heif)$/i.test(f.name));
    const combined = [...files, ...arr].slice(0, 50);
    setFiles(combined);
  }

  async function handleAnalyze() {
    if (files.length < 3) {
      toast.error("Upload at least 3 photos so we can read the trip.");
      return;
    }
    setBusy(true);
    setStep("processing");
    setProcessingLine(0);
    const startedAt = Date.now();
    try {
      const uploaded: string[] = [];
      let done = 0;
      for (const f of files) {
        const ext = (f.name.split(".").pop() || "jpg").toLowerCase();
        const path = `${userId}/${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await supabase.storage.from("trip-photos").upload(path, f);
        if (upErr) throw upErr;
        const { data: signed } = await supabase.storage
          .from("trip-photos")
          .createSignedUrl(path, 60 * 60 * 24 * 365);
        if (signed?.signedUrl) uploaded.push(signed.signedUrl);
        done += 1;
        setUploadPct(Math.round((done / files.length) * 100));
      }
      setPhotoUrls(uploaded);

      const result = await analyzeTripPhotos({ data: { photoUrls: uploaded.slice(0, 5) } });

      // enforce minimum 2s processing UX
      const elapsed = Date.now() - startedAt;
      if (elapsed < 2000) await new Promise((r) => setTimeout(r, 2000 - elapsed));

      setAnalysis(result);
      setDestination(result.destination || "");
      setMonthName(result.estimated_month || MONTHS[new Date().getMonth()]);
      setYear(result.estimated_year || new Date().getFullYear());
      setVibe(result.travel_vibe || "solo adventure");
      setMoodTags(Array.isArray(result.mood_tags) ? result.mood_tags.slice(0, 6) : []);
      setStep("confirm");
    } catch (err: any) {
      toast.error(err?.message ?? "Could not analyse photos");
      setStep("upload");
    } finally {
      setBusy(false);
    }
  }

  async function handleSave() {
    if (!analysis) return;
    if (!destination.trim()) { toast.error("Destination is required."); return; }
    setBusy(true);
    try {
      const { start, end } = dateRangeForMonth(monthName, year);
      const bestIdx = Math.min(Math.max(analysis.best_photo_index || 0, 0), photoUrls.length - 1);
      const { error } = await supabase.from("trips").insert({
        user_id: userId,
        destination: destination.trim(),
        state: analysis.state ?? null,
        destination_type: analysis.destination_type ?? null,
        start_date: start,
        end_date: end,
        travel_style: vibeToStyle(vibe),
        photo_urls: photoUrls,
        best_photo_url: photoUrls[bestIdx] ?? photoUrls[0] ?? null,
        mood_tags: moodTags,
        logged_via: "photo_drop",
      } as any);
      if (error) throw error;
      setStep("success");
    } catch (err: any) {
      toast.error(err?.message ?? "Could not save trip");
    } finally {
      setBusy(false);
    }
  }

  function handleSuccessDone() {
    onSaved();
    handleClose();
  }

  const bestPhoto = analysis && photoUrls.length
    ? photoUrls[Math.min(Math.max(analysis.best_photo_index || 0, 0), photoUrls.length - 1)]
    : null;

  return (
    <div className="fixed inset-0 z-[110] bg-ink/50 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-6">
      <div className="bg-white w-full md:max-w-2xl md:rounded-2xl rounded-t-2xl max-h-[95vh] overflow-y-auto relative">
        <div className="sticky top-0 z-10 bg-white border-b border-sand px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2 font-display text-xl">
            <Sparkles className="w-5 h-5 text-teal" />
            {step === "success" ? "Trip stamped!" : "Log a trip from photos"}
          </div>
          <button onClick={handleClose} disabled={busy} className="text-mute hover:text-ink p-1 disabled:opacity-40" aria-label="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === "upload" && (
          <div className="p-6 space-y-4">
            <label
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault(); setDragOver(false);
                if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
              }}
              className={`block cursor-pointer rounded-2xl border-2 border-dashed transition-colors px-6 py-14 text-center ${
                dragOver ? "border-teal bg-teal-light/40" : "border-sand hover:border-teal bg-canvas/50"
              }`}
            >
              <input
                type="file" accept="image/*,.heic,.heif" multiple className="hidden"
                onChange={(e) => e.target.files && addFiles(e.target.files)}
              />
              <Upload className="w-8 h-8 text-teal mx-auto mb-3" />
              <div className="font-display text-2xl">Drop your trip photos here</div>
              <p className="mt-2 text-sm text-mute max-w-md mx-auto">
                Upload 5–50 photos. We'll figure out the destination, dates, and build your trip automatically.
              </p>
              <div className="mt-4 inline-flex pill-cta pill-primary pointer-events-none">
                <Camera className="w-4 h-4" /> Choose photos
              </div>
              <div className="mt-3 text-xs text-mute">JPG · PNG · HEIC</div>
            </label>

            {files.length > 0 && (
              <div>
                <div className="text-xs font-mono-accent uppercase tracking-wide text-mute mb-2">
                  {files.length} photo{files.length > 1 ? "s" : ""} ready
                </div>
                <div className="grid grid-cols-6 gap-2">
                  {files.slice(0, 12).map((f, i) => (
                    <img key={i} src={URL.createObjectURL(f)} alt="" className="aspect-square object-cover rounded-md" />
                  ))}
                  {files.length > 12 && (
                    <div className="aspect-square rounded-md bg-canvas text-mute text-xs flex items-center justify-center">
                      +{files.length - 12}
                    </div>
                  )}
                </div>
              </div>
            )}

            <button
              onClick={handleAnalyze}
              disabled={files.length < 3 || busy}
              className="w-full pill-cta pill-primary disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" /> Analyse photos & build my trip
            </button>
            {files.length > 0 && files.length < 3 && (
              <div className="text-xs text-ember text-center">Add at least {3 - files.length} more photo{3 - files.length > 1 ? "s" : ""}.</div>
            )}
          </div>
        )}

        {step === "processing" && (
          <div className="p-10 text-center min-h-[380px] flex flex-col items-center justify-center">
            <div className="relative w-20 h-20 mb-6">
              <div className="absolute inset-0 rounded-full bg-teal/20 animate-ping" />
              <div className="absolute inset-2 rounded-full bg-teal flex items-center justify-center">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
            </div>
            <div className="font-display text-2xl min-h-[2rem] transition-opacity duration-300" key={processingLine}>
              {processingLines[processingLine]}
            </div>
            <div className="mt-6 w-full max-w-xs h-1.5 rounded-full bg-sand overflow-hidden">
              <div className="h-full bg-teal transition-all duration-300" style={{ width: `${Math.max(uploadPct, 15)}%` }} />
            </div>
            <div className="text-xs text-mute mt-3">Uploading {uploadPct}%</div>
          </div>
        )}

        {step === "confirm" && analysis && (
          <div className="p-6 space-y-6">
            <div className="relative rounded-2xl overflow-hidden aspect-[16/10] bg-ink">
              {bestPhoto && (
                <img src={bestPhoto} alt="Best trip photo" className="w-full h-full object-cover" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <div className="font-mono-accent text-[10px] uppercase tracking-widest opacity-80">
                  {analysis.destination_type} · {analysis.confidence} confidence
                </div>
                <div className="font-display text-4xl md:text-5xl leading-tight mt-1">{destination || analysis.destination}</div>
                {analysis.state && (
                  <div className="font-mono-accent text-sm opacity-90 mt-1">{analysis.state}</div>
                )}
              </div>
            </div>

            <div>
              <div className="font-display text-2xl">Is this right?</div>
              <p className="text-sm text-mute mt-1">Tweak anything before we stamp it into your passport.</p>
            </div>

            <Field label="Destination">
              <input
                value={destination} onChange={(e) => setDestination(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-sand focus:outline-none focus:border-teal"
              />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Month">
                <select value={monthName} onChange={(e) => setMonthName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-sand focus:outline-none focus:border-teal bg-white">
                  {MONTHS.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </Field>
              <Field label="Year">
                <input type="number" min={1990} max={new Date().getFullYear()}
                  value={year} onChange={(e) => setYear(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-lg border border-sand focus:outline-none focus:border-teal" />
              </Field>
            </div>

            <Field label="Travel vibe">
              <div className="flex flex-wrap gap-2">
                {VIBES.map((v) => {
                  const active = vibe === v;
                  return (
                    <button key={v} type="button" onClick={() => setVibe(v)}
                      className={`px-4 py-2 rounded-full border text-sm capitalize transition-colors ${
                        active ? "bg-teal text-white border-teal" : "bg-white text-ink border-sand hover:border-teal"
                      }`}>
                      {v}
                    </button>
                  );
                })}
              </div>
            </Field>

            <Field label="Mood tags">
              <div className="flex flex-wrap gap-2 mb-2">
                {moodTags.map((t) => (
                  <span key={t} className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-full bg-teal-light text-teal text-xs font-mono-accent">
                    {t}
                    <button type="button" onClick={() => setMoodTags(moodTags.filter((x) => x !== t))}
                      className="hover:text-ink" aria-label={`Remove ${t}`}>
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input value={newTag} onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newTag.trim()) {
                      e.preventDefault();
                      setMoodTags([...moodTags, newTag.trim()].slice(0, 8));
                      setNewTag("");
                    }
                  }}
                  placeholder="Add a tag and press enter"
                  className="flex-1 px-4 py-2 rounded-lg border border-sand focus:outline-none focus:border-teal text-sm" />
              </div>
            </Field>

            <div className="flex flex-col sm:flex-row gap-2">
              <button onClick={handleSave} disabled={busy} className="flex-1 pill-cta pill-primary">
                <Check className="w-4 h-4" /> {busy ? "Saving..." : "Looks right — save trip"}
              </button>
              <button onClick={() => setStep("upload")} disabled={busy}
                className="pill-cta bg-white border border-sand text-ink hover:border-teal">
                Start over
              </button>
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="p-10 text-center">
            <div className="relative w-28 h-28 mx-auto mb-4">
              <div className="absolute inset-0 rounded-full bg-teal animate-[scale-in_0.4s_ease-out]" />
              <div className="absolute inset-0 flex items-center justify-center text-white">
                <Check className="w-12 h-12" strokeWidth={3} />
              </div>
            </div>
            <div className="font-display text-3xl">Trip stamped!</div>
            <p className="text-mute mt-2">
              {destination} added to your passport.
            </p>
            {moodTags.length > 0 && (
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {moodTags.map((t) => (
                  <span key={t} className="font-mono-accent text-xs px-3 py-1.5 rounded-full bg-teal-light text-teal">{t}</span>
                ))}
              </div>
            )}
            <div className="mt-8 flex flex-col sm:flex-row gap-2 justify-center">
              <button onClick={handleSuccessDone} className="pill-cta pill-primary">See my passport</button>
              <button onClick={() => { reset(); }} className="pill-cta bg-white border border-sand text-ink hover:border-teal">
                Log another
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs font-mono-accent uppercase tracking-wide text-mute mb-2">{label}</div>
      {children}
    </div>
  );
}
