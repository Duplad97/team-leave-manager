import PhoneInTalkIcon from '@mui/icons-material/PhoneInTalk';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useAtomValue } from 'jotai';
import dayjs from 'dayjs';
import { leaveRequestsQueryAtom, onCallCalendarQueryAtom } from '../store/atoms';
import { memberAvatarColor } from '../theme';
import type { LeaveRequest, OnCallWeek } from '../types';
import { buildCalendarWeeks } from '../utils/dates';
import { LoadingState } from './LoadingState';
import { SectionCard } from './SectionCard';

const STATUS_COLORS = {
  PENDING: { bg: '#fef3c7', text: '#92400e', border: '#fcd34d' },
  APPROVED: { bg: '#dcfce7', text: '#166534', border: '#86efac' },
  REJECTED: { bg: '#fee2e2', text: '#991b1b', border: '#fca5a5' },
} as const;

const ON_CALL_STYLE = { bg: '#e0e7ff', text: '#1e3a5f', border: '#a5b4fc' };

const LEGEND = [
  { label: 'On-call', color: ON_CALL_STYLE },
  { label: 'Pending leave', color: STATUS_COLORS.PENDING },
  { label: 'Approved leave', color: STATUS_COLORS.APPROVED },
] as const;

function leavesForDay(requests: LeaveRequest[], day: dayjs.Dayjs): LeaveRequest[] {
  return requests.filter(
    (r) =>
      r.status !== 'REJECTED' &&
      !day.isBefore(r.startDate, 'day') &&
      !day.isAfter(r.endDate, 'day'),
  );
}

function onCallForWeek(schedule: OnCallWeek[], weekStart: dayjs.Dayjs): OnCallWeek | undefined {
  const key = weekStart.format('YYYY-MM-DD');
  return schedule.find((w) => w.weekStart === key);
}

function isOnCallOnLeave(onCall: OnCallWeek, day: dayjs.Dayjs): boolean {
  return onCall.conflictingLeave.some(
    (leave) =>
      !day.isBefore(leave.startDate, 'day') && !day.isAfter(leave.endDate, 'day'),
  );
}

function isWeekend(dayIndex: number): boolean {
  return dayIndex >= 5;
}

