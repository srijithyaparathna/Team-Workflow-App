import { useEffect, useState } from 'react';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from '@mui/material';
import { taskApi } from '../../api/task.api';
import { errorMessage } from '../../api/client';
import { useAuth } from '../../hooks/useAuth';
import { toDateTimeInput } from '../../utils/format';
import {
  PRIORITY_OPTIONS,
  STATUS_OPTIONS,
  type Priority,
  type Status,
  type Task,
  type TaskInput,
  type User,
} from '../../types';

interface Props {
  open: boolean;
  task?: Task | null;
  users: User[];
  onClose: () => void;
  onSaved: () => void | Promise<void>;
  // Pre-fill the due date/time when creating (e.g. from a clicked calendar slot).
  defaultDueDate?: string | null;
}

const EMPTY: TaskInput = {
  title: '',
  description: '',
  priority: 'medium',
  status: 'open',
  due_date: '',
  assigned_to: null,
};

export function TaskFormDialog({ open, task, users, onClose, onSaved, defaultDueDate }: Props) {
  const { isAdmin } = useAuth();
  const isEdit = Boolean(task);
  const [form, setForm] = useState<TaskInput>(EMPTY);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setError('');
      setForm(
        task
          ? {
              title: task.title,
              description: task.description ?? '',
              priority: task.priority,
              status: task.status,
              due_date: toDateTimeInput(task.due_date),
              assigned_to: task.assigned_to,
            }
          : { ...EMPTY, due_date: toDateTimeInput(defaultDueDate) }
      );
    }
  }, [open, task, defaultDueDate]);

  const set =
    (key: keyof TaskInput) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async () => {
    setError('');

    if (form.due_date && form.due_date < toDateTimeInput(new Date().toISOString())) {
      setError('Due date cannot be in the past.');
      return;
    }

    setSaving(true);
    try {
      // <input type="datetime-local"> gives "yyyy-MM-ddTHH:mm" (no seconds);
      // pad it out to a complete ISO datetime before sending.
      const payload: TaskInput = {
        ...form,
        due_date: form.due_date ? `${form.due_date}:00` : null,
        assigned_to: form.assigned_to ? Number(form.assigned_to) : null,
      };
      if (isEdit && task) await taskApi.update(task.id, payload);
      else await taskApi.create(payload);
      await onSaved();
      onClose();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontWeight: 700 }}>{isEdit ? 'Edit Task' : 'Create Task'}</DialogTitle>
      <DialogContent>
        <Stack spacing={2.5} sx={{ mt: 1 }}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField
            label="Title"
            value={form.title}
            onChange={set('title')}
            required
            fullWidth
          />
          <TextField
            label="Description"
            value={form.description ?? ''}
            onChange={set('description')}
            multiline
            minRows={3}
            fullWidth
          />
          <Box
            sx={{
              display: 'grid',
              gap: 2.5,
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
            }}
          >
            <TextField
              select
              label="Priority"
              value={form.priority}
              onChange={(e) => setForm((f) => ({ ...f, priority: e.target.value as Priority }))}
              fullWidth
            >
              {PRIORITY_OPTIONS.map((o) => (
                <MenuItem key={o.value} value={o.value}>
                  {o.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Status"
              value={form.status}
              onChange={(e) => setForm((f) => ({ ...f, status: e.target.value as Status }))}
              fullWidth
            >
              {STATUS_OPTIONS.map((o) => (
                <MenuItem key={o.value} value={o.value}>
                  {o.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Due date & time"
              type="datetime-local"
              value={form.due_date ?? ''}
              onChange={set('due_date')}
              slotProps={{
                inputLabel: { shrink: true },
                htmlInput: { step: 1800, min: toDateTimeInput(new Date().toISOString()) }, // 1800s = 30 min increments
              }}
              fullWidth
            />
            {isAdmin && (
              <TextField
                select
                label="Assign to"
                value={form.assigned_to ?? ''}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    assigned_to: e.target.value ? Number(e.target.value) : null,
                  }))
                }
                fullWidth
              >
                <MenuItem value="">Unassigned</MenuItem>
                {users.map((u) => (
                  <MenuItem key={u.id} value={u.id}>
                    {u.name} ({u.email})
                  </MenuItem>
                ))}
              </TextField>
            )}
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2.5 }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Button
          onClick={submit}
          variant="contained"
          disabled={saving || !form.title.trim()}
        >
          {saving ? 'Saving…' : isEdit ? 'Save changes' : 'Create task'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
