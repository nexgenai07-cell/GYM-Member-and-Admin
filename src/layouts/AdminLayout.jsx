import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminHeader from '../components/admin/AdminHeader';

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-[#0b0b0c] text-on-surface">
      <AdminSidebar />
      <div className="pl-72">
        <AdminHeader />
        <main className="w-full pt-16 min-h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
}