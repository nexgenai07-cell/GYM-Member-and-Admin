import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApi } from '../../hooks/useApi';
import { catalogService } from '../../services/catalogService';
import TrainerBanner from '../../components/trainers/TrainerBanner';
import SpecialtiesPillRow from '../../components/trainers/SpecialtiesPillRow';
import PhilosophyCard from '../../components/trainers/PhilosophyCard';
import TelemetryImpact from '../../components/trainers/TelemetryImpact';
import CurriculumGrid from '../../components/trainers/CurriculumGrid';
import ReviewsList from '../../components/trainers/ReviewsList';
import BookingPanel from '../../components/trainers/BookingPanel';
import { tl } from '../../i18n';

export default function TrainerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: trainer, loading } = useApi(
    () => catalogService.trainer(id),
    [id]
  );

  if (loading) {
    return (
      <div className="w-full px-space-xl py-space-xl flex flex-col gap-6">
        <div className="h-64 bg-surface-container rounded-xl animate-pulse" />
        <div className="h-96 bg-surface-container rounded-xl animate-pulse" />
      </div>
    );
  }

  if (!trainer) {
    return (
      <div className="w-full px-space-xl py-space-xl text-center py-24">
        <span className="material-symbols-outlined text-4xl text-on-surface-variant/40">
          person_off
        </span>
        <p className="font-title-md text-title-md text-on-surface mt-3">
          {tl("Trainer not found")}
        </p>
        <button
          onClick={() => navigate('/dashboard/trainers')}
          className="mt-4 px-6 py-2 rounded bg-primary-container text-on-primary-container font-label-lg uppercase tracking-wider"
          type="button"
        >
          {tl("Back to Directory")}
        </button>
      </div>
    );
  }

  return (
    <div className="w-full px-space-xl py-space-xl flex flex-col gap-space-xl">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <motion.div
          className="absolute -top-40 right-[10%] w-[460px] h-[460px] rounded-full bg-primary-container/10 blur-3xl"
          animate={{ x: [0, 34, 0], y: [0, 26, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <TrainerBanner trainer={trainer} />

      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-space-xl">
        {/* LEFT: Content */}
        <div className="flex flex-col gap-space-xl min-w-0">
          <SpecialtiesPillRow specialties={trainer.specialties} />
          <PhilosophyCard bio={trainer.bio} title={tl("Coaching Philosophy")} />
          <TelemetryImpact trainer={trainer} />
          <CurriculumGrid courses={trainer.courses || []} />
          <ReviewsList reviews={trainer.reviews || []} />
        </div>

        {/* RIGHT: Sticky Booking */}
        <BookingPanel trainer={trainer} />
      </div>
    </div>
  );
}