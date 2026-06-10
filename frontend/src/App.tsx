import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import GroupsIcon from '@mui/icons-material/Groups';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
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
import { PageHeader } from './components/PageHeader';
import { TeamMembersPanel } from './components/TeamMembersPanel';
import { theme } from './theme';

type TabKey = 'team' | 'leave' | 'oncall';

const tabs: { value: TabKey; label: string; icon: React.ReactElement }[] = [
  { value: 'leave', label: 'Leave', icon: <EventAvailableIcon sx={{ fontSize: 20 }} /> },
  { value: 'team', label: 'Team', icon: <GroupsIcon sx={{ fontSize: 20 }} /> },
  { value: 'oncall', label: 'On-Call', icon: <SupportAgentIcon sx={{ fontSize: 20 }} /> },
];

export default function App() {
  const [tab, setTab] = useState<TabKey>('leave');

  return (
    <JotaiProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <AppBar
            position="sticky"
            elevation={0}
            sx={{
              bgcolor: 'background.paper',
              borderBottom: 1,
              borderColor: 'divider',
            }}
          >
            <Toolbar sx={{ gap: 1.5, minHeight: { xs: 56, sm: 64 } }}>
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 2,
                  bgcolor: 'primary.main',
                  color: 'primary.contrastText',
                  display: 'grid',
                  placeItems: 'center',
                }}
              >
                <CalendarMonthIcon sx={{ fontSize: 20 }} />
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="subtitle1" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
                  Team Leave Manager
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Leave requests & on-call rotation
                </Typography>
              </Box>
            </Toolbar>
            <Tabs
              value={tab}
              onChange={(_, value: TabKey) => setTab(value)}
              sx={{
                px: { xs: 1, sm: 2 },
                minHeight: 44,
                '& .MuiTab-root': {
                  minHeight: 44,
                  gap: 1,
                },
              }}
            >
              {tabs.map(({ value, label, icon }) => (
                <Tab key={value} value={value} label={label} icon={icon} iconPosition="start" />
              ))}
            </Tabs>
          </AppBar>

          <Box component="main" sx={{ flex: 1, py: { xs: 3, sm: 4 } }}>
            <Container maxWidth="lg">
              {tab === 'team' && (
                <Stack spacing={3}>
                  <PageHeader
                    title="Team Members"
                    description="Your team's on-call rotation order. Members rotate weekly in this sequence."
                  />
                  <TeamMembersPanel />
                </Stack>
              )}

              {tab === 'leave' && (
                <Stack spacing={3}>
                  <PageHeader
                    title="Leave Requests"
                    description="Submit time off, review pending requests, and see the team calendar at a glance."
                  />
                  <LeaveRequestForm />
                  <LeaveRequestList />
                  <LeaveCalendar />
                </Stack>
              )}

              {tab === 'oncall' && (
                <Stack spacing={3}>
                  <PageHeader
                    title="On-Call Schedule"
                    description="Weekly rotation schedule with automatic conflict detection when the on-call person has approved leave."
                  />
                  <OnCallSchedule />
                </Stack>
              )}
            </Container>
          </Box>

          <Box
            component="footer"
            sx={{
              py: 2.5,
              textAlign: 'center',
              borderTop: 1,
              borderColor: 'divider',
              bgcolor: 'background.paper',
            }}
          >
            <Typography variant="caption" color="text.secondary">
              Team Leave Manager
            </Typography>
          </Box>
        </Box>
      </ThemeProvider>
    </JotaiProvider>
  );
}
