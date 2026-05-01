import type { LSAAd, StepInstruction } from '../types/ads';

export const LSA_CATEGORIES = [
  'Appliance Repair',
  'Carpet Cleaning',
  'Cleaning',
  'Electrician',
  'Event Planning',
  'Fencing',
  'Flooring',
  'Garage Door',
  'General Contractor',
  'HVAC',
  'Handyman',
  'House Cleaning',
  'Interior Design',
  'Junk Removal',
  'Landscaping',
  'Lawn Care',
  'Locksmith',
  'Moving',
  'Painting',
  'Pest Control',
  'Pet Grooming',
  'Plumber',
  'Pool Services',
  'Real Estate Agent',
  'Roofing',
  'Tree Services',
  'Tutoring',
  'Water Damage Restoration',
  'Window Cleaning',
  'Window Repair',
];

export function generateLSASteps(ad: LSAAd): StepInstruction[] {
  return [
    {
      step: 1,
      title: 'Sign up for Google Local Services Ads',
      url: 'https://ads.google.com/local-services-ads',
      fields: [],
      notes: [
        'Click "Get started" and sign in with your Google account',
        'Select your country and business category',
        'This is separate from regular Google Ads — different dashboard',
      ],
    },
    {
      step: 2,
      title: 'Enter business information',
      fields: [
        { label: 'Business name', value: ad.businessName },
        { label: 'Business category', value: ad.businessCategory },
        { label: 'Phone number', value: ad.phone },
        { label: 'Service area', value: ad.serviceArea },
        { label: 'Business hours', value: ad.businessHours },
        {
          label: 'Services offered',
          value: ad.services.join(', '),
        },
      ],
    },
    {
      step: 3,
      title: 'Complete Google Guarantee / Google Screened verification',
      fields: [
        ...(ad.licenseNumber
          ? [{ label: 'License number to enter', value: ad.licenseNumber }]
          : []),
        ...(ad.insuranceProvider
          ? [{ label: 'Insurance provider', value: ad.insuranceProvider }]
          : []),
      ],
      notes: [
        'Google will verify your business license and insurance — this is REQUIRED',
        'You may also need to pass a background check',
        'Verification can take 1–2 weeks',
        'Businesses that pass get the green "Google Guaranteed" badge',
        'Have your license certificate and insurance documents ready to upload',
      ],
    },
    {
      step: 4,
      title: 'Set your budget',
      fields: [
        { label: 'Weekly budget', value: `$${ad.weeklyBudget}` },
        { label: 'How billing works', value: 'You pay per verified lead, not per click' },
      ],
      notes: [
        'LSA uses pay-per-lead pricing — Google sets the per-lead price by category',
        'You can dispute leads that are spam or outside your service area',
        `Typical lead costs for ${ad.businessCategory}: varies by market, usually $15–$150`,
      ],
    },
    {
      step: 5,
      title: 'Set up lead management',
      fields: [],
      notes: [
        'Download the "Google Local Services Ads" app on your phone',
        'Enable notifications so you can respond to leads within minutes',
        'Response speed affects your ad ranking',
        'You can pause the ad instantly from the app when you are fully booked',
      ],
    },
    {
      step: 6,
      title: 'Go live and monitor',
      fields: [],
      notes: [
        'Once verified, your ad goes live automatically',
        'You will appear in the "Google Guaranteed" section above regular search ads',
        'Ask satisfied customers to leave Google reviews — more reviews = better ranking',
        'Check the LSA dashboard weekly to manage leads and budget',
      ],
    },
  ];
}
