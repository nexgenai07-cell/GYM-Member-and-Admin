export const currentPlan = {
  name: 'Smart Pro',
  price: 79,
  interval: 'month',
  status: 'Active',
  description: 'Unlimited Biometric Turnstile Access',
  features: [
    '24/7 Monolith Weightroom & Platforms',
    'Smart Sensor Telemetry & Velocity Bar Tracking',
    '4 Monthly Cryotherapy Recovery Passes',
    'Complimentary Apothecary Hydration Stations',
  ],
};

export const paymentMethod = {
  brand: 'VISA',
  last4: '4242',
  cardholder: 'Alex Mercer',
  expiry: '09/27',
  securityLabel: '3D Secure 2.0 Tokenized',
  status: 'Protected',
};

export const lockerCredit = {
  balance: 45.0,
  max: 100,
  allocation: 45,
  breakdown: [
    { label: 'Apothecary', amount: 30.0 },
    { label: 'Cafe', amount: 15.0 },
  ],
};

export const transactions = [
  {
    id: '#INV-9921',
    date: 'Oct 15, 2025',
    description: 'Pro Membership - Oct Renewal',
    icon: 'fitness_center',
    method: { type: 'Visa', label: '•••• 4242' },
    amount: 79.0,
    status: 'Paid',
  },
  {
    id: '#INV-9884',
    date: 'Oct 09, 2025',
    description: 'Titan Hydro-Isolate 2.5kg (Apothecary)',
    icon: 'nutrition',
    method: { type: 'Locker Balance' },
    amount: 64.5,
    status: 'Paid',
  },
  {
    id: '#INV-9742',
    date: 'Oct 02, 2025',
    description: '1:1 Coaching w/ Coach Marcus',
    icon: 'sports',
    method: { type: 'Visa', label: '•••• 4242' },
    amount: 120.0,
    status: 'Paid',
  },
  {
    id: '#INV-9610',
    date: 'Sep 24, 2025',
    description: 'Cryo Recovery Chamber (Session 03)',
    icon: 'ac_unit',
    method: { type: 'Locker Balance' },
    amount: 35.0,
    status: 'Paid',
  },
  {
    id: '#INV-9402',
    date: 'Sep 15, 2025',
    description: 'Pro Membership - Sep Renewal',
    icon: 'fitness_center',
    method: { type: 'Visa', label: '•••• 4242' },
    amount: 79.0,
    status: 'Paid',
  },
];

export const settings = {
  autoRenew: {
    enabled: true,
    gracePeriod: '72 Hours Active',
    description:
      'Automatically settle membership cycle 48 hours prior to lapse date. Guarantees uninterrupted gym floor and turnstile clearance.',
  },
  biometric: {
    enabled: true,
    terminalKey: 'TK-8841-SEC-V4',
    description:
      'Facial recognition and palm telemetry scanner access nodes verify live billing credentials at entry lanes.',
  },
  corporateTax: {
    enabled: false,
    taxId: null,
    description:
      'Dispatch compliant VAT/GST registered receipts and monthly corporate expensing summaries to your accounting department.',
  },
};