export function LeaveCalendar() {
  const requests = useAtomValue(leaveRequestsQueryAtom);
  const onCall = useAtomValue(onCallCalendarQueryAtom);

  if (requests.state === 'loading' || onCall.state === 'loading') {
    return <LoadingState variant="table" count={6} />;
  }

  if (requests.state === 'hasError' || onCall.state === 'hasError') {
    return <Alert severity="error" variant="outlined">Failed to load calendar data.</Alert>;
  }

  const weeks = buildCalendarWeeks();
  const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

  return (
    <SectionCard
      title="Calendar View"
      subtitle="Six-week overview of on-call rotation and leave"
    >
      <Stack spacing={2}>
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
          {LEGEND.map(({ label, color }) => (
            <Chip
              key={label}
              label={label}
              size="small"
              sx={{
                bgcolor: color.bg,
                color: color.text,
                border: `1px solid ${color.border}`,
                fontWeight: 500,
              }}
            />
          ))}
        </Stack>

        <Stack spacing={2.5}>
          {weeks.map((week, weekIndex) => {
            const onCallWeek = onCallForWeek(onCall.data, week[0]);

            return (
              <Box key={weekIndex}>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={1}
                  sx={{
                    mb: 1,
                    alignItems: { sm: 'center' },
                    justifyContent: 'space-between',
                  }}
                >
                  <Typography
                    variant="overline"
                    color="text.secondary"
                    sx={{ letterSpacing: '0.08em' }}
                  >
                    Week of {week[0].format('MMM D, YYYY')}
                  </Typography>

                  {onCallWeek && (
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{
                        alignItems: 'center',
                        px: 1.5,
                        py: 0.75,
                        borderRadius: 2,
                        bgcolor: onCallWeek.hasConflict ? 'warning.light' : ON_CALL_STYLE.bg,
                        border: '1px solid',
                        borderColor: onCallWeek.hasConflict ? 'warning.main' : ON_CALL_STYLE.border,
                      }}
                    >
                      <PhoneInTalkIcon
                        sx={{
                          fontSize: 16,
                          color: onCallWeek.hasConflict ? 'warning.dark' : ON_CALL_STYLE.text,
                        }}
                      />
                      <Avatar
                        sx={{
                          width: 22,
                          height: 22,
                          fontSize: '0.65rem',
                          bgcolor: memberAvatarColor(onCallWeek.onCallMember.name),
                        }}
                      >
                        {onCallWeek.onCallMember.name[0]}
                      </Avatar>
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 600,
                          color: onCallWeek.hasConflict ? 'warning.dark' : ON_CALL_STYLE.text,
                        }}
                      >
                        On call: {onCallWeek.onCallMember.name}
                      </Typography>
                      {onCallWeek.hasConflict && (
                        <Chip
                          icon={<WarningAmberIcon sx={{ fontSize: '14px !important' }} />}
                          label="On leave"
                          size="small"
                          color="warning"
                          sx={{ height: 22, '& .MuiChip-label': { px: 0.75, fontSize: '0.7rem' } }}
                        />
                      )}
                    </Stack>
                  )}
                </Stack>

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
                    const weekend = isWeekend(dayIndex);
                    const onCallConflict =
                      onCallWeek?.hasConflict && isOnCallOnLeave(onCallWeek, day);

                    return (
                      <Box
                        key={day.format('YYYY-MM-DD')}
                        sx={{
                          border: 1,
                          borderColor: onCallConflict
                            ? 'warning.main'
                            : isToday
                              ? 'primary.main'
                              : 'divider',
                          borderRadius: 2,
                          p: 1,
                          minHeight: 108,
                          bgcolor: onCallConflict
                            ? 'warning.light'
                            : isToday
                              ? 'primary.50'
                              : weekend
                                ? '#f8fafc'
                                : 'background.paper',
                          boxShadow: isToday ? '0 0 0 1px rgba(30, 58, 95, 0.15)' : 'none',
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            fontWeight: isToday ? 700 : 500,
                            color: isToday
                              ? 'primary.main'
                              : weekend
                                ? 'text.secondary'
                                : 'text.primary',
                          }}
                        >
                          {dayLabels[dayIndex]} {day.format('D')}
                        </Typography>

                        <Stack spacing={0.5} sx={{ mt: 0.75 }}>
                          {onCallWeek && (
                            <Box
                              sx={{
                                px: 0.75,
                                py: 0.25,
                                borderRadius: 1,
                                bgcolor: onCallConflict ? 'warning.main' : ON_CALL_STYLE.bg,
                                color: onCallConflict ? '#fff' : ON_CALL_STYLE.text,
                                border: `1px solid ${onCallConflict ? 'warning.dark' : ON_CALL_STYLE.border}`,
                                fontSize: '0.6rem',
                                fontWeight: 600,
                                lineHeight: 1.4,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {onCallWeek.onCallMember.name}
                            </Box>
                          )}

                          {dayLeaves.map((leave) => {
                            const colors = STATUS_COLORS[leave.status];
                            const isOnCallPerson =
                              onCallWeek?.onCallMember.name === leave.teamMemberName;

                            return (
                              <Box
                                key={leave.id}
                                sx={{
                                  px: 0.75,
                                  py: 0.25,
                                  borderRadius: 1,
                                  bgcolor: colors.bg,
                                  color: colors.text,
                                  border: `1px solid ${isOnCallPerson && leave.status === 'APPROVED' ? 'warning.main' : colors.border}`,
                                  fontSize: '0.65rem',
                                  fontWeight: 600,
                                  lineHeight: 1.4,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                {leave.teamMemberName}
                              </Box>
                            );
                          })}
                        </Stack>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            );
          })}
        </Stack>
      </Stack>
    </SectionCard>
  );
}
