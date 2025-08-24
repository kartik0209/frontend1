export const objectiveOptions = [
  {
    value: "conversions",
    label: "Conversions",
    description: "Let the advertiser to make available for the conversion goal",
  },
  {
    value: "sale",
    label: "Sale",
    description: "When the aim is to sell or make money",
  },
  {
    value: "app_installs",
    label: "App Installs",
    description: "When you are targeting to get campaigns default goal",
  },
  {
    value: "leads",
    label: "Leads",
    description: "The leads generation campaign",
  },
  {
    value: "impressions",
    label: "Impressions",
    description: "Impression based on impressions",
  },
  {
    value: "clicks",
    label: "Clicks",
    description: "When the pay-per-click campaign",
  },
];

export const conversionTrackingOptions = [
  {
    value: "server_postback",
    label: "Server Postback",
    description: "Server to server integration",
  },
  
  {
    value: "iframe_pixel",
    label: "Iframe Pixel",
    description: "Traditional pixel for direct placement on a website or gtm",
  },
 
];



export const statusOptions = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Paused', value: 'paused' },
  { label: 'Expired', value: 'expired' },
];

export const visibilityOptions = [
  { label: 'Public', value: 'public' },
  { label: 'Private', value: 'private' },
  { label: 'Invite Only', value: 'invite_only' },
];


export const currencyOptions = [
  { label: 'USD', value: 'USD' },
  { label: 'EUR', value: 'EUR' },
  { label: 'GBP', value: 'GBP' },
  { label: 'INR', value: 'INR' },
];

export const revenueModelOptions = [
  { label: 'CPA', value: 'CPA' },
  { label: 'CPC', value: 'CPC' },
  { label: 'CPM', value: 'CPM' },
  { label: 'Revenue Share', value: 'revenue_share' },
];

export const deviceOptions = [
  { label: 'Desktop', value: 'desktop' },
  { label: 'Mobile', value: 'mobile' },
  { label: 'Tablet', value: 'tablet' },
];

export const osOptions = [
  { label: 'Windows', value: 'windows' },
  { label: 'macOS', value: 'macos' },
  { label: 'Linux', value: 'linux' },
  { label: 'iOS', value: 'ios' },
  { label: 'Android', value: 'android' },
];

export const timezoneOptions = [
  { label: 'UTC', value: 'UTC' },
  { label: 'EST', value: 'EST' },
  { label: 'PST', value: 'PST' },
  { label: 'CST', value: 'CST' },
  { label: 'MST', value: 'MST' },
  { label: 'GMT', value: 'GMT' },
];