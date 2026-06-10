import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { useAtom, useAtomValue } from 'jotai';
import { leaveRequestsQueryAtom, updateLeaveStatusAtom } from '../store/atoms';
import type { LeaveRequest, LeaveStatus } from '../types';
import { formatDateRange } from '../utils/dates';
import { StatusChip } from './StatusChip';

function LeaveActions({ request }: { request: LeaveRequest }) {
  const [, updateStatus] = useAtom(updateLeaveStatusAtom);

  async function handleStatus(status: LeaveStatus) {
    await updateStatus({ id: request.id, status });
  }

  if (request.status !== 'PENDING') {
    return null;
  }

  return (
    <Stack direction="row" spacing={1}>
      <Button size="small" color="success" onClick={() => handleStatus('APPROVED')}>
        Approve
      </Button>
      <Button size="small" color="error" onClick={() => handleStatus('REJECTED')}>
        Reject
      </Button>
    </Stack>
  );
}

export function LeaveRequestList() {
  const requests = useAtomValue(leaveRequestsQueryAtom);

  if (requests.state === 'loading') {
    return <Typography color="text.secondary">Loading leave requests…</Typography>;
  }

  if (requests.state === 'hasError') {
    return <Alert severity="error">Failed to load leave requests.</Alert>;
  }

  if (requests.data.length === 0) {
    return (
      <Alert severity="info">No leave requests yet. Create one using the form above.</Alert>
    );
  }

  return (
    <Card variant="outlined">
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Leave Requests
        </Typography>
        <TableContainer>
          <Table size="small">
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
              {requests.data.map((request) => (
                <TableRow key={request.id} hover>
                  <TableCell>{request.teamMemberName}</TableCell>
                  <TableCell>{formatDateRange(request.startDate, request.endDate)}</TableCell>
                  <TableCell>{request.reason}</TableCell>
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
      </CardContent>
    </Card>
  );
}
