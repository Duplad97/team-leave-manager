import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useAtom, useAtomValue } from 'jotai';
import { leaveRequestsQueryAtom, updateLeaveStatusAtom } from '../store/atoms';
import { memberAvatarColor } from '../theme';
import type { LeaveRequest, LeaveStatus } from '../types';
import { formatDateRange } from '../utils/dates';
import { EmptyState } from './EmptyState';
import { LoadingState } from './LoadingState';
import { SectionCard } from './SectionCard';
import { StatCard } from './StatCard';
import { StatusChip } from './StatusChip';

function LeaveActions({ request }: { request: LeaveRequest }) {
  const [, updateStatus] = useAtom(updateLeaveStatusAtom);

  async function handleStatus(status: LeaveStatus) {
    await updateStatus({ id: request.id, status });
  }

  if (request.status !== 'PENDING') {
    return <Typography variant="caption" color="text.secondary">—</Typography>;
  }

  return (
    <Stack direction="row" spacing={1} sx={{ justifyContent: 'flex-end' }}>
      <Tooltip title="Approve">
        <Button
          size="small"
          variant="outlined"
          color="success"
          onClick={() => handleStatus('APPROVED')}
          sx={{ minWidth: 36, px: 1 }}
        >
          <CheckCircleOutlinedIcon fontSize="small" />
        </Button>
      </Tooltip>
      <Tooltip title="Reject">
        <Button
          size="small"
          variant="outlined"
          color="error"
          onClick={() => handleStatus('REJECTED')}
          sx={{ minWidth: 36, px: 1 }}
        >
          <CancelOutlinedIcon fontSize="small" />
        </Button>
      </Tooltip>
    </Stack>
  );
}

function countByStatus(requests: LeaveRequest[], status: LeaveStatus): number {
  return requests.filter((r) => r.status === status).length;
}

export function LeaveRequestList() {
  const requests = useAtomValue(leaveRequestsQueryAtom);

  if (requests.state === 'loading') {
    return <LoadingState variant="table" count={5} />;
  }

  if (requests.state === 'hasError') {
    return <Alert severity="error" variant="outlined">Failed to load leave requests.</Alert>;
  }

  const data = requests.data;

  return (
    <Stack spacing={3}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard
            label="Pending"
            value={countByStatus(data, 'PENDING')}
            icon={<HourglassEmptyIcon />}
            accent="#d97706"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard
            label="Approved"
            value={countByStatus(data, 'APPROVED')}
            icon={<CheckCircleOutlinedIcon />}
            accent="#16a34a"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <StatCard
            label="Rejected"
            value={countByStatus(data, 'REJECTED')}
            icon={<CancelOutlinedIcon />}
            accent="#dc2626"
          />
        </Grid>
      </Grid>

      {data.length === 0 ? (
        <EmptyState
          icon={<EventBusyIcon />}
          title="No leave requests yet"
          description="Submit a new request using the form above. Approved and pending time off will appear here."
        />
      ) : (
        <SectionCard title="All Requests" subtitle={`${data.length} total request${data.length === 1 ? '' : 's'}`} flush>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Member</TableCell>
                  <TableCell>Dates</TableCell>
                  <TableCell>Reason</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((request) => (
                  <TableRow key={request.id} hover>
                    <TableCell>
                      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            fontSize: '0.8rem',
                            bgcolor: memberAvatarColor(request.teamMemberName),
                          }}
                        >
                          {request.teamMemberName[0]}
                        </Avatar>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {request.teamMemberName}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{formatDateRange(request.startDate, request.endDate)}</Typography>
                    </TableCell>
                    <TableCell sx={{ maxWidth: 240 }}>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {request.reason}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <StatusChip status={request.status} />
                    </TableCell>
                    <TableCell align="right">
                      <LeaveActions request={request} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </SectionCard>
      )}
    </Stack>
  );
}
