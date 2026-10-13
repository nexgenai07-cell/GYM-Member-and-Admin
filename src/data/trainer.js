export const trainer = {
  name: 'Coach Marcus Vance',
  image:
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDKLeWExd6s3BXxXIgJ8CqmSkndG07e0uo_ejww1JM5b-LJkJEhGYLB2JMPkEdkSh5CAcRTss2C8u6VkI76FntXvT56Fz97x9sPmNWtcxlVa-NRnGrR5YdbecumAfiBvWDvQQSdUId5O-3NACcdODsluvaOztxVz4_V3CZ6IgCoCZdHotzfNV_d3YeIG_QTJn4cFuoS4njfKDObTEiHgmbxi8GGJaL8sXHW-9qdHJNsLCCgsIbqc0bq2A',
  title: 'Head Elite Specialist',
  credentials: 'CSCS*D · USAW National Coach · 12+ Years Exp',
  accepting: 'Accepting Athletes',
  metrics: [
    { label: 'Athlete Rating', value: '4.9', unit: '/ 5.0', sub: '380+ Logged Reviews', icon: 'star' },
    { label: 'Barbell Velocity', value: '0.82', unit: 'm/s avg', sub: 'VBT Calibrated', icon: 'speed' },
    { label: 'Comp Athletes', value: '42', unit: 'National Podiums', sub: 'IPF & USAW Roster', icon: 'trophy' },
  ],
  labFocus: {
    label: 'Lab Focus',
    title: 'Biomechanics',
    subtitle: 'Kinetic Optimization',
    footer: 'Force Plate Sync',
    icon: 'biotech',
  },
};

export const specialties = [
  'Barbell Velocity (VBT)',
  'Powerlifting Periodization',
  'Biomechanical Optimization',
];

export const philosophy = {
  title: 'Coaching Philosophy & Methodology',
  protocol: 'Protocol V3.2',
  paragraphs: [
    'I do not believe in subjective coaching guessing games. Every lift executed under my supervision is analyzed using linear position transducers, force plate metrics, and high-frequency video capture. We systematically eliminate lever leaks, force vectors that drift from mid-foot, and neuromuscular rate of force decay.',
    'Whether you are preparing for a national raw championship or rebuilding joint mechanics under severe axial loads, our training structure focuses on the absolute threshold of mechanical tension and CNS recovery tracking.',
  ],
};

export const telemetryImpact = [
  { label: 'Deadlift Delta', value: '+35.0 KG', bar: 80, sub: '84 Lifters Mean', accent: true },
  { label: 'Adipose Tissue', value: '-4.2%', bar: 60, sub: 'DEXA Confirmed', accent: false },
  { label: 'Rate Force Dev', value: '+21.8%', bar: 92, sub: 'Explosive Power', accent: true },
];

export const curriculum = [
  {
    id: 1,
    tag: 'Strength Protocol',
    duration: '12 Weeks',
    title: 'Olympic Squat Precision',
    description:
      'Reconstruct bottom position stability, solve ankle dorsiflexion impingement, and build massive eccentric recoil force.',
    price: 149,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC1SdsFT0wzyLvqaAnGUT27bFwiXBZQbpJ0K7bQ36iTJqwWopIIJXIjcdtKk2AlMSZhSHCBWfXrJKGRd4AmYhCac5_wKwMOuUaIUZrJIzBrbJkj1ClrjSPcUXjw2xcb2iIIS07tUD59z47W6ouxoVvmOg32L5qmt_LBA1agp0Zj9yL6jHDPYP4Cb4DrbgsKZqkKniUh9EvXtlWXeScFAHcNQGtS0418HxdNnQxjrgcpjsETiQkZ5WV1aA',
  },
  {
    id: 2,
    tag: 'Advanced Telemetry',
    duration: '6 Weeks',
    title: 'VBT Mastery & Fatigue Index',
    description:
      'Learn velocity loss thresholds, autoregulation stops, and peak power phase transitions.',
    price: 119,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDJFJk33QFbpNVVjpRpm2wLjfPsiiGrOzP4d4ITQtN4aCQa9rs25b_BHo6qSomcruHx-sv-Z4UY3wnuO7UvtkfqkkunKGfATg-BBiqSV5pkVw5SBByO7861OhkR9gr5MeJuVpdElkZixBjKdiSGQS9-VmnfWSoF1nUD527MrfFPAvpAJ-cRiOHQkq9UUgpFWDlUrnMbqFpCMHaYcigDkumzEFaUY4s0ZiTec1AXsRSmIS5261VWQdYQNA',
  },
];

export const reviews = [
  {
    initials: 'KR',
    name: 'Klaus Richter',
    role: 'Powerlifting 93kg Division',
    rating: 5,
    text: '"Marcus broke down my conventional deadlift hinge in 20 minutes using the platform cameras. Fixed my hip height before initiation and I added 25kg onto my raw PR without lower back soreness."',
    date: 'Oct 18, 2025',
    type: 'Biometric Assessment',
  },
  {
    initials: 'SL',
    name: 'Sarah Lindqvist',
    role: 'CrossFit Games Regional Competitor',
    rating: 5,
    text: '"The bar velocity metrics completely shifted how I train my snatch turnover. Marcus does not waste words—brutal, objective, and insanely accurate."',
    date: 'Nov 02, 2025',
    type: '60-Min Technique Analysis',
  },
];

export const bookingServices = [
  {
    id: 'technique',
    name: '60-Min Technique Analysis',
    description: 'Platform High-Speed Video + VBT',
    price: 95,
    default: true,
  },
  {
    id: 'biometric',
    name: 'Biometric Assessment',
    description: 'Dual Force Plate + Mob Impingement',
    price: 120,
    default: false,
  },
];

export const bookingSlots = [
  { time: '07:00 AM', available: true },
  { time: '09:30 AM', available: true, default: true },
  { time: '14:00 PM', available: true },
  { time: '16:30 PM', available: true },
  { time: '18:00 PM', available: true },
  { time: 'BOOKED', available: false },
];