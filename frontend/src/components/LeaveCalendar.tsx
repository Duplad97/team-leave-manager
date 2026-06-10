import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useAtomValue } from 'jotai';
import dayjs from 'dayjs';
import { leaveRequestsQueryAtom } from '../store/atoms';
import type { LeaveRequest } from '../types';

const STATUS_COLORS = {
  PENDING: '#f59e0b',
  APPROVED: '#22c55e',
  REJECTED: '#ef4444',
} as const;

function buildWeeks(): dayjs.Dayjs[][] {
  const today = dayjs().startOf('week');
  const weeks: dayjs.Dayjs[][] = [];

  for (let w = 0; w < 6; w++) {
    const weekStart = today.add(w, 'week');
    const days: dayjs.Dayjs[] = [];
    for (let d = 0; d < 7; d++) {
      days.push(weekStart.add(d, 'day'));
    }
    weeks.push(days);
  }

  return weeks;
}

function leavesForDay(requests: LeaveRequest[], day: dayjs.Dayjs): LeaveRequest[] {
  return requests.filter(
    (r) =>
      r.status !== 'REJECTED' &&
      !day.isBefore(r.startDate, 'day') &&
      !day.isAfter(r.endDate, 'day'),
  );
}

export function LeaveCalendar() {
  const requests = useAtomValue(leaveRequestsQueryAtom);

  if (requests.state === 'loading') {
    return <Typography color="text.secondary">Loading calendar…</Typography>;
  }

  if (requests.state === 'hasError') {
    return <Alert severity="error">Failed to load calendar data.</Alert>;
  }

  const weeks = buildWeeks();
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Calendar View
        </Typography>
        <Stack spacing={2}>
          {weeks.map((week, weekIndex) => (
            <Box key={weekIndex}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                Week of {week[0].format('MMM D, YYYY')}
              </Typography>
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(7, 1fr)',
                  gap: 1,
                }}
              >
                {week.map((day, dayIndex) => {
                  const dayLeaves = leavesForDay(requests.data, day);
                  const isToday = day.isSame(dayjs(), 'day');

                  return (
                    <Box
                      key={day.format('YYYY-MM-DD')}
                      sx={{
                        border: 1,
                        borderColor: isToday ? 'primary.main' : 'divider',
                        borderRadius: 1,
                        p: 1,
                        minHeight: 88,
                        bgcolor: isToday ? 'primary.50' : 'background.paper',
                      }}
                    >
                      <Typography variant="caption" sx={{ fontWeight: isToday ? 700 : 400 }}>
                        {dayLabels[dayIndex]} {day.format('D')}
                      </Typography>
                      <Stack spacing={0.5} sx={{ mt: 0.5 }}>
                        {dayLeaves.map((leave) => (
                          <Chip
                            key={leave.id}
                            label={leave.teamMemberName}
                            size="small"
                            sx={{
                              bgcolor: STATUS_COLORS[leave.status],
                              color: '#fff',
                              fontSize: '0.65rem',
                              height: 20,
                            }}
                          />
                        ))}
                      </Stack>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
