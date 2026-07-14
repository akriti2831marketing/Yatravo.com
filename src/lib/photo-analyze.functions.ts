import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const Input = z.object({
  photoUrls: z.array(z.string().url()).min(1).max(5),
});

export type PhotoTripAnalysis = {
  destination: string;
  state: string;
  destination_type: "mountains" | "beach" | "heritage" | "adventure" | "city" | "wildlife";
  estimated_month: string;
  estimated_year: number;
  travel_vibe: "solo adventure" | "group fun" | "family trip" | "couple getaway" | "backpacker";
  mood_tags: string[];
  best_photo_index: number;
  confidence: "high" | "medium" | "low";
};

export const analyzeTripPhotos = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => Input.parse(d))
  .handler(async ({ data }): Promise<PhotoTripAnalysis> => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const prompt = `Analyse these travel photos and return ONLY a JSON object with no markdown, no explanation:
{
  "destination": "city or region name",
  "state": "Indian state or country if international",
  "destination_type": "mountains|beach|heritage|adventure|city|wildlife",
  "estimated_month": "month name",
  "estimated_year": 2024,
  "travel_vibe": "solo adventure|group fun|family trip|couple getaway|backpacker",
  "mood_tags": ["tag1","tag2","tag3"],
  "best_photo_index": 0,
  "confidence": "high|medium|low"
}
Base destination on visual clues — mountains, beaches, architecture, landscapes, signage visible in the photos. If international, set state to the country name. Return only the JSON.`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Lovable-API-Key": key },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "user",
            content: [
              ...data.photoUrls.map((url) => ({ type: "image_url", image_url: { url } })),
              { type: "text", text: prompt },
            ],
          },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!res.ok) {
      const t = await res.text();
      if (res.status === 429) throw new Error("Rate limited — please wait a minute and try again.");
      if (res.status === 402) throw new Error("AI credits exhausted. Please add credits in workspace billing.");
      throw new Error(`AI request failed (${res.status}): ${t.slice(0, 200)}`);
    }

    const json = await res.json();
    const text: string = json.choices?.[0]?.message?.content ?? "{}";
    const cleaned = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();
    const parsed = JSON.parse(cleaned);
    return parsed as PhotoTripAnalysis;
  });
