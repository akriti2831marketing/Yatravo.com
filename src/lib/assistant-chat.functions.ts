import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const MsgSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().min(1).max(4000),
});

const Input = z.object({
  destination: z.string().min(1).max(120),
  state: z.string().max(120).optional().default(""),
  travelStyle: z.string().max(40).optional().default("curious"),
  budgetTier: z.string().max(40).optional().default("midrange"),
  pastDestinations: z.array(z.string()).max(30).default([]),
  tribeMatchCount: z.number().int().nonnegative().default(0),
  history: z.array(MsgSchema).max(20).default([]),
  message: z.string().min(1).max(2000),
});

export const askAssistant = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => Input.parse(d))
  .handler(async ({ data }): Promise<{ reply: string }> => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const system = `You are Yatravo's in-trip travel assistant. The user is currently travelling in ${data.destination}${data.state ? `, ${data.state}` : ""}. They are a ${data.travelStyle} traveler with a ${data.budgetTier} budget. They have previously visited: ${data.pastDestinations.join(", ") || "no logged trips yet"}.

Answer like a knowledgeable local friend who knows this area well. Be specific — name actual places, actual dishes, actual routes. Never be generic. Never say "it depends." Give a real answer with real recommendations.

Keep answers under 150 words. Short paragraphs. No bullet points unless listing 3+ specific places.

If they ask about finding other travelers, tell them to check the Tribe section of Yatravo and mention that ${data.tribeMatchCount} travelers are currently heading to nearby destinations.`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Lovable-API-Key": key },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: system },
          ...data.history,
          { role: "user", content: data.message },
        ],
      }),
    });

    if (!res.ok) {
      const t = await res.text();
      if (res.status === 429) throw new Error("Rate limited — please wait a moment and try again.");
      if (res.status === 402) throw new Error("AI credits exhausted. Please add credits in workspace billing.");
      throw new Error(`AI request failed (${res.status}): ${t.slice(0, 200)}`);
    }

    const json = await res.json();
    const reply: string = json.choices?.[0]?.message?.content ?? "";
    return { reply: reply.trim() || "Hmm, I couldn't come up with an answer. Try rephrasing?" };
  });
