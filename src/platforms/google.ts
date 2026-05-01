import type { GoogleAd, StepInstruction } from '../types/ads';

export const GOOGLE_LIMITS = {
  headline: 30,
  description: 90,
  finalUrl: 2048,
};

export const GOAL_LABELS: Record<string, string> = {
  traffic: 'Website Traffic',
  leads: 'Lead Generation',
  awareness: 'Brand Awareness',
  calls: 'Phone Calls',
};

export const BID_STRATEGY_LABELS: Record<string, string> = {
  maximize_clicks: 'Maximize Clicks',
  target_cpa: 'Target CPA',
  target_roas: 'Target ROAS',
  manual_cpc: 'Manual CPC',
};

export const MATCH_TYPE_LABELS: Record<string, string> = {
  broad: 'Broad Match',
  phrase: 'Phrase Match',
  exact: 'Exact Match',
};

export const MATCH_TYPE_SYMBOLS: Record<string, string> = {
  broad: '',
  phrase: '"keyword"',
  exact: '[keyword]',
};

export function generateGoogleSteps(ad: GoogleAd): StepInstruction[] {
  return [
    {
      step: 1,
      title: 'Open Google Ads and create a new campaign',
      url: 'https://ads.google.com',
      fields: [],
      notes: [
        'Click "+ New campaign" on the left sidebar',
        `Select objective: "${GOAL_LABELS[ad.goal]}"`,
        'Choose campaign type: Search',
        'Click Continue',
      ],
    },
    {
      step: 2,
      title: 'Campaign settings',
      fields: [
        { label: 'Campaign name', value: ad.campaignName },
        { label: 'Daily budget', value: `$${ad.dailyBudget}` },
        { label: 'Bid strategy', value: BID_STRATEGY_LABELS[ad.bidStrategy] },
        ...(ad.targetCpa ? [{ label: 'Target CPA', value: `$${ad.targetCpa}` }] : []),
        { label: 'Location targeting', value: ad.locationTargeting },
        { label: 'Networks', value: 'Search only (uncheck Google Display Network)' },
        ...(ad.startDate ? [{ label: 'Start date', value: ad.startDate }] : []),
        ...(ad.endDate ? [{ label: 'End date', value: ad.endDate }] : []),
      ],
    },
    {
      step: 3,
      title: 'Create ad group and add keywords',
      fields: [
        { label: 'Ad group name', value: `${ad.campaignName} - Group 1` },
        { label: 'Keyword match type', value: MATCH_TYPE_LABELS[ad.keywordMatchType] },
        {
          label: 'Keywords to add',
          value: ad.keywords
            .map((k) => {
              if (ad.keywordMatchType === 'phrase') return `"${k}"`;
              if (ad.keywordMatchType === 'exact') return `[${k}]`;
              return k;
            })
            .join('\n'),
        },
      ],
      notes: [
        'Paste each keyword on its own line in the keyword box',
        'Add negative keywords for irrelevant searches if needed',
      ],
    },
    {
      step: 4,
      title: 'Create your responsive search ad',
      fields: [
        { label: 'Headline 1', value: ad.headlines[0] },
        { label: 'Headline 2', value: ad.headlines[1] },
        { label: 'Headline 3', value: ad.headlines[2] },
        { label: 'Description 1', value: ad.descriptions[0] },
        { label: 'Description 2', value: ad.descriptions[1] },
        { label: 'Final URL', value: ad.finalUrl },
      ],
      notes: [
        'Google will automatically test combinations of your headlines and descriptions',
        'Aim for "Excellent" Ad Strength by making headlines as unique as possible',
      ],
    },
    ...(ad.callExtension
      ? [
          {
            step: 5,
            title: 'Add call extension',
            fields: [{ label: 'Phone number', value: ad.callExtension }],
            notes: [
              'Go to Ads & Extensions → Extensions → Call extensions',
              'Add your phone number — it will show below the ad on mobile',
            ],
          },
        ]
      : []),
    {
      step: ad.callExtension ? 6 : 5,
      title: 'Review and publish',
      fields: [],
      notes: [
        'Review the campaign summary for any warnings',
        'Click "Publish campaign"',
        'Ads typically go live within 1–2 business days after Google review',
        'Check back after 24 hours to verify the ad is running',
      ],
    },
  ];
}
