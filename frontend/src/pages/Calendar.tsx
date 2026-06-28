import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { DateClickArg } from '@fullcalendar/interaction';
import type { DatesSetArg, EventClickArg, EventContentArg } from '@fullcalendar/core';
import {
  Box,
  Card,
  CircularProgress,
  IconButton,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { TaskFormDialog } from '../components/tasks/TaskFormDialog';
import { STATUS_META } from '../components/common/Chips';
import { taskApi } from '../api/task.api';
import { userApi } from '../api/user.api';
import { errorMessage } from '../api/client';
import { useAuth } from '../hooks/useAuth';
import { parseTaskDate } from '../utils/format';
import type { Task, User } from '../types';
import './Calendar.css';

type ViewName = 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay';

const VIEW_OPTIONS: { value: ViewName; label: string }[] = [
  { value: 'dayGridMonth', label: 'Month' },
  { value: 'timeGridWeek', label: 'Week' },
  { value: 'timeGridDay', label: 'Day' },
];

function renderEvent(arg: EventContentArg) {
  return (
    <div className="modern-event">
      <span className="dot" style={{ background: arg.event.borderColor }} />
      <span className="title">{arg.event.title}</span>
      {arg.timeText && <span className="time">{arg.timeText}</span>}
    </div>
  );
}

export default function CalendarPage() {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const calendarRef = useRef<FullCalendar>(null);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [slotDate, setSlotDate] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [view, setView] = useState<ViewName>('dayGridMonth');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setTasks(await taskApi.list());
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (isAdmin) userApi.list().then(setUsers).catch(() => {});
  }, [isAdmin]);

  // Tasks without a (parseable) due date can't be placed on the calendar.
  const events = useMemo(
    () =>
      tasks
        .map((t) => ({ task: t, start: parseTaskDate(t.due_date) }))
        .filter((e): e is { task: Task; start: Date } => e.start !== null)
        .map(({ task, start }) => {
          const meta = STATUS_META[task.status];
          const end = new Date(start.getTime() + 60 * 60 * 1000);
          return {
            id: String(task.id),
            title: task.title,
            start,
            end,
            backgroundColor: meta.bg,
            borderColor: meta.color,
            textColor: meta.color,
          };
        }),
    [tasks]
  );

  const handleEventClick = (info: EventClickArg) => {
    navigate(`/tasks/${info.event.id}`);
  };

  // Calendar days strictly before today are disabled for creating tasks —
  // existing tasks on those days remain visible/clickable via handleEventClick.
  const isPastDate = (date: Date) => {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    return date < startOfToday;
  };

  const handleDateClick = (info: DateClickArg) => {
    if (isPastDate(info.date)) return;
    setSlotDate(info.dateStr);
    setFormOpen(true);
  };

  const handleDatesSet = (arg: DatesSetArg) => {
    setTitle(arg.view.title);
    setView(arg.view.type as ViewName);
  };

  const goPrev = () => calendarRef.current?.getApi().prev();
  const goNext = () => calendarRef.current?.getApi().next();
  const goToday = () => calendarRef.current?.getApi().today();
  const changeView = (next: ViewName) => {
    calendarRef.current?.getApi().changeView(next);
    setView(next);
  };

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4">Calendar</Typography>
        <Typography color="text.secondary">
          Tasks plotted by due date and time — click a slot to create a task, click a task to
          view it.
        </Typography>
      </Box>

      {error && <Card sx={{ p: 2, bgcolor: '#fef2f2', color: '#b91c1c' }}>{error}</Card>}

      <Card sx={{ p: { xs: 1.5, md: 3 } }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={2}
          sx={{ justifyContent: 'space-between', alignItems: { sm: 'center' }, mb: 2 }}
        >
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <IconButton size="small" onClick={goPrev}>
              <ChevronLeftRoundedIcon />
            </IconButton>
            <IconButton size="small" onClick={goNext}>
              <ChevronRightRoundedIcon />
            </IconButton>
            <Typography variant="h6" sx={{ fontWeight: 700, minWidth: 160 }}>
              {title}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1.5}>
            <TextField
              select
              size="small"
              value={view}
              onChange={(e) => changeView(e.target.value as ViewName)}
              sx={{ minWidth: 120 }}
            >
              {VIEW_OPTIONS.map((o) => (
                <MenuItem key={o.value} value={o.value}>
                  {o.label}
                </MenuItem>
              ))}
            </TextField>
            <Box
              component="button"
              onClick={goToday}
              sx={{
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 2,
                px: 2,
                fontWeight: 600,
                fontSize: 14,
                bgcolor: 'background.paper',
                color: 'text.primary',
                cursor: 'pointer',
                '&:hover': { bgcolor: 'action.hover' },
              }}
            >
              Today
            </Box>
          </Stack>
        </Stack>

        {loading ? (
          <Box sx={{ display: 'grid', placeItems: 'center', minHeight: 400 }}>
            <CircularProgress />
          </Box>
        ) : (
          <Box className="modern-calendar">
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={false}
              height="auto"
              nowIndicator
              selectable
              dayMaxEvents={3}
              events={events}
              eventContent={renderEvent}
              eventClick={handleEventClick}
              dateClick={handleDateClick}
              datesSet={handleDatesSet}
              slotDuration="00:30:00"
              slotLabelInterval="01:00:00"
              slotMinTime="00:00:00"
              slotMaxTime="24:00:00"
              scrollTime="07:00:00"
            />
          </Box>
        )}
      </Card>

      <TaskFormDialog
        open={formOpen}
        task={null}
        users={users}
        defaultDueDate={slotDate}
        onClose={() => setFormOpen(false)}
        onSaved={load}
      />
    </Stack>
  );
}
