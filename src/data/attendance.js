export const attendanceStats = [
  {
    label: 'Current Streak',
    sublabel: 'Cadence Velocity',
    value: '18',
    unit: 'Days',
    icon: 'local_fire_department',
    accent: true,
    footer: 'Personal Best: 24 Days (Oct 2024)',
    progress: 75,
  },
  {
    label: 'Month Check-Ins',
    sublabel: 'Cadence Frequency',
    value: '22',
    unit: 'Visits',
    icon: 'calendar_month',
    accent: false,
    badge: 'Top 4% Campus Elite',
    footer: 'Cycle Goal: 26 Sessions',
    footerRight: '84%',
  },
  {
    label: 'Workout Hours',
    sublabel: 'Time Under Load',
    value: '34.5',
    unit: 'Hrs',
    icon: 'timer',
    accent: false,
    badge: '+4.2 hrs vs previous 30-day window',
    footer: 'Daily Mean: 1h 34m',
    footerRight: 'Avg HR: 148 BPM',
  },
  {
    label: 'Prime Window',
    sublabel: 'Optimal Rhythm',
    value: '17:30 - 19:00',
    unit: '',
    icon: 'speed',
    accent: true,
    badge: 'Evening Prime · 78% Session Affinity',
    footer: 'Recovery index: 94%',
    footerRight: 'Bio-Synced',
  },
];

export const milestones = [
  {
    tier: 'Tier 01 • Unlocked',
    title: '15-Day Consistency',
    status: 'claimed',
    badge: 'Claimed',
    description: 'Granted voucher: 15% OFF Performance Fuel & Apparel at the Gym Pro Shop.',
    footer: 'Coupon: CONSISTENT-15',
    action: 'View Voucher',
    icon: 'task_alt',
  },
  {
    tier: 'Tier 02 • Active Hunt',
    title: '30-Day Beast Mode',
    status: 'active',
    badge: '18 / 30 Days',
    description: 'Target Reward: Complimentary Session in High-Subzero Cryo Pods ($65 Value).',
    progress: 60,
    daysLeft: '12 Days to Lock',
    icon: 'progress_activity',
  },
  {
    tier: 'Tier 03 • Locked',
    title: 'Century Club 100 Days',
    status: 'locked',
    badge: '18 / 100',
    description: 'Engraved Black Titanium Barbell Collar + Lifetime 1-Year VIP Locker Privilege.',
    footer: 'Target Window: June 2025',
    icon: 'lock',
  },
];

export const checkInLedger = [
  {
    date: 'Today, May 18',
    status: 'Streak #18',
    statusType: 'active',
    entry: '17:28:14',
    exit: 'ACTIVE SESSION',
    exitActive: true,
    duration: '1h 14m (Ongoing)',
    durationActive: true,
    zones: ['Heavy Iron Arena', 'Cryo Pods'],
    reps: '340 Reps',
    volume: '18,450 kg Volume',
  },
  {
    date: 'May 17, 2025',
    status: 'Streak #17',
    statusType: 'default',
    entry: '17:42:02',
    exit: '19:18:40',
    duration: '1h 36m',
    zones: ['Sprint Track', 'Heavy Iron Arena'],
    reps: '420 Reps',
    volume: '22,100 kg Volume',
  },
  {
    date: 'May 16, 2025',
    status: 'Streak #16',
    statusType: 'default',
    entry: '07:15:20',
    exit: '08:22:15',
    duration: '1h 06m',
    zones: ['Heavy Iron Arena'],
    reps: '280 Reps',
    volume: '14,200 kg Volume',
  },
  {
    date: 'May 15, 2025',
    status: 'Tier 01 Hit',
    statusType: 'tier',
    entry: '18:02:11',
    exit: '19:45:00',
    duration: '1h 42m',
    zones: ['Heavy Iron Arena', 'Sprint Track', 'Cryo Pods'],
    reps: '510 Reps',
    volume: '26,750 kg Volume',
  },
  {
    date: 'May 14, 2025',
    status: 'Streak #14',
    statusType: 'default',
    entry: '17:35:50',
    exit: '18:50:12',
    duration: '1h 14m',
    zones: ['Sprint Track'],
    reps: '190 Reps',
    volume: 'Speed Drills · 4.8 km',
  },
];

export const arenaSnapshots = [
  {
    tag: 'Zone Leaderboard',
    tagAccent: true,
    title: 'Heavy Iron Arena',
    description:
      '14 of 22 sessions concentrated here. Optimal barbell velocity recorded on Deadlifts.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAWTpQQZxWNLKQLpra2l594YhowLdXrb727C5jmZblvkjq6Ucr9I9lzdOgvA53tmjcw44tYKMXkQmSI0p8Ma4v9tmT7l_TfKRxtOv2HfEaly6iKivvJqnmnaX78uCPhtF40AV0BaakefxpFkiyVoP-J73sQQOesyqBDseduuAFSfwow7ZbMHOahXfU6yAYvUzW6NNPmLqGBG-4McC5DUQuns1Q-ueNCwH1vRYOxnItmHxqMj3ltRxOCCQ',
  },
  {
    tag: 'Cold Recovery',
    tagAccent: false,
    title: 'Cryo Pod System',
    description:
      '6 recovery immersions logged. Next free unlocked session at Day 30 mark.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC6rLapvFmFNJx860WNpB8Mrf5tgDoYhOlU_xLMZ3DISxDlWk5X_nKy1nKxDbgBdSYvz0KsLd5v2010rru47jU5cEIF_n-0qe7EzpdflyQYyq2DOgg0keTwe3MuMbC2PMoy2-3UCcUMzBeMfJYfQQUcermOiltr_M7uhErht5evGlYp1Nl41iIzMQJR85jM2GbuO4YeSxFJEmoHr-DS7iRDnsbUEF544Tgtcx7IrinZ1O0_ZirL6g00pg',
  },
  {
    tag: 'Velocity & Cardio',
    tagAccent: false,
    title: 'Indoor Sprint Track',
    description: 'Top sprint speed: 29.4 km/h clocked at lane 3 laser gates.',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBI8bzequKwIF2CSGm78G3dWAOie9lH6AEEVmgfe0XSHQMZk4B2kDAI-6n-sPRwWoIpuIWok7BJwPcU8klNGXkGq7ip-IZ9lUWYXdZz1XUOVYYW8V5D_RTCB1tRLCKqz-R7Q4K2vrq3hY3im3ocyn5M-7xWAHQfR2Uk-llnc188-bcRDk2aJLY-_I90mLUBzn7pKHalHXPW68s00zmRAh5HhLnShyT-NIEV4O_iEMDnrLiesTh60QmgaA',
  },
];

// 52 weeks × 7 days heatmap
export function generateYearHeatmap() {
  const data = [];
  for (let w = 0; w < 52; w++) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      const rand = Math.random();
      let level = 0;
      if (rand > 0.3) level = 1;
      if (rand > 0.5) level = 2;
      if (rand > 0.7) level = 3;
      if (rand > 0.85) level = 4;
      week.push(level);
    }
    data.push(week);
  }
  // Last 3 weeks = strong streak (level 3-4)
  for (let w = 49; w < 52; w++) {
    for (let d = 0; d < 7; d++) {
      data[w][d] = d === 6 && w === 51 ? 0 : 4; // Last day empty
    }
  }
  return data;
}