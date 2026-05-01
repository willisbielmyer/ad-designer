import type { TikTokAd, StepInstruction } from '../types/ads';

const GOAL_LABELS: Record<TikTokAd['goal'], string> = {
  traffic: 'Website Traffic',
  leads: 'Lead Generation',
  awareness: 'Brand Awareness / Reach',
  app_installs: 'App Installs',
};

export function generateTikTokSteps(ad: TikTokAd): StepInstruction[] {
  return [
    {
      step: 1,
      title: 'Sign in to TikTok Ads Manager',
      url: 'https://ads.tiktok.com',
      fields: [
        { label: 'Go to', value: 'ads.tiktok.com → Create' },
        { label: 'Objective', value: GOAL_LABELS[ad.goal] },
      ],
      notes: [
        'If you don\'t have a TikTok Ads account, create one at ads.tiktok.com — it\'s free.',
        'Choose "Simplified mode" for your first campaign or "Custom mode" for full control.',
      ],
    },
    {
      step: 2,
      title: 'Campaign settings',
      fields: [
        { label: 'Campaign name', value: ad.campaignName },
        { label: 'Daily budget', value: `$${ad.dailyBudget}` },
        { label: 'Objective', value: GOAL_LABELS[ad.goal] },
      ],
      notes: [
        'TikTok recommends a minimum daily budget of $20 to exit the learning phase.',
        'Leave "Campaign budget optimization" off to control spending at the ad group level.',
      ],
    },
    {
      step: 3,
      title: 'Ad group — placement & targeting',
      fields: [
        { label: 'Placement', value: 'TikTok (keep other placements unchecked for better quality)' },
        { label: 'Location', value: ad.locationTargeting },
        { label: 'Age', value: `${ad.ageMin}–${ad.ageMax}` },
        { label: 'Gender', value: ad.genderTargeting === 'all' ? 'All genders' : ad.genderTargeting === 'male' ? 'Male' : 'Female' },
        ...(ad.interestTargeting ? [{ label: 'Interests', value: ad.interestTargeting }] : []),
      ],
      notes: [
        'For new accounts, start with broad targeting and let TikTok\'s algorithm optimize.',
        'Use "Behavioral" targeting to reach people who have interacted with similar content.',
      ],
    },
    {
      step: 4,
      title: 'Ad group — optimization & bidding',
      fields: [
        { label: 'Optimization goal', value: ad.goal === 'traffic' ? 'Click' : ad.goal === 'leads' ? 'Conversion' : 'Reach' },
        { label: 'Bid strategy', value: 'Lowest cost (recommended for new campaigns)' },
        { label: 'Daily budget', value: `$${ad.dailyBudget}` },
      ],
    },
    {
      step: 5,
      title: 'Create your ad — upload video',
      fields: [
        { label: 'Ad name', value: `${ad.campaignName} — Ad 1` },
        { label: 'Ad format', value: 'Single video' },
        { label: 'Video spec', value: '9:16 vertical, 1080×1920 px, MP4 or MOV' },
        { label: 'Duration', value: ad.videoDuration },
        { label: 'Video concept', value: ad.videoDescription },
        ...(ad.musicDescription ? [{ label: 'Music', value: ad.musicDescription }] : []),
      ],
      notes: [
        'TikTok recommends 21–34 second videos for most objectives.',
        'Add auto-captions — 92% of TikTok users watch with sound on, but captions improve accessibility.',
        'Hook viewers in the first 2–3 seconds or they will scroll past.',
        'Shoot vertically (9:16). Horizontal or square videos perform significantly worse.',
      ],
    },
    {
      step: 6,
      title: 'Add caption, hashtags, and CTA',
      fields: [
        { label: 'Caption', value: ad.caption },
        { label: 'Hashtags', value: ad.hashtags },
        { label: 'CTA button', value: ad.ctaButton },
        { label: 'Destination URL', value: ad.destinationUrl },
      ],
      notes: [
        'Caption appears below the video — keep it short and punchy.',
        'Use 3–5 hashtags: mix 1–2 broad trending tags with 2–3 niche-specific tags.',
        'The CTA button appears as an overlay button on the video.',
      ],
    },
    {
      step: 7,
      title: 'Review and publish',
      fields: [
        { label: 'Review checklist', value: 'Video uploaded, caption set, CTA and URL confirmed' },
        { label: 'Submit for review', value: 'Click "Submit" — TikTok reviews ads within 24 hours' },
      ],
      notes: [
        'TikTok\'s review typically takes a few hours but can take up to 24 hours.',
        'Check back after 3–5 days and pause/replace ads with a CTR below 1%.',
        'Refresh creatives every 2–3 weeks — TikTok audiences experience ad fatigue quickly.',
      ],
    },
  ];
}
