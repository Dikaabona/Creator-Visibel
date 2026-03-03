
import { Creator, CreatorTier, Campaign, CampaignStatus } from './types';

export const getTier = (followers: number): CreatorTier => {
  if (followers > 1000000) return CreatorTier.MEGA;
  if (followers > 100000) return CreatorTier.MAKRO;
  if (followers > 10000) return CreatorTier.MIKRO;
  return CreatorTier.NANO;
};

export const MOCK_CREATORS: Creator[] = [
  {
    id: '1',
    userId: 'u1',
    name: 'Ria Ricis',
    followers: 15000000,
    engagementRate: 0.05,
    tier: CreatorTier.MEGA,
    tiktokUrl: 'https://tiktok.com/@riaricis',
    instagramUrl: 'https://instagram.com/riaricis1795',
    domicile: 'Jakarta',
    category: 'Entertainment',
    agencyId: 'agency_global',
    rateCard: 50000000
  },
  {
    id: '2',
    userId: 'u2',
    name: 'Arief Muhammad',
    followers: 5500000,
    engagementRate: 0.04,
    tier: CreatorTier.MEGA,
    tiktokUrl: 'https://tiktok.com/@ariefmuhammad',
    instagramUrl: 'https://instagram.com/ariefmuhammad',
    domicile: 'Tangerang',
    category: 'Lifestyle',
    agencyId: 'agency_global',
    rateCard: 45000000
  },
  {
    id: '3',
    userId: 'u3',
    name: 'Jessica Jane',
    followers: 800000,
    engagementRate: 0.06,
    tier: CreatorTier.MAKRO,
    tiktokUrl: 'https://tiktok.com/@jessicajane',
    instagramUrl: 'https://instagram.com/jessicajane99',
    domicile: 'Jakarta',
    category: 'Beauty',
    agencyId: 'agency_a',
    rateCard: 15000000
  },
  {
    id: '4',
    userId: 'u4',
    name: 'GadgetIn',
    followers: 3000000,
    engagementRate: 0.03,
    tier: CreatorTier.MEGA,
    tiktokUrl: 'https://tiktok.com/@gadgetin',
    instagramUrl: 'https://instagram.com/gadgetins',
    domicile: 'Jakarta',
    category: 'Tech',
    agencyId: 'agency_global',
    rateCard: 25000000
  },
  {
    id: '5',
    userId: 'u5',
    name: 'Tasyi Athasyia',
    followers: 950000,
    engagementRate: 0.07,
    tier: CreatorTier.MAKRO,
    tiktokUrl: 'https://tiktok.com/@tasyi',
    instagramUrl: 'https://instagram.com/tasyiiathasyia',
    domicile: 'Jakarta',
    category: 'Food',
    agencyId: 'agency_a',
    rateCard: 12000000
  },
  {
    id: '6',
    userId: 'u6',
    name: 'Jerome Polin',
    followers: 1200000,
    engagementRate: 0.05,
    tier: CreatorTier.MEGA,
    tiktokUrl: 'https://tiktok.com/@jeromepolin',
    instagramUrl: 'https://instagram.com/jeromepolin',
    domicile: 'Surabaya',
    category: 'Education',
    agencyId: 'agency_b',
    rateCard: 20000000
  }
];

export const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: 'c1',
    brandId: 'b1',
    brandName: 'Unilever',
    name: 'Ramadan Special 2024',
    brief: 'Campaign ramadan untuk produk Unilever.',
    status: CampaignStatus.ACTIVE,
    budget: 250000000,
    creatorCount: 15,
    startDate: '2024-03-01',
    endDate: '2024-04-15',
    deadline: '2024-04-10',
    targetNiche: 'Food & Beverage',
    targetFollowers: 100000
  },
  {
    id: 'c2',
    brandId: 'b2',
    brandName: 'Scarlett Whitening',
    name: 'Skincare Launch',
    brief: 'Peluncuran produk skincare baru.',
    status: CampaignStatus.ON_HOLD,
    budget: 120000000,
    creatorCount: 8,
    startDate: '2024-05-10',
    endDate: '2024-06-10',
    deadline: '2024-06-05',
    targetNiche: 'Beauty',
    targetFollowers: 50000
  },
  {
    id: 'c3',
    brandId: 'b3',
    brandName: 'Samsung',
    name: 'New Gadget Unboxing',
    brief: 'Unboxing gadget terbaru Samsung.',
    status: CampaignStatus.DRAFT,
    budget: 450000000,
    creatorCount: 5,
    startDate: '2024-07-01',
    endDate: '2024-07-15',
    deadline: '2024-07-10',
    targetNiche: 'Tech',
    targetFollowers: 500000
  },
  {
    id: 'c4',
    brandId: 'b4',
    brandName: 'Ervat',
    name: 'Back to School',
    brief: 'Campaign kembali ke sekolah.',
    status: CampaignStatus.COMPLETED,
    budget: 80000000,
    creatorCount: 20,
    startDate: '2024-01-01',
    endDate: '2024-01-30',
    deadline: '2024-01-25',
    targetNiche: 'Education',
    targetFollowers: 10000
  }
];
