// src/pages/member/Profile.jsx — TOP SECTION ONLY (replace the hooks)
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useApi } from '../../hooks/useApi';
import { workoutsService } from '../../services/workoutsService';
import { nutritionService } from '../../services/nutritionService';
import { membersService } from '../../services/membersService';
import { useAuth } from '../../context/AuthContext';

// Import the standalone components
import ProfileBanner from '../../components/profile/ProfileBanner';
import ProfileStatsGrid from '../../components/profile/ProfileStatsGrid';
import BodyScan from '../../components/profile/BodyScan';
import CompositionChart from '../../components/profile/CompositionChart';
import PRMilestones from '../../components/profile/PRMilestones';
import DigitalPass from '../../components/profile/DigitalPass';

const EASE = [0.22, 1, 0.36, 1];

export default function Profile() {
  const { user } = useAuth();

  const { data: prs, loading: prsLoading } = useApi(
    () => workoutsService.prs(),
    []
  );
  const { data: dexa } = useApi(() => nutritionService.latestDexa(), [], {
    showError: false,
  });
  const { data: dexaHistory } = useApi(
    () => nutritionService.dexaHistory(),
    [],
    { showError: false }
  );
  const { data: stats } = useApi(() => workoutsService.stats(), []);
  const { data: membership } = useApi(() => membersService.myMembership(), [], {
    showError: false,
  });

  const displayName = user?.full_name || user?.username || 'Athlete';
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="w-full px-space-xl pb-space-2xl pt-space-xl flex flex-col">
      <ProfileBanner
        displayName={displayName}
        initials={initials}
        user={user}
        membership={membership}
        stats={stats}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm p-space-md mb-space-xl rounded-lg bg-surface-container border border-surface-container-high">
        <div className="flex items-center gap-space-sm">
          <span className="material-symbols-outlined text-primary">lock_reset</span>
          <span className="font-body-md text-[14px] text-on-surface">
            Still using the temporary password from your welcome email? Change it now.
          </span>
        </div>
        <Link
          to="/dashboard/change-password"
          className="shrink-0 px-space-md py-space-xs rounded bg-primary-container hover:bg-secondary-container text-on-primary-container font-label-md text-label-md uppercase tracking-widest transition-colors text-center"
        >
          Change password
        </Link>
      </div>

      <ProfileStatsGrid dexa={dexa} stats={stats} />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-xl mb-space-xl">
        <div className="xl:col-span-5">
          <BodyScan dexa={dexa} />
        </div>
        <div className="xl:col-span-7">
          <CompositionChart dexaHistory={dexaHistory || []} stats={stats} />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-xl">
        <div className="xl:col-span-7">
          <PRMilestones prs={prs} loading={prsLoading} />
        </div>
        <div className="xl:col-span-5">
          <DigitalPass user={user} membership={membership} />
        </div>
      </div>
    </div>
  );
}