import { Box, Paper, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';

// reusable shell for auth pages (login, register, forgot password, etc.)
export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', md: '1.1fr 1fr' },
        bgcolor: 'background.default',
      }}
    >
      {/* Branded panel */}
      {/* // left side of the auth page with branding and marketing content, hidden on small screens  */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flexDirection: 'column',
          justifyContent: 'space-between',
          p: 6,
          color: '#fff',
          background: 'linear-gradient(135deg, #312e81 0%, #4338ca 55%, #0369a1 100%)',
        }}
      >

        {/* logo and branding */}
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              bgcolor: 'rgba(255,255,255,0.2)',
              display: 'grid',
              placeItems: 'center',
              fontWeight: 800,
            }}
          >
            T
          </Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Team Workflow App
          </Typography>
        </Stack>

        <Box>
          <Typography variant="h3" sx={{ fontWeight: 800, mb: 2, lineHeight: 1.15 }}>
            Manage your team's work in one place.
          </Typography>
          <Typography sx={{ opacity: 0.9, maxWidth: 420 }}>
            Create, assign and track tasks with priorities, statuses and role-based
            access — built for fast-moving teams.
          </Typography>
        </Box>

        <Typography sx={{ opacity: 0.7, fontSize: 14 }}>
          © {new Date().getFullYear()} Team Workflow App
        </Typography>
      </Box>

      {/* Form panel */}
       {/* Right side from section  */}
      <Box sx={{ display: 'grid', placeItems: 'center', p: { xs: 3, md: 6 } }}>
        <Paper
          elevation={0}
          sx={{
            width: '100%',
            maxWidth: 420,
            p: { xs: 3, md: 4 },
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 700 }}>
            {title} 
          </Typography>
          {subtitle && (
            <Typography color="text.secondary" sx={{ mb: 3 }}>
              {subtitle}
            </Typography>
          )}
          {children}
          {footer && <Box sx={{ mt: 3, textAlign: 'center' }}>{footer}</Box>}
        </Paper>
      </Box>
    </Box>
  );
}
