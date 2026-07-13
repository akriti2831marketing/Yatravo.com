import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/waitlist")({
  head: () => ({
    meta: [
      { title: "Join Yatravo — Free travel passport" },
      { name: "description", content: "Join Yatravo free today. Log your first trip, find your tribe, and discover stays that nobody else knows about." },
      { property: "og:title", content: "Join Yatravo — Free travel passport" },
      { property: "og:description", content: "Free to join. Free to use. Free to list. Built by travelers, for travelers." },
      { property: "og:url", content: "/waitlist" },
    ],
    links: [{ rel: "canonical", href: "/waitlist" }],
  }),
  component: WaitlistPage,
});

function WaitlistPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", role: "Traveler", dest: "" });

  return (
    <div className="min-h-screen bg-canvas">
      <header className="px-6 lg:px-10 py-6 border-b border-sand">
        <Link to="/" className="font-display font-semibold text-xl text-ink">
          Yatravo<span className="text-teal">.</span>
        </Link>
      </header>

      <main className="px-6 lg:px-10 py-16 lg:py-24">
        <div className="max-w-2xl mx-auto">
          <div className="eyebrow">join yatravo</div>
          <h1 className="mt-4 font-display font-semibold text-5xl lg:text-6xl leading-[1.05]">
            Your travel passport is waiting for you.
          </h1>
          <p className="mt-6 text-lg text-mute leading-relaxed">
            Join Yatravo free today. Log your first trip, find your tribe, and discover stays that nobody else knows about.
          </p>

          {submitted ? (
            <div className="mt-12 stamp-card p-10 text-center">
              <div className="w-14 h-14 rounded-full bg-teal text-white flex items-center justify-center mx-auto">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </div>
              <div className="mt-6 font-display text-2xl">You're in.</div>
              <p className="mt-3 text-mute">Check your inbox — your passport is ready to build.</p>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
              className="mt-12 stamp-card p-8 space-y-5"
            >
              <Field
                label="What do we call you?"
                value={form.name}
                onChange={(v) => setForm({ ...form, name: v })}
                required
                maxLength={80}
              />
              <Field
                label="Your email address"
                type="email"
                value={form.email}
                onChange={(v) => setForm({ ...form, email: v })}
                required
                maxLength={255}
              />
              <div>
                <label className="block text-sm font-medium mb-2">I am a...</label>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full px-4 py-3 rounded-md bg-canvas border border-sand focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/20"
                >
                  <option>Traveler</option>
                  <option>Homestay Owner</option>
                  <option>Local Guide</option>
                  <option>Adventure Operator</option>
                  <option>Other</option>
                </select>
              </div>
              <Field
                label="Where have you loved travelling most?"
                placeholder="e.g. Manali, Goa, Ladakh..."
                value={form.dest}
                onChange={(v) => setForm({ ...form, dest: v })}
                maxLength={120}
              />
              <button type="submit" className="pill-cta pill-primary w-full justify-center mt-4">
                Start my journey — it's free
              </button>
            </form>
          )}

          <div className="mt-12 grid sm:grid-cols-3 gap-4 text-sm">
            {[
              "You'll get an email from us within minutes — no waiting, no queue",
              "Travelers: start logging trips and building your passport right away",
              "Local businesses: your listing page will be live within 24 hours of signing up",
            ].map((t) => (
              <div key={t} className="pl-4 border-l-2 border-teal text-mute leading-relaxed">{t}</div>
            ))}
          </div>

          <div className="mt-10 text-center font-mono-accent text-sm text-mute max-w-md mx-auto leading-relaxed">
            Be part of something being built from the ground up — by travelers, for travelers.
          </div>
        </div>
      </main>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
  placeholder,
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  maxLength?: number;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        maxLength={maxLength}
        className="w-full px-4 py-3 rounded-md bg-canvas border border-sand focus:outline-none focus:border-teal focus:ring-2 focus:ring-teal/20"
      />
    </div>
  );
}
