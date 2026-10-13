import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import BrandingPanel from '../components/auth/BrandingPanel';
import LoginForm from '../components/auth/LoginForm';

const EASE = [0.22, 1, 0.36, 1];

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (data) => {
  try {
    setLoading(true);
    const result = await login(data.email, data.password);
    toast.success('Welcome back!');

    // Redirect based on role
    const userRole = result.user?.role;
    if (['admin', 'manager'].includes(userRole)) {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  } catch (e) {
    const msg = e.response?.data?.detail || 'Login failed. Please check your credentials.';
    toast.error(msg);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen w-full bg-background flex">
      {/* Left: Branding (hidden on mobile) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: EASE }}
        className="hidden lg:flex lg:w-1/2 xl:w-3/5"
      >
        <BrandingPanel />
      </motion.div>

      {/* Right: Login Form */}
      <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-6 md:p-10 bg-surface-container-lowest relative overflow-hidden">
        {/* ===== Ambient background (grid + breathing glows, matches app) ===== */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(128,128,128,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(128,128,128,0.04) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
            maskImage:
              'radial-gradient(ellipse 80% 60% at 50% 40%, black 20%, transparent 75%)',
            WebkitMaskImage:
              'radial-gradient(ellipse 80% 60% at 50% 40%, black 20%, transparent 75%)',
          }}
        />
        <motion.div
          className="absolute -right-32 -top-32 w-96 h-96 bg-primary-container/10 rounded-full blur-3xl pointer-events-none"
          animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -left-32 -bottom-32 w-96 h-96 bg-secondary-container/10 rounded-full blur-3xl pointer-events-none"
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.9, 0.5] }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 2,
          }}
        />
        {/* Slow drifting accent orb */}
        <motion.div
          className="absolute right-[10%] bottom-[15%] w-40 h-40 rounded-full bg-primary-container/5 blur-2xl pointer-events-none"
          animate={{ y: [0, -30, 0], x: [0, 14, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        />

        <motion.div
          initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
          className="relative w-full max-w-md"
        >
          {/* Mobile logo — with active pulse ring */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3, ease: EASE }}
            className="lg:hidden flex items-center gap-space-sm mb-space-xl"
          >
            <div className="relative w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center shadow-[0_0_16px_rgba(229,25,55,0.45)]">
              <motion.span
                className="material-symbols-outlined text-on-primary-container text-[24px]"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{
                  duration: 2.6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                fitness_center
              </motion.span>
              <motion.span
                className="absolute inset-0 rounded-lg border border-primary-container/70"
                animate={{ scale: [1, 1.5], opacity: [0.7, 0] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: 'easeOut' }}
              />
            </div>
            <div className="flex flex-col">
              <span className="font-headline-md text-headline-md tracking-wider text-on-surface uppercase leading-none">
                Smart Gym
              </span>
              <span className="font-label-md text-label-md text-primary tracking-widest uppercase">
                Performance Core
              </span>
            </div>
          </motion.div>

          {/* ✅ Pass loading to LoginForm so the button can show a spinner/disable state */}
          <LoginForm onSubmit={handleLogin} loading={loading} />
        </motion.div>
      </div>
    </div>
  );
}