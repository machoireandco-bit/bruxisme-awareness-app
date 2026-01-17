const STORAGE_KEYS = {
  entries: 'bruxisme_entries',
  settings: 'bruxisme_settings',
  schedule: 'bruxisme_schedule'
};

const DEFAULT_SETTINGS = {
  notificationsEnabled: false,
  notificationsPerDay: 20,
  startHour: 8,
  endHour: 22
};

const safeParse = (value, fallback) => {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

export const loadEntries = () => {
  return safeParse(localStorage.getItem(STORAGE_KEYS.entries), []);
};

export const saveEntry = (entry) => {
  const entries = loadEntries();
  entries.unshift(entry);
  localStorage.setItem(STORAGE_KEYS.entries, JSON.stringify(entries));
};

export const loadSettings = () => {
  return {
    ...DEFAULT_SETTINGS,
    ...safeParse(localStorage.getItem(STORAGE_KEYS.settings), {})
  };
};

export const saveSettings = (settings) => {
  localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
};

export const loadSchedule = () => {
  return safeParse(localStorage.getItem(STORAGE_KEYS.schedule), null);
};

export const saveSchedule = (schedule) => {
  localStorage.setItem(STORAGE_KEYS.schedule, JSON.stringify(schedule));
};

export const resetSchedule = () => {
  localStorage.removeItem(STORAGE_KEYS.schedule);
};

export { DEFAULT_SETTINGS };
