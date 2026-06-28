import {
  Box,
  Card,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from '@mui/material';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import EventRoundedIcon from '@mui/icons-material/EventRounded';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EditablePriorityChip, EditableStatusChip } from '../common/Chips';
import { formatDateTime } from '../../utils/format';
import type { Priority, Status, Task } from '../../types';

export function TaskCard({
  task,
  canEdit,
  onEdit,
  onDelete,
  onQuickUpdate,
}: {
  task: Task;
  canEdit: boolean;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
  onQuickUpdate: (task: Task, field: 'priority' | 'status', value: Priority | Status) => void;
}) {
  const navigate = useNavigate();
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);

  return (
    <Card sx={{ p: 2.5, display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <EditablePriorityChip
          priority={task.priority}
          disabled={!canEdit}
          onChange={(value) => onQuickUpdate(task, 'priority', value)}
        />
        {canEdit && (
          <>
            <IconButton size="small" onClick={(e) => setAnchor(e.currentTarget)}>
              <MoreVertRoundedIcon fontSize="small" />
            </IconButton>
            <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
              <MenuItem
                onClick={() => {
                  setAnchor(null);
                  onEdit(task);
                }}
              >
                Edit
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setAnchor(null);
                  onDelete(task);
                }}
                sx={{ color: 'error.main' }}
              >
                Delete
              </MenuItem>
            </Menu>
          </>
        )}
      </Stack>

      <Box
        sx={{ mt: 1.5, cursor: 'pointer', flex: 1 }}
        onClick={() => navigate(`/tasks/${task.id}`)}
      >
        <Typography variant="h6" sx={{ mb: 0.5 }} noWrap>
          {task.title}
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: 40,
          }}
        >
          {task.description || 'No description'}
        </Typography>
      </Box>

      <Stack
        direction="row"
        sx={{ justifyContent: 'space-between', alignItems: 'center', mt: 2 }}
      >
        <EditableStatusChip
          status={task.status}
          disabled={!canEdit}
          onChange={(value) => onQuickUpdate(task, 'status', value)}
        />
        <Stack
          direction="row"
          spacing={0.5}
          sx={{ alignItems: 'center', color: 'text.secondary' }}
        >
          <EventRoundedIcon sx={{ fontSize: 16 }} />
          <Typography variant="caption">{formatDateTime(task.due_date)}</Typography>
        </Stack>
      </Stack>
    </Card>
  );
}
