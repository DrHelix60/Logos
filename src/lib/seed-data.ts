import { Community, DatabaseModel, Blueprint, DynamicEntry, UserProfile } from "@/types/database";

export function formatLegalName(fullName: string): string {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length <= 1) return fullName;
  // First name stays complete, subsequent names and surnames are abbreviated with periods
  const firstName = parts[0];
  const initials = parts.slice(1).map((p) => p.charAt(0).toUpperCase()).join(".");
  return `${firstName} ${initials}.`;
}

// Pre-issued Founder Account
export const initialProfiles: UserProfile[] = [
  {
    id: "usr-founder-rafael",
    fullName: "Rafael Santiago De La Torre Jiménez",
    displayName: "Rafael S.T.J.",
    role: "founder",
    reputationScore: 100,
    acceptedProposals: 0,
    totalProposals: 0,
    spotlightTokens: 5,
  },
];

// Start completely empty! Zero communities, zero databases, zero blueprints, zero entries.
export const initialCommunities: Community[] = [];
export const initialDatabases: DatabaseModel[] = [];
export const initialBlueprints: Blueprint[] = [];
export const initialEntries: DynamicEntry[] = [];
