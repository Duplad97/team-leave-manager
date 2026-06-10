import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import { useEffect, useState } from 'react';
import { fetchReplacementSuggestions } from '../api';
import type { TeamMember, OnCallWeek } from '../types';
import { memberAvatarColor } from '../theme';

interface ReplacementSuggestionsProps {
  onCallWeek: OnCallWeek;
}

export function ReplacementSuggestions({ onCallWeek }: ReplacementSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (expanded && !onCallWeek.hasConflict) {
      return;
    }

    if (!expanded) {
      return;
    }

    async function loadSuggestions() {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchReplacementSuggestions(
          onCallWeek.onCallMember.id,
          onCallWeek.weekStart,
          onCallWeek.weekEnd
        );
        setSuggestions(data);
      } catch (err) {
        setError('Failed to load replacement suggestions');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadSuggestions();
  }, [expanded, onCallWeek]);

  if (!onCallWeek.hasConflict) {
    return null;
  }

  return (
    <Card sx={{ mt: 2 }}>
      <CardContent>
        <Button
          onClick={() => setExpanded(!expanded)}
          sx={{ width: '100%', justifyContent: 'flex-start' }}
        >
          <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
            {expanded ? '▼' : '▶'} Suggested Replacements ({suggestions.length})
          </Typography>
        </Button>

        {expanded && (
          <Stack spacing={2} sx={{ mt: 2 }}>
            {error && <Alert severity="error">{error}</Alert>}

            {loading ? (
              <Typography color="textSecondary">Loading suggestions...</Typography>
            ) : suggestions.length === 0 ? (
              <Typography color="textSecondary">
                No available team members for this period
              </Typography>
            ) : (
              <List>
                {suggestions.map((member) => (
                  <ListItem key={member.id} disablePadding>
                    <ListItemButton>
                      <ListItemIcon>
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            fontSize: '0.8rem',
                            bgcolor: memberAvatarColor(member.name),
                          }}
                        >
                          {member.name[0]}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={member.name}
                        secondary={member.email}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            )}
          </Stack>
        )}
      </CardContent>
    </Card>
  );
}
