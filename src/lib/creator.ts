export type CreatorProfile = {
  id: string;
  user_id: string;
  handle: string;
  creator_name: string;
  bio: string | null;
  primary_platform: string | null;
  content_styles: string[] | null;
  years_travelling: string | null;
  instagram_username: string | null;
  instagram_followers: number | null;
  instagram_profile_pic: string | null;
  instagram_connected_at: string | null;
  youtube_username: string | null;
  youtube_subscribers: number | null;
  website_url: string | null;
  cover_photo_url: string | null;
  commitment_agreed: boolean;
  commitment_agreed_at: string | null;
  verified_creator: boolean;
  verified_at: string | null;
  show_upcoming_trips: boolean;
  allow_join_requests: boolean;
  show_instagram_count: boolean;
  profile_views: number;
  created_at: string;
};

export const PLATFORMS = ["Instagram", "YouTube", "Both", "Blog", "Other"] as const;
export const CONTENT_STYLES = [
  "Solo adventures", "Budget travel", "Luxury travel", "Mountain treks",
  "Beach & coastal", "Heritage & culture", "Food trails", "Road trips",
  "International travel", "Wildlife & nature",
] as const;
export const YEARS_OPTIONS = ["Less than 1", "1–3 years", "3–5 years", "5+ years"] as const;

export type BadgeStatus = {
  earned: boolean;
  instagramConnected: boolean;
  instagramFollowers: boolean;
  tripsLogged: boolean;
  trustScoreQualified: boolean;
  commitmentAgreed: boolean;
  tripCount: number;
  trustScore: number;
  followerCount: number;
};

export function computeCreatorBadge(
  profile: Pick<CreatorProfile, "instagram_username" | "instagram_followers" | "commitment_agreed">,
  tripCount: number,
  trustScore: number,
): BadgeStatus {
  const instagramConnected = !!profile.instagram_username;
  const followerCount = profile.instagram_followers ?? 0;
  const instagramFollowers = followerCount >= 1000;
  const tripsLogged = tripCount >= 5;
  const trustScoreQualified = trustScore >= 70;
  const commitmentAgreed = profile.commitment_agreed;
  return {
    earned: instagramConnected && instagramFollowers && tripsLogged && trustScoreQualified && commitmentAgreed,
    instagramConnected, instagramFollowers, tripsLogged, trustScoreQualified, commitmentAgreed,
    tripCount, trustScore, followerCount,
  };
}

export function slugifyHandle(input: string): string {
  return input.toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 30);
}
