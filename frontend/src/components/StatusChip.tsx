import Chip from '@mui/material/Chip';
import type { LeaveStatus } from '../types';

const config: Record<LeaveStatus, { label: string; color: 'warning' | 'success' | 'error' }> = {
  PENDING: { label: 'Pending', color: 'warning' },
  APPROVED: { label: 'Approved', color: 'success' },
  REJECTED: { label: 'Rejected', color: 'error' },
};

interface StatusChipProps {
  status: LeaveStatus;
}

export function StatusChip({ status }: StatusChipProps) {
  const { label, color } = config[status];
  return <Chip label={label} color={color} size="small" />;
}
