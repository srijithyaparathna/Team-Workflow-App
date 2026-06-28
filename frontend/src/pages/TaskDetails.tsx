// import React hooks';
import { useCallback, useEffect, useState } from 'react';
// import React Router hooks';
import { useNavigate, useParams } from 'react-router-dom';
// import MUI components';
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Divider,
  Stack,
  Typography,
} from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { PriorityChip, StatusChip } from '../components/common/Chips';
import { TaskFormDialog } from '../components/tasks/TaskFormDialog';
import { ConfirmDialog } from '../components/common/ConfirmDialog';

// import API functions and utilities';
import { taskApi } from '../api/task.api';
import { userApi } from '../api/user.api';
import { errorMessage } from '../api/client';
// import custom hooks and types';
import { useAuth } from '../hooks/useAuth';
import { formatDateTime } from '../utils/format';
import type { Task, User } from '../types';

// Reuseable component for displaying a labeled field
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
        {label}
      </Typography>
      <Box sx={{ mt: 0.5 }}>{children}</Box>
    </Box>
  );
}

export default function TaskDetails() {
  // Get the task ID from the URL parameters
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();

  const [task, setTask] = useState<Task | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Load task details from the API
  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      setTask(await taskApi.get(Number(id)));
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (isAdmin) userApi.list().then(setUsers).catch(() => {});
  }, [isAdmin]);

  const canEdit = task && (isAdmin || task.created_by === user?.id);

  const userName = (uid: number | null, embeddedName?: string | null) => {
    if (!uid) return 'Unassigned';
    if (embeddedName) return embeddedName;
    const match = users.find((u) => u.id === uid);
    return match ? match.name : `User #${uid}`;
  };
// Handle the delete action
  const handleDelete = async () => {
    if (!task) return;
    setDeleteLoading(true);
    try {
      await taskApi.remove(task.id);
      navigate('/tasks');
    } catch (err) {
      setError(errorMessage(err));
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 320 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !task) {
    return (
      <Stack spacing={2}>
        <Button
          startIcon={<ArrowBackRoundedIcon />}
          onClick={() => navigate('/tasks')}
          sx={{ alignSelf: 'flex-start' }}
        >
          Back to tasks
        </Button>
        <Card sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="error">{error || 'Task not found'}</Typography>
        </Card>
      </Stack>
    );
  }

  return (
    <Stack spacing={3}>
      <Button
        startIcon={<ArrowBackRoundedIcon />}
        onClick={() => navigate('/tasks')}
        sx={{ alignSelf: 'flex-start' }}
        color="inherit"
      >
        Back to tasks
      </Button>

      <Card sx={{ p: { xs: 3, md: 4 } }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ justifyContent: 'space-between', alignItems: { sm: 'flex-start' } }}
        >
          <Box>
            <Typography variant="h4" gutterBottom>
              {task.title}
            </Typography>
            <Stack direction="row" spacing={1}>
              <PriorityChip priority={task.priority} />
              <StatusChip status={task.status} />
            </Stack>
          </Box>
          {canEdit && (
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                startIcon={<EditRoundedIcon />}
                onClick={() => setEditOpen(true)}
              >
                Edit
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteRoundedIcon />}
                onClick={() => setDeleteOpen(true)}
              >
                Delete
              </Button>
            </Stack>
          )}
        </Stack>

        <Divider sx={{ my: 3 }} />

        <Field label="Description">
          <Typography sx={{ whiteSpace: 'pre-wrap' }}>
            {task.description || 'No description provided.'}
          </Typography>
        </Field>

        <Box
          sx={{
            mt: 3,
            display: 'grid',
            gap: 3,
            gridTemplateColumns: { xs: '1fr 1fr', sm: 'repeat(3, 1fr)' },
          }}
        >
          <Field label="Due date">
            <Typography sx={{ fontWeight: 600 }}>{formatDateTime(task.due_date)}</Typography>
          </Field>
          <Field label="Assigned to">
            <Typography sx={{ fontWeight: 600 }}>
              {userName(task.assigned_to, task.assigned_to_name)}
            </Typography>
          </Field>
          <Field label="Created by">
            <Typography sx={{ fontWeight: 600 }}>
              {userName(task.created_by, task.created_by_name)}
            </Typography>
          </Field>
          <Field label="Created">
            <Typography sx={{ fontWeight: 600 }}>{formatDateTime(task.created_at)}</Typography>
          </Field>
          <Field label="Last updated">
            <Typography sx={{ fontWeight: 600 }}>{formatDateTime(task.updated_at)}</Typography>
          </Field>
        </Box>
      </Card>

      <TaskFormDialog
        open={editOpen}
        task={task}
        users={users}
        onClose={() => setEditOpen(false)}
        onSaved={load}
      />
      <ConfirmDialog
        open={deleteOpen}
        title="Delete task"
        message={`Are you sure you want to delete "${task.title}"? This cannot be undone.`}
        confirmLabel="Delete"
        loading={deleteLoading}
        onConfirm={handleDelete}
        onClose={() => setDeleteOpen(false)}
      />
    </Stack>
  );
}
