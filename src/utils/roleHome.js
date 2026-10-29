// src/utils/roleHome.js
// Where each kind of account lands after signing in. One site, three portals.

export const STAFF_ROLES = ['admin', 'manager'];      // admin console
export const COACH_ROLES = ['trainer'];                // coach portal

export const isStaff = (user) => STAFF_ROLES.includes(user?.role);
export const isCoach = (user) => COACH_ROLES.includes(user?.role);

/** /admin, /coach or /dashboard — or the forced password change first. */
export function homeFor(user) {
  if (user?.must_change_password) return '/dashboard/change-password';
  if (isStaff(user)) return '/admin';
  if (isCoach(user)) return '/coach';
  return '/dashboard';
}

/** The sign-in page that suits the account. */
export function loginFor(user) {
  if (isStaff(user)) return '/admin/login';
  if (isCoach(user)) return '/coach/login';
  return '/login';
}
