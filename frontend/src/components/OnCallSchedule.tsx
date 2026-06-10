import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import Alert from '@mui/material/Alert';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
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
import { formatDateRange, weekLabel } from '../utils/dates';

export function OnCallSchedule() {
  const schedule = useAtomValue(onCallScheduleQueryAtom);

  if (schedule.state === 'loading') {
    return <Typography color="text.secondary">Loading on-call schedule…</Typography>;
  }

  if (schedule.state === 'hasError') {
    return <Alert severity="error">Failed to load on-call schedule.</Alert>;
  }

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" gutterBottom>
          On-Call Rotation
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Weekly rotation: Alice → Bob → Charlie → Diana, then repeats.
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Week</TableCell>
                <TableCell>Dates</TableCell>
                <TableCell>On Call</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {schedule.data.map((week) => (
                <TableRow
                  key={week.weekNumber}
                  hover
                  sx={week.hasConflict ? { bgcolor: 'warning.50' } : undefined}
                >
                  <TableCell>Week {week.weekNumber}</TableCell>
                  <TableCell>{weekLabel(week.weekStart, week.weekEnd)}</TableCell>
                  <TableCell>
                    <Typography sx={{ fontWeight: 600 }}>{week.onCallMember.name}</Typography>
                  </TableCell>
                  <TableCell>
                    {week.hasConflict ? (
                      <Stack spacing={0.5}>
                        <Chip
                          icon={<WarningAmberIcon />}
                          label="On approved leave"
                          color="warning"
                          size="small"
                        />
                        {week.conflictingLeave.map((leave) => (
                          <Typography key={leave.id} variant="caption" color="text.secondary">
                            {formatDateRange(leave.startDate, leave.endDate)} — {leave.reason}
                          </Typography>
                        ))}
                      </Stack>
                    ) : (
                      <Chip label="Available" color="success" size="small" variant="outlined" />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
}
