import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';

dayjs.extend(isoWeek);

const CALENDAR_WEEKS = 6;

export function formatDate(date: string): string {
  return dayjs(date).format('MMM D, YYYY');
}

export function formatDateRange(start: string, end: string): string {
  const startDate = dayjs(start);
  const endDate = dayjs(end);
  if (startDate.isSame(endDate, 'day')) {
    return startDate.format('MMM D, YYYY');
  }
  if (startDate.isSame(endDate, 'month')) {
    return `${startDate.format('MMM D')} – ${endDate.format('D, YYYY')}`;
  }
  return `${startDate.format('MMM D')} – ${endDate.format('MMM D, YYYY')}`;
}

export function weekLabel(start: string, end: string): string {
  return `${dayjs(start).format('MMM D')} – ${dayjs(end).format('MMM D, YYYY')}`;
}

export function buildCalendarWeeks(weekCount = CALENDAR_WEEKS): dayjs.Dayjs[][] {
  const weekStart = dayjs().startOf('isoWeek');
  const weeks: dayjs.Dayjs[][] = [];

  for (let w = 0; w < weekCount; w++) {
    const start = weekStart.add(w, 'week');
    const days: dayjs.Dayjs[] = [];
    for (let d = 0; d < 7; d++) {
      days.push(start.add(d, 'day'));
    }
    weeks.push(days);
  }

  return weeks;
}

export { CALENDAR_WEEKS };
