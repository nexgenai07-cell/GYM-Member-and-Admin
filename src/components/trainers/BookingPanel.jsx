import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { catalogService } from '../../services/catalogService';

// Generate days for current month
function generateDays() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay(); // 0=Sun, 1=Mon...
  // Normalize to Monday start
  const offset = (firstDay + 6) % 7;

  const days = [];
  for (let i = 0; i < offset; i++) {
    days.push({ d: '', disabled: true, empty: true });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d);
    const isPast = date < new Date(year, month, now.getDate());
    days.push({ d, disabled: isPast, date });
  }
  return { days, year, month };
}

const SERVICES = [
  { id: 'technique', name: '60-Min Technique Analysis', description: 'Platform High-Speed Video + VBT', price: 95 },
  { id: 'biometric', name: 'Biometric Assessment', description: 'Dual Force Plate + Mob Impingement', price: 120 },
];

const TIME_SLOTS = ['07:00 AM', '09:30 AM', '14:00 PM', '16:30 PM', '18:00 PM'];

export default function BookingPanel({ trainer }) {
  const { days, year, month } = generateDays();
  const monthName = new Date(year, month).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const [selectedService, setSelectedService] = useState('technique');
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState('09:30 AM');
  const [notes, setNotes] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);

  const currentPrice = SERVICES.find((s) => s.id === selectedService)?.price || 95;

  const handleConfirm = async () => {
    if (!selectedDay) {
      toast.error('Select a date first');
      return;
    }
    if (!trainer) {
      toast.error('Trainer not loaded');
      return;
    }

    try {
      setLoading(true);

      // Build scheduled_at datetime
      const [time, period] = selectedSlot.split(' ');
      let [hours, minutes] = time.split(':').map(Number);
      if (period === 'PM' && hours !== 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;

      const scheduledAt = new Date(year, month, selectedDay, hours, minutes);

      await catalogService.bookSession({
        trainer_id: trainer.id,
        scheduled_at: scheduledAt.toISOString(),
        duration_minutes: 60,
        focus_area: SERVICES.find((s) => s.id === selectedService)?.name,
        notes,
      });

      toast.success('Session booked!');
      setConfirmed(true);
    } catch (e) {
      toast.error(e.response?.data?.detail || 'Failed to book session');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col">
      <div className="sticky top-20 bg-surface-container-lowest rounded-xl p-space-lg shadow-2xl flex flex-col gap-space-md">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <span className="font-label-md text-label-md text-primary tracking-widest uppercase flex items-center gap-space-2xs">
              <span className="w-2 h-2 rounded-full bg-primary-container" />
              Live Telemetry Scheduling
            </span>
            <h2 className="font-headline-md text-headline-md text-on-surface uppercase tracking-wide">
              Book 1-On-1 Session
            </h2>
          </div>
          <span className="material-symbols-outlined text-headline-md text-on-surface-variant">
            calendar_clock
          </span>
        </div>

        {!confirmed ? (
          <div className="flex flex-col gap-space-md">
            {/* Service Selection */}
            <div className="flex flex-col gap-space-2xs">
              <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                Step 1: Select Protocol Service
              </label>
              <div className="grid grid-cols-1 gap-space-xs">
                {SERVICES.map((svc) => {
                  const active = selectedService === svc.id;
                  return (
                    <motion.button
                      key={svc.id}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedService(svc.id)}
                      className={`relative flex items-center justify-between p-space-sm rounded-lg cursor-pointer transition-all text-left ${
                        active ? 'bg-surface-container-low' : 'bg-surface-container-low hover:bg-surface-container'
                      }`}
                      type="button"
                    >
                      <div className="flex items-center gap-space-sm">
                        <div
                          className={`w-4 h-4 rounded-full flex items-center justify-center ${
                            active ? 'bg-primary-container' : 'bg-surface-container-highest'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              active ? 'bg-on-primary-container' : 'bg-transparent'
                            }`}
                          />
                        </div>
                        <div className="flex flex-col">
                          <span className="font-title-md text-title-md text-on-surface leading-tight">
                            {svc.name}
                          </span>
                          <span className="font-label-md text-label-md text-on-surface-variant uppercase">
                            {svc.description}
                          </span>
                        </div>
                      </div>
                      <span
                        className={`font-headline-md text-headline-md ${
                          active ? 'text-primary' : 'text-on-surface'
                        }`}
                      >
                        ${svc.price}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Calendar */}
            <div className="flex flex-col gap-space-2xs">
              <div className="flex items-center justify-between">
                <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                  Step 2: Choose Platform Date
                </label>
                <span className="font-label-lg text-label-lg text-on-surface uppercase tracking-wider">
                  {monthName}
                </span>
              </div>

              <div className="bg-surface-container-low rounded-lg p-space-sm">
                <div className="grid grid-cols-7 gap-1 text-center font-label-md text-label-md text-on-surface-variant uppercase mb-space-2xs">
                  <span>Mo</span><span>Tu</span><span>We</span><span>Th</span>
                  <span>Fr</span><span>Sa</span><span>Su</span>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center font-label-lg text-label-lg">
                  {days.map((day, i) => {
                    if (day.empty) return <span key={i} />;
                    if (day.disabled) {
                      return (
                        <span key={i} className="py-2 text-surface-variant opacity-40">
                          {day.d}
                        </span>
                      );
                    }
                    const isSelected = selectedDay === day.d;
                    return (
                      <motion.button
                        key={i}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSelectedDay(day.d)}
                        className={`py-2 rounded transition-colors ${
                          isSelected
                            ? 'bg-primary-container text-on-primary-container font-extrabold shadow-md'
                            : 'text-on-surface-variant hover:bg-surface-container-high'
                        }`}
                        type="button"
                      >
                        {day.d}
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Time Slots */}
            <div className="flex flex-col gap-space-2xs">
              <label className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">
                Step 3: Available Slot {selectedDay ? `(Day ${selectedDay})` : ''}
              </label>
              <div className="grid grid-cols-3 gap-space-xs">
                {TIME_SLOTS.map((time) => {
                  const isSelected = selectedSlot === time;
                  return (
                    <motion.button
                      key={time}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedSlot(time)}
                      className={`py-space-xs px-space-2xs rounded font-label-lg text-label-lg transition-colors ${
                        isSelected
                          ? 'bg-primary-container text-on-primary-container shadow-md'
                          : 'bg-surface-container-low hover:bg-surface-container text-on-surface'
                      }`}
                      type="button"
                    >
                      {time}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Notes */}
            <div className="flex flex-col gap-space-2xs">
              <label
                className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider"
                htmlFor="athlete-notes"
              >
                Step 4: Objective & Injury Flags
              </label>
              <textarea
                id="athlete-notes"
                rows="3"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Target raw squat sticking point at 210kg."
                className="w-full bg-surface-container-low text-on-surface rounded-lg p-space-sm font-body-md text-body-md focus:outline-none focus:bg-surface-container placeholder:text-outline/70 resize-none"
              />
            </div>

            {/* Price Summary */}
            <div className="bg-surface-container rounded-lg p-space-sm flex items-center justify-between">
              <div className="flex flex-col">
                <span className="font-label-md text-label-md text-on-surface-variant uppercase">
                  Platform Fee Total
                </span>
                <span className="font-label-lg text-label-lg text-primary uppercase">
                  No Cancellation Fee &gt;24h
                </span>
              </div>
              <div className="flex items-baseline gap-space-2xs">
                <span className="font-headline-lg text-headline-lg text-on-surface">
                  ${currentPrice}
                </span>
                <span className="font-label-md text-label-md text-on-surface-variant uppercase">
                  USD
                </span>
              </div>
            </div>

            {/* CTA */}
            <motion.button
              whileTap={{ scale: 0.99 }}
              onClick={handleConfirm}
              disabled={loading || !selectedDay}
              className={`w-full py-space-md font-label-lg text-label-lg uppercase tracking-widest rounded transition-all flex items-center justify-center gap-space-xs disabled:opacity-50 ${
                loading
                  ? 'bg-surface-container-high text-primary cursor-wait'
                  : 'bg-primary-container hover:bg-secondary-container text-on-primary-container shadow-[0_0_24px_rgba(229,25,55,0.35)]'
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-title-md">
                {loading ? 'sync' : 'electric_bolt'}
              </span>
              {loading ? 'Booking...' : 'Confirm 1-On-1 Booking'}
            </motion.button>
          </div>
        ) : (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg bg-surface-container p-space-md flex flex-col gap-space-2xs"
            >
              <div className="flex items-center gap-space-xs text-primary">
                <span className="material-symbols-outlined text-title-md">
                  check_circle
                </span>
                <span className="font-label-lg text-label-lg uppercase tracking-wider">
                  Slot Confirmed &amp; Synchronized
                </span>
              </div>
              <p className="font-body-md text-body-md text-on-surface">
                Session booked with {trainer?.user?.full_name || 'your trainer'} for{' '}
                <strong className="text-primary font-bold">
                  Day {selectedDay} at {selectedSlot}
                </strong>
                .
              </p>
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}