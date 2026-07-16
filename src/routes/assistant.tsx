import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Compass, Send, MapPin, X } from "lucide-react";
import { toast } from "sonner";
import { SiteShell } from "@/components/site-chrome";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { askAssistant } from "@/lib/assistant-chat.functions";
import { DESTINATION_SUGGESTIONS } from "@/lib/trips";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "Travel Assistant — Yatravo" },
      { name: "description", content: "Your live travel companion. Ask anything about where you are right now." },
      { property: "og:title", content: "Travel Assistant — Yatravo" },
      { property: "og:description", content: "Real answers from a local-friend AI, powered by traveler community data." },
    ],
    links: [{ rel: "canonical", href: "/assistant" }],
  }),
  component: AssistantPage,
});

type ChatMsg = { role: "user" | "assistant"; content: string };

const SUGGESTED = [
  "Best local food near me right now",
  "Is the road ahead safe this month?",
  "Find solo travelers heading my way",
  "Hidden spots most tourists miss here",
  "What should I absolutely not miss?",
  "Homestay recommendations from real travelers",
  "What's the weather usually like here this time of year?",
];

function AssistantPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const ask = useServerFn(askAssistant);

  const [destination, setDestination] = useState("");
  const [destInput, setDestInput] = useState("");
  const [state, setState] = useState("");
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [queryCount, setQueryCount] = useState(0);
  const [showLogNudge, setShowLogNudge] = useState(false);
  const [dismissedNudge, setDismissedNudge] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [previousChats, setPreviousChats] = useState<
    { id: string; destination: string | null; first: string }[]
  >([]);
  const [pastDestinations, setPastDestinations] = useState<string[]>([]);
  const [travelStyle, setTravelStyle] = useState("curious");
  const [budgetTier, setBudgetTier] = useState("midrange");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  const loadContext = useCallback(async (uid: string) => {
    const [{ data: trips }, { data: convs }] = await Promise.all([
      supabase.from("trips").select("destination, travel_style, budget_tier").eq("user_id", uid).order("start_date", { ascending: false }).limit(20),
      supabase.from("assistant_conversations").select("id, destination, messages").eq("user_id", uid).order("updated_at", { ascending: false }).limit(3),
    ]);
    if (trips && trips.length) {
      setPastDestinations(trips.map((t: any) => t.destination));
      const style = trips.find((t: any) => t.travel_style)?.travel_style;
      const budget = trips.find((t: any) => t.budget_tier)?.budget_tier;
      if (style) setTravelStyle(style);
      if (budget) setBudgetTier(budget);
    }
    if (convs) {
      setPreviousChats(
        convs.map((c: any) => {
          const first = Array.isArray(c.messages) && c.messages[0]?.content
            ? String(c.messages[0].content).slice(0, 80)
            : "New conversation";
          return { id: c.id, destination: c.destination, first };
        }),
      );
    }
  }, []);

  useEffect(() => {
    if (user) loadContext(user.id);
  }, [user, loadContext]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  const suggestions = useMemo(() => {
    if (!destInput.trim()) return [];
    const q = destInput.toLowerCase();
    return DESTINATION_SUGGESTIONS.filter((d) => d.toLowerCase().includes(q)).slice(0, 6);
  }, [destInput]);

  function pickDestination(d: string) {
    setDestination(d);
    setDestInput(d);
    setMessages([]);
    setQueryCount(0);
    setDismissedNudge(false);
    setShowLogNudge(false);
    setConversationId(null);
  }

  async function persistConversation(nextMsgs: ChatMsg[], dest: string) {
    if (!user) return;
    if (conversationId) {
      await supabase.from("assistant_conversations").update({
        messages: nextMsgs.slice(-10) as any,
        destination: dest,
      }).eq("id", conversationId);
    } else {
      const { data } = await supabase.from("assistant_conversations").insert({
        user_id: user.id,
        destination: dest,
        messages: nextMsgs.slice(-10) as any,
      }).select("id").single();
      if (data?.id) setConversationId(data.id);
    }
  }

  async function send(rawText?: string) {
    const text = (rawText ?? input).trim();
    if (!text || !destination || sending) return;
    setInput("");
    const historyForAI = messages.map((m) => ({ role: m.role, content: m.content }));
    const next: ChatMsg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setSending(true);
    try {
      const { reply } = await ask({
        data: {
          destination,
          state,
          travelStyle,
          budgetTier,
          pastDestinations,
          tribeMatchCount: 0,
          history: historyForAI,
          message: text,
        },
      });
      const final: ChatMsg[] = [...next, { role: "assistant", content: reply }];
      setMessages(final);
      const newCount = queryCount + 1;
      setQueryCount(newCount);
      if (newCount >= 3 && !dismissedNudge) setShowLogNudge(true);
      await persistConversation(final, destination);
    } catch (e: any) {
      toast.error(e?.message ?? "Assistant unavailable");
      setMessages(next);
    } finally {
      setSending(false);
    }
  }

  async function autoLogTrip() {
    if (!user || !destination) return;
    const today = new Date().toISOString().slice(0, 10);
    const { error } = await supabase.from("trips").insert({
      user_id: user.id,
      destination,
      start_date: today,
      end_date: today,
      logged_via: "assistant",
    });
    if (error) {
      toast.error("Couldn't log trip");
      return;
    }
    toast.success(`Logging ${destination} as an active trip ✨`);
    setShowLogNudge(false);
    setDismissedNudge(true);
  }

  async function endTrip() {
    if (!destination) return;
    if (!user) return;
    const today = new Date().toISOString().slice(0, 10);
    const { error } = await supabase.from("trips").insert({
      user_id: user.id,
      destination,
      start_date: today,
      end_date: today,
      logged_via: "assistant",
    });
    if (error) {
      toast.error("Couldn't save trip");
      return;
    }
    toast.success(`${destination} added to your passport`);
    navigate({ to: "/passport" });
  }

  if (loading || !user) {
    return <SiteShell><div className="min-h-[60vh] flex items-center justify-center text-mute">Loading…</div></SiteShell>;
  }

  return (
    <SiteShell>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-40">
        {/* Header */}
        <div className="mb-6">
          {!destination ? (
            <div>
              <h1 className="font-display text-3xl sm:text-4xl text-ink">Where are you right now?</h1>
              <p className="text-mute mt-2 text-sm">Tell me where you're travelling and I'll be your local-friend for the trip.</p>
              <div className="relative mt-5">
                <div className="flex items-center gap-2 bg-white border border-sand rounded-full px-4 py-3 shadow-sm">
                  <MapPin className="h-4 w-4 text-teal" />
                  <input
                    autoFocus
                    value={destInput}
                    onChange={(e) => setDestInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && destInput.trim()) pickDestination(destInput.trim()); }}
                    placeholder="e.g. Manali, Goa, Spiti Valley"
                    className="flex-1 bg-transparent outline-none text-ink placeholder:text-mute/70"
                  />
                  {destInput && (
                    <button onClick={() => pickDestination(destInput.trim())} className="pill-cta pill-primary text-xs">Start</button>
                  )}
                </div>
                {suggestions.length > 0 && (
                  <div className="absolute z-10 left-0 right-0 mt-2 bg-white border border-sand rounded-2xl shadow-lg overflow-hidden">
                    {suggestions.map((s) => (
                      <button key={s} onClick={() => pickDestination(s)} className="w-full text-left px-4 py-2.5 text-sm hover:bg-sand/40">
                        {s}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-3">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-teal opacity-75 animate-ping" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal" />
                </span>
                <div>
                  <div className="font-display text-2xl text-ink leading-tight">You're in {destination}</div>
                  <div className="text-xs text-mute font-mono-accent uppercase tracking-wide">live · assistant on</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => { setDestination(""); setMessages([]); setConversationId(null); }} className="text-xs text-mute hover:text-ink">Change</button>
                <button onClick={endTrip} className="pill-cta pill-ghost text-xs">End trip</button>
              </div>
            </div>
          )}
        </div>

        {destination && (
          <>
            {/* Log nudge */}
            {showLogNudge && (
              <div className="mb-4 flex items-start gap-3 bg-teal/10 border border-teal/30 rounded-2xl p-4">
                <Compass className="h-5 w-5 text-teal shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-ink">Looks like you're exploring <b>{destination}</b> — want us to start logging this as a trip?</p>
                  <div className="mt-2 flex gap-2">
                    <button onClick={autoLogTrip} className="pill-cta pill-primary text-xs">Yes, log it</button>
                    <button onClick={() => { setShowLogNudge(false); setDismissedNudge(true); }} className="pill-cta pill-ghost text-xs">Not now</button>
                  </div>
                </div>
                <button onClick={() => { setShowLogNudge(false); setDismissedNudge(true); }} aria-label="dismiss" className="text-mute hover:text-ink"><X className="h-4 w-4" /></button>
              </div>
            )}

            {/* Chat */}
            <div ref={scrollRef} className="min-h-[40vh] max-h-[55vh] overflow-y-auto space-y-4 pr-1">
              {messages.length === 0 && (
                <div className="text-sm text-mute bg-white border border-sand rounded-2xl p-4">
                  Ask me anything about {destination}. Try a suggestion below to get started.
                </div>
              )}
              {messages.map((m, i) => (
                <div key={i} className={m.role === "user" ? "flex justify-end" : "flex gap-2 items-start"}>
                  {m.role === "assistant" && (
                    <div className="h-8 w-8 rounded-full bg-teal/10 border border-teal/30 flex items-center justify-center shrink-0">
                      <Compass className="h-4 w-4 text-teal" />
                    </div>
                  )}
                  <div className={m.role === "user"
                    ? "max-w-[80%] bg-teal text-white rounded-2xl rounded-tr-md px-4 py-2.5 text-sm whitespace-pre-wrap"
                    : "max-w-[85%] bg-white border border-sand rounded-2xl rounded-tl-md px-4 py-3 text-sm text-ink whitespace-pre-wrap shadow-sm"}>
                    {m.content}
                  </div>
                </div>
              ))}
              {sending && (
                <div className="flex gap-2 items-start">
                  <div className="h-8 w-8 rounded-full bg-teal/10 border border-teal/30 flex items-center justify-center shrink-0">
                    <Compass className="h-4 w-4 text-teal" />
                  </div>
                  <div className="bg-white border border-sand rounded-2xl px-4 py-3 text-sm text-mute">
                    <span className="inline-flex gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-teal/60 animate-pulse" />
                      <span className="h-1.5 w-1.5 rounded-full bg-teal/60 animate-pulse [animation-delay:150ms]" />
                      <span className="h-1.5 w-1.5 rounded-full bg-teal/60 animate-pulse [animation-delay:300ms]" />
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Suggested chips (only when empty) */}
            {messages.length === 0 && (
              <div className="mt-4 -mx-4 sm:mx-0 overflow-x-auto">
                <div className="flex gap-2 px-4 sm:px-0 pb-1">
                  {SUGGESTED.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="shrink-0 whitespace-nowrap px-3.5 py-1.5 text-xs rounded-full bg-white border border-sand hover:border-teal hover:text-teal text-ink/80 transition-colors"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Previous chats */}
        {previousChats.length > 0 && !destination && (
          <details className="mt-8 group">
            <summary className="cursor-pointer text-sm text-mute hover:text-ink">Previous chats</summary>
            <div className="mt-3 space-y-2">
              {previousChats.map((c) => (
                <button
                  key={c.id}
                  onClick={() => c.destination && pickDestination(c.destination)}
                  className="w-full text-left bg-white border border-sand rounded-xl px-4 py-3 hover:border-teal transition-colors"
                >
                  <div className="text-xs text-teal font-mono-accent uppercase tracking-wide">{c.destination ?? "Unknown"}</div>
                  <div className="text-sm text-ink/80 mt-0.5 line-clamp-1">{c.first}</div>
                </button>
              ))}
            </div>
          </details>
        )}
      </div>

      {/* Fixed composer */}
      {destination && (
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-gradient-to-t from-canvas via-canvas to-canvas/0 pt-6 pb-4 px-4">
          <div className="max-w-3xl mx-auto flex items-end gap-2 bg-white border border-sand rounded-full shadow-lg pl-4 pr-1.5 py-1.5">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); send(); } }}
              placeholder={`Ask about ${destination}…`}
              className="flex-1 bg-transparent outline-none text-sm py-2"
              disabled={sending}
            />
            <button
              onClick={() => send()}
              disabled={sending || !input.trim()}
              className="h-10 w-10 rounded-full bg-teal text-white flex items-center justify-center disabled:opacity-40 hover:bg-teal/90 transition-colors"
              aria-label="Send"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
          <div className="max-w-3xl mx-auto text-center mt-2">
            <Link to="/passport" className="text-[11px] text-mute hover:text-ink">Back to passport</Link>
          </div>
        </div>
      )}
    </SiteShell>
  );
}
