import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  Badge,
  Box,
  Typography,
  Divider,
  useMediaQuery,
  useTheme,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
  Chip,
  alpha,
  CircularProgress
} from '@mui/material';

import {
  Search,
  Notifications,
  Mail,
  Brightness4,
  Brightness7,
  Person,
  Dashboard,
  ShoppingCart,
  Inventory,
  People,
  Analytics,
  Settings,
  Receipt,
  Logout,
  ExpandLess,
  ExpandMore,
  ChevronLeft,
  Menu as MenuIcon
} from '@mui/icons-material';

import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { getCurrentAdmin, logout, getAdminFullName, getAdminInitials, getAdminPicture, getAdminRoleDisplay } from '../Config/auth';
import tawakkol from '../assets/tawakkol.png';

/* ================= COLORS ================= */
const COLORS = {
  noir: '#1a1a1a',
  noirSoft: '#222',
  gold: '#d4af37',
  white: '#ffffff',
  errorRed: '#ff4757',
  successGreen: '#2ed573',
};

const drawerWidth = 280;

/* ================= STYLES ================= */

const StyledAppBar = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'sidebarOpen',
})(({ sidebarOpen }) => ({
  backgroundColor: COLORS.noir,
  color: COLORS.white,
  borderBottom: `1px solid ${alpha('#fff', 0.08)}`,
  transition: '0.3s',
  ...(sidebarOpen && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
  }),
}));

const SidebarDrawer = styled(Drawer)(() => ({
  '& .MuiDrawer-paper': {
    width: drawerWidth,
    backgroundColor: COLORS.noir,
    borderRight: `1px solid ${alpha('#fff', 0.08)}`,
    color: COLORS.white,
    display: 'flex',
    flexDirection: 'column',
  },
}));

const SearchBar = styled(TextField)(() => ({
  width: '100%',
  maxWidth: 450,
  '& .MuiOutlinedInput-root': {
    backgroundColor: COLORS.noirSoft,
    borderRadius: 30,
    color: COLORS.white,
    '& fieldset': { 
      border: 'none',
    },
    '&:hover fieldset': {
      border: 'none',
    },
    '&.Mui-focused fieldset': {
      border: 'none',
    },
  },
  '& .MuiInputBase-input::placeholder': {
    color: alpha(COLORS.white, 0.6),
  },
}));

const SidebarItem = styled(ListItemButton)(() => ({
  borderRadius: 10,
  marginBottom: 6,
  color: COLORS.white,
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: alpha(COLORS.gold, 0.15),
    transform: 'translateX(4px)',
  },
  '&.Mui-selected': {
    backgroundColor: alpha(COLORS.gold, 0.25),
    '&:hover': {
      backgroundColor: alpha(COLORS.gold, 0.3),
    },
  },
}));

const ProfileAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: COLORS.gold,
  color: COLORS.noir,
  fontWeight: 'bold',
  border: `2px solid ${COLORS.gold}`,
  width: 36,
  height: 36,
  fontSize: '0.9rem',
  transition: 'all 0.2s ease',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: `0 0 0 2px ${alpha(COLORS.gold, 0.3)}`,
  },
}));

const GoldBadge = styled(Badge)(() => ({
  '& .MuiBadge-badge': {
    backgroundColor: COLORS.gold,
    color: COLORS.noir,
    fontWeight: 'bold',
    border: `1px solid ${COLORS.noir}`,
  },
}));

/* ================= COMPONENT ================= */

