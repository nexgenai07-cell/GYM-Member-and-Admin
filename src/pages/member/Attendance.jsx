import { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useApi } from '../../hooks/useApi';
import { attendanceService } from '../../services/attendanceService';
import AttendanceStats from '../../components/attendance/AttendanceStats';
import YearHeatmap from '../../components/attendance/YearHeatmap';
import HourlyCurve from '../../components/attendance/HourlyCurve';
import MilestoneTiers from '../../components/attendance/MilestoneTiers';
import CheckInLedger from '../../components/attendance/CheckInLedger';
import ArenaSnapshots from '../../components/attendance/ArenaSnapshots';

const EASE = [0.22, 1, 0.36, 1];

export default function Attendance() {
  const [checkingIn, setCheckingIn] = useState(false);

  const { data: summary, refetch: refetchSummary } = useApi(
    () => attendanceService.summary(),
    []
  );

  const { data: milestones, refetch: refetchMilestones } = useApi(
    () => attendanceService.milestones(),
    []
  );

  const { data: hourly } = useApi(() => attendanceService.hourly(), []);
  const { data: arenas } = useApi(() => attendanceService.arenas(), []);

  const handleCheckIn = async () => {
    try {
      setCheckingIn(true);
      await attendanceService.checkIn({
        facility: 'Metro Station Core 01',
        zone: 'Heavy Iron Arena',
      });
      toast.success('Checked in successfully!');
      refetchSummary();
      refetchMilestones();
    } catch (e) {
      const msg = e.response?.data?.detail || 'Check-in failed';
      toast.error(msg);
    } finally {
      setCheckingIn(false);
    }
  };

  return (
    <div className="relative w-full px-space-xl pb-space-2xl pt-space-xl flex flex-col gap-space-xl">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute -top-40 right-[12%] w-[460px] h-[460px] rounded-full bg-primary-container/10 blur-3xl"
          animate={{ x: [0, 35, 0], y: [0, 28, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Top Bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-space-md"
      >
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-space-xs text-primary">
            <span className="material-symbols-outlined text-[16px]">verified_user</span>
            <span className="font-label-md text-label-md uppercase tracking-widest">
              Biometric Check-In Matrix
            </span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface uppercase tracking-wide leading-none m-0">
            Attendance &{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-container via-primary to-primary-container">
              Gym Telemetry
            </span>
          </h1>
        </div>

        <div className="flex items-center gap-space-sm self-start md:self-auto">
          <div className="flex items-center gap-space-xs px-space-md py-space-xs rounded bg-surface-container shadow-sm">
            <span className="relative flex w-2.5 h-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-container opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary-container" />
            </span>
            <span className="font-label-md text-label-md uppercase text-on-surface-variant">
              Active NFC:
            </span>
            <span className="font-title-md text-title-md text-on-surface tracking-wider">
              GATE-04 ALPHA
            </span>
          </div>

          <button
            onClick={handleCheckIn}
            disabled={checkingIn}
            className="relative flex items-center gap-space-xs px-space-md py-space-xs rounded bg-primary-container text-on-primary-container font-label-lg text-label-lg uppercase tracking-wider hover:bg-secondary-container transition-colors shadow-[0_0_20px_rgba(229,25,55,0.4)] disabled:opacity-60"
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">
              {checkingIn ? 'sync' : 'contactless'}
            </span>
            <span>{checkingIn ? 'Checking In...' : 'Instant Check-In'}</span>
          </button>
        </div>
      </motion.div>

      {/* Stats */}
      <AttendanceStats summary={summary} />

      {/* Heatmap + Hourly */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-md">
        <div className="xl:col-span-8">
          <YearHeatmap />
        </div>
        <div className="xl:col-span-4">
          <HourlyCurve hourly={hourly} />
        </div>
      </div>

      {/* Milestones */}
      <MilestoneTiers
        milestones={milestones}
        onClaim={() => {
          refetchMilestones();
          refetchSummary();
        }}
      />

      {/* Ledger */}
      <CheckInLedger />

      {/* Arenas */}
      <ArenaSnapshots arenas={arenas} />
    </div>
  );
}