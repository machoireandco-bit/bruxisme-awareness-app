import { loadSchedule, saveSchedule } from './storage';

const toDateKey = (date = new Date()) => {
  return date.toISOString().slice(0, 10);
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const generateRandomTimes = ({
  count,
  startHour,
  endHour,
  date = new Date()
}) => {
  const safeCount = clamp(count, 10, 50);
  const start = new Date(date);
  start.setHours(startHour, 0, 0, 0);
  const end = new Date(date);
  end.setHours(endHour, 0, 0, 0);

  const startMs = start.getTime();
  const endMs = end.getTime();
  const span = Math.max(endMs - startMs, 1);

  const times = Array.from({ length: safeCount }, () => {
    const offset = Math.floor(Math.random() * span);
    return startMs + offset;
  }).sort((a, b) => a - b);

  return times;
};

export const ensureTodaySchedule = (settings) => {
  const todayKey = toDateKey();
  const schedule = loadSchedule();

  if (!schedule || schedule.date !== todayKey) {
    const times = generateRandomTimes({
      count: settings.notificationsPerDay,
      startHour: settings.startHour,
      endHour: settings.endHour
    });
    const nextSchedule = { date: todayKey, times };
    saveSchedule(nextSchedule);
    return nextSchedule;
  }

  return schedule;
};

export const popDueNotifications = (now = Date.now()) => {
  const schedule = loadSchedule();
  if (!schedule) return { schedule: null, due: [] };

  const due = [];
  const remaining = [];

  schedule.times.forEach((time) => {
    if (time <= now) {
      due.push(time);
    } else {
      remaining.push(time);
    }
  });

  const nextSchedule = { ...schedule, times: remaining };
  saveSchedule(nextSchedule);

  return { schedule: nextSchedule, due };
};

export const getSchedulePreview = () => {
  const schedule = loadSchedule();
  if (!schedule) return [];
  return schedule.times.slice(0, 5);
};
