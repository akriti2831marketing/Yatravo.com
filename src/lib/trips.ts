export type TravelStyle = "solo" | "friends" | "family" | "couple";
export type BudgetTier = "budget" | "midrange" | "premium";

export type Trip = {
  id: string;
  user_id: string;
  destination: string;
  start_date: string;
  end_date: string;
  travel_style: TravelStyle | null;
  budget_tier: BudgetTier | null;
  note: string | null;
  photo_urls: string[] | null;
  gmail_verified: boolean;
  created_at: string;
};

export type Confirmation = { id: string; trip_id: string };

export const DESTINATION_SUGGESTIONS = [
  "Goa", "Manali", "Jaipur", "Spiti Valley", "Rishikesh", "Coorg",
  "Ladakh", "Udaipur", "Kerala Backwaters", "Andaman", "Pondicherry",
  "Gokarna", "Shimla", "Darjeeling", "Munnar", "Hampi", "Varanasi",
  "Mcleodganj", "Kasol", "Auli",
];

const MOUNTAIN_KW = ["manali","shimla","ladakh","spiti","coorg","munnar","darjeeling","mcleodganj","kasol","auli","himachal","uttarakhand","sikkim","rishikesh","leh"];
const COASTAL_KW = ["goa","andaman","kerala","pondicherry","gokarna","puri","alibaug","varkala","mahabalipuram"];
const ADVENTURE_KW = ["spiti","ladakh","rishikesh","hampi","auli","everest","trek"];

export function destinationKind(d: string): "mountain" | "coastal" | "adventure" | "city" {
  const s = d.toLowerCase();
  if (COASTAL_KW.some((k) => s.includes(k))) return "coastal";
  if (MOUNTAIN_KW.some((k) => s.includes(k))) return "mountain";
  if (ADVENTURE_KW.some((k) => s.includes(k))) return "adventure";
  return "city";
}

export function explorerLevel(count: number): string {
  if (count >= 30) return "Wanderer Elite";
  if (count >= 15) return "Pioneer";
  if (count >= 5) return "Explorer";
  return "New Explorer";
}

export type Badge = { key: string; label: string };

export function computeBadges(trips: Trip[]): Badge[] {
  const out: Badge[] = [];
  const solo = trips.filter((t) => t.travel_style === "solo");
  if (solo.length >= 1) out.push({ key: "first_solo", label: "First solo trip" });
  if (solo.length >= 5) out.push({ key: "solo_x5", label: "Solo x5" });
  const mountain = trips.filter((t) => destinationKind(t.destination) === "mountain");
  if (mountain.length >= 5) out.push({ key: "mountain_explorer", label: "Mountain explorer" });
  const coastal = trips.filter((t) => destinationKind(t.destination) === "coastal");
  if (coastal.length >= 3) out.push({ key: "coastal_wanderer", label: "Coastal wanderer" });
  const budget = trips.filter((t) => t.budget_tier === "budget");
  if (budget.length >= 5) out.push({ key: "budget_master", label: "Budget master" });
  return out;
}

export function badgeForTrip(trip: Trip, allTrips: Trip[]): Badge | null {
  // earliest solo trip earns "First solo"
  if (trip.travel_style === "solo") {
    const soloSorted = allTrips
      .filter((t) => t.travel_style === "solo")
      .sort((a, b) => +new Date(a.start_date) - +new Date(b.start_date));
    if (soloSorted[0]?.id === trip.id) return { key: "first_solo", label: "First solo trip" };
  }
  const kind = destinationKind(trip.destination);
  if (kind === "mountain") return { key: "mountain", label: "Mountain" };
  if (kind === "coastal") return { key: "coastal", label: "Coastal" };
  return null;
}

export function computeTrustScore(trips: Trip[], confirmedTripIds: Set<string>): number {
  let score = 0;
  const withEvidence = trips.filter((t) => (t.photo_urls && t.photo_urls.length) || (t.note && t.note.trim()));
  score += Math.min(withEvidence.length * 3, 30);
  const gmail = trips.filter((t) => t.gmail_verified);
  score += Math.min(gmail.length * 8, 40);
  const confirmed = trips.filter((t) => confirmedTripIds.has(t.id));
  score += Math.min(confirmed.length * 12, 50);
  return Math.min(score, 100);
}

export function trustBadgeStyle(score: number): { label: string; bg: string; fg: string } {
  if (score >= 70) return { label: "Well verified", bg: "#E0F2EE", fg: "#085041" };
  if (score >= 40) return { label: "Some verification", bg: "#FAF0E8", fg: "#7A3A12" };
  return { label: "Building trust", bg: "#EEEAE0", fg: "#5A554A" };
}
