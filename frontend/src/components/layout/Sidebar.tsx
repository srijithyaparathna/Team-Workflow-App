// NavLink is used for navigation between diffrent pages
import { NavLink } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';

// Material UI icons for the sidebar navigation items
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import ChecklistRoundedIcon from '@mui/icons-material/ChecklistRounded';
import CalendarMonthRoundedIcon from '@mui/icons-material/CalendarMonthRounded';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
// for authentication and authorization admin or user
import { useAuth } from '../../hooks/useAuth';

export const SIDEBAR_WIDTH = 248;

interface NavItem {
  label: string;
  to: string;
  icon: React.ReactNode;
  adminOnly?: boolean;
}

// array containing all sidebar menu items
const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', to: '/dashboard', icon: <DashboardRoundedIcon /> },
  { label: 'Tasks', to: '/tasks', icon: <ChecklistRoundedIcon /> },
  { label: 'Calendar', to: '/calendar', icon: <CalendarMonthRoundedIcon /> },
  { label: 'Users', to: '/users', icon: <GroupRoundedIcon />, adminOnly: true },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { isAdmin, logout } = useAuth();
  const items = NAV_ITEMS.filter((i) => !i.adminOnly || isAdmin);

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 2 }}>
      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', px: 1, py: 2 }}>
        <Box
          sx={{
            width: 38,
            height: 38,
            borderRadius: 2,
            background: 'linear-gradient(135deg, #4338ca, #0369a1)',
            display: 'grid',
            placeItems: 'center',
            color: '#fff',
            fontWeight: 800,
          }}
        >
          T
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          TaskFlow
        </Typography>
      </Stack>

      <List sx={{ flex: 1, mt: 1 }}>
        {items.map((item) => (
          <ListItemButton
            key={item.to}
            component={NavLink}
            to={item.to}
            onClick={onNavigate}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              color: 'text.secondary',
              '&.active': {
                bgcolor: 'primary.main',
                color: '#fff',
                '& .MuiListItemIcon-root': { color: '#fff' },
              },
              '&:hover': { bgcolor: 'action.hover' },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.label} slotProps={{ primary: { sx: { fontWeight: 600 } } }} />
          </ListItemButton>
        ))}
      </List>

      <ListItemButton onClick={() => logout()} sx={{ borderRadius: 2, color: 'error.main' }}>
        <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
          <LogoutRoundedIcon />
        </ListItemIcon>
        <ListItemText primary="Logout" slotProps={{ primary: { sx: { fontWeight: 600 } } }} />
      </ListItemButton>
    </Box>
  );
}

export function Sidebar({
  mobileOpen,
  onClose,
}: {
  mobileOpen: boolean;
  onClose: () => void;
}) {
  return (
    <>
      {/* Permanent sidebar on desktop */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: SIDEBAR_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: SIDEBAR_WIDTH,
            boxSizing: 'border-box',
            borderRight: '1px solid',
            borderColor: 'divider',
          },
        }}
        open
      >
        <SidebarContent />
      </Drawer>

      {/* Temporary drawer on mobile */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { width: SIDEBAR_WIDTH, boxSizing: 'border-box' },
        }}
      >
        <SidebarContent onNavigate={onClose} />
      </Drawer>
    </>
  );
}
