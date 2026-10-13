import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    setLoading(true);
    const result = await login(email, password);

    // Verify admin role
    if (!['admin', 'manager'].includes(result.user?.role)) {
      toast.error('Admin access required');
      await logout();
      return;
    }

    toast.success('Admin access granted');
    navigate('/admin');
  } catch (e) {
    toast.error(e.response?.data?.detail || 'Invalid credentials');
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen w-full bg-[#08080a] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Ambient glows */}
      <div className="absolute -right-32 -top-32 w-96 h-96 bg-primary-container/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-32 -bottom-32 w-96 h-96 bg-secondary-container/10 rounded-full blur-3xl pointer-events-none" />

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="relative inline-flex items-center justify-center mb-4">
            <div className="w-16 h-16 rounded-2xl bg-primary-container flex items-center justify-center shadow-[0_0_30px_rgba(229,25,55,0.6)]">
              <span className="material-symbols-outlined text-on-primary-container text-[32px]">admin_panel_settings</span>
            </div>
            <span className="absolute inset-0 rounded-2xl ring-2 ring-primary-container/40 animate-ping" />
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface uppercase tracking-widest">Admin Console</h1>
          <p className="font-label-md text-[11px] text-primary uppercase tracking-[0.3em] mt-1 font-bold">Level 5 Clearance Required</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-[#0e0e0f] border border-[#1a1a1e] rounded-2xl p-8 flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-wider" htmlFor="admin-email">Administrator Email</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px] pointer-events-none z-10">alternate_email</span>
              <input id="admin-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@smartgym.internal"
                className="w-full bg-[#0a0a0c] text-on-surface font-body-md text-body-md pl-10 pr-4 py-3 rounded-lg border border-[#1a1a1e] focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container placeholder:text-on-surface-variant/30 transition-all" />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-wider" htmlFor="admin-password">Access Key</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px] pointer-events-none z-10">key</span>
              <input id="admin-password" type={showPassword ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter secure key"
                className="w-full bg-[#0a0a0c] text-on-surface font-body-md text-body-md pl-10 pr-12 py-3 rounded-lg border border-[#1a1a1e] focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container placeholder:text-on-surface-variant/30 transition-all" />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors" aria-label="Toggle password">
                <span className="material-symbols-outlined text-[18px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between flex-wrap gap-2">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input type="checkbox" className="peer sr-only" />
              <span className="w-4 h-4 rounded border-2 border-[#1a1a1e] bg-[#0a0a0c] flex items-center justify-center peer-checked:bg-primary-container peer-checked:border-primary-container transition-all" />
              <span className="font-body-md text-[12px] text-on-surface-variant">Keep me signed in</span>
            </label>
            <button type="button" className="font-label-md text-[10px] text-primary uppercase tracking-wider hover:underline">Need help?</button>
          </div>

          <motion.button whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }} type="submit"
            className="w-full bg-primary-container hover:bg-secondary-container text-on-primary-container font-label-lg text-label-lg uppercase tracking-widest py-3.5 rounded-lg shadow-[0_0_24px_rgba(229,25,55,0.5)] transition-all flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[18px]">lock_open</span>
            <span>Enter Command Center</span>
          </motion.button>

          <div className="flex items-center justify-center gap-2 pt-4 border-t border-[#1a1a1e]">
            <span className="material-symbols-outlined text-primary text-[14px]">verified_user</span>
            <span className="font-label-md text-[10px] text-on-surface-variant uppercase tracking-wider">Hardware Key Required on First Login</span>
          </div>
        </form>

        {/* Footer links */}
        <div className="mt-6 flex items-center justify-between font-label-md text-[10px] uppercase tracking-wider text-on-surface-variant">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            All Systems Online
          </span>
          <Link to="/login" className="text-primary hover:underline">Member Login →</Link>
        </div>
      </motion.div>
    </div>
  );
}