// src/pages/member/Profile.jsx
import { useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
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
import SecuritySettings from '../../components/SecuritySettings';
import { tl } from '../../i18n';

export default function Profile() {
  const { user } = useAuth();
  const [params] = useSearchParams();
  const securityRef = useRef(null);
  // /dashboard/profile?tab=security (e.g. from a "2-step verification was reset" notification)
  useEffect(() => {
    if (params.get('tab') === 'security') securityRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [params]);

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
  // Everything this page shows, as a JSON file the member keeps.
  const exportData = () => {
    const blob = new Blob([JSON.stringify({
      exported_at: new Date().toISOString(),
      profile: { name: displayName, email: user?.email, phone: user?.phone, member_since: user?.created_at },
      membership,
      workout_stats: stats,
      personal_records: prs,
      body_scans: dexaHistory,
    }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smart-gym-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

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
        onExport={exportData}
      />
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

      <div ref={securityRef} id="security" className="mt-space-xl grid grid-cols-1 xl:grid-cols-12 gap-space-xl scroll-mt-24">
        <div className="xl:col-span-7">
          <SecuritySettings />
        </div>
        <div className="xl:col-span-5 rounded-xl border border-surface-container-high bg-surface-container p-5 flex flex-col gap-2 h-fit">
          <h2 className="text-on-surface font-bold text-[16px] flex items-center gap-2">
            <span className="material-symbols-outlined text-primary" aria-hidden="true">key</span>{tl('Password')}
          </h2>
          <p className="text-[13px] text-on-surface-variant">{tl('Use a password you don’t use anywhere else.')}</p>
          <Link to="/dashboard/change-password" className="text-primary text-[13px] font-bold hover:underline w-fit">{tl('Change password →')}</Link>
        </div>
      </div>
    </div>
  );
}