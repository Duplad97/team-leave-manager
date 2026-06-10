import { createTheme, alpha } from '@mui/material/styles';

const primary = '#1e3a5f';
const primaryLight = '#2d5a8e';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: primary,
      light: primaryLight,
      dark: '#152a45',
    },
    secondary: {
      main: '#0d9488',
    },
    background: {
      default: '#f1f5f9',
      paper: '#ffffff',
    },
    text: {
      primary: '#0f172a',
      secondary: '#64748b',
    },
    divider: '#e2e8f0',
    warning: {
      main: '#d97706',
      light: '#fef3c7',
    },
    error: {
      main: '#dc2626',
    },
    success: {
      main: '#16a34a',
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700, letterSpacing: '-0.02em' },
    h5: { fontWeight: 600, letterSpacing: '-0.01em' },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 500 },
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#f1f5f9',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          border: '1px solid',
          borderColor: '#e2e8f0',
          boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        contained: {
          '&:hover': {
            boxShadow: '0 4px 12px rgba(30, 58, 95, 0.2)',
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          minHeight: 48,
          fontWeight: 500,
          fontSize: '0.9rem',
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-head': {
            backgroundColor: '#f8fafc',
            color: '#475569',
            fontWeight: 600,
            fontSize: '0.75rem',
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            borderBottom: '1px solid #e2e8f0',
          },
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:last-child td': {
            borderBottom: 0,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 500,
        },
        sizeSmall: {
          height: 24,
          fontSize: '0.75rem',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: '#fff',
          },
        },
      },
    },
  },
});

export const avatarColors = [
  '#1e3a5f',
  '#0d9488',
  '#7c3aed',
  '#db2777',
  '#ea580c',
  '#0891b2',
];

export function memberAvatarColor(name: string): string {
  const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return avatarColors[index % avatarColors.length];
}

export function subtleHover() {
  return {
    transition: 'box-shadow 0.2s ease, transform 0.2s ease',
    '&:hover': {
      boxShadow: `0 8px 24px ${alpha('#0f172a', 0.08)}`,
      transform: 'translateY(-2px)',
    },
  };
}
