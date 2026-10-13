// src/components/shop/LockerInfo.jsx
import { motion } from 'framer-motion';

const LOCKER_INFO = [
  {
    icon: 'schedule',
    title: 'Ready in 10 Mins',
    description: 'Orders are staged in your locker within 10 minutes of confirmation.',
  },
  {
    icon: 'lock',
    title: 'Secure Locker Access',
    description: 'Unlock via your member QR code or app — no staff interaction needed.',
  },
  {
    icon: 'local_shipping',
    title: 'Home Delivery Available',
    description: 'Prefer doorstep delivery? Choose it at checkout — arrives next day.',
  },
];

export default function LockerInfo() {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="w-full px-space-xl pb-space-2xl bg-surface"
    >
      <div className="max-w-[1440px] mx-auto bg-surface-container-lowest rounded-xl p-space-lg relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg relative z-10">
          {LOCKER_INFO.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
              className="flex items-start gap-space-md"
            >
              <div className="w-10 h-10 rounded bg-surface-container flex items-center justify-center text-primary-container flex-shrink-0">
                <span className="material-symbols-outlined text-2xl">
                  {item.icon}
                </span>
              </div>
              <div className="flex flex-col gap-space-2xs">
                <h4 className="font-title-md text-title-md text-on-surface uppercase tracking-wider">
                  {item.title}
                </h4>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  );
}