import { useState } from 'react';
import { Chip, Menu, MenuItem } from '@mui/material';
import ArrowDropDownRoundedIcon from '@mui/icons-material/ArrowDropDownRounded';
import { PRIORITY_OPTIONS, STATUS_OPTIONS, type Priority, type Status } from '../../types';

// Exported so other views (e.g. the calendar) can reuse the same colors.
export const STATUS_META: Record<Status, { label: string; color: string; bg: string }> = {
  open: { label: 'Open', color: '#2563eb', bg: '#dbeafe' },
  in_progress: { label: 'In Progress', color: '#d97706', bg: '#fef3c7' },
  testing: { label: 'Testing', color: '#7c3aed', bg: '#ede9fe' },
  done: { label: 'Done', color: '#16a34a', bg: '#dcfce7' },
};

export const PRIORITY_META: Record<Priority, { label: string; color: string; bg: string }> = {
  low: { label: 'Low', color: '#0891b2', bg: '#cffafe' },
  medium: { label: 'Medium', color: '#ca8a04', bg: '#fef9c3' },
  high: { label: 'High', color: '#dc2626', bg: '#fee2e2' },
};

export function StatusChip({ status }: { status: Status }) {
  const m = STATUS_META[status];
  return (
    <Chip
      label={m.label}
      size="small"
      sx={{ color: m.color, bgcolor: m.bg, fontWeight: 600, borderRadius: 2 }}
    />
  );
}

export function PriorityChip({ priority }: { priority: Priority }) {
  const m = PRIORITY_META[priority];
  return (
    <Chip
      label={m.label}
      size="small"
      sx={{ color: m.color, bgcolor: m.bg, fontWeight: 600, borderRadius: 2 }}
    />
  );
}

// Clickable status chip that opens a menu to change status inline (skips the full edit dialog).
export function EditableStatusChip({
  status,
  onChange,
  disabled,
}: {
  status: Status;
  onChange: (next: Status) => void;
  disabled?: boolean;
}) {
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);
  const m = STATUS_META[status];

  if (disabled) return <StatusChip status={status} />;

  return (
    <>
      <Chip
        label={m.label}
        size="small"
        deleteIcon={<ArrowDropDownRoundedIcon />}
        onDelete={(e) => setAnchor(e.currentTarget as HTMLElement)}
        onClick={(e) => setAnchor(e.currentTarget)}
        sx={{ color: m.color, bgcolor: m.bg, fontWeight: 600, borderRadius: 2, cursor: 'pointer' }}
      />
      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
        {STATUS_OPTIONS.map((o) => (
          <MenuItem
            key={o.value}
            selected={o.value === status}
            onClick={() => {
              setAnchor(null);
              if (o.value !== status) onChange(o.value);
            }}
          >
            {o.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}

// Clickable priority chip that opens a menu to change priority inline.
export function EditablePriorityChip({
  priority,
  onChange,
  disabled,
}: {
  priority: Priority;
  onChange: (next: Priority) => void;
  disabled?: boolean;
}) {
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);
  const m = PRIORITY_META[priority];

  if (disabled) return <PriorityChip priority={priority} />;

  return (
    <>
      <Chip
        label={m.label}
        size="small"
        deleteIcon={<ArrowDropDownRoundedIcon />}
        onDelete={(e) => setAnchor(e.currentTarget as HTMLElement)}
        onClick={(e) => setAnchor(e.currentTarget)}
        sx={{ color: m.color, bgcolor: m.bg, fontWeight: 600, borderRadius: 2, cursor: 'pointer' }}
      />
      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
        {PRIORITY_OPTIONS.map((o) => (
          <MenuItem
            key={o.value}
            selected={o.value === priority}
            onClick={() => {
              setAnchor(null);
              if (o.value !== priority) onChange(o.value);
            }}
          >
            {o.label}
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
