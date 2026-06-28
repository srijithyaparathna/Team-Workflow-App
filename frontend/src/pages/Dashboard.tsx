/*
 * File: Dashboard.tsx
 * -------------------
 * Purpose:
 * Main dashboard page displayed after the user logs in.
 *
 * Uses:
 * - useAuth()          -> Gets logged-in user.
 * - taskApi.list()     -> Fetches tasks from backend.
 * - StatCard           -> Displays task summary cards.
 * - TaskStatusChart    -> Displays task statistics graph.
 * - StatusChip         -> Shows task status.
 * - PriorityChip       -> Shows task priority.
 *
 * Process:
 * 1. Load tasks from the backend API.
 * 2. Calculate task statistics.
 * 3. Display statistic cards.
 * 4. Display task status chart.
 * 5. Display recent tasks.
 *
 * Returns:
 * - Complete dashboard page with task overview.
 */

import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  Chip,
  CircularProgress,
  Stack,
  Typography,
} from '@mui/material';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import BugReportRoundedIcon from '@mui/icons-material/BugReportRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import { StatCard } from '../components/dashboard/StatCard';
import { TaskStatusChart } from '../components/dashboard/TaskStatusChart';
import { StatusChip, PriorityChip } from '../components/common/Chips';
import { taskApi } from '../api/task.api';
import { useAuth } from '../hooks/useAuth';
import { errorMessage } from '../api/client';
import type { Task } from '../types';
import { formatDateTime } from '../utils/format';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    taskApi
      .list()
      .then(setTasks)
      .catch((err) => setError(errorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(
    () => ({
      open: tasks.filter((t) => t.status === 'open').length,
      inProgress: tasks.filter((t) => t.status === 'in_progress').length,
      testing: tasks.filter((t) => t.status === 'testing').length,
      done: tasks.filter((t) => t.status === 'done').length,
    }),
    [tasks]
  );

  const recent = useMemo(() => tasks.slice(0, 5), [tasks]);

  if (loading) {
    return (
      <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 320 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4">
          Welcome back, {user?.name?.split(' ')[0]} 👋
        </Typography>
        <Typography color="text.secondary">
          Here's an overview of your tasks.
        </Typography>
      </Box>

      {error && (
        <Card sx={{ p: 2, bgcolor: '#fef2f2', color: '#b91c1c' }}>{error}</Card>
      )}

      {/* Stat cards */}
      <Box
        sx={{
          display: 'grid',
          gap: 2.5,
          gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' },
        }}
      >
        <StatCard
          label="Open"
          value={stats.open}
          icon={<AssignmentRoundedIcon />}
          gradient="linear-gradient(135deg, #2563eb, #1d4ed8)"
        />
        <StatCard
          label="In Progress"
          value={stats.inProgress}
          icon={<AutorenewRoundedIcon />}
          gradient="linear-gradient(135deg, #d97706, #b45309)"
        />
        <StatCard
          label="Testing"
          value={stats.testing}
          icon={<BugReportRoundedIcon />}
          gradient="linear-gradient(135deg, #7c3aed, #6d28d9)"
        />
        <StatCard
          label="Done"
          value={stats.done}
          icon={<CheckCircleRoundedIcon />}
          gradient="linear-gradient(135deg, #16a34a, #15803d)"
        />
      </Box>

      {/* Chart + recent */}
      <Box
        sx={{
          display: 'grid',
          gap: 2.5,
          gridTemplateColumns: { xs: '1fr', lg: '1.4fr 1fr' },
        }}
      >
        <TaskStatusChart tasks={tasks} />

        <Card sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Recent Tasks
          </Typography>
          {recent.length === 0 ? (
            <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>
              No tasks yet.
            </Typography>
          ) : (
            <Stack divider={<Box sx={{ borderBottom: '1px solid', borderColor: 'divider' }} />}>
              {recent.map((task) => (
                <Stack
                  key={task.id}
                  direction="row"
                  onClick={() => navigate(`/tasks/${task.id}`)}
                  sx={{
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    py: 1.5,
                    cursor: 'pointer',
                    '&:hover': { color: 'primary.main' },
                  }}
                >
                  <Box sx={{ minWidth: 0 }}>
                    <Typography noWrap sx={{ fontWeight: 600 }}>
                      {task.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Due {formatDateTime(task.due_date)}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center', flexShrink: 0 }}>
                    <PriorityChip priority={task.priority} />
                    <StatusChip status={task.status} />
                  </Stack>
                </Stack>
              ))}
            </Stack>
          )}
          <Chip
            label="View all tasks"
            onClick={() => navigate('/tasks')}
            sx={{ mt: 2, fontWeight: 600 }}
            color="primary"
            variant="outlined"
          />
        </Card>
      </Box>
    </Stack>
  );
}
