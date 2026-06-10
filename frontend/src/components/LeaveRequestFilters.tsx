import FilterListIcon from '@mui/icons-material/FilterList';
import ClearIcon from '@mui/icons-material/Clear';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useAtom, useAtomValue } from 'jotai';
import { teamMembersQueryAtom, filterByTeamMemberAtom, filterByStatusAtom } from '../store/atoms';
import type { LeaveStatus, TeamMember } from '../types';
import { LoadingState } from './LoadingState';

const statusOptions: LeaveStatus[] = ['PENDING', 'APPROVED', 'REJECTED'];

const statusColors: Record<LeaveStatus, string> = {
  PENDING: '#f59e0b',
  APPROVED: '#10b981',
  REJECTED: '#ef4444',
};

export function LeaveRequestFilters() {
  const members = useAtomValue(teamMembersQueryAtom);
  const [selectedMember, setSelectedMember] = useAtom(filterByTeamMemberAtom);
  const [selectedStatus, setSelectedStatus] = useAtom(filterByStatusAtom);

  if (members.state === 'loading') {
    return <LoadingState variant="form" />;
  }

  const memberList: TeamMember[] = members.state === 'hasData' ? members.data : [];
  const hasActiveFilters = selectedMember || selectedStatus;

  const handleClearFilters = () => {
    setSelectedMember(undefined);
    setSelectedStatus(undefined);
  };

  return (
    <Box
      sx={{
        px: { xs: 1.5, sm: 2 },
        py: 1.5,
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Stack spacing={1.5}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterListIcon sx={{ color: 'primary.main' }} />
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Filters
          </Typography>
          {hasActiveFilters && (
            <Typography
              variant="caption"
              sx={{
                ml: 'auto',
                px: 1.5,
                py: 0.5,
                bgcolor: 'primary.light',
                color: 'primary.dark',
                borderRadius: 1,
                fontWeight: 500,
              }}
            >
              {selectedMember && selectedStatus ? '2 active' : '1 active'}
            </Typography>
          )}
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(180px, 240px))' },
            gap: 1.5,
          }}
        >
          <FormControl>
            <InputLabel id="member-filter-label">Team Member</InputLabel>
            <Select
              labelId="member-filter-label"
              id="member-filter"
              value={selectedMember || ''}
              label="Team Member"
              onChange={(e) =>
                setSelectedMember(
                  e.target.value ? Number(e.target.value) : undefined
                )
              }
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            >
              <MenuItem value="">
                <em>All Members</em>
              </MenuItem>
              {memberList.map((member) => (
                <MenuItem key={member.id} value={member.id}>
                  {member.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl>
            <InputLabel id="status-filter-label">Status</InputLabel>
            <Select
              labelId="status-filter-label"
              id="status-filter"
              value={selectedStatus || ''}
              label="Status"
              onChange={(e) =>
                setSelectedStatus(
                  (e.target.value as LeaveStatus | '') || undefined
                )
              }
              sx={{
                '& .MuiOutlinedInput-root': {
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main',
                  },
                },
              }}
            >
              <MenuItem value="">
                <em>All Statuses</em>
              </MenuItem>
              {statusOptions.map((status) => (
                <MenuItem key={status} value={status}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        bgcolor: statusColors[status],
                      }}
                    />
                    {status}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {hasActiveFilters && (
          <Button
            size="small"
            variant="text"
            startIcon={<ClearIcon />}
            onClick={handleClearFilters}
            sx={{
              alignSelf: 'flex-start',
              textTransform: 'none',
            }}
          >
            Clear Filters
          </Button>
        )}
      </Stack>
    </Box>
  );
}
