import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Input = z.object({
  destinations: z.array(z.string()).max(30).default([]),
  contentStyles: z.array(z.string()).max(10).default([]),
  yearsTravelling: z.string().max(40).default(""),
});

export const generateCreatorBios = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => Input.parse(d))
  .handler(async ({ data }): Promise<{ bios: string[] }> => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const prompt = `Write 3 short creator bio options (max 120 characters each) for a travel creator on Yatravo.

Their travel data:
- Destinations visited: ${data.destinations.join(", ") || "just starting out"}
- Content styles: ${data.contentStyles.join(", ") || "general travel"}
- Years travelling: ${data.yearsTravelling || "unknown"}

Return ONLY a JSON array of 3 strings: ["bio1", "bio2", "bio3"]

Rules:
- Each bio under 120 characters
- No hashtags
- No "wanderlust" or "blessed"
- Conversational and specific — mention a real pattern from their travel data
- Can be funny, honest, or matter-of-fact
- Should feel like something a real creator would actually write`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Lovable-API-Key": key },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "You return only valid JSON. No prose, no markdown fences." },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!res.ok) {
      if (res.status === 429) throw new Error("Rate limited — please wait a moment.");
      if (res.status === 402) throw new Error("AI credits exhausted.");
      throw new Error(`AI request failed (${res.status})`);
    }

    const json = await res.json();
    const raw: string = json.choices?.[0]?.message?.content ?? "[]";
    const cleaned = raw.replace(/```json|```/g, "").trim();
    try {
      const parsed = JSON.parse(cleaned);
      const bios = Array.isArray(parsed) ? parsed.filter((b) => typeof b === "string").slice(0, 3) : [];
      return { bios };
    } catch {
      return { bios: [] };
    }
  });
