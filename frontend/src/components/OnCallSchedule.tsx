import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { useAtomValue } from 'jotai';
import { onCallScheduleQueryAtom } from '../store/atoms';
import { memberAvatarColor } from '../theme';
import { formatDateRange, weekLabel } from '../utils/dates';
import { LoadingState } from './LoadingState';
import { SectionCard } from './SectionCard';
import { StatCard } from './StatCard';

export function OnCallSchedule() {
  const schedule = useAtomValue(onCallScheduleQueryAtom);

  if (schedule.state === 'loading') {
    return <LoadingState variant="table" count={8} />;
  }

  if (schedule.state === 'hasError') {
    return <Alert severity="error" variant="outlined">Failed to load on-call schedule.</Alert>;
  }

  const data = schedule.data;
  const conflictCount = data.filter((w) => w.hasConflict).length;
  const availableCount = data.length - conflictCount;

  return (
    <Stack spacing={3}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <StatCard
            label="Weeks covered"
            value={data.length}
            icon={<CheckCircleOutlinedIcon />}
            accent="#1e3a5f"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <StatCard
            label="Schedule conflicts"
            value={conflictCount}
            icon={<WarningAmberIcon />}
            accent={conflictCount > 0 ? '#d97706' : '#16a34a'}
          />
        </Grid>
      </Grid>

      <SectionCard
        title="Rotation Schedule"
        subtitle="Alice → Bob → Charlie → Diana, repeating weekly"
        flush
      >
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Week</TableCell>
                <TableCell>Dates</TableCell>
                <TableCell>On Call</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((week) => (
                <TableRow
                  key={week.weekNumber}
                  hover
                  sx={
                    week.hasConflict
                      ? {
                          bgcolor: 'warning.light',
                          '&:hover': { bgcolor: 'warning.light' },
                        }
                      : undefined
                  }
                >
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      Week {week.weekNumber}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {weekLabel(week.weekStart, week.weekEnd)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                      <Avatar
                        sx={{
                          width: 32,
                          height: 32,
                          fontSize: '0.8rem',
                          bgcolor: memberAvatarColor(week.onCallMember.name),
                        }}
                      >
                        {week.onCallMember.name[0]}
                      </Avatar>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {week.onCallMember.name}
                      </Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    {week.hasConflict ? (
                      <Stack spacing={0.75}>
                        <Chip
                          icon={<WarningAmberIcon />}
                          label="On approved leave"
                          color="warning"
                          size="small"
                          sx={{ alignSelf: 'flex-start' }}
                        />
                        {week.conflictingLeave.map((leave) => (
                          <Box key={leave.id}>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                              {formatDateRange(leave.startDate, leave.endDate)}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {leave.reason}
                            </Typography>
                          </Box>
                        ))}
                      </Stack>
                    ) : (
                      <Chip
                        icon={<CheckCircleOutlinedIcon />}
                        label="Available"
                        color="success"
                        size="small"
                        variant="outlined"
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </SectionCard>

      {availableCount === data.length && (
        <Alert severity="success" variant="outlined">
          No on-call conflicts detected in the next {data.length} weeks.
        </Alert>
      )}
    </Stack>
  );
}
