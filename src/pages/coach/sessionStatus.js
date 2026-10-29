// src/pages/coach/sessionStatus.js — how a 1-on-1 session's status looks in the coach portal.
import { tl } from '../../i18n';

export const SESSION_TONE = {
  scheduled: 'bg-sky-500/15 text-sky-300', completed: 'bg-emerald-500/15 text-emerald-400',
  no_show: 'bg-amber-500/15 text-amber-300', cancelled: 'bg-rose-500/15 text-rose-400',
};
export const SESSION_LABEL = {
  scheduled: tl('Scheduled'), completed: tl('Completed'), no_show: tl('No-show'), cancelled: tl('Cancelled'),
};
