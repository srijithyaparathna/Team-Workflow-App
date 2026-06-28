// Import useState to manage component state.
import { useState } from 'react';

// Outlet displays the child route component.
import { Outlet } from 'react-router-dom';

// Material UI components.
import { Box, Toolbar } from '@mui/material';

// Import Sidebar component and sidebar width.
import { Sidebar, SIDEBAR_WIDTH } from './Sidebar';

// Import the top navigation bar.
import { Topbar } from './Topbar';

// Dashboard layout component.
export function DashboardLayout() {

  // Controls whether the mobile sidebar is open.
  const [mobileOpen, setMobileOpen] = useState(false);

  return (

    // Main container using flex layout.
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        bgcolor: 'background.default',
      }}
    >

      {/* Sidebar */}
      <Sidebar
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />

      {/* Top navigation bar */}
      <Topbar
        onMenuClick={() => setMobileOpen(true)}
      />

      {/* Main page content */}
      <Box
        component="main"
        sx={{
          // Take remaining screen space.
          flexGrow: 1,

          // Prevent content overflow.
          minWidth: 0,

          // Leave space for the sidebar on desktop.
          width: { md: `calc(100% - ${SIDEBAR_WIDTH}px)` },

          // Responsive padding.
          p: { xs: 2, md: 6 },
        }}
      >

        {/* Adds space below the fixed topbar */}
        <Toolbar />

        {/* Displays the current page (Dashboard, Tasks, Users, etc.) */}
        <Outlet />

      </Box>

    </Box>
  );
}