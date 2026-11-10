export type UserRole = "founder" | "leader" | "member" | "visitor";

export interface UserProfile {
  id: string;
  fullName: string;
  displayName: string;
  role: UserRole;
  reputationScore: number;
  acceptedProposals: number;
  totalProposals: number;
  spotlightTokens: number;
}

export interface Community {
  id: string;
  name: string;
  discipline: string;
  scopePrinciples: string;
  creatorId: string;
  createdAt: string;
}

export interface DatabaseModel {
  id: string;
  communityId: string;
  name: string;
  scopeDescription: string;
  blueprintId: string;
  createdAt: string;
}

export type BlueprintFieldType = 
  | "text" 
  | "number" 
  | "textarea" 
  | "multiselect" 
  | "image" 
  | "audio" 
  | "video" 
  | "map";

export interface BlueprintField {
  id: string;
  label: string;
  type: BlueprintFieldType;
  options?: string[];
  unit?: string;
  required: boolean;
  weightPercent: number;
}

export interface BlueprintSection {
  id: string;
  title: string;
  tier: 1 | 2 | 3 | 4;
  tierWeightPercent: number;
  fields: BlueprintField[];
}

export interface Blueprint {
  id: string;
  communityId: string;
  name: string;
  version: string;
  domain: string;
  sections: BlueprintSection[];
  createdAt: string;
}

export interface DynamicEntry {
  id: string;
  databaseId: string;
  communityId: string;
  blueprintId: string;
  title: string;
  subtitle?: string;
  status: "published" | "pending_review";
  authorId: string;
  isBoosted: boolean;
  metricScore: number;
  data: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}
