import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Avatar,
  Box,
  Chip,
  Divider,
  IconButton,
  InputBase,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
} from '@mui/material';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { useAuth } from '../../hooks/useAuth';
import { SIDEBAR_WIDTH } from './Sidebar';

const initials = (name: string) =>
  name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

export function Topbar({ onMenuClick }: { onMenuClick: () => void }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchor, setAnchor] = useState<null | HTMLElement>(null);

  const handleLogout = async () => {
    setAnchor(null);
    await logout();
    navigate('/login');
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        width: { md: `calc(100% - ${SIDEBAR_WIDTH}px)` },
        ml: { md: `${SIDEBAR_WIDTH}px` },
        bgcolor: 'background.paper',
        color: 'text.primary',
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Toolbar sx={{ gap: 2 }}>
        <IconButton
          onClick={onMenuClick}
          sx={{ display: { md: 'none' } }}
          edge="start"
        >
          <MenuRoundedIcon />
        </IconButton>

        <Stack
          direction="row"
          spacing={1}
          sx={{
            alignItems: 'center',
            flex: 1,
            maxWidth: 420,
            px: 2,
            py: 0.75,
            borderRadius: 3,
            bgcolor: 'background.default',
          }}
        >
          <SearchRoundedIcon sx={{ color: 'text.secondary' }} />
          <InputBase placeholder="Search…" sx={{ flex: 1 }} />
        </Stack>

        <Box sx={{ flex: 1 }} />

        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <Chip
            label={user?.role === 'admin' ? 'Admin' : 'User'}
            size="small"
            color={user?.role === 'admin' ? 'primary' : 'default'}
            sx={{ fontWeight: 600 }}
          />
          <IconButton onClick={(e) => setAnchor(e.currentTarget)} sx={{ p: 0.5 }}>
            <Avatar sx={{ width: 38, height: 38, bgcolor: 'primary.main' }}>
              {user ? initials(user.name) : '?'}
            </Avatar>
          </IconButton>
        </Stack>

        <Menu
          anchorEl={anchor}
          open={Boolean(anchor)}
          onClose={() => setAnchor(null)}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <Box sx={{ px: 2, py: 1 }}>
            <Typography sx={{ fontWeight: 600 }}>{user?.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.email}
            </Typography>
          </Box>
          <Divider />
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutRoundedIcon fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
