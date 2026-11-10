export type UserRole = "leader" | "member" | "visitor";

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  reputationScore: number;
  acceptedProposals: number;
  totalProposals: number;
  spotlightTokens: number;
}

export interface SchoolOfThought {
  id: string;
  name: string;
  description: string;
  curatorRole: string;
}

export interface Canon {
  id: string;
  schoolId: string;
  name: string;
  version: string;
  isActive: boolean;
  databaseIds: string[];
}

export interface DatabaseModel {
  id: string;
  name: string;
  scopeDescription: string;
  defaultBlueprintId: string;
}

export interface BlueprintField {
  id: string;
  label: string;
  type: "text" | "number" | "select" | "multiselect" | "textarea" | "audio" | "image" | "video" | "map";
  options?: string[];
  unit?: string;
  required: boolean;
  tier: 1 | 2 | 3 | 4;
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
  name: string;
  version: string;
  domain: string;
  sections: BlueprintSection[];
}

export interface MediaAsset {
  id: string;
  title: string;
  type: "audio" | "image" | "map" | "video";
  url: string;
  filename: string;
  caption?: string;
}

export interface SpeciesEntryData {
  commonName: string;
  scientificName: string;
  nominateReference?: string;
  class: string;
  sizeWeight: string;
  sizeLength: string;
  sizeHeight?: string;
  sizeCategory: string;
  diet: string;
  activity: string;
  ethology: {
    territorialism?: string;
    socialization?: string;
    sexualSelection?: string;
    parenting?: string;
    seasonal?: string;
    feedingDrinking?: string;
    thermoregulation?: string;
    summaryText: string;
  };
  ecology: {
    trophicLevel: number;
    eltonianNiche: string;
    immediateFoodWeb: string;
    isKeystone: boolean;
    abioticInteractions: string;
    summaryText: string;
  };
  anatomy: {
    sexualDimorphism?: string;
    metabolism?: string;
    notableStructures: string;
    summaryText: string;
  };
  habitats: string[];
  biomes: string[];
  tracksAndId?: {
    description: string;
    imageUrl?: string;
  };
  media: {
    heroImage: string;
    vocalizationAudio?: {
      url: string;
      title: string;
      filename: string;
    };
    videoEmbedUrl?: string;
    videoTitle?: string;
    gallery: MediaAsset[];
  };
  distribution: {
    recognisedMapUrl?: string;
    expectedMapUrl?: string;
    lgmMapUrl?: string;
  };
}

export interface SpeciesEntry {
  id: string;
  databaseId: string;
  blueprintId: string;
  commonName: string;
  scientificName: string;
  status: "published" | "pending_review";
  authorId: string;
  isBoosted: boolean;
  metricScore: number;
  data: SpeciesEntryData;
  createdAt: string;
  updatedAt: string;
}

export interface FilterState {
  searchQuery: string;
  selectedClasses: string[];
  classMode: "or" | "and";
  selectedSizes: string[];
  sizeMode: "or" | "and";
  selectedDiets: string[];
  dietMode: "or" | "and";
  selectedActivities: string[];
  activityMode: "or" | "and";
  selectedHabitats: string[];
  habitatMode: "or" | "and";
  selectedBiomes: string[];
  biomeMode: "or" | "and";
}
