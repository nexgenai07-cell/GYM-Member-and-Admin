import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Member layout
import Sidebar from './components/Sidebar';
import Header from './components/Header';

// Admin layout
import AdminLayout from './layouts/AdminLayout';

// Member pages
import Dashboard from './pages/member/Dashboard';
import MachineGuide from './pages/member/MachineGuide';
import Courses from './pages/member/Courses';
import Player from './pages/member/Player';
import Trainers from './pages/member/Trainers';
import TrainerProfile from './pages/member/TrainerProfile';
import Nutritionists from './pages/member/Nutritionists';
import Shop from './pages/member/Shop';
import Attendance from './pages/member/Attendance';
import Profile from './pages/member/Profile';
import Payments from './pages/member/Payments';
import Notifications from './pages/member/Notifications';
import ChangePassword from './pages/member/ChangePassword';

// Admin pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMembers from './pages/admin/AdminMembers';
import AdminMachines from './pages/admin/AdminMachines';
import AdminFinance from './pages/admin/AdminFinance';
import AdminTrainers from './pages/admin/AdminTrainers';
import AdminFacilities from './pages/admin/AdminFacilities';
import AdminClasses from './pages/admin/AdminClasses';
import AdminStaff from './pages/admin/AdminStaff';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminReports from './pages/admin/AdminReports';
import AdminCMS from './pages/admin/AdminCMS';
import AdminRegistrations from './pages/admin/AdminRegistrations';
import MemberLookup from './pages/admin/MemberLookup';
import AdminSettings from './pages/admin/AdminSettings';

// Shared
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import NotFound from './pages/NotFound';


/* ============================================
   LOADING SCREEN
   ============================================ */
function AuthLoader() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-primary-container/30 border-t-primary-container animate-spin" />
        <span className="font-label-md text-[11px] text-on-surface-variant uppercase tracking-widest">
          Authenticating...
        </span>
      </div>
    </div>
  );
}


/* ============================================
   SMART REDIRECT FOR ROOT "/"
   Sends logged-in users to dashboard/admin
   Sends guests to /login
   ============================================ */
function RootRedirect() {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) return <AuthLoader />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Admins go to /admin, members go to /dashboard
  if (['admin', 'manager'].includes(user?.role)) {
    return <Navigate to="/admin" replace />;
  }

  return <Navigate to="/dashboard" replace />;
}


/* ============================================
   MEMBER PROTECTED ROUTE
   ============================================ */
function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <AuthLoader />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return children;
}


/* ============================================
   ADMIN PROTECTED ROUTE
   ============================================ */
function AdminProtectedRoute({ children }) {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) return <AuthLoader />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!['admin', 'manager'].includes(user?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}


/* ============================================
   MEMBER LAYOUT
   ============================================ */
function MemberLayout({ children }) {
  return (
    <>
      <Sidebar />
      <div className="pl-64">
        <Header />
        <main className="w-full pt-16 bg-background min-h-screen">{children}</main>
      </div>
    </>
  );
}


/* ============================================
   APP
   ============================================ */
function App() {
  return (
    <Routes>
      {/* ============ PUBLIC / AUTH ============ */}
      <Route path="/login" element={<Login />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* ============ ROOT — smart redirect ============ */}
      <Route path="/" element={<RootRedirect />} />

      {/* ============ ADMIN — admin/manager only ============ */}
      <Route
        path="/admin/*"
        element={
          <AdminProtectedRoute>
            <AdminLayout />
          </AdminProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="members" element={<AdminMembers />} />
        <Route path="trainers" element={<AdminTrainers />} />
        <Route path="staff" element={<AdminStaff />} />
        <Route path="machines" element={<AdminMachines />} />
        <Route path="facilities" element={<AdminFacilities />} />
        <Route path="classes" element={<AdminClasses />} />
        <Route path="finance" element={<AdminFinance />} />
        <Route path="reports" element={<AdminReports />} />
        <Route path="analytics" element={<AdminAnalytics />} />
        <Route path="cms" element={<AdminCMS />} />
        <Route path="registrations" element={<AdminRegistrations />} />
        <Route path="member-lookup" element={<MemberLookup />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Route>

      {/* ============ MEMBER — authenticated users ============ */}
      <Route
        path="/dashboard/*"
        element={
          <ProtectedRoute>
            <MemberLayout>
              <Routes>
                <Route index element={<Dashboard />} />
                <Route path="machine-guide" element={<MachineGuide />} />
                <Route path="courses" element={<Courses />} />
                <Route path="player" element={<Player />} />
                <Route path="player/:courseId" element={<Player />} />
                <Route path="trainers" element={<Trainers />} />
                <Route path="trainers/:id" element={<TrainerProfile />} />
                <Route path="nutritionists" element={<Nutritionists />} />
                <Route path="shop" element={<Shop />} />
                <Route path="attendance" element={<Attendance />} />
                <Route path="profile" element={<Profile />} />
                <Route path="payments" element={<Payments />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="change-password" element={<ChangePassword />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </MemberLayout>
          </ProtectedRoute>
        }
      />

      {/* ============ CATCH-ALL → login ============ */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;