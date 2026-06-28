
/*
 * File: TaskStatusChart.tsx
 * -------------------------
 * Purpose:
 * Displays a bar chart showing the number of tasks in each status.
 *
 * Used By:
 * - Dashboard.tsx
 *
 * Receives:
 * - tasks -> Array of task objects.
 *
 * Process:
 * - Counts Open, In Progress, Testing and Done tasks.
 * - Passes the counts to Recharts.
 *
 * Returns:
 * - A responsive bar chart inside a Material UI Card.
 */
import { Card, Typography } from '@mui/material';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { Task } from '../../types';

const STATUS_COLORS: Record<string, string> = {
  Open: '#3b82f6',
  'In Progress': '#f59e0b',
  Testing: '#8b5cf6',
  Done: '#22c55e',
};

export function TaskStatusChart({ tasks }: { tasks: Task[] }) {
  const data = [
    { name: 'Open', value: tasks.filter((t) => t.status === 'open').length },
    { name: 'In Progress', value: tasks.filter((t) => t.status === 'in_progress').length },
    { name: 'Testing', value: tasks.filter((t) => t.status === 'testing').length },
    { name: 'Done', value: tasks.filter((t) => t.status === 'done').length },
  ];

  return (
    <Card sx={{ p: 3, height: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Task Statistics
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Tasks by status
      </Typography>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} barCategoryGap="35%">
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef2f7" />
          <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={12} />
          <YAxis allowDecimals={false} tickLine={false} axisLine={false} fontSize={12} />
          <Tooltip cursor={{ fill: '#f8fafc' }} />
          <Bar dataKey="value" radius={[6, 6, 0, 0]}>
            {data.map((entry) => (
              <Cell key={entry.name} fill={STATUS_COLORS[entry.name]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
