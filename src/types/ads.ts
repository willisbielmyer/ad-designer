export type Platform = 'google' | 'meta' | 'lsa' | 'tiktok';
export type AdGoal = 'traffic' | 'leads' | 'awareness' | 'calls';

export interface GoogleAd {
  platform: 'google';
  format: 'search';
  goal: AdGoal;
  campaignName: string;
  dailyBudget: string;
  headlines: [string, string, string];
  descriptions: [string, string];
  finalUrl: string;
  keywords: string[];
  keywordMatchType: 'broad' | 'phrase' | 'exact';
  bidStrategy: 'maximize_clicks' | 'target_cpa' | 'target_roas' | 'manual_cpc';
  targetCpa?: string;
  callExtension?: string;
  locationTargeting: string;
  startDate?: string;
  endDate?: string;
}

export type GoogleDisplayCTA =
  | 'Automated'
  | 'Book Now'
  | 'Contact Us'
  | 'Download'
  | 'Get Quote'
  | 'Learn More'
  | 'Shop Now'
  | 'Sign Up'
  | 'Visit Site';

export interface GoogleDisplayAd {
  platform: 'google';
  format: 'display';
  goal: AdGoal;
  campaignName: string;
  dailyBudget: string;
  businessName: string;
  shortHeadlines: [string, string, string, string, string];
  longHeadline: string;
  descriptions: [string, string];
  finalUrl: string;
  callToAction: GoogleDisplayCTA;
  imageDescriptions: string[];
  logoDescription: string;
  generatedImageUrl?: string;
  locationTargeting: string;
  targetingType: 'contextual' | 'audience' | 'placement' | 'remarketing';
  audienceDescription?: string;
  startDate?: string;
  endDate?: string;
}

export interface MetaAd {
  platform: 'meta';
  format: 'feed' | 'stories_reels';
  goal: AdGoal;
  campaignName: string;
  dailyBudget: string;
  primaryText: string;
  headline: string;
  description: string;
  ctaButton: MetaCTA;
  destinationUrl: string;
  imageDescription: string;
  generatedImageUrl?: string;
  ageMin: number;
  ageMax: number;
  genderTargeting: 'all' | 'male' | 'female';
  locationTargeting: string;
  interestTargeting: string;
  placements: MetaPlacement[];
  leadFormQuestions?: string[];
  privacyPolicyUrl?: string;
}

export type MetaCTA =
  | 'LEARN_MORE'
  | 'SIGN_UP'
  | 'CONTACT_US'
  | 'BOOK_NOW'
  | 'GET_QUOTE'
  | 'CALL_NOW'
  | 'SHOP_NOW';

export type MetaPlacement = 'feed' | 'stories' | 'reels' | 'instagram' | 'marketplace';

export type TikTokCTA =
  | 'Learn More'
  | 'Shop Now'
  | 'Sign Up'
  | 'Download'
  | 'Book Now'
  | 'Contact Us'
  | 'Get Quote'
  | 'Subscribe';

export interface TikTokAd {
  platform: 'tiktok';
  goal: 'traffic' | 'leads' | 'awareness' | 'app_installs';
  campaignName: string;
  dailyBudget: string;
  videoDescription: string;
  videoDuration: '5-15s' | '15-30s' | '30-60s';
  musicDescription?: string;
  caption: string;
  hashtags: string;
  ctaButton: TikTokCTA;
  destinationUrl: string;
  ageMin: number;
  ageMax: number;
  genderTargeting: 'all' | 'male' | 'female';
  locationTargeting: string;
  interestTargeting: string;
  generatedImageUrl?: string;
}

export interface LSAAd {
  platform: 'lsa';
  goal: 'leads' | 'calls';
  businessName: string;
  businessCategory: string;
  serviceArea: string;
  weeklyBudget: string;
  phone: string;
  services: string[];
  businessHours: string;
  licenseNumber?: string;
  insuranceProvider?: string;
}

export type AnyAd = GoogleAd | GoogleDisplayAd | MetaAd | TikTokAd | LSAAd;

export interface SavedCampaign {
  id: string;
  name: string;
  platform: Platform;
  savedAt: string;
  ad: AnyAd;
}

export interface StepInstruction {
  step: number;
  title: string;
  url?: string;
  fields: { label: string; value: string }[];
  notes?: string[];
}
