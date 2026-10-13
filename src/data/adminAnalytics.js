export const analyticsKPIs = [
  { label: 'Total Members', value: '1,842', delta: '+128 this month', icon: 'groups', accent: true },
  { label: 'Avg Session Length', value: '78m', delta: '+6m vs last month', icon: 'timer', accent: false },
  { label: 'Retention Rate', value: '94.2%', delta: 'Top 5% benchmark', icon: 'trending_up', accent: true },
  { label: 'Lifetime Value', value: '$1,840', delta: 'Avg per member', icon: 'payments', accent: false },
];

export const membershipGrowth = [
  { month: 'Nov', total: 1520, new: 62, churned: 18 },
  { month: 'Dec', total: 1584, new: 88, churned: 24 },
  { month: 'Jan', total: 1638, new: 78, churned: 24 },
  { month: 'Feb', total: 1672, new: 58, churned: 24 },
  { month: 'Mar', total: 1706, new: 62, churned: 28 },
  { month: 'Apr', total: 1742, new: 58, churned: 22 },
  { month: 'May', total: 1768, new: 48, churned: 22 },
  { month: 'Jun', total: 1794, new: 48, churned: 22 },
  { month: 'Jul', total: 1808, new: 36, churned: 22 },
  { month: 'Aug', total: 1824, new: 38, churned: 22 },
  { month: 'Sep', total: 1836, new: 34, churned: 22 },
  { month: 'Oct', total: 1842, new: 28, churned: 22 },
];

export const churnRisk = [
  { band: 'Low Risk (70-100%)', count: 1420, percent: 77.1, color: 'bg-emerald-400' },
  { band: 'Medium Risk (40-69%)', count: 284, percent: 15.4, color: 'bg-yellow-400' },
  { band: 'High Risk (20-39%)', count: 98, percent: 5.3, color: 'bg-orange-400' },
  { band: 'Critical (<20%)', count: 40, percent: 2.2, color: 'bg-error' },
];

export const topMetrics = [
  { label: 'Peak Hours', value: '17:00-20:00', sub: '412 avg concurrent', icon: 'schedule' },
  { label: 'Top Class', value: 'Olympic Lifting', sub: '94% avg attendance', icon: 'event' },
  { label: 'Top Machine', value: 'Squat Cage #03', sub: '512 scans/week', icon: 'fitness_center' },
  { label: 'Top Trainer', value: 'Marcus Vance', sub: '$6,420 monthly', icon: 'school' },
];

export const aiInsights = [
  {
    priority: 'high',
    icon: 'trending_up',
    title: 'Evening Peak Demand Surge',
    description: 'Peak occupancy between 18:30-19:30 exceeded capacity by 12% on 3 occasions this week. Recommend opening overflow zone or adding evening class.',
    action: 'Open Zone Delta',
  },
  {
    priority: 'medium',
    icon: 'trending_down',
    title: 'Tuesday Morning Decline',
    description: 'Tuesday 09:00 slot shows 28% lower attendance over 6 weeks. Consider class reallocation to Wednesday.',
    action: 'Review Schedule',
  },
  {
    priority: 'high',
    icon: 'person_remove',
    title: 'Cohort Retention Dip',
    description: 'Members who joined in Aug 2025 show 18% higher churn than usual. Correlation found with fewer initial trainer touchpoints.',
    action: 'Launch Outreach',
  },
  {
    priority: 'low',
    icon: 'lightbulb',
    title: 'Cross-Sell Opportunity',
    description: '68 members using Cryo Recovery regularly have not enrolled in any nutrition plan. Recommend targeted bundle offer.',
    action: 'Create Bundle',
  },
];