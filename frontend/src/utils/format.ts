import { format, isValid, parse, parseISO } from 'date-fns';

// task.due_date comes back from the backend as a naive "yyyy-MM-dd HH:mm:ss"
// string (no timezone — see backend/src/config/db.js's `dateStrings` option),
// so it must be parsed as plain wall-clock time, not as a UTC instant. Other
// fields (created_at, updated_at) are still real ISO timestamps. Try both so
// every date/datetime field in the app can share these helpers.
const parseAnyDate = (value: string): Date => {
  const iso = parseISO(value);
  if (isValid(iso)) return iso;
  const naive = parse(value, 'yyyy-MM-dd HH:mm:ss', new Date());
  if (isValid(naive)) return naive;
  return new Date(value);
};

export const formatDate = (value: string | null | undefined, fallback = '—') => {
  if (!value) return fallback;
  const date = parseAnyDate(value);
  return isValid(date) ? format(date, 'dd MMM yyyy') : fallback;
};

// Format a date-time string to a more readable format. If the input is invalid or null, return a fallback value (default is '—').
export const formatDateTime = (value: string | null | undefined, fallback = '—') => {
  if (!value) return fallback;
  const date = parseAnyDate(value);
  return isValid(date) ? format(date, 'dd MMM yyyy, h:mm a') : fallback;
};

// Convert an ISO/SQL datetime to the yyyy-MM-ddTHH:mm value an
// <input type="datetime-local"> expects.
export const toDateTimeInput = (value: string | null | undefined) => {
  if (!value) return '';
  const date = parseAnyDate(value);
  return isValid(date) ? format(date, "yyyy-MM-dd'T'HH:mm") : '';
};

// For places (e.g. the calendar) that need an actual Date object rather than a formatted string.
export const parseTaskDate = (value: string | null | undefined): Date | null => {
  if (!value) return null;
  const date = parseAnyDate(value);
  return isValid(date) ? date : null;
};
