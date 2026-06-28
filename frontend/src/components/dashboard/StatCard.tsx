/*
 * File: StatCard.tsx
 * ------------------
 * Purpose:
 * Reusable component that displays a single dashboard statistic card.
 *
 * Used By:
 * - Dashboard.tsx
 *
 * Receives:
 * - label     -> Card title (Open, Done, etc.)
 * - value     -> Number to display
 * - icon      -> Material UI icon
 * - gradient  -> Card background color
 *
 * Returns:
 * - A styled Material UI Card showing one statistic.
 */

import { Box, Card, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';

export function StatCard({
  label,
  value,
  icon,
  gradient,
}: {
  label: string;
  value: number | string;
  icon: ReactNode;
  gradient: string;
}) {
  return (
    <Card sx={{ p: 2.5, color: '#fff', background: gradient, height: '100%' }}>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h3" sx={{ fontWeight: 800, lineHeight: 1 }}>
            {value}
          </Typography>
          <Typography sx={{ opacity: 0.9, mt: 1, fontWeight: 500 }}>{label}</Typography>
        </Box>
        <Box
          sx={{
            width: 44,
            height: 44,
            borderRadius: 2,
            bgcolor: 'rgba(255,255,255,0.25)',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          {icon}
        </Box>
      </Stack>
    </Card>
  );
}
