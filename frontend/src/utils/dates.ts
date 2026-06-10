import dayjs from 'dayjs';

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
