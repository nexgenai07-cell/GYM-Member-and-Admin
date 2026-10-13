export const courseModules = [
  {
    id: 'w1',
    week: 'Week 01: Foundational Biomechanics',
    progress: 100,
    status: 'complete',
    description: 'Kinetic chain alignment & linear position encoder calibration.',
  },
  {
    id: 'w2',
    week: 'Week 02: Force-Velocity Curve Profiling',
    progress: 100,
    status: 'complete',
    description: 'Determining individualized load-velocity profiles & baseline 1RM estimates.',
  },
  {
    id: 'w3',
    week: 'Week 03: Dynamic Effort & Bar Acceleration',
    progress: 45,
    status: 'active',
    days: [
      { day: 'Day 1: Rate of Force Development', status: 'done', duration: '24m' },
      { day: 'Day 2: Concentric Peak Power', status: 'playing', duration: '28m' },
      { day: 'Day 3: Accommodating Resistance', status: 'locked', duration: '32m' },
      { day: 'Day 4: Velocity Loss Autoregulation', status: 'locked', duration: '28m' },
    ],
  },
  {
    id: 'w4',
    week: 'Week 04: Transducer Telemetry & CNS Peak',
    progress: 0,
    status: 'locked',
    description: 'Supercompensation, tapering protocols and ballistic test taper.',
  },
];

export const exercises = [
  {
    id: 1,
    priority: 'Priority 01 • Prime Compound',
    icon: 'bolt',
    title: 'Barbell Speed Squat',
    prescription: '5 Sets × 3 Reps @ 0.85 m/s Target',
    description:
      'Dynamic effort tempo (1-0-X). Emphasize explosive hip drive out of the bottom reversal point. Rest 90 seconds between sets.',
    tracker: {
      labels: ['Working Sets', 'Recorded Mean Vel'],
      values: [
        { label: 'S1', value: '0.89', done: true },
        { label: 'S2', value: '0.87', done: true },
        { label: 'S3', value: '0.86', done: true },
        { label: 'S4', value: '--', done: false },
        { label: 'S5', value: '--', done: false },
      ],
    },
    action: { icon: 'sensors', label: 'Connect Transducer' },
    accent: true,
  },
  {
    id: 2,
    priority: 'Priority 02 • Overload',
    icon: 'fitness_center',
    title: 'Band-Resisted Deadlift',
    prescription: '4 Sets × 2 Reps @ Heavy Tension',
    description:
      'Anchor double mini-bands across barbell collar. Accelerate through the lockout without cervical hyperextension.',
    tracker: {
      labels: ['Target Band Tension', 'Est. Load Offset'],
      keyValue: [
        { key: '+65 LBS AT LOCKOUT', value: '60% 1RM', accent: true },
      ],
    },
    action: { icon: 'tune', label: 'Configure Resistance' },
    accent: false,
  },
  {
    id: 3,
    priority: 'Priority 03 • Plyometric',
    icon: 'height',
    title: 'Depth Box Jumps',
    prescription: '4 Sets × 5 Reps (30" Target Box)',
    description:
      'Step off 18-inch box, minimize ground contact time to under 0.20s, and rebound immediately with triple-extension power.',
    tracker: {
      labels: ['Max Ground Contact', 'Reactive Index'],
      keyValue: [
        { key: '< 0.18 SEC', value: 'RSI 2.8+', accent: true },
      ],
    },
    action: { icon: 'timer', label: 'View Rebound Telemetry' },
    accent: false,
  },
];