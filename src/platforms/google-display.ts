import type { GoogleDisplayAd, StepInstruction } from '../types/ads';

const GOAL_LABELS: Record<GoogleDisplayAd['goal'], string> = {
  traffic: 'Website Traffic',
  leads: 'Lead Generation',
  awareness: 'Brand Awareness',
  calls: 'Phone Calls',
};

const TARGETING_LABELS: Record<GoogleDisplayAd['targetingType'], string> = {
  contextual: 'Contextual — show on pages related to your keywords/topics',
  audience: 'Audience segments — target by interests, demographics, or in-market',
  placement: 'Placement — choose specific websites and apps',
  remarketing: 'Remarketing — re-engage past website visitors',
};

export function generateGoogleDisplaySteps(ad: GoogleDisplayAd): StepInstruction[] {
  const filledHeadlines = ad.shortHeadlines.filter(Boolean);
  const filledDescs = ad.descriptions.filter(Boolean);

  return [
    {
      step: 1,
      title: 'Sign in and start a new campaign',
      url: 'https://ads.google.com',
      fields: [
        { label: 'Go to', value: 'Campaigns → New campaign' },
        { label: 'Goal', value: GOAL_LABELS[ad.goal] },
        { label: 'Campaign type', value: 'Display' },
      ],
      notes: [
        'If prompted "What do you want to focus on?", select the option matching your goal above.',
        'Choose "Standard display campaign" (not Smart).',
      ],
    },
    {
      step: 2,
      title: 'Campaign settings',
      fields: [
        { label: 'Campaign name', value: ad.campaignName },
        { label: 'Daily budget', value: `$${ad.dailyBudget}` },
        ...(ad.startDate ? [{ label: 'Start date', value: ad.startDate }] : []),
        ...(ad.endDate ? [{ label: 'End date', value: ad.endDate }] : []),
        { label: 'Bid strategy', value: 'Maximize conversions (or Target CPA if you have conversion data)' },
      ],
      notes: [
        'For new campaigns without historical data, "Maximize clicks" is a safer starting bid strategy.',
      ],
    },
    {
      step: 3,
      title: 'Location & language targeting',
      fields: [
        { label: 'Locations', value: ad.locationTargeting },
        { label: 'Language', value: 'English (or match your audience)' },
      ],
      notes: ['Select "People in or regularly in your targeted locations" for physical service areas.'],
    },
    {
      step: 4,
      title: 'Audience & placement targeting',
      fields: [
        { label: 'Targeting method', value: TARGETING_LABELS[ad.targetingType] },
        ...(ad.audienceDescription ? [{ label: 'Audience / keywords', value: ad.audienceDescription }] : []),
      ],
      notes: [
        'For contextual: add keywords or topics under "Content targeting".',
        'For remarketing: link your Google Analytics or set up a remarketing tag first.',
        'For placements: search for specific websites and add them under "Placements".',
      ],
    },
    {
      step: 5,
      title: 'Create ad group and responsive display ad',
      fields: [
        { label: 'Ad group name', value: `${ad.campaignName} — Ad Group 1` },
        { label: 'Ad type', value: 'Responsive display ad' },
      ],
      notes: [
        'Responsive display ads automatically adjust size, appearance, and format to fit available ad spaces.',
      ],
    },
    {
      step: 6,
      title: 'Enter business name and final URL',
      fields: [
        { label: 'Business name', value: ad.businessName },
        { label: 'Final URL', value: ad.finalUrl },
      ],
    },
    {
      step: 7,
      title: 'Upload images and logo',
      fields: [
        { label: 'Logo', value: ad.logoDescription || 'Upload your company logo (1:1 square, min 128×128 px)' },
        ...ad.imageDescriptions
          .filter(Boolean)
          .map((desc, i) => ({ label: `Image ${i + 1}`, value: desc })),
      ],
      notes: [
        'Landscape images (1.91:1 ratio, 1200×628 px minimum) perform best in most placements.',
        'Square images (1:1, 1200×1200 px minimum) are required for some inventory.',
        'Upload at least 3–4 images for better performance variety.',
        'Avoid overlaying text on images — Google uses the headlines separately.',
      ],
    },
    {
      step: 8,
      title: 'Add headlines and descriptions',
      fields: [
        ...filledHeadlines.map((h, i) => ({ label: `Short headline ${i + 1}`, value: h })),
        { label: 'Long headline', value: ad.longHeadline },
        ...filledDescs.map((d, i) => ({ label: `Description ${i + 1}`, value: d })),
        { label: 'Call to action', value: ad.callToAction },
      ],
      notes: [
        'Add 5 short headlines and 2–5 descriptions for the best Ad Strength score.',
        'Google mixes and matches your assets — make each one stand alone.',
        'Avoid repetition across headlines; each should highlight a different benefit.',
      ],
    },
    {
      step: 9,
      title: 'Review ad strength and publish',
      fields: [
        { label: 'Target Ad Strength', value: '"Good" or "Excellent"' },
      ],
      notes: [
        'Google\'s Ad Strength meter reflects asset variety — aim for at least "Good".',
        'Save and continue → review the campaign summary → click "Publish campaign".',
        'Display campaigns typically need 7–14 days to optimize. Check back after 2 weeks.',
      ],
    },
  ];
}
