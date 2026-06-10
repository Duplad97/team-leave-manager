import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useAtomValue } from 'jotai';
import { teamMembersQueryAtom } from '../store/atoms';
import { memberAvatarColor, subtleHover } from '../theme';
import { LoadingState } from './LoadingState';

function memberInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

export function TeamMembersPanel() {
  const members = useAtomValue(teamMembersQueryAtom);

  if (members.state === 'loading') {
    return <LoadingState variant="cards" count={4} />;
  }

  if (members.state === 'hasError') {
    return (
      <Typography color="error" variant="body2">
        Failed to load team members.
      </Typography>
    );
  }

  return (
    <Grid container spacing={2}>
      {members.data.map((member) => {
        const color = memberAvatarColor(member.name);
        return (
          <Grid key={member.id} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card sx={subtleHover()}>
              <CardContent>
                <Stack spacing={2}>
                  <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                    <Avatar sx={{ bgcolor: color, width: 48, height: 48, fontWeight: 600 }}>
                      {memberInitials(member.name)}
                    </Avatar>
                    <Stack spacing={0.25} sx={{ minWidth: 0 }}>
                      <Typography sx={{ fontWeight: 600 }} noWrap>
                        {member.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" noWrap>
                        {member.email}
                      </Typography>
                    </Stack>
                  </Stack>
                  <Chip
                    label={`Rotation #${member.rotationOrder + 1}`}
                    size="small"
                    variant="outlined"
                    sx={{ alignSelf: 'flex-start', borderColor: 'divider' }}
                  />
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}
