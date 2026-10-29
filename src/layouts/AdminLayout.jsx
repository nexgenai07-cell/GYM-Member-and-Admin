import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';
import { MobileNavProvider } from './MobileNav';

export default function AdminLayout() {
  return (
    <MobileNavProvider>
      <div className="min-h-screen bg-[#0b0b0c] text-on-surface">
        <AdminSidebar />
        <div className="lg:pl-72 min-w-0 overflow-x-hidden">
          <AdminHeader />
          <main className="w-full min-w-0 pt-16 min-h-screen">
            <Outlet />
          </main>
        </div>
      </div>
    </MobileNavProvider>
  );
}
