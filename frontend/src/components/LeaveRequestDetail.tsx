import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import type { LeaveRequest } from '../types';
import { formatDateRange } from '../utils/dates';
import { StatusChip } from './StatusChip';
import { CommentsPanel } from './CommentsPanel';

interface LeaveRequestDetailProps {
  request: LeaveRequest;
}

export function LeaveRequestDetail({ request }: LeaveRequestDetailProps) {
  return (
    <Stack spacing={2}>
      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Box>
              <Typography variant="subtitle2" color="textSecondary">
                Team Member
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                {request.teamMemberName}
              </Typography>
            </Box>

            <Divider />

            <Box>
              <Typography variant="subtitle2" color="textSecondary">
                Leave Dates
              </Typography>
              <Typography variant="body1">
                {formatDateRange(request.startDate, request.endDate)}
              </Typography>
            </Box>

            <Divider />

            <Box>
              <Typography variant="subtitle2" color="textSecondary">
                Reason
              </Typography>
              <Typography variant="body1">{request.reason}</Typography>
            </Box>

            <Divider />

            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle2" color="textSecondary">
                  Status
                </Typography>
                <StatusChip status={request.status} />
              </Box>

              {request.approverName && (
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Approved By
                  </Typography>
                  <Chip label={request.approverName} size="small" />
                </Box>
              )}

              {request.approvedAt && (
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Approved On
                  </Typography>
                  <Typography variant="body2">
                    {new Date(request.approvedAt).toLocaleDateString()}
                  </Typography>
                </Box>
              )}
            </Box>
          </Stack>
        </CardContent>
      </Card>

      <CommentsPanel leaveRequest={request} />
    </Stack>
  );
}
