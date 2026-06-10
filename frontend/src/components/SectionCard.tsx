import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import type { ReactNode } from 'react';

interface SectionCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  flush?: boolean;
}

export function SectionCard({ title, subtitle, children, flush }: SectionCardProps) {
  return (
    <Card>
      <Box sx={{ px: 3, pt: 3, pb: flush ? 2 : 2.5 }}>
        <Stack spacing={0.25}>
          <Typography variant="h6">{title}</Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Stack>
      </Box>
      <Box sx={{ px: flush ? 0 : 3, pb: flush ? 0 : 3 }}>{children}</Box>
    </Card>
  );
}
