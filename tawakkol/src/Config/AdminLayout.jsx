import React, { useState } from 'react';
import { Box, CssBaseline, useTheme, useMediaQuery } from '@mui/material';
import AdminBar from '../Admin/AdminBar'; // Your existing AdminBar component

const AdminLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('en');
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleThemeToggle = () => {
    setDarkMode(!darkMode);
  };

  const handleLanguageChange = (langCode) => {
    setLanguage(langCode);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', width: '100%' }}>
      <CssBaseline />
      
      {/* AdminBar Component with all props */}
      <AdminBar
        onThemeToggle={handleThemeToggle}
        darkMode={darkMode}
        language={language}
        onLanguageChange={handleLanguageChange}
        sidebarOpen={sidebarOpen}
        onSidebarToggle={handleSidebarToggle}
      />
      
      {/* Main Content Area - Starts right next to sidebar */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          width: '100%',
          backgroundColor: theme.palette.background.default,
          transition: theme.transitions.create(['margin-left'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          // Content starts right next to sidebar when open
          marginLeft: !isMobile && sidebarOpen ? '280px' : '0',
        }}
      >
        {/* AppBar Spacer */}
        <Box sx={{ 
          ...theme.mixins.toolbar,
          minHeight: '74px !important'
        }} />
        
        {/* Page Content - Minimal padding */}
        <Box sx={{ 
          flex: 1,
          p: 0, // Reduced padding
          width: '100%',
          overflow: 'auto',
          // Remove any extra margins or transitions that cause spacing
        }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default AdminLayout;