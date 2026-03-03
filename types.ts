
export enum CreatorTier {
  NANO = 'NANO',
  MIKRO = 'MIKRO',
  MAKRO = 'MAKRO',
  MEGA = 'MEGA'
}

export enum UserRole {
  ADMIN = 'ADMIN',
  BRAND = 'BRAND',
  CREATOR = 'CREATOR'
}

export enum CampaignStatus {
  ACTIVE = 'ACTIVE',
  DRAFT = 'DRAFT',
  COMPLETED = 'COMPLETED',
  ON_HOLD = 'ON_HOLD'
}

export enum ApplicationStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  BRIEF_SENT = 'BRIEF_SENT',
  BRIEF_ACCEPTED = 'BRIEF_ACCEPTED',
  BRIEF_REJECTED = 'BRIEF_REJECTED',
  CONTENT_UPLOADED = 'CONTENT_UPLOADED',
  CONTENT_APPROVED = 'CONTENT_APPROVED',
  PAID = 'PAID'
}

export interface Creator {
  id: string;
  userId: string;
  name: string;
  bio?: string;
  followers: number;
  engagementRate: number;
  tier: CreatorTier;
  tiktokUrl: string;
  instagramUrl: string;
  domicile: string;
  category: string;
  rateCard?: number;
  photoUrl?: string;
  portfolioUrls?: string[];
  rating?: number;
  agencyId?: string;
  whatsapp?: string;
}

export interface Brand {
  id: string;
  userId: string;
  name: string;
  companyName: string;
  logoUrl?: string;
}

export interface Campaign {
  id: string;
  brandId: string;
  brandName: string;
  name: string;
  brief: string;
  status: CampaignStatus;
  budget: number;
  targetNiche: string;
  targetFollowers: number;
  deadline: string;
  startDate: string;
  endDate: string;
  creatorCount: number;
}

export interface Application {
  id: string;
  campaignId: string;
  creatorId: string;
  status: ApplicationStatus;
  submissionUrl?: string;
  paymentStatus: 'UNPAID' | 'ESCROW' | 'PAID';
  rating?: number;
  feedback?: string;
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}

export interface SearchFilters {
  domicile?: string;
  tier?: CreatorTier;
  query?: string;
  minFollowers?: number;
}
