import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useAtomValue } from 'jotai';
import { teamMembersQueryAtom } from '../store/atoms';

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
    return <Typography color="text.secondary">Loading team members…</Typography>;
  }

  if (members.state === 'hasError') {
    return <Typography color="error">Failed to load team members.</Typography>;
  }

  return (
    <Grid container spacing={2}>
      {members.data.map((member) => (
        <Grid key={member.id} size={{ xs: 12, sm: 6, md: 3 }}>
          <Card variant="outlined">
            <CardContent>
              <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                <Avatar sx={{ bgcolor: 'primary.main' }}>{memberInitials(member.name)}</Avatar>
                <Stack spacing={0.25}>
                  <Typography sx={{ fontWeight: 600 }}>{member.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {member.email}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Rotation #{member.rotationOrder + 1}
                  </Typography>
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
