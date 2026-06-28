import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CircularProgress,
  IconButton,
  InputAdornment,
  MenuItem,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import GridViewRoundedIcon from '@mui/icons-material/GridViewRounded';
import TableRowsRoundedIcon from '@mui/icons-material/TableRowsRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import { TaskCard } from '../components/tasks/TaskCard';
import { TaskFormDialog } from '../components/tasks/TaskFormDialog';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { EditablePriorityChip, EditableStatusChip } from '../components/common/Chips';
import { taskApi } from '../api/task.api';
import { userApi } from '../api/user.api';
import { errorMessage } from '../api/client';
import { useAuth } from '../hooks/useAuth';
import { formatDateTime } from '../utils/format';
import {
  PRIORITY_OPTIONS,
  STATUS_OPTIONS,
  type Priority,
  type Status,
  type Task,
  type User,
} from '../types';

type View = 'card' | 'table';

export default function Tasks() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [view, setView] = useState<View>('table');

  const [search, setSearch] = useState('');
  const [priority, setPriority] = useState<Priority | ''>('');
  const [status, setStatus] = useState<Status | ''>('');

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Task | null>(null);
  const [deleting, setDeleting] = useState<Task | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [snack, setSnack] = useState('');

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await taskApi.list({ priority, status });
      setTasks(data);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [priority, status]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (isAdmin) userApi.list().then(setUsers).catch(() => {});
  }, [isAdmin]);

  // Client-side title search on top of server filters.
  const visible = useMemo(
    () =>
      tasks.filter((t) =>
        search.trim() ? t.title.toLowerCase().includes(search.toLowerCase()) : true
      ),
    [tasks, search]
  );

  // Jump back to page 1 whenever the visible set changes underneath the current page.
  useEffect(() => {
    setPage(0);
  }, [search, priority, status]);

  const paged = useMemo(
    () => visible.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [visible, page, rowsPerPage]
  );

  const canEdit = (task: Task) => isAdmin || task.created_by === user?.id;

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (task: Task) => {
    setEditing(task);
    setFormOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    setDeleteLoading(true);
    try {
      await taskApi.remove(deleting.id);
      setDeleting(null);
      await load();
      setSnack('Task deleted');
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setDeleteLoading(false);
    }
  };

  const quickUpdate = async (
    task: Task,
    field: 'priority' | 'status',
    value: Priority | Status
  ) => {
    try {
      await taskApi.update(task.id, { [field]: value });
      await load();
      setSnack(field === 'status' ? 'Status updated' : 'Priority updated');
    } catch (err) {
      setError(errorMessage(err));
    }
  };

  return (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={2}
        sx={{ justifyContent: 'space-between', alignItems: { xs: 'flex-start', sm: 'center' } }}
      >
        <Box>
          <Typography variant="h4">Tasks</Typography>
          <Typography color="text.secondary">
            {isAdmin ? 'All tasks across the team' : 'Tasks you created or are assigned to'}
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={openCreate}>
          New Task
        </Button>
      </Stack>

      {/* Filters */}
      <Card sx={{ p: 2 }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          sx={{ alignItems: { md: 'center' } }}
        >
          <TextField
            placeholder="Search by title…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            sx={{ flex: 1 }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon fontSize="small" />
                  </InputAdornment>
                ),
              },
            }}
          />
          <TextField
            select
            label="Priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value as Priority | '')}
            size="small"
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="">All priorities</MenuItem>
            {PRIORITY_OPTIONS.map((o) => (
              <MenuItem key={o.value} value={o.value}>
                {o.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value as Status | '')}
            size="small"
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="">All statuses</MenuItem>
            {STATUS_OPTIONS.map((o) => (
              <MenuItem key={o.value} value={o.value}>
                {o.label}
              </MenuItem>
            ))}
          </TextField>
          <ToggleButtonGroup
            value={view}
            exclusive
            size="small"
            onChange={(_, v) => v && setView(v)}
          >
            <ToggleButton value="card">
              <GridViewRoundedIcon fontSize="small" />
            </ToggleButton>
            <ToggleButton value="table">
              <TableRowsRoundedIcon fontSize="small" />
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      </Card>

      {error && <Card sx={{ p: 2, bgcolor: '#fef2f2', color: '#b91c1c' }}>{error}</Card>}

      {loading ? (
        <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 240 }}>
          <CircularProgress />
        </Box>
      ) : visible.length === 0 ? (
        <Card sx={{ p: 6, textAlign: 'center' }}>
          <Typography variant="h6" color="text.secondary">
            No tasks found
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 2 }}>
            Try adjusting your filters or create a new task.
          </Typography>
          <Button variant="contained" startIcon={<AddRoundedIcon />} onClick={openCreate}>
            New Task
          </Button>
        </Card>
      ) : (
        <>
        {view === 'card' ? (
        <Box
          sx={{
            display: 'grid',
            gap: 2.5,
            gridTemplateColumns: {
              xs: '1fr',
              sm: '1fr 1fr',
              lg: 'repeat(3, 1fr)',
            },
          }}
        >
          {paged.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              canEdit={canEdit(task)}
              onEdit={openEdit}
              onDelete={setDeleting}
              onQuickUpdate={quickUpdate}
            />
          ))}
        </Box>
      ) : (
        <Card sx={{ overflow: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                {isAdmin && <TableCell>Assigned to</TableCell>}
                <TableCell>Priority</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Due date</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
           <TableBody>
  {paged.map((task) => (
    <TableRow key={task.id} hover>

      <TableCell
        sx={{ cursor: 'pointer', fontWeight: 600 }}
        onClick={() => navigate(`/tasks/${task.id}`)}
      >
        {task.title}
      </TableCell>

      {isAdmin && (
        <TableCell>
          {task.assigned_to_name ??
            users.find((u) => u.id === task.assigned_to)?.name ??
            'Unassigned'}
        </TableCell>
      )}

      <TableCell>
        <EditablePriorityChip
          priority={task.priority}
          disabled={!canEdit(task)}
          onChange={(value) => quickUpdate(task, 'priority', value)}
        />
      </TableCell>

      <TableCell>
        <EditableStatusChip
          status={task.status}
          disabled={!canEdit(task)}
          onChange={(value) => quickUpdate(task, 'status', value)}
        />
      </TableCell>

      <TableCell>
        {formatDateTime(task.due_date)}
      </TableCell>

      <TableCell align="right">
        {canEdit(task) && (
          <>
            <Tooltip title="Edit">
              <IconButton
                size="small"
                onClick={() => openEdit(task)}
              >
                <EditRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>

            <Tooltip title="Delete">
              <IconButton
                size="small"
                color="error"
                onClick={() => setDeleting(task)}
              >
                <DeleteRoundedIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </>
        )}
      </TableCell>

    </TableRow>
  ))}
</TableBody>
          </Table>
        </Card>
      )}

      <TablePagination
        component="div"
        count={visible.length}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(e) => {
          setRowsPerPage(parseInt(e.target.value, 10));
          setPage(0);
        }}
        rowsPerPageOptions={[6, 12, 24, 48]}
      />
        </>
      )}

      <TaskFormDialog
        open={formOpen}
        task={editing}
        users={users}
        onClose={() => setFormOpen(false)}
        onSaved={async () => {
          await load();
          setSnack(editing ? 'Task updated' : 'Task created');
        }}
      />
      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete task"
        message={`Are you sure you want to delete "${deleting?.title}"? This cannot be undone.`}
        confirmLabel="Delete"
        loading={deleteLoading}
        onConfirm={confirmDelete}
        onClose={() => setDeleting(null)}
      />

      <Snackbar
        open={Boolean(snack)}
        autoHideDuration={3000}
        onClose={() => setSnack('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" variant="filled" onClose={() => setSnack('')}>
          {snack}
        </Alert>
      </Snackbar>
    </Stack>
  );
}
