import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

interface LoadingStateProps {
  variant?: 'cards' | 'table' | 'form';
  count?: number;
}

export function LoadingState({ variant = 'table', count = 4 }: LoadingStateProps) {
  if (variant === 'cards') {
    return (
      <Grid container spacing={2}>
        {Array.from({ length: count }).map((_, i) => (
          <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                  <Skeleton variant="circular" width={48} height={48} />
                  <Stack spacing={0.5} sx={{ flex: 1 }}>
                    <Skeleton width="60%" />
                    <Skeleton width="80%" />
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    );
  }

  if (variant === 'form') {
    return (
      <Card>
        <CardContent>
          <Stack spacing={2}>
            <Skeleton width={180} height={28} />
            <Skeleton height={56} />
            <Stack direction="row" spacing={2}>
              <Skeleton height={56} sx={{ flex: 1 }} />
              <Skeleton height={56} sx={{ flex: 1 }} />
            </Stack>
            <Skeleton height={80} />
            <Skeleton width={140} height={40} />
          </Stack>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Stack spacing={1}>
          <Skeleton width={160} height={28} />
          {Array.from({ length: count }).map((_, i) => (
            <Skeleton key={i} height={48} />
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
}
