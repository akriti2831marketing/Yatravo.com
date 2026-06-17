import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { DESTINATION_SUGGESTIONS, type BudgetTier, type TravelStyle } from "@/lib/trips";

export function LogTripModal({ open, onClose, onSaved, userId }: {
  open: boolean; onClose: () => void; onSaved: () => void; userId: string;
}) {
  const [destination, setDestination] = useState("");
  const [showSugg, setShowSugg] = useState(false);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [style, setStyle] = useState<TravelStyle | "">("");
  const [tier, setTier] = useState<BudgetTier | "">("");
  const [files, setFiles] = useState<File[]>([]);
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  if (!open) return null;

  const suggestions = DESTINATION_SUGGESTIONS.filter((d) =>
    d.toLowerCase().includes(destination.toLowerCase()) && d.toLowerCase() !== destination.toLowerCase()
  ).slice(0, 5);

  function reset() {
    setDestination(""); setStart(""); setEnd(""); setStyle(""); setTier("");
    setFiles([]); setNote("");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!destination || !start || !end || !style || !tier) {
      toast.error("Please fill destination, dates, style and budget.");
      return;
    }
    if (new Date(end) < new Date(start)) {
      toast.error("End date must be after start date.");
      return;
    }
    setBusy(true);
    try {
      const photo_urls: string[] = [];
      for (const f of files.slice(0, 3)) {
        const ext = f.name.split(".").pop() ?? "jpg";
        const path = `${userId}/${crypto.randomUUID()}.${ext}`;
        const { error: upErr } = await supabase.storage.from("trip-photos").upload(path, f);
        if (upErr) throw upErr;
        const { data } = await supabase.storage.from("trip-photos").createSignedUrl(path, 60 * 60 * 24 * 365);
        if (data?.signedUrl) photo_urls.push(data.signedUrl);
      }
      const { error } = await supabase.from("trips").insert({
        user_id: userId,
        destination, start_date: start, end_date: end,
        travel_style: style, budget_tier: tier,
        note: note || null,
        photo_urls,
      });
      if (error) throw error;
      toast.success("Trip logged! Check your passport for new badges.");
      reset();
      onSaved();
      onClose();
    } catch (err: any) {
      toast.error(err.message ?? "Could not save trip");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[100] bg-ink/40 backdrop-blur-sm flex items-end md:items-center justify-center p-0 md:p-6">
      <div className="bg-white w-full md:max-w-xl md:rounded-2xl rounded-t-2xl max-h-[95vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-sand px-6 py-4 flex items-center justify-between">
          <div className="font-display text-xl">Log a trip</div>
          <button onClick={onClose} className="text-mute hover:text-ink p-1" aria-label="Close">✕</button>
        </div>
        <div className="px-6 pt-4">
          <div className="bg-teal-light/60 border border-teal/15 rounded-xl p-4 text-sm flex items-start gap-3">
            <div className="text-teal text-lg leading-none">✉</div>
            <div className="flex-1">
              <div className="font-medium">Connect Gmail to auto-detect trips</div>
              <div className="text-mute mt-1">From flight & hotel bookings.</div>
            </div>
            <button
              type="button"
              onClick={() => toast("Gmail import coming soon")}
              className="text-sm font-medium text-teal hover:underline whitespace-nowrap"
            >
              Connect
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
          <Field label="Destination">
            <div className="relative">
              <input
                type="text" value={destination}
                onChange={(e) => { setDestination(e.target.value); setShowSugg(true); }}
                onFocus={() => setShowSugg(true)}
                onBlur={() => setTimeout(() => setShowSugg(false), 150)}
                placeholder="e.g. Spiti Valley"
                className="w-full px-4 py-3 rounded-lg border border-sand focus:outline-none focus:border-teal"
              />
              {showSugg && destination && suggestions.length > 0 && (
                <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-white border border-sand rounded-lg shadow-sm max-h-48 overflow-y-auto">
                  {suggestions.map((s) => (
                    <button key={s} type="button"
                      onClick={() => { setDestination(s); setShowSugg(false); }}
                      className="block w-full text-left px-4 py-2 hover:bg-canvas text-sm">
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Start date">
              <input type="date" value={start} onChange={(e) => setStart(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-sand focus:outline-none focus:border-teal" />
            </Field>
            <Field label="End date">
              <input type="date" value={end} onChange={(e) => setEnd(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-sand focus:outline-none focus:border-teal" />
            </Field>
          </div>

          <Field label="Travel style">
            <PillGroup
              options={[["solo","Solo"],["friends","With friends"],["family","Family"],["couple","Couple"]]}
              value={style} onChange={(v) => setStyle(v as TravelStyle)}
            />
          </Field>

          <Field label="Budget tier">
            <PillGroup
              options={[["budget","Budget"],["midrange","Mid-range"],["premium","Premium"]]}
              value={tier} onChange={(v) => setTier(v as BudgetTier)}
            />
          </Field>

          <Field label="Photos (optional, up to 3)">
            <label className="block border border-dashed border-sand rounded-lg px-4 py-6 text-center text-sm text-mute cursor-pointer hover:border-teal">
              <input
                type="file" accept="image/*" multiple className="hidden"
                onChange={(e) => setFiles(Array.from(e.target.files ?? []).slice(0, 3))}
              />
              {files.length ? `${files.length} photo${files.length > 1 ? "s" : ""} selected` : "Tap to upload or drag photos here"}
            </label>
          </Field>

          <Field label="Note (optional)">
            <textarea
              maxLength={200} value={note} onChange={(e) => setNote(e.target.value)}
              placeholder="Any memory worth keeping?"
              className="w-full px-4 py-3 rounded-lg border border-sand focus:outline-none focus:border-teal min-h-[80px] resize-none"
            />
            <div className="text-xs text-mute mt-1">{note.length}/200</div>
          </Field>

          <button disabled={busy} className="w-full pill-cta pill-primary">
            {busy ? "Saving..." : "Save trip — earn badge"}
          </button>
        </form>
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

function PillGroup({ options, value, onChange }: {
  options: [string, string][]; value: string; onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(([v, label]) => {
        const active = value === v;
        return (
          <button
            key={v} type="button" onClick={() => onChange(v)}
            className={`px-4 py-2 rounded-full border text-sm transition-colors ${
              active ? "bg-teal text-white border-teal" : "bg-white text-ink border-sand hover:border-teal"
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