const AdminBar = ({
  onThemeToggle,
  darkMode,
  sidebarOpen,
  onSidebarToggle,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();

  const [expandedMenus, setExpandedMenus] = useState({});
  const [search, setSearch] = useState('');
  const [notifAnchor, setNotifAnchor] = useState(null);
  const [mailAnchor, setMailAnchor] = useState(null);
  const [profileAnchor, setProfileAnchor] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activePath, setActivePath] = useState('/Admin-Panel/Dashboard');

  /* ================= EFFECTS ================= */

  useEffect(() => {
    const fetchAdminData = () => {
      const adminData = getCurrentAdmin();
      if (adminData) {
        setAdmin(adminData);
      } else {
        // If no admin data, redirect to login after a delay
        setTimeout(() => {
          navigate('/login');
        }, 1500);
      }
      setLoading(false);
    };

    fetchAdminData();
    
    // Set active path based on current URL
    setActivePath(window.location.pathname);
  }, [navigate]);

  useEffect(() => {
    if (isMobile && sidebarOpen) {
      onSidebarToggle();
    }
  }, [isMobile, sidebarOpen, onSidebarToggle]);

  /* ================= DATA ================= */

  const menus = [
    { 
      title: 'Dashboard', 
      icon: <Dashboard />, 
      path: '/Admin-Panel/Dashboard',
      roles: ['admin', 'super-admin']
    },
    {
      title: 'Products',
      icon: <Inventory />,
      sub: [
        { title: 'Add New', path: '/Admin-Panel/Creating-New-Product' },
        { title: 'Manage Products', path: '/Admin-Panel/Manage-Products' },
        { title: 'Sold Out', path: '/Admin-Panel/Sold-Out-Products' },
      ],
      roles: ['admin', 'super-admin']
    },
    {
      title: 'Orders',
      icon: <ShoppingCart />,
      sub: [
        { title: 'All Orders', path: '/Admin-Panel/Orders' },
        { title: 'Pending', path: '/Admin-Panel/Pending-Orders' },
        { title: 'Completed', path: '/Admin-Panel/Completed-Orders' },
        { title: 'Cancelled', path: '/Admin-Panel/Cancelled-Orders' },
      ],
      roles: ['admin', 'super-admin']
    },
    { 
      title: 'Customers', 
      icon: <People />, 
      path: '/Admin-Panel/Customers',
      roles: ['admin', 'super-admin']
    },
    { 
      title: 'Analytics', 
      icon: <Analytics />, 
      path: '/Admin-Panel/Analytics',
      roles: ['admin', 'super-admin']
    },
    { 
      title: 'Reports', 
      icon: <Receipt />, 
      path: '/Admin-Panel/Reports',
      roles: ['super-admin'] // Only super-admin can see reports
    },
    { 
      title: 'Settings', 
      icon: <Settings />, 
      path: '/Admin-Panel/Settings',
      roles: ['super-admin'] // Only super-admin can see settings
    },
  ];

  // Filter menus based on admin role
  const filteredMenus = menus.filter(menu => {
    if (!admin) return false;
    if (!menu.roles) return true;
    return menu.roles.includes(admin.role);
  });

  const notifications = [
    { id: 1, text: 'New order received', time: '2 min ago', read: false },
    { id: 2, text: 'Low stock alert for T-shirts', time: '1 hour ago', read: true },
    { id: 3, text: 'New customer registered', time: '3 hours ago', read: true },
  ];

  const mails = [
    { id: 1, text: 'Support ticket reply from Ahmed', time: 'Just now', unread: true },
    { id: 2, text: 'New supplier message', time: '30 min ago', unread: false },
    { id: 3, text: 'Monthly newsletter', time: '2 hours ago', unread: false },
  ];

  const unreadNotifications = notifications.filter(n => !n.read).length;
  const unreadMails = mails.filter(m => m.unread).length;

  /* ================= HANDLERS ================= */

  const goTo = (path) => {
    setActivePath(path);
    navigate(path);
    if (isMobile && sidebarOpen) {
      onSidebarToggle();
    }
  };

  const handleLogout = () => {
    logout();
    setProfileAnchor(null);
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && search.trim()) {
      // Implement search functionality
      console.log('Searching for:', search);
      setSearch('');
    }
  };

  const getAdminFullNameText = () => {
    if (!admin) return 'Loading...';
    return getAdminFullName(admin);
  };

  const getAdminInitialsText = () => {
    if (!admin) return 'A';
    return getAdminInitials(admin);
  };

  const getAdminPictureUrl = () => {
    if (!admin) return '';
    const pictureUrl = getAdminPicture(admin);
    return pictureUrl;
  };

  const getAdminRoleText = () => {
    if (!admin) return 'Admin';
    return getAdminRoleDisplay(admin);
  };

  const isMenuItemActive = (menuPath, subItems = []) => {
    if (menuPath === activePath) return true;
    if (subItems.some(sub => sub.path === activePath)) return true;
    return false;
  };

  /* ================= SIDEBAR ================= */

  const drawerContent = (
    <>
      {/* Sidebar Header */}
      <Box p={2} display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" alignItems="center" gap={1.5}>
          <ProfileAvatar 
            src={tawakkol} 
            alt="Tawakkol"
            sx={{ 
              backgroundColor: 'transparent',
              border: 'none',
              width: 40,
              height: 40
            }}
          />
          <Box>
            <Typography fontWeight={800} color="white" fontSize="1.1rem">
              Tawakkol
            </Typography>
            <Typography variant="caption" color={alpha(COLORS.gold, 0.8)}>
              Admin Panel
            </Typography>
          </Box>
        </Box>
        {!isMobile && (
          <IconButton 
            onClick={onSidebarToggle}
            sx={{ 
              color: COLORS.gold,
              '&:hover': {
                backgroundColor: alpha(COLORS.gold, 0.1),
              }
            }}
          >
            <ChevronLeft />
          </IconButton>
        )}
      </Box>

      <Divider sx={{ borderColor: alpha(COLORS.white, 0.1), mb: 1 }} />

      {/* Admin Profile Section */}
      <Box p={2}>
        {loading ? (
          <Box display="flex" alignItems="center" justifyContent="center" p={3}>
            <CircularProgress size={24} sx={{ color: COLORS.gold }} />
          </Box>
        ) : admin ? (
          <Box 
            display="flex" 
            alignItems="center" 
            gap={2} 
            p={2} 
            sx={{ 
              backgroundColor: alpha(COLORS.gold, 0.08), 
              borderRadius: 2,
              border: `1px solid ${alpha(COLORS.gold, 0.2)}`,
              backdropFilter: 'blur(10px)',
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: alpha(COLORS.gold, 0.12),
                borderColor: alpha(COLORS.gold, 0.4),
              }
            }}
          >
            <ProfileAvatar 
              src={getAdminPictureUrl()} 
              alt={getAdminFullNameText()}
              sx={{
                width: 48,
                height: 48,
                fontSize: '1.1rem',
              }}
            >
              {!getAdminPictureUrl() && getAdminInitialsText()}
            </ProfileAvatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography 
                fontWeight={700} 
                color="white" 
                noWrap
                sx={{ 
                  fontSize: '0.95rem',
                  lineHeight: 1.2,
                  mb: 0.5
                }}
              >
                {getAdminFullNameText()}
              </Typography>
              <Typography 
                variant="caption" 
                color={COLORS.gold} 
                fontWeight={600}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                }}
              >
                <Box 
                  sx={{ 
                    width: 6, 
                    height: 6, 
                    borderRadius: '50%', 
                    backgroundColor: COLORS.gold,
                    display: 'inline-block'
                  }} 
                />
                {getAdminRoleText()}
              </Typography>
            </Box>
          </Box>
        ) : (
          <Box 
            p={2} 
            sx={{ 
              backgroundColor: alpha(COLORS.errorRed, 0.1),
              borderRadius: 2,
              border: `1px solid ${alpha(COLORS.errorRed, 0.2)}`,
              textAlign: 'center'
            }}
          >
            <Typography color={COLORS.errorRed} fontSize="0.9rem">
              Not authenticated
            </Typography>
            <Typography variant="caption" color={alpha(COLORS.white, 0.6)}>
              Redirecting to login...
            </Typography>
          </Box>
        )}
      </Box>

      <Divider sx={{ borderColor: alpha(COLORS.white, 0.1), my: 1 }} />

      {/* Navigation Menu */}
      <List sx={{ p: 2, flex: 1, overflowY: 'auto' }}>
        {filteredMenus.map((m) => {
          const isActive = isMenuItemActive(m.path, m.sub);
          const isExpanded = expandedMenus[m.title];
          
          return (
            <React.Fragment key={m.title}>
              <SidebarItem
                selected={isActive}
                onClick={() =>
                  m.sub
                    ? setExpandedMenus((p) => ({ ...p, [m.title]: !p[m.title] }))
                    : goTo(m.path)
                }
                sx={{
                  pl: m.sub ? 2 : 2.5,
                  ...(isActive && {
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: 4,
                      height: '60%',
                      backgroundColor: COLORS.gold,
                      borderRadius: '0 2px 2px 0',
                    }
                  })
                }}
              >
                <ListItemIcon sx={{ 
                  color: isActive ? COLORS.gold : alpha(COLORS.gold, 0.7),
                  minWidth: 40,
                }}>
                  {React.cloneElement(m.icon, {
                    sx: { fontSize: '1.2rem' }
                  })}
                </ListItemIcon>
                <ListItemText 
                  primary={m.title} 
                  primaryTypographyProps={{
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.95rem',
                  }}
                />
                {m.sub && (
                  <Box sx={{ color: alpha(COLORS.gold, 0.5) }}>
                    {isExpanded ? <ExpandLess /> : <ExpandMore />}
                  </Box>
                )}
              </SidebarItem>

              {m.sub && isExpanded && m.sub.map((s) => {
                const isSubActive = s.path === activePath;
                return (
                  <SidebarItem 
                    key={s.title} 
                    selected={isSubActive}
                    onClick={() => goTo(s.path)}
                    sx={{ 
                      pl: 6,
                      py: 1,
                      ...(isSubActive && {
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          left: 24,
                          top: '50%',
                          transform: 'translateY(-50%)',
                          width: 4,
                          height: '40%',
                          backgroundColor: COLORS.gold,
                          borderRadius: '0 2px 2px 0',
                        }
                      })
                    }}
                  >
                    <ListItemText 
                      primary={s.title} 
                      primaryTypographyProps={{
                        fontSize: '0.9rem',
                        fontWeight: isSubActive ? 600 : 400,
                        color: isSubActive ? COLORS.gold : alpha(COLORS.white, 0.8),
                      }}
                    />
                  </SidebarItem>
                );
              })}
            </React.Fragment>
          );
        })}
      </List>

      {/* Logout Button */}
      <Box p={2} mt="auto">
        <SidebarItem 
          onClick={handleLogout}
          sx={{
            backgroundColor: alpha(COLORS.errorRed, 0.1),
            border: `1px solid ${alpha(COLORS.errorRed, 0.2)}`,
            '&:hover': {
              backgroundColor: alpha(COLORS.errorRed, 0.2),
              borderColor: alpha(COLORS.errorRed, 0.4),
            }
          }}
        >
          <ListItemIcon sx={{ color: COLORS.errorRed }}>
            <Logout />
          </ListItemIcon>
          <ListItemText 
            primary="Logout" 
            primaryTypographyProps={{
              fontWeight: 600,
              color: COLORS.errorRed,
            }}
          />
        </SidebarItem>
      </Box>
    </>
  );

  /* ================= RENDER ================= */

  if (loading) {
    return (
      <Box 
        display="flex" 
        justifyContent="center" 
        alignItems="center" 
        minHeight="64px"
        sx={{ 
          backgroundColor: COLORS.noir,
          borderBottom: `1px solid ${alpha('#fff', 0.08)}`,
        }}
      >
        <CircularProgress size={24} sx={{ color: COLORS.gold }} />
      </Box>
    );
  }

  return (
    <>
      <StyledAppBar position="fixed" sidebarOpen={sidebarOpen}>
        <Toolbar sx={{ 
          justifyContent: 'space-between',
          minHeight: { xs: 56, sm: 64 },
          px: { xs: 1, sm: 2, md: 3 }
        }}>
          {/* LEFT - Menu Button */}
          <IconButton 
            onClick={onSidebarToggle}
            sx={{ 
              color: COLORS.gold,
              '&:hover': {
                backgroundColor: alpha(COLORS.gold, 0.1),
              }
            }}
          >
            <MenuIcon />
          </IconButton>

          {/* CENTER - Search Bar */}
          <Box sx={{ 
            flex: 1, 
            display: 'flex', 
            justifyContent: 'center',
            maxWidth: { xs: 'none', md: 600 },
            px: { xs: 1, sm: 2 }
          }}>
            <SearchBar
              placeholder="Search orders, products, customers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleSearch}
              InputProps={{
                startAdornment: <Search sx={{ color: alpha(COLORS.gold, 0.7), mr: 1 }} />,
              }}
              size="small"
            />
          </Box>

          {/* RIGHT - Actions & Profile */}
          <Box display="flex" alignItems="center" gap={{ xs: 0.5, sm: 1.5 }}>
            {/* Theme Toggle */}
            <Tooltip title={darkMode ? "Light Mode" : "Dark Mode"}>
              <IconButton 
                onClick={onThemeToggle}
                sx={{ 
                  color: COLORS.white,
                  '&:hover': {
                    backgroundColor: alpha(COLORS.gold, 0.1),
                    color: COLORS.gold,
                  }
                }}
              >
                {darkMode ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
            </Tooltip>

            {/* Notifications */}
            <Tooltip title="Notifications">
              <IconButton 
                onClick={(e) => setNotifAnchor(e.currentTarget)}
                sx={{ 
                  color: COLORS.white,
                  '&:hover': {
                    backgroundColor: alpha(COLORS.gold, 0.1),
                    color: COLORS.gold,
                  }
                }}
              >
                <GoldBadge badgeContent={unreadNotifications} max={9}>
                  <Notifications />
                </GoldBadge>
              </IconButton>
            </Tooltip>

            {/* Messages */}
            <Tooltip title="Messages">
              <IconButton 
                onClick={(e) => setMailAnchor(e.currentTarget)}
                sx={{ 
                  color: COLORS.white,
                  '&:hover': {
                    backgroundColor: alpha(COLORS.gold, 0.1),
                    color: COLORS.gold,
                  }
                }}
              >
                <GoldBadge badgeContent={unreadMails} max={9}>
                  <Mail />
                </GoldBadge>
              </IconButton>
            </Tooltip>

            {/* PROFILE CHIP */}
            {admin ? (
              <Tooltip title={`${getAdminFullNameText()} • ${getAdminRoleText()}`}>
                <Chip
                  avatar={
                    <ProfileAvatar 
                      src={getAdminPictureUrl()} 
                      alt={getAdminFullNameText()}
                    >
                      {!getAdminPictureUrl() && getAdminInitialsText()}
                    </ProfileAvatar>
                  }
                  label={
                    <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                      <Typography 
                        variant="body2" 
                        fontWeight={600}
                        lineHeight={1.2}
                      >
                        {getAdminFullNameText()}
                      </Typography>
                      <Typography 
                        variant="caption" 
                        color={COLORS.gold}
                        lineHeight={1}
                      >
                        {getAdminRoleText()}
                      </Typography>
                    </Box>
                  }
                  onClick={(e) => setProfileAnchor(e.currentTarget)}
                  sx={{
                    backgroundColor: alpha(COLORS.white, 0.05),
                    color: COLORS.white,
                    fontWeight: 600,
                    cursor: 'pointer',
                    border: `1px solid ${alpha(COLORS.gold, 0.2)}`,
                    height: 'auto',
                    py: 1,
                    px: 1,
                    '&:hover': {
                      backgroundColor: alpha(COLORS.gold, 0.1),
                      borderColor: alpha(COLORS.gold, 0.4),
                      transform: 'translateY(-1px)',
                    },
                    transition: 'all 0.2s ease',
                    '& .MuiChip-label': {
                      px: 1,
                    }
                  }}
                />
              </Tooltip>
            ) : (
              <Chip
                avatar={<ProfileAvatar><Person /></ProfileAvatar>}
                label={
                  <Typography variant="body2" fontWeight={600}>
                    Not Logged In
                  </Typography>
                }
                onClick={() => navigate('/login')}
                sx={{
                  backgroundColor: alpha(COLORS.errorRed, 0.1),
                  color: COLORS.errorRed,
                  cursor: 'pointer',
                  border: `1px solid ${alpha(COLORS.errorRed, 0.2)}`,
                  '&:hover': {
                    backgroundColor: alpha(COLORS.errorRed, 0.2),
                  }
                }}
              />
            )}
          </Box>
        </Toolbar>
      </StyledAppBar>

      {/* NOTIFICATIONS MENU */}
      <Menu 
        anchorEl={notifAnchor} 
        open={!!notifAnchor} 
        onClose={() => setNotifAnchor(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            backgroundColor: COLORS.noir,
            color: COLORS.white,
            border: `1px solid ${alpha(COLORS.gold, 0.2)}`,
            minWidth: 320,
            maxHeight: 400,
            mt: 1,
            '& .MuiList-padding': {
              p: 0,
            }
          }
        }}
      >
        <Box sx={{ p: 2, borderBottom: `1px solid ${alpha(COLORS.white, 0.1)}` }}>
          <Typography fontWeight={700} fontSize="0.95rem">
            Notifications ({notifications.length})
          </Typography>
        </Box>
        {notifications.map((n) => (
          <MenuItem 
            key={n.id}
            onClick={() => setNotifAnchor(null)}
            sx={{
              px: 2,
              py: 1.5,
              borderBottom: `1px solid ${alpha(COLORS.white, 0.05)}`,
              '&:hover': {
                backgroundColor: alpha(COLORS.gold, 0.1),
              },
              ...(!n.read && {
                backgroundColor: alpha(COLORS.gold, 0.05),
              })
            }}
          >
            <Box sx={{ width: '100%' }}>
              <Typography fontSize="0.9rem">{n.text}</Typography>
              <Typography 
                variant="caption" 
                color={alpha(COLORS.white, 0.5)}
                sx={{ display: 'block', mt: 0.5 }}
              >
                {n.time}
              </Typography>
            </Box>
          </MenuItem>
        ))}
      </Menu>

      {/* MESSAGES MENU */}
      <Menu 
        anchorEl={mailAnchor} 
        open={!!mailAnchor} 
        onClose={() => setMailAnchor(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            backgroundColor: COLORS.noir,
            color: COLORS.white,
            border: `1px solid ${alpha(COLORS.gold, 0.2)}`,
            minWidth: 320,
            maxHeight: 400,
            mt: 1,
            '& .MuiList-padding': {
              p: 0,
            }
          }
        }}
      >
        <Box sx={{ p: 2, borderBottom: `1px solid ${alpha(COLORS.white, 0.1)}` }}>
          <Typography fontWeight={700} fontSize="0.95rem">
            Messages ({mails.length})
          </Typography>
        </Box>
        {mails.map((m) => (
          <MenuItem 
            key={m.id}
            onClick={() => setMailAnchor(null)}
            sx={{
              px: 2,
              py: 1.5,
              borderBottom: `1px solid ${alpha(COLORS.white, 0.05)}`,
              '&:hover': {
                backgroundColor: alpha(COLORS.gold, 0.1),
              },
              ...(m.unread && {
                backgroundColor: alpha(COLORS.gold, 0.05),
              })
            }}
          >
            <Box sx={{ width: '100%' }}>
              <Typography fontSize="0.9rem">{m.text}</Typography>
              <Typography 
                variant="caption" 
                color={alpha(COLORS.white, 0.5)}
                sx={{ display: 'block', mt: 0.5 }}
              >
                {m.time}
              </Typography>
            </Box>
          </MenuItem>
        ))}
      </Menu>

      {/* PROFILE MENU */}
      <Menu 
        anchorEl={profileAnchor} 
        open={!!profileAnchor} 
        onClose={() => setProfileAnchor(null)}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            backgroundColor: COLORS.noir,
            color: COLORS.white,
            border: `1px solid ${alpha(COLORS.gold, 0.2)}`,
            minWidth: 280,
            mt: 1,
          }
        }}
      >
        {admin && (
          <>
            <Box px={2} py={1.5}>
              <Box display="flex" alignItems="center" gap={2}>
                <ProfileAvatar 
                  src={getAdminPictureUrl()} 
                  alt={getAdminFullNameText()}
                  sx={{ width: 48, height: 48, fontSize: '1.1rem' }}
                >
                  {!getAdminPictureUrl() && getAdminInitialsText()}
                </ProfileAvatar>
                <Box>
                  <Typography fontWeight={700} fontSize="0.95rem">
                    {getAdminFullNameText()}
                  </Typography>
                  <Typography 
                    variant="caption" 
                    color={COLORS.gold}
                    sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                  >
                    <Box 
                      sx={{ 
                        width: 6, 
                        height: 6, 
                        borderRadius: '50%', 
                        backgroundColor: COLORS.gold 
                      }} 
                    />
                    {getAdminRoleText()}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Divider sx={{ borderColor: alpha(COLORS.white, 0.1), my: 0.5 }} />
          </>
        )}
        
        <MenuItem 
          onClick={() => {
            goTo('/Admin-Panel/Profile');
            setProfileAnchor(null);
          }}
          sx={{
            py: 1.5,
            '&:hover': {
              backgroundColor: alpha(COLORS.gold, 0.1),
            }
          }}
        >
          <ListItemIcon sx={{ color: COLORS.gold, minWidth: 40 }}>
            <Person fontSize="small" />
          </ListItemIcon>
          <ListItemText 
            primary="My Profile" 
            primaryTypographyProps={{ fontSize: '0.9rem' }}
          />
        </MenuItem>
        
        <MenuItem 
          onClick={() => {
            goTo('/Admin-Panel/Settings');
            setProfileAnchor(null);
          }}
          sx={{
            py: 1.5,
            '&:hover': {
              backgroundColor: alpha(COLORS.gold, 0.1),
            }
          }}
        >
          <ListItemIcon sx={{ color: COLORS.gold, minWidth: 40 }}>
            <Settings fontSize="small" />
          </ListItemIcon>
          <ListItemText 
            primary="Settings" 
            primaryTypographyProps={{ fontSize: '0.9rem' }}
          />
        </MenuItem>
        
        <Divider sx={{ borderColor: alpha(COLORS.white, 0.1) }} />
        
        <MenuItem 
          onClick={handleLogout}
          sx={{
            py: 1.5,
            '&:hover': {
              backgroundColor: alpha(COLORS.errorRed, 0.1),
            }
          }}
        >
          <ListItemIcon sx={{ color: COLORS.errorRed, minWidth: 40 }}>
            <Logout fontSize="small" />
          </ListItemIcon>
          <ListItemText 
            primary="Logout" 
            primaryTypographyProps={{ 
              fontSize: '0.9rem',
              color: COLORS.errorRed,
              fontWeight: 600
            }}
          />
        </MenuItem>
      </Menu>

      {/* SIDEBAR DRAWER */}
      <SidebarDrawer
        variant={isMobile ? 'temporary' : 'persistent'}
        open={sidebarOpen}
        onClose={onSidebarToggle}
        ModalProps={{
          keepMounted: true, // Better mobile performance
        }}
      >
        {drawerContent}
      </SidebarDrawer>
    </>
  );
};

export default AdminBar;