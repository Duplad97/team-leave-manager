import AddIcon from '@mui/icons-material/Add';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useAtom, useAtomValue } from 'jotai';
import { useState } from 'react';
import { createLeaveAtom, teamMembersQueryAtom } from '../store/atoms';
import { LoadingState } from './LoadingState';

export function LeaveRequestForm() {
  const members = useAtomValue(teamMembersQueryAtom);
  const [, createLeave] = useAtom(createLeaveAtom);

  const [teamMemberId, setTeamMemberId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (members.state === 'loading') {
    return <LoadingState variant="form" />;
  }

  const memberList = members.state === 'hasData' ? members.data : [];

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setSuccess(false);
    setSubmitting(true);

    try {
      await createLeave({
        teamMemberId: Number(teamMemberId),
        startDate,
        endDate,
        reason,
      });
      setTeamMemberId('');
      setStartDate('');
      setEndDate('');
      setReason('');
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create leave request');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Card>
      <CardContent sx={{ p: { xs: 2.5, sm: 3 } }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h6">New Leave Request</Typography>
            <Typography variant="body2" color="text.secondary">
              Overlapping requests for the same person are automatically blocked.
            </Typography>
          </Box>

          <Divider />

          <Stack component="form" spacing={2.5} onSubmit={handleSubmit}>
            {error && <Alert severity="error" variant="outlined">{error}</Alert>}
            {success && (
              <Alert severity="success" variant="outlined">
                Leave request submitted successfully.
              </Alert>
            )}

            <TextField
              select
              label="Team member"
              value={teamMemberId}
              onChange={(e) => setTeamMemberId(e.target.value)}
              required
              fullWidth
            >
              {memberList.map((member) => (
                <MenuItem key={member.id} value={String(member.id)}>
                  {member.name}
                </MenuItem>
              ))}
            </TextField>

            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField
                label="Start date"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                slotProps={{ inputLabel: { shrink: true } }}
                required
                fullWidth
              />
              <TextField
                label="End date"
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                slotProps={{ inputLabel: { shrink: true } }}
                required
                fullWidth
              />
            </Stack>

            <TextField
              label="Reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Vacation, medical appointment, personal day"
              required
              fullWidth
              multiline
              minRows={2}
            />

            <Box>
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={submitting}
                startIcon={<AddIcon />}
              >
                {submitting ? 'Submitting…' : 'Submit Request'}
              </Button>
            </Box>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
