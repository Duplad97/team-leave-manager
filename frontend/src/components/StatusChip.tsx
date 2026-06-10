import Chip from '@mui/material/Chip';
import type { LeaveStatus } from '../types';

const config: Record<
  LeaveStatus,
  { label: string; sx: { bgcolor: string; color: string; border: string } }
> = {
  PENDING: {
    label: 'Pending',
    sx: { bgcolor: '#fef3c7', color: '#92400e', border: '1px solid #fcd34d' },
  },
  APPROVED: {
    label: 'Approved',
    sx: { bgcolor: '#dcfce7', color: '#166534', border: '1px solid #86efac' },
  },
  REJECTED: {
    label: 'Rejected',
    sx: { bgcolor: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5' },
  },
};

interface StatusChipProps {
  status: LeaveStatus;
}

export function StatusChip({ status }: StatusChipProps) {
  const { label, sx } = config[status];
  return <Chip label={label} size="small" sx={sx} />;
}
