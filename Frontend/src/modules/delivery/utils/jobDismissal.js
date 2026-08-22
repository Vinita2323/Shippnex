/**
 * jobDismissal.js
 * Persistent storage utility (localStorage) for captain dismissed / accepted / rejected job IDs.
 * Ensures popups NEVER reappear on any screen once a job is accepted, rejected, or closed.
 */

const DISMISSED_JOBS_STORAGE_KEY = 'shippnex_captain_dismissed_jobs';

export const getDismissedJobIds = () => {
  try {
    const raw = localStorage.getItem(DISMISSED_JOBS_STORAGE_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch (e) {
    return new Set();
  }
};

export const markJobAsDismissed = (jobOrId) => {
  if (!jobOrId) return;
  try {
    const set = getDismissedJobIds();
    if (typeof jobOrId === 'string') {
      set.add(jobOrId);
    } else {
      if (jobOrId._id) set.add(String(jobOrId._id));
      if (jobOrId.bookingId) set.add(String(jobOrId.bookingId));
      if (jobOrId.orderId) set.add(String(jobOrId.orderId));
    }
    localStorage.setItem(DISMISSED_JOBS_STORAGE_KEY, JSON.stringify([...set]));
  } catch (e) {
    console.error('Error saving dismissed job:', e);
  }
};

export const isJobDismissed = (jobOrId) => {
  if (!jobOrId) return true;
  const set = getDismissedJobIds();
  if (typeof jobOrId === 'string') {
    return set.has(jobOrId);
  }
  if (jobOrId._id && set.has(String(jobOrId._id))) return true;
  if (jobOrId.bookingId && set.has(String(jobOrId.bookingId))) return true;
  if (jobOrId.orderId && set.has(String(jobOrId.orderId))) return true;
  return false;
};
