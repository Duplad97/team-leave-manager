import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { ThemeProvider } from '@mui/material/styles';
import { Provider as JotaiProvider } from 'jotai';
import { useState } from 'react';
import { LeaveCalendar } from './components/LeaveCalendar';
import { LeaveRequestForm } from './components/LeaveRequestForm';
import { LeaveRequestList } from './components/LeaveRequestList';
import { OnCallSchedule } from './components/OnCallSchedule';
import { TeamMembersPanel } from './components/TeamMembersPanel';
import { theme } from './theme';

type TabKey = 'team' | 'leave' | 'oncall';

export default function App() {
  const [tab, setTab] = useState<TabKey>('leave');

  return (
    <JotaiProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppBar position="static" elevation={0} color="default">
          <Toolbar>
            <Typography variant="h6" color="primary" sx={{ flexGrow: 1, fontWeight: 700 }}>
              Team Leave Manager
            </Typography>
          </Toolbar>
          <Tabs
            value={tab}
            onChange={(_, value: TabKey) => setTab(value)}
            sx={{ px: 2, borderBottom: 1, borderColor: 'divider' }}
          >
            <Tab label="Leave Requests" value="leave" />
            <Tab label="Team" value="team" />
            <Tab label="On-Call" value="oncall" />
          </Tabs>
        </AppBar>

        <Container maxWidth="lg" sx={{ py: 4 }}>
          {tab === 'team' && (
            <Stack spacing={3}>
              <Typography variant="h5">Team Members</Typography>
              <TeamMembersPanel />
            </Stack>
          )}

          {tab === 'leave' && (
            <Stack spacing={3}>
              <Typography variant="h5">Leave Requests</Typography>
              <LeaveRequestForm />
              <LeaveRequestList />
              <LeaveCalendar />
            </Stack>
          )}

          {tab === 'oncall' && (
            <Stack spacing={3}>
              <Typography variant="h5">On-Call Schedule</Typography>
              <OnCallSchedule />
            </Stack>
          )}
        </Container>

        <Box component="footer" sx={{ py: 3, textAlign: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            Team Leave Manager MVP
          </Typography>
        </Box>
      </ThemeProvider>
    </JotaiProvider>
  );
}
