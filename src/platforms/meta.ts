import type { MetaAd, StepInstruction } from '../types/ads';

export const META_LIMITS = {
  primaryText: 125,
  headline: 27,
  description: 27,
};

export const CTA_LABELS: Record<string, string> = {
  LEARN_MORE: 'Learn More',
  SIGN_UP: 'Sign Up',
  CONTACT_US: 'Contact Us',
  BOOK_NOW: 'Book Now',
  GET_QUOTE: 'Get Quote',
  CALL_NOW: 'Call Now',
  SHOP_NOW: 'Shop Now',
};

export const PLACEMENT_LABELS: Record<string, string> = {
  feed: 'Facebook Feed',
  stories: 'Facebook/Instagram Stories',
  reels: 'Instagram Reels',
  instagram: 'Instagram Feed',
  marketplace: 'Facebook Marketplace',
};

export const GOAL_OBJECTIVE: Record<string, string> = {
  traffic: 'Traffic → Link clicks',
  leads: 'Leads → Instant forms',
  awareness: 'Awareness → Reach',
  calls: 'Traffic → Calls',
};

export function generateMetaSteps(ad: MetaAd): StepInstruction[] {
  const steps: StepInstruction[] = [
    {
      step: 1,
      title: 'Open Meta Ads Manager and create a campaign',
      url: 'https://www.facebook.com/adsmanager',
      fields: [],
      notes: [
        'Click the green "+ Create" button',
        `Select campaign objective: ${GOAL_OBJECTIVE[ad.goal]}`,
        'Choose "Manual campaign" for full control',
        'Click Continue',
      ],
    },
    {
      step: 2,
      title: 'Campaign-level settings',
      fields: [
        { label: 'Campaign name', value: ad.campaignName },
        { label: 'Special ad categories', value: 'None (unless housing, employment, or credit)' },
        { label: 'A/B Test', value: 'Off (can enable later)' },
        { label: 'Campaign budget optimization', value: 'Off (set budget at ad set level)' },
      ],
    },
    {
      step: 3,
      title: 'Ad Set — Budget and schedule',
      fields: [
        { label: 'Ad set name', value: `${ad.campaignName} - Ad Set 1` },
        { label: 'Daily budget', value: `$${ad.dailyBudget}` },
        { label: 'Schedule', value: 'Run continuously starting today' },
      ],
    },
    {
      step: 4,
      title: 'Ad Set — Audience targeting',
      fields: [
        { label: 'Location', value: ad.locationTargeting },
        { label: 'Age range', value: `${ad.ageMin}–${ad.ageMax}` },
        {
          label: 'Gender',
          value:
            ad.genderTargeting === 'all'
              ? 'All genders'
              : ad.genderTargeting === 'male'
                ? 'Men only'
                : 'Women only',
        },
        ...(ad.interestTargeting
          ? [{ label: 'Detailed targeting (interests)', value: ad.interestTargeting }]
          : []),
      ],
      notes: [
        'Under "Detailed targeting" search for interests one at a time and click to add',
        'Aim for an audience size of 500K–2M for best results',
      ],
    },
    {
      step: 5,
      title: 'Ad Set — Placements',
      fields: [
        {
          label: 'Placements',
          value:
            ad.placements.length > 0
              ? ad.placements.map((p) => PLACEMENT_LABELS[p]).join(', ')
              : 'Advantage+ Placements (recommended)',
        },
      ],
      notes: [
        'Select "Manual placements" if you want control',
        'Advantage+ lets Meta auto-optimize across placements',
      ],
    },
    {
      step: 6,
      title: 'Create the ad creative',
      fields: [
        { label: 'Ad name', value: `${ad.campaignName} - Ad 1` },
        { label: 'Format', value: 'Single image or video' },
        {
          label: 'Image spec',
          value: '1200 × 628 px (feed), 1080 × 1920 px (stories/reels)',
        },
        { label: 'Primary text', value: ad.primaryText },
        { label: 'Headline', value: ad.headline },
        { label: 'Description', value: ad.description },
        { label: 'Call to action', value: CTA_LABELS[ad.ctaButton] },
        { label: 'Website URL', value: ad.destinationUrl },
      ],
      notes: [
        'Upload your image using the "Add media" button',
        `Image note: ${ad.imageDescription}`,
        'Preview the ad across placements before publishing',
      ],
    },
    ...(ad.goal === 'leads' && ad.leadFormQuestions && ad.leadFormQuestions.length > 0
      ? [
          {
            step: 7,
            title: 'Create lead form (Instant Form)',
            fields: [
              { label: 'Form type', value: 'More volume (fewer questions)' },
              {
                label: 'Questions to include',
                value: ad.leadFormQuestions.join('\n'),
              },
              {
                label: 'Privacy policy URL',
                value: ad.privacyPolicyUrl || 'REQUIRED — add your privacy policy URL',
              },
            ],
            notes: [
              'Pre-filled fields (name, email, phone) auto-fill from Facebook profile — keep these',
              'Limit custom questions to 2–3 max to reduce drop-off',
              'Set up CRM integration or download leads from Ads Manager → Leads Center',
            ],
          },
        ]
      : []),
    {
      step: ad.goal === 'leads' ? 8 : 7,
      title: 'Review and publish',
      fields: [],
      notes: [
        'Click "Publish" — Meta review usually takes under 24 hours',
        'Monitor results in Ads Manager after 48–72 hours before making changes',
        'Check frequency — if it exceeds 3.0, refresh the creative',
      ],
    },
  ];

  return steps;
}
