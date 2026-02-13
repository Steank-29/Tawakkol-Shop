import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Button,
  TextField,
  InputAdornment,
  Chip,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Card,
  CardContent,
  Grid,
  Avatar,
  Divider,
  Tooltip,
  LinearProgress,
  Alert,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  ListItemText,
  Checkbox,
  Zoom,
  Badge,
  alpha,
  AvatarGroup,
  Stack
} from '@mui/material';
import {
  Search,
  Refresh,
  FilterList,
  Visibility,
  Close,
  CheckCircle,
  Cancel,
  Email,
  Phone,
  Person,
  AttachMoney,
  CalendarToday,
  AccessTime,
  ArrowUpward,
  ArrowDownward,
  MoreVert,
  Delete,
  Warning,
  Info,
  Download,
  AttachFile,
  Flag,
  PriorityHigh,
  LowPriority,
  Message,
  Markunread,
  Drafts,
  Schedule,
  CheckCircleOutline,
  ErrorOutline,
  Send,
  Reply,
  Archive,
  Star,
  StarBorder
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import frLocale from 'date-fns/locale/fr';
import { format, formatDistance } from 'date-fns';
import { fr } from 'date-fns/locale';
import API_BASE from '../Config/api';

// ============ PREMIUM COLOR PALETTE - WHITE BACKGROUND + BLACK CARDS ============
const premiumColors = {
  gold: '#d4af37',
  goldLight: '#f4e4a6',
  goldDark: '#b8941f',
  goldGradient: 'linear-gradient(135deg, #d4af37 0%, #f9d423 50%, #d4af37 100%)',
  
  noir: '#000000',
  charcoal: '#0a0a0a',
  surface: '#121212',
  surfaceLight: '#1e1e1e',
  
  white: '#ffffff',
  textPrimary: '#ffffff',
  textSecondary: '#e0e0e0',
  textMuted: '#9e9e9e',
  
  // Importance Colors
  low: '#10b981',
  medium: '#f59e0b',
  high: '#ef4444',
  urgent: '#8b5cf6',
  
  lowBg: 'rgba(16, 185, 129, 0.15)',
  mediumBg: 'rgba(245, 158, 11, 0.15)',
  highBg: 'rgba(239, 68, 68, 0.15)',
  urgentBg: 'rgba(139, 92, 246, 0.15)',
  
  // Status Colors
  pending: '#f59e0b',
  resolved: '#10b981',
  pendingBg: 'rgba(245, 158, 11, 0.15)',
  resolvedBg: 'rgba(16, 185, 129, 0.15)',
  
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
  
  shadowSm: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  shadowMd: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  shadowLg: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  shadowXl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  shadowGold: '0 10px 30px -5px rgba(212, 175, 55, 0.2)'
};

// ============ IMPORTANCE CONFIGURATION ============
const importanceConfig = {
  low: {
    label: 'Basse',
    color: premiumColors.low,
    bgColor: premiumColors.lowBg,
    icon: <LowPriority />,
    iconColor: premiumColors.low,
    priority: 1
  },
  medium: {
    label: 'Moyenne',
    color: premiumColors.medium,
    bgColor: premiumColors.mediumBg,
    icon: <Flag />,
    iconColor: premiumColors.medium,
    priority: 2
  },
  high: {
    label: 'Haute',
    color: premiumColors.high,
    bgColor: premiumColors.highBg,
    icon: <PriorityHigh />,
    iconColor: premiumColors.high,
    priority: 3
  },
  urgent: {
    label: 'Urgente',
    color: premiumColors.urgent,
    bgColor: premiumColors.urgentBg,
    icon: <Warning />,
    iconColor: premiumColors.urgent,
    priority: 4
  }
};

// ============ STATUS CONFIGURATION ============
const statusConfig = {
  pending: {
    label: 'En attente',
    color: premiumColors.pending,
    bgColor: premiumColors.pendingBg,
    icon: <Schedule />,
    iconColor: premiumColors.pending
  },
  resolved: {
    label: 'Résolu',
    color: premiumColors.resolved,
    bgColor: premiumColors.resolvedBg,
    icon: <CheckCircleOutline />,
    iconColor: premiumColors.resolved
  }
};

// ============ STATISTICS CARD COMPONENT ============
const StatCard = ({ title, value, subtitle, icon, color, trend }) => {
  return (
    <Zoom in timeout={400}>
      <Card
        elevation={0}
        sx={{
          bgcolor: premiumColors.surface,
          border: `1px solid ${alpha(premiumColors.gold, 0.15)}`,
          borderRadius: 3,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, ${color}, ${premiumColors.gold})`,
            opacity: 0.8
          },
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: premiumColors.shadowGold,
            borderColor: alpha(premiumColors.gold, 0.3),
            bgcolor: premiumColors.charcoal
          }
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
              <Typography
                sx={{
                  color: premiumColors.textMuted,
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  mb: 1
                }}
              >
                {title}
              </Typography>
              <Typography
                variant="h4"
                sx={{
                  color: premiumColors.white,
                  fontFamily: "'Fjalla One', sans-serif",
                  fontWeight: 700,
                  fontSize: '2rem',
                  lineHeight: 1.2,
                  mb: 0.5
                }}
              >
                {value}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography
                  sx={{
                    color: premiumColors.textMuted,
                    fontSize: '0.75rem'
                  }}
                >
                  {subtitle}
                </Typography>
              </Box>
            </Box>
            <Avatar
              sx={{
                bgcolor: alpha(color, 0.15),
                color: color,
                width: 56,
                height: 56,
                borderRadius: 2,
                '& svg': {
                  fontSize: '2rem'
                }
              }}
            >
              {icon}
            </Avatar>
          </Box>
        </CardContent>
      </Card>
    </Zoom>
  );
};

// ============ MESSAGE CARD COMPONENT ============
const MessageCard = ({ contact, onView, onStatusUpdate, onDelete }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const importance = importanceConfig[contact.importance] || importanceConfig.medium;
  const status = statusConfig[contact.status] || statusConfig.pending;
  const userRole = localStorage.getItem('userRole');

  const handleMenuOpen = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => setAnchorEl(null);
  
  const handleStatusChange = (newStatus) => {
    onStatusUpdate(contact._id, newStatus);
    handleMenuClose();
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete(contact);
  };

  return (
    <Zoom in timeout={400}>
      <Paper
        elevation={0}
        onClick={() => onView(contact)}
        sx={{
          p: 2.5,
          mb: 2,
          bgcolor: premiumColors.surface,
          border: `1px solid ${alpha(premiumColors.gold, 0.15)}`,
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden',
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          opacity: contact.status === 'resolved' ? 0.8 : 1,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '6px',
            height: '100%',
            background: `linear-gradient(180deg, ${importance.color}, ${premiumColors.gold})`,
            opacity: 0.8
          },
          '&:hover': {
            transform: 'translateY(-4px) scale(1.01)',
            boxShadow: premiumColors.shadowGold,
            borderColor: alpha(premiumColors.gold, 0.3),
            bgcolor: premiumColors.charcoal,
            opacity: 1,
            '& .message-subject': {
              color: premiumColors.gold
            }
          }
        }}
      >
        <Grid container spacing={2} alignItems="center">
          {/* Contact Info */}
          <Grid item xs={12} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Badge
                overlap="circular"
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  <Tooltip title={status.label}>
                    <Avatar
                      sx={{
                        bgcolor: status.color,
                        width: 16,
                        height: 16,
                        border: `2px solid ${premiumColors.surface}`
                      }}
                    >
                      {status.icon}
                    </Avatar>
                  </Tooltip>
                }
              >
                <Avatar
                  sx={{
                    bgcolor: alpha(importance.color, 0.1),
                    color: importance.color,
                    width: 52,
                    height: 52,
                    borderRadius: 2,
                    fontSize: '1.3rem',
                    fontWeight: 700
                  }}
                >
                  {contact.fullName.charAt(0)}
                </Avatar>
              </Badge>
              <Box>
                <Typography
                  className="message-subject"
                  sx={{
                    color: premiumColors.white,
                    fontFamily: "'Fjalla One', sans-serif",
                    fontSize: '1rem',
                    fontWeight: 700,
                    transition: 'color 0.3s ease',
                    mb: 0.5,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5
                  }}
                >
                  {contact.fullName}
                </Typography>
                <Typography
                  sx={{
                    color: premiumColors.textMuted,
                    fontSize: '0.7rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5
                  }}
                >
                  <Email sx={{ fontSize: '0.7rem' }} />
                  {contact.email.length > 20 
                    ? `${contact.email.substring(0, 20)}...` 
                    : contact.email}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Issue Preview */}
          <Grid item xs={12} md={4}>
            <Box sx={{ pl: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Chip
                  icon={importance.icon}
                  label={importance.label}
                  size="small"
                  sx={{
                    bgcolor: importance.bgColor,
                    color: importance.color,
                    border: `1px solid ${alpha(importance.color, 0.3)}`,
                    fontSize: '0.65rem',
                    height: 22,
                    '& .MuiChip-icon': { fontSize: '0.8rem' }
                  }}
                />
                {contact.fileUrl && (
                  <Tooltip title="Pièce jointe">
                    <AttachFile sx={{ fontSize: '0.8rem', color: premiumColors.textMuted }} />
                  </Tooltip>
                )}
              </Box>
              <Typography
                sx={{
                  color: contact.status === 'resolved' ? premiumColors.textMuted : premiumColors.white,
                  fontSize: '0.85rem',
                  fontWeight: contact.status === 'pending' ? 600 : 400,
                  display: '-webkit-box',
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textDecoration: contact.status === 'resolved' ? 'line-through' : 'none'
                }}
              >
                {contact.issue}
              </Typography>
            </Box>
          </Grid>

          {/* Date & Time */}
          <Grid item xs={12} md={2.5}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                sx={{
                  color: premiumColors.gold,
                  fontFamily: "'Fjalla One', sans-serif",
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 0.5,
                  mb: 0.5
                }}
              >
                <CalendarToday sx={{ fontSize: '0.8rem' }} />
                {format(new Date(contact.createdAt), 'dd/MM/yyyy')}
              </Typography>
              <Typography
                sx={{
                  color: premiumColors.textMuted,
                  fontSize: '0.7rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 0.5
                }}
              >
                <AccessTime sx={{ fontSize: '0.7rem' }} />
                {formatDistance(new Date(contact.createdAt), new Date(), { addSuffix: true, locale: fr })}
              </Typography>
            </Box>
          </Grid>

          {/* Actions */}
          <Grid item xs={12} md={2.5}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1.5 }}>
              {/* Status Chip */}
              <Chip
                icon={status.icon}
                label={status.label}
                size="small"
                sx={{
                  bgcolor: status.bgColor,
                  color: status.color,
                  border: `1px solid ${alpha(status.color, 0.3)}`,
                  fontWeight: 700,
                  fontSize: '0.7rem',
                  height: 28
                }}
              />

              {/* View Button */}
              <Tooltip title="Voir les détails" arrow>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    onView(contact);
                  }}
                  sx={{
                    color: premiumColors.textSecondary,
                    bgcolor: alpha(premiumColors.gold, 0.08),
                    width: 36,
                    height: 36,
                    borderRadius: 2,
                    '&:hover': {
                      bgcolor: alpha(premiumColors.gold, 0.2),
                      color: premiumColors.gold
                    }
                  }}
                >
                  <Visibility fontSize="small" />
                </IconButton>
              </Tooltip>

              {/* Status Update Menu */}
              {contact.status === 'pending' && (
                <>
                  <Button
                    variant="contained"
                    onClick={handleMenuOpen}
                    size="small"
                    sx={{
                      bgcolor: alpha(premiumColors.gold, 0.9),
                      color: premiumColors.noir,
                      px: 2,
                      py: 0.5,
                      fontSize: '0.7rem',
                      fontWeight: 800,
                      textTransform: 'none',
                      borderRadius: 2,
                      '&:hover': {
                        bgcolor: premiumColors.gold
                      }
                    }}
                  >
                    Traiter
                  </Button>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    onClick={(e) => e.stopPropagation()}
                    PaperProps={{
                      sx: {
                        bgcolor: premiumColors.surface,
                        border: `1px solid ${alpha(premiumColors.gold, 0.2)}`,
                        borderRadius: 2,
                        mt: 1,
                        minWidth: 200
                      }
                    }}
                  >
                    <MenuItem
                      onClick={() => handleStatusChange('resolved')}
                      sx={{
                        color: premiumColors.white,
                        gap: 1,
                        '&:hover': { bgcolor: premiumColors.resolvedBg }
                      }}
                    >
                      <CheckCircleOutline sx={{ color: premiumColors.resolved }} />
                      <Box>
                        <Typography sx={{ fontSize: '0.85rem', fontWeight: 600 }}>
                          Marquer comme résolu
                        </Typography>
                        <Typography sx={{ fontSize: '0.65rem', color: premiumColors.textMuted }}>
                          Ce message sera archivé
                        </Typography>
                      </Box>
                    </MenuItem>
                  </Menu>
                </>
              )}

              {/* Delete Button - Super Admin only */}
              {userRole === 'super-admin' && (
                <Tooltip title="Supprimer" arrow>
                  <IconButton
                    onClick={handleDeleteClick}
                    sx={{
                      color: alpha(premiumColors.cancelled, 0.7),
                      bgcolor: alpha(premiumColors.cancelled, 0.08),
                      width: 36,
                      height: 36,
                      borderRadius: 2,
                      '&:hover': {
                        bgcolor: alpha(premiumColors.cancelled, 0.15),
                        color: premiumColors.cancelled
                      }
                    }}
                  >
                    <Delete fontSize="small" />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Zoom>
  );
};

// ============ MESSAGE DETAILS MODAL ============
const MessageDetailsModal = ({ open, onClose, contact, onStatusUpdate, onDelete }) => {
  const [statusAnchorEl, setStatusAnchorEl] = useState(null);
  const userRole = localStorage.getItem('userRole');
  
  if (!contact) return null;

  const importance = importanceConfig[contact.importance] || importanceConfig.medium;
  const status = statusConfig[contact.status] || statusConfig.pending;

  const handleStatusMenuOpen = (event) => {
    event.stopPropagation();
    setStatusAnchorEl(event.currentTarget);
  };
  
  const handleStatusMenuClose = () => setStatusAnchorEl(null);
  
  const handleStatusChange = (newStatus) => {
    onStatusUpdate(contact._id, newStatus);
    handleStatusMenuClose();
  };

  const handleDeleteClick = () => {
    onDelete(contact);
  };

  const handleDownloadFile = () => {
    if (contact.fileUrl) {
      window.open(`${API_BASE}${contact.fileUrl}`, '_blank');
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: premiumColors.surface,
          border: `1px solid ${alpha(premiumColors.gold, 0.2)}`,
          borderRadius: 3,
          boxShadow: premiumColors.shadowXl
        }
      }}
    >
      {/* Header */}
      <DialogTitle sx={{ 
        borderBottom: `1px solid ${alpha(premiumColors.gold, 0.15)}`,
        p: 3
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Avatar
              sx={{
                bgcolor: alpha(importance.color, 0.1),
                color: importance.color,
                width: 56,
                height: 56,
                borderRadius: 2,
                fontSize: '1.5rem',
                fontWeight: 700
              }}
            >
              {contact.fullName.charAt(0)}
            </Avatar>
            <Box>
              <Typography
                variant="h5"
                sx={{
                  color: premiumColors.white,
                  fontFamily: "'Fjalla One', sans-serif",
                  fontWeight: 700,
                  mb: 0.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                {contact.fullName}
                <Chip
                  icon={importance.icon}
                  label={importance.label}
                  size="small"
                  sx={{
                    bgcolor: importance.bgColor,
                    color: importance.color,
                    border: `1px solid ${alpha(importance.color, 0.3)}`,
                    height: 24,
                    '& .MuiChip-icon': { fontSize: '0.8rem' }
                  }}
                />
              </Typography>
              <Box sx={{ display: 'flex', gap: 3 }}>
                <Typography
                  sx={{
                    color: premiumColors.textMuted,
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5
                  }}
                >
                  <CalendarToday sx={{ fontSize: '0.8rem' }} />
                  {format(new Date(contact.createdAt), 'dd MMMM yyyy', { locale: fr })}
                </Typography>
                <Typography
                  sx={{
                    color: premiumColors.textMuted,
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5
                  }}
                >
                  <AccessTime sx={{ fontSize: '0.8rem' }} />
                  {format(new Date(contact.createdAt), 'HH:mm', { locale: fr })}
                </Typography>
              </Box>
            </Box>
          </Box>
          <IconButton
            onClick={onClose}
            sx={{
              color: premiumColors.textMuted,
              bgcolor: alpha(premiumColors.gold, 0.05),
              width: 40,
              height: 40,
              '&:hover': {
                bgcolor: alpha(premiumColors.gold, 0.15),
                color: premiumColors.gold
              }
            }}
          >
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Contact Information */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                bgcolor: alpha(premiumColors.surfaceLight, 0.5),
                border: `1px solid ${alpha(premiumColors.gold, 0.1)}`,
                borderRadius: 2,
                height: '100%'
              }}
            >
              <Typography
                sx={{
                  color: premiumColors.gold,
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <Person sx={{ fontSize: '1rem' }} />
                INFORMATIONS DE CONTACT
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: alpha(premiumColors.info, 0.1),
                      color: premiumColors.info,
                      width: 40,
                      height: 40,
                      borderRadius: 1.5
                    }}
                  >
                    <Email sx={{ fontSize: '1.1rem' }} />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ color: premiumColors.textMuted, fontSize: '0.7rem', mb: 0.25 }}>
                      Email
                    </Typography>
                    <Typography 
                      sx={{ 
                        color: premiumColors.white, 
                        fontSize: '0.95rem',
                        fontWeight: 500,
                        wordBreak: 'break-all'
                      }}
                    >
                      {contact.email}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: alpha(premiumColors.success, 0.1),
                      color: premiumColors.success,
                      width: 40,
                      height: 40,
                      borderRadius: 1.5
                    }}
                  >
                    <Phone sx={{ fontSize: '1.1rem' }} />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ color: premiumColors.textMuted, fontSize: '0.7rem', mb: 0.25 }}>
                      Téléphone
                    </Typography>
                    <Typography sx={{ color: premiumColors.white, fontSize: '0.95rem', fontWeight: 500 }}>
                      {contact.phone}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Status & File */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                bgcolor: alpha(premiumColors.surfaceLight, 0.5),
                border: `1px solid ${alpha(premiumColors.gold, 0.1)}`,
                borderRadius: 2,
                height: '100%'
              }}
            >
              <Typography
                sx={{
                  color: premiumColors.gold,
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <Info sx={{ fontSize: '1rem' }} />
                STATUT & PIÈCES JOINTES
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: alpha(status.color, 0.1),
                      color: status.color,
                      width: 40,
                      height: 40,
                      borderRadius: 1.5
                    }}
                  >
                    {status.icon}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ color: premiumColors.textMuted, fontSize: '0.7rem', mb: 0.25 }}>
                      Statut actuel
                    </Typography>
                    <Chip
                      icon={status.icon}
                      label={status.label}
                      sx={{
                        bgcolor: status.bgColor,
                        color: status.color,
                        border: `1px solid ${alpha(status.color, 0.3)}`,
                        fontWeight: 700,
                        height: 32
                      }}
                    />
                  </Box>
                </Box>

                {contact.fileUrl && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      sx={{
                        bgcolor: alpha(premiumColors.gold, 0.1),
                        color: premiumColors.gold,
                        width: 40,
                        height: 40,
                        borderRadius: 1.5
                      }}
                    >
                      <AttachFile sx={{ fontSize: '1.1rem' }} />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ color: premiumColors.textMuted, fontSize: '0.7rem', mb: 0.25 }}>
                        Pièce jointe
                      </Typography>
                      <Button
                        onClick={handleDownloadFile}
                        startIcon={<Download />}
                        sx={{
                          color: premiumColors.gold,
                          fontSize: '0.85rem',
                          textTransform: 'none',
                          p: 0,
                          '&:hover': {
                            bgcolor: 'transparent',
                            textDecoration: 'underline'
                          }
                        }}
                      >
                        {contact.fileName || 'Télécharger le fichier'}
                      </Button>
                    </Box>
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>

          {/* Message Content */}
          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                bgcolor: alpha(premiumColors.surfaceLight, 0.5),
                border: `1px solid ${alpha(premiumColors.gold, 0.1)}`,
                borderRadius: 2
              }}
            >
              <Typography
                sx={{
                  color: premiumColors.gold,
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '1px',
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <Message sx={{ fontSize: '1rem' }} />
                DESCRIPTION DU PROBLÈME
              </Typography>

              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  bgcolor: alpha(premiumColors.noir, 0.5),
                  borderRadius: 2,
                  border: `1px solid ${alpha(premiumColors.gold, 0.1)}`
                }}
              >
                <Typography
                  sx={{
                    color: premiumColors.textSecondary,
                    fontSize: '0.95rem',
                    lineHeight: 1.6,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word'
                  }}
                >
                  {contact.issue}
                </Typography>
              </Paper>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>

      {/* Footer Actions */}
      <DialogActions sx={{ 
        borderTop: `1px solid ${alpha(premiumColors.gold, 0.15)}`,
        p: 3,
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <Box>
          {userRole === 'super-admin' && (
            <Button
              variant="outlined"
              onClick={handleDeleteClick}
              startIcon={<Delete />}
              sx={{
                color: premiumColors.cancelled,
                borderColor: alpha(premiumColors.cancelled, 0.3),
                borderWidth: 1.5,
                px: 3,
                py: 1,
                fontSize: '0.85rem',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: 2,
                '&:hover': {
                  borderColor: premiumColors.cancelled,
                  bgcolor: alpha(premiumColors.cancelled, 0.1)
                }
              }}
            >
              Supprimer
            </Button>
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          {contact.status === 'pending' && (
            <Button
              variant="contained"
              onClick={() => handleStatusChange('resolved')}
              startIcon={<CheckCircleOutline />}
              sx={{
                bgcolor: premiumColors.resolved,
                color: premiumColors.white,
                px: 3,
                py: 1,
                fontSize: '0.85rem',
                fontWeight: 600,
                textTransform: 'none',
                borderRadius: 2,
                '&:hover': {
                  bgcolor: '#0d9488'
                }
              }}
            >
              Marquer comme résolu
            </Button>
          )}
          <Button
            variant="contained"
            onClick={onClose}
            sx={{
              bgcolor: premiumColors.gold,
              color: premiumColors.noir,
              px: 4,
              py: 1,
              fontSize: '0.9rem',
              fontWeight: 700,
              textTransform: 'none',
              borderRadius: 2,
              '&:hover': {
                bgcolor: premiumColors.goldDark
              }
            }}
          >
            Fermer
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

// ============ DELETE CONFIRMATION DIALOG ============
const DeleteConfirmDialog = ({ open, onClose, onConfirm, contact }) => {
  if (!contact) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: premiumColors.surface,
          border: `1px solid ${alpha(premiumColors.gold, 0.2)}`,
          borderRadius: 3,
          boxShadow: premiumColors.shadowXl
        }
      }}
    >
      <DialogTitle sx={{ p: 3, pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            sx={{
              bgcolor: alpha(premiumColors.cancelled, 0.15),
              color: premiumColors.cancelled,
              width: 56,
              height: 56,
              borderRadius: 2
            }}
          >
            <Warning sx={{ fontSize: '2rem' }} />
          </Avatar>
          <Box>
            <Typography
              variant="h5"
              sx={{
                color: premiumColors.white,
                fontFamily: "'Fjalla One', sans-serif",
                fontWeight: 700,
                mb: 0.5
              }}
            >
              Confirmer la suppression
            </Typography>
            <Typography
              sx={{
                color: premiumColors.textMuted,
                fontSize: '0.9rem'
              }}
            >
              Cette action est irréversible
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Paper
          elevation={0}
          sx={{
            p: 2.5,
            bgcolor: alpha(premiumColors.cancelled, 0.05),
            border: `1px solid ${alpha(premiumColors.cancelled, 0.2)}`,
            borderRadius: 2,
            mb: 2
          }}
        >
          <Typography
            sx={{
              color: premiumColors.white,
              fontSize: '0.95rem',
              mb: 2,
              fontWeight: 500
            }}
          >
            Êtes-vous sûr de vouloir supprimer ce message ?
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                bgcolor: alpha(importanceConfig[contact.importance]?.color || premiumColors.gold, 0.1),
                color: importanceConfig[contact.importance]?.color || premiumColors.gold,
                width: 48,
                height: 48,
                borderRadius: 1.5
              }}
            >
              {contact.fullName?.charAt(0) || '?'}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography
                sx={{
                  color: premiumColors.white,
                  fontWeight: 700,
                  fontSize: '1rem'
                }}
              >
                {contact.fullName}
              </Typography>
              <Typography
                sx={{
                  color: premiumColors.textMuted,
                  fontSize: '0.8rem',
                  mt: 0.25,
                  display: '-webkit-box',
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden'
                }}
              >
                {contact.issue}
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Box
          sx={{
            p: 2,
            bgcolor: alpha(premiumColors.error, 0.05),
            borderRadius: 2,
            border: `1px solid ${alpha(premiumColors.error, 0.15)}`
          }}
        >
          <Typography
            sx={{
              color: premiumColors.error,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <Info sx={{ fontSize: '1rem' }} />
            Ce message sera définitivement supprimé de la base de données
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0, gap: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          onClick={onClose}
          sx={{
            color: premiumColors.textSecondary,
            borderColor: alpha(premiumColors.gold, 0.3),
            borderWidth: 1.5,
            py: 1.25,
            fontSize: '0.9rem',
            fontWeight: 600,
            textTransform: 'none',
            borderRadius: 2,
            '&:hover': {
              borderColor: premiumColors.gold,
              bgcolor: alpha(premiumColors.gold, 0.05),
              color: premiumColors.white
            }
          }}
        >
          Annuler
        </Button>
        <Button
          fullWidth
          variant="contained"
          onClick={() => {
            onConfirm(contact._id);
            onClose();
          }}
          sx={{
            bgcolor: premiumColors.cancelled,
            color: premiumColors.white,
            py: 1.25,
            fontSize: '0.9rem',
            fontWeight: 700,
            textTransform: 'none',
            borderRadius: 2,
            boxShadow: `0 8px 16px -4px ${alpha(premiumColors.cancelled, 0.3)}`,
            '&:hover': {
              bgcolor: '#dc2626',
              transform: 'translateY(-2px)',
              boxShadow: `0 12px 20px -8px ${alpha(premiumColors.cancelled, 0.4)}`
            },
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          Supprimer définitivement
        </Button>
      </DialogActions>
    </Dialog>
  );
};

// ============ MAIN MESSAGERIE COMPONENT ============
const Messagerie = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [importanceFilter, setImportanceFilter] = useState([]);
  const [statusFilter, setStatusFilter] = useState([]);
  const [dateFilter, setDateFilter] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    resolved: 0,
    urgent: 0,
    high: 0,
    medium: 0,
    low: 0,
    today: 0
  });

  // ============ API FUNCTIONS ============
  const fetchContacts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/api/contact`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success) {
        setContacts(data.data);
        applyFilters(data.data);
        calculateStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
      showSnackbar('Erreur lors du chargement des messages', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchContactById = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/api/contact/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setSelectedContact(data.data);
        setDetailsOpen(true);
      }
    } catch (error) {
      console.error('Error fetching contact:', error);
      showSnackbar('Erreur lors du chargement du message', 'error');
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/api/contact/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const updateContactStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/api/contact/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      const data = await response.json();
      
      if (data.success) {
        const updatedContacts = contacts.map(contact => 
          contact._id === id ? { ...contact, status: newStatus } : contact
        );
        setContacts(updatedContacts);
        applyFilters(updatedContacts);
        calculateStats(updatedContacts);
        
        if (selectedContact && selectedContact._id === id) {
          setSelectedContact({ ...selectedContact, status: newStatus });
        }
        
        showSnackbar('Statut mis à jour avec succès', 'success');
      }
    } catch (error) {
      console.error('Error updating contact status:', error);
      showSnackbar('Erreur lors de la mise à jour du statut', 'error');
    }
  };

  const deleteContact = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/api/contact/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        const updatedContacts = contacts.filter(contact => contact._id !== id);
        setContacts(updatedContacts);
        applyFilters(updatedContacts);
        calculateStats(updatedContacts);
        
        if (selectedContact && selectedContact._id === id) {
          setDetailsOpen(false);
          setSelectedContact(null);
        }
        
        showSnackbar('Message supprimé avec succès', 'success');
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
      showSnackbar('Erreur lors de la suppression du message', 'error');
    }
  };

  // ============ UTILITY FUNCTIONS ============
  const calculateStats = (contactsData) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const stats = {
      total: contactsData.length,
      pending: contactsData.filter(c => c.status === 'pending').length,
      resolved: contactsData.filter(c => c.status === 'resolved').length,
      urgent: contactsData.filter(c => c.importance === 'urgent').length,
      high: contactsData.filter(c => c.importance === 'high').length,
      medium: contactsData.filter(c => c.importance === 'medium').length,
      low: contactsData.filter(c => c.importance === 'low').length,
      today: contactsData.filter(c => new Date(c.createdAt) >= today).length
    };
    
    setStats(stats);
  };

  const applyFilters = (contactsData) => {
    let filtered = [...contactsData];

    if (searchTerm) {
      filtered = filtered.filter(contact => 
        contact.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.phone?.includes(searchTerm) ||
        contact.issue?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (importanceFilter.length > 0) {
      filtered = filtered.filter(contact => importanceFilter.includes(contact.importance));
    }

    if (statusFilter.length > 0) {
      filtered = filtered.filter(contact => statusFilter.includes(contact.status));
    }

    if (dateFilter) {
      const filterDate = new Date(dateFilter).setHours(0, 0, 0, 0);
      filtered = filtered.filter(contact => {
        const contactDate = new Date(contact.createdAt).setHours(0, 0, 0, 0);
        return contactDate === filterDate;
      });
    }

    filtered.sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];
      
      if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      }
      if (sortBy === 'importance') {
        valA = importanceConfig[a.importance]?.priority || 0;
        valB = importanceConfig[b.importance]?.priority || 0;
      }
      
      return sortOrder === 'asc' ? valA - valB : valB - valA;
    });

    setFilteredContacts(filtered);
  };

  const getImportanceCount = (importance) => {
    return contacts.filter(c => c.importance === importance).length;
  };

  const getStatusCount = (status) => {
    return contacts.filter(c => c.status === status).length;
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleViewContact = (contact) => {
    setSelectedContact(contact);
    setDetailsOpen(true);
  };

  const handleDeleteClick = (contact) => {
    setContactToDelete(contact);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = (id) => {
    deleteContact(id);
    setContactToDelete(null);
  };

  const handleImportanceFilterChange = (event) => {
    setImportanceFilter(event.target.value);
  };

  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleRefresh = () => {
    fetchContacts();
    fetchStats();
    showSnackbar('Données actualisées', 'success');
  };

  const exportToCSV = () => {
    const headers = ['Nom', 'Email', 'Téléphone', 'Importance', 'Message', 'Statut', 'Date'];
    const data = filteredContacts.map(contact => [
      contact.fullName,
      contact.email,
      contact.phone,
      importanceConfig[contact.importance]?.label || contact.importance,
      contact.issue.replace(/,/g, ';'),
      statusConfig[contact.status]?.label || contact.status,
      format(new Date(contact.createdAt), 'dd/MM/yyyy HH:mm')
    ]);
    
    const csv = [headers, ...data].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `messages_${format(new Date(), 'yyyyMMdd_HHmm')}.csv`;
    a.click();
    
    showSnackbar('Export CSV réussi', 'success');
  };

  useEffect(() => {
    fetchContacts();
    fetchStats();
  }, []);

  useEffect(() => {
    applyFilters(contacts);
  }, [searchTerm, importanceFilter, statusFilter, dateFilter, sortBy, sortOrder]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={frLocale}>
      {/* WHITE BACKGROUND */}
      <Box sx={{ 
        width: '90%',
        minHeight: '100vh',
        bgcolor: '#ffffff',
        py: { xs: 2, lg: 5 },
        ml:12
      }}>
        {/* CENTERED CONTAINER */}
        <Box sx={{
          maxWidth: '1600px',
          width: '95%',
          mx: 'auto'
        }}>
          {/* Header Section */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 4
          }}>
            <Box>
              <Typography
                variant="h3"
                sx={{
                  color: premiumColors.goldDark,
                  fontFamily: "'Fjalla One', sans-serif",
                  fontWeight: 800,
                  fontSize: { xs: '2rem', lg: '2.5rem' },
                  letterSpacing: '1px',
                  mb: 1
                }}
              >
                Messagerie
              </Typography>
              <Typography
                sx={{
                  color: '#666666',
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5
                }}
              >
                <Message sx={{ fontSize: '1.1rem', color: premiumColors.goldDark }} />
                {filteredContacts.length} message{filteredContacts.length > 1 ? 's' : ''} affiché{filteredContacts.length > 1 ? 's' : ''}
                {filteredContacts.length !== contacts.length && ` (sur ${contacts.length} total)`}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Tooltip title="Exporter CSV" arrow>
                <IconButton
                  onClick={exportToCSV}
                  sx={{
                    color: premiumColors.noir,
                    bgcolor: alpha(premiumColors.gold, 1),
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    '&:hover': {
                      bgcolor: alpha(premiumColors.gold, 0.2)
                    }
                  }}
                >
                  <Download />
                </IconButton>
              </Tooltip>
              <Tooltip title="Actualiser" arrow>
                <IconButton
                  onClick={handleRefresh}
                  sx={{
                    color: premiumColors.noir,
                    bgcolor: alpha(premiumColors.gold, 1),
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    '&:hover': {
                      bgcolor: alpha(premiumColors.gold, 0.2),
                      transform: 'rotate(180deg)'
                    },
                    transition: 'all 0.4s ease'
                  }}
                >
                  <Refresh />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Statistics Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Messages"
                value={stats.total}
                subtitle={`+${stats.today} aujourd'hui`}
                icon={<Message />}
                color={premiumColors.gold}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="En attente"
                value={stats.pending}
                subtitle={`${((stats.pending / stats.total) * 100 || 0).toFixed(1)}% du total`}
                icon={<Schedule />}
                color={premiumColors.pending}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Résolus"
                value={stats.resolved}
                subtitle={`${((stats.resolved / stats.total) * 100 || 0).toFixed(1)}% du total`}
                icon={<CheckCircleOutline />}
                color={premiumColors.resolved}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Urgents"
                value={stats.urgent}
                subtitle={`${stats.high + stats.medium} autres priorités`}
                icon={<Warning />}
                color={premiumColors.urgent}
              />
            </Grid>
          </Grid>

          {/* Filters Section */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 4,
              bgcolor:  '#f4f4f4',
              border: '1px solid #e0e0e0',
              borderRadius: 10
            }}
          >
            <Grid container spacing={2} alignItems="center">
              {/* Search */}
              <Grid item xs={12} md={3.5}>
                <TextField
                  fullWidth
                  placeholder="Rechercher par nom, email, téléphone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ color: premiumColors.goldDark }} />
                      </InputAdornment>
                    ),
                    endAdornment: searchTerm && (
                      <InputAdornment position="end">
                        <IconButton
                          size="small"
                          onClick={() => setSearchTerm('')}
                          sx={{ color: premiumColors.goldDark }}
                        >
                          <Close />
                        </IconButton>
                      </InputAdornment>
                    ),
                    sx: {
                      color: '#333333',
                      bgcolor: '#ffffff',
                      borderRadius: 2,
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#e0e0e0'
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: premiumColors.gold
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: premiumColors.gold,
                        borderWidth: 1.5
                      }
                    }
                  }}
                />
              </Grid>

{/* Importance Filter */}
<Grid item xs={12} md={2.5}>
  <FormControl fullWidth size="small">
    <InputLabel 
      sx={{ 
        color: '#666666',
        bgcolor: '#ffffff',
        px: 1,
        '&.Mui-focused': { 
          color: premiumColors.goldDark 
        }
      }}
    >
    </InputLabel>
    <Select
      multiple
      value={importanceFilter}
      onChange={handleImportanceFilterChange}
      displayEmpty
      renderValue={(selected) => {
        if (selected.length === 0) {
          return (
            <Typography sx={{ color: '#666666', fontSize: '0.9rem' }}>
              Toutes les priorités
            </Typography>
          );
        }
        return (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected.map((value) => (
              <Chip
                key={value}
                label={importanceConfig[value]?.label}
                size="small"
                sx={{
                  bgcolor: importanceConfig[value]?.bgColor,
                  color: importanceConfig[value]?.color,
                  fontSize: '0.7rem',
                  height: 24,
                  '& .MuiChip-label': { px: 1 }
                }}
              />
            ))}
          </Box>
        );
      }}
      sx={{
        color: '#333333',
        bgcolor: '#ffffff',
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: '#e0e0e0'
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: premiumColors.gold
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: premiumColors.gold,
          borderWidth: 1.5
        }
      }}
      MenuProps={{
        PaperProps: {
          sx: {
            bgcolor: premiumColors.surface,
            border: `1px solid ${alpha(premiumColors.gold, 0.2)}`,
            borderRadius: 2,
            mt: 1,
            maxHeight: 400,
            boxShadow: premiumColors.shadowLg
          }
        }
      }}
    >
      {Object.keys(importanceConfig).map((importance) => (
        <MenuItem 
          key={importance} 
          value={importance}
          sx={{
            color: premiumColors.white,
            '&:hover': {
              bgcolor: importanceConfig[importance]?.bgColor
            },
            '&.Mui-selected': {
              bgcolor: alpha(importanceConfig[importance]?.color, 0.2),
              '&:hover': {
                bgcolor: alpha(importanceConfig[importance]?.color, 0.3)
              }
            }
          }}
        >
          <Checkbox 
            checked={importanceFilter.indexOf(importance) > -1} 
            size="small"
            sx={{
              color: importanceConfig[importance]?.color,
              '&.Mui-checked': {
                color: importanceConfig[importance]?.color
              }
            }}
          />
          <ListItemText 
            primary={importanceConfig[importance].label}
            secondary={`${getImportanceCount(importance)} message${getImportanceCount(importance) > 1 ? 's' : ''}`}
            sx={{
              '& .MuiListItemText-primary': {
                color: premiumColors.white,
                fontSize: '0.9rem',
                fontWeight: importanceFilter.includes(importance) ? 700 : 400
              },
              '& .MuiListItemText-secondary': {
                color: premiumColors.textMuted,
                fontSize: '0.75rem'
              }
            }}
          />
        </MenuItem>
      ))}
    </Select>
  </FormControl>
</Grid>

{/* Status Filter */}
<Grid item xs={12} md={2.5}>
  <FormControl fullWidth size="small">
    <InputLabel 
      sx={{ 
        color: '#666666',
        bgcolor: '#ffffff',
        px: 1,
        '&.Mui-focused': { 
          color: premiumColors.goldDark 
        }
      }}
    >
    </InputLabel>
    <Select
      multiple
      value={statusFilter}
      onChange={handleStatusFilterChange}
      displayEmpty
      renderValue={(selected) => {
        if (selected.length === 0) {
          return (
            <Typography sx={{ color: '#666666', fontSize: '0.9rem' }}>
              Tous les statuts
            </Typography>
          );
        }
        return (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected.map((value) => (
              <Chip
                key={value}
                label={statusConfig[value]?.label}
                size="small"
                sx={{
                  bgcolor: statusConfig[value]?.bgColor,
                  color: statusConfig[value]?.color,
                  fontSize: '0.7rem',
                  height: 24,
                  '& .MuiChip-label': { px: 1 }
                }}
              />
            ))}
          </Box>
        );
      }}
      sx={{
        color: '#333333',
        bgcolor: '#ffffff',
        '& .MuiOutlinedInput-notchedOutline': {
          borderColor: '#e0e0e0'
        },
        '&:hover .MuiOutlinedInput-notchedOutline': {
          borderColor: premiumColors.gold
        },
        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
          borderColor: premiumColors.gold,
          borderWidth: 1.5,
        }
      }}
      MenuProps={{
        PaperProps: {
          sx: {
            bgcolor: premiumColors.surface,
            border: `1px solid ${alpha(premiumColors.gold, 0.2)}`,
            borderRadius: 2,
            mt: 1,
            maxHeight: 400,
            boxShadow: premiumColors.shadowLg
          }
        }
      }}
    >
      {Object.keys(statusConfig).map((status) => (
        <MenuItem 
          key={status} 
          value={status}
          sx={{
            color: premiumColors.white,
            '&:hover': {
              bgcolor: statusConfig[status]?.bgColor
            },
            '&.Mui-selected': {
              bgcolor: alpha(statusConfig[status]?.color, 0.2),
              '&:hover': {
                bgcolor: alpha(statusConfig[status]?.color, 0.3)
              }
            }
          }}
        >
          <Checkbox 
            checked={statusFilter.indexOf(status) > -1} 
            size="small"
            sx={{
              color: statusConfig[status]?.color,
              '&.Mui-checked': {
                color: statusConfig[status]?.color
              }
            }}
          />
          <ListItemText 
            primary={statusConfig[status].label}
            secondary={`${getStatusCount(status)} message${getStatusCount(status) > 1 ? 's' : ''}`}
            sx={{
              '& .MuiListItemText-primary': {
                color: premiumColors.white,
                fontSize: '0.9rem',
                fontWeight: statusFilter.includes(status) ? 700 : 400
              },
              '& .MuiListItemText-secondary': {
                color: premiumColors.textMuted,
                fontSize: '0.75rem'
              }
            }}
          />
        </MenuItem>
      ))}
    </Select>
  </FormControl>
</Grid>

              {/* Date Filter */}
              <Grid item xs={12} md={2.5}>
                <DatePicker
                  label="Filtrer par date"
                  value={dateFilter}
                  onChange={setDateFilter}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: 'small',
                      sx: {
                        '& .MuiOutlinedInput-root': {
                          color: '#333333',
                          bgcolor: '#ffffff',
                          borderRadius: 2,
                          '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#e0e0e0'
                          },
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: premiumColors.gold
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: premiumColors.gold,
                            borderWidth: 1.5
                          }
                        },
                        '& .MuiInputLabel-root': {
                          color: '#666666',
                          '&.Mui-focused': {
                            color: premiumColors.goldDark
                          }
                        }
                      }
                    }
                  }}
                />
              </Grid>

              {/* Reset Button */}
              <Grid item xs={12} md={1}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => {
                    setSearchTerm('');
                    setImportanceFilter([]);
                    setStatusFilter([]);
                    setDateFilter(null);
                  }}
                  sx={{
                    color: premiumColors.goldDark,
                    borderColor: premiumColors.gold,
                    borderWidth: 1.5,
                    bgcolor: '#ffffff',
                    py: 1,
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    borderRadius: 2,
                    '&:hover': {
                      borderColor: premiumColors.goldDark,
                      bgcolor: alpha(premiumColors.gold, 0.05)
                    }
                  }}
                >
                  Reset
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {/* Sort Bar */}
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: 2,
              mb: 2,
              px: 1
            }}
          >
            <Typography sx={{ color: '#666666', fontSize: '0.85rem' }}>
              Trier par:
            </Typography>
            <Button
              size="small"
              onClick={() => handleSort('createdAt')}
              endIcon={sortBy === 'createdAt' && (sortOrder === 'asc' ? <ArrowUpward /> : <ArrowDownward />)}
              sx={{
                color: sortBy === 'createdAt' ? premiumColors.goldDark : '#666666',
                fontSize: '0.8rem',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': { 
                  color: premiumColors.goldDark,
                  bgcolor: 'transparent'
                }
              }}
            >
              Date
            </Button>
            <Button
              size="small"
              onClick={() => handleSort('importance')}
              endIcon={sortBy === 'importance' && (sortOrder === 'asc' ? <ArrowUpward /> : <ArrowDownward />)}
              sx={{
                color: sortBy === 'importance' ? premiumColors.goldDark : '#666666',
                fontSize: '0.8rem',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': { 
                  color: premiumColors.goldDark,
                  bgcolor: 'transparent'
                }
              }}
            >
              Priorité
            </Button>
            <Button
              size="small"
              onClick={() => handleSort('status')}
              endIcon={sortBy === 'status' && (sortOrder === 'asc' ? <ArrowUpward /> : <ArrowDownward />)}
              sx={{
                color: sortBy === 'status' ? premiumColors.goldDark : '#666666',
                fontSize: '0.8rem',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': { 
                  color: premiumColors.goldDark,
                  bgcolor: 'transparent'
                }
              }}
            >
              Statut
            </Button>
          </Box>

          {/* Messages List */}
          {loading ? (
            <Box sx={{ width: '100%', py: 8 }}>
              <LinearProgress 
                sx={{
                  bgcolor: alpha(premiumColors.gold, 0.1),
                  height: 6,
                  borderRadius: 3,
                  '& .MuiLinearProgress-bar': {
                    bgcolor: premiumColors.gold,
                    borderRadius: 3
                  }
                }}
              />
            </Box>
          ) : filteredContacts.length === 0 ? (
            <Paper
              sx={{
                p: 8,
                textAlign: 'center',
                bgcolor: premiumColors.surface,
                border: `1px solid ${alpha(premiumColors.gold, 0.15)}`,
                borderRadius: 3
              }}
            >
              <Message sx={{ fontSize: 80, color: alpha(premiumColors.gold, 0.3), mb: 2 }} />
              <Typography
                variant="h5"
                sx={{
                  color: premiumColors.white,
                  fontFamily: "'Fjalla One', sans-serif",
                  fontWeight: 700,
                  mb: 1
                }}
              >
                Aucun message trouvé
              </Typography>
              <Typography sx={{ color: premiumColors.textMuted, fontSize: '0.95rem' }}>
                Essayez de modifier vos filtres
              </Typography>
            </Paper>
          ) : (
            <Box>
              {filteredContacts
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((contact) => (
                  <MessageCard
                    key={contact._id}
                    contact={contact}
                    onView={handleViewContact}
                    onStatusUpdate={updateContactStatus}
                    onDelete={handleDeleteClick}
                  />
                ))}
              
              <TablePagination
                component="div"
                count={filteredContacts.length}
                page={page}
                onPageChange={(e, newPage) => setPage(newPage)}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={(e) => {
                  setRowsPerPage(parseInt(e.target.value, 10));
                  setPage(0);
                }}
                labelRowsPerPage="Lignes par page"
                sx={{
                  mt: 2,
                  color: '#666666',
                  '& .MuiTablePagination-select': {
                    color: '#333333'
                  },
                  '& .MuiTablePagination-selectIcon': {
                    color: premiumColors.goldDark
                  },
                  '& .MuiTablePagination-actions button': {
                    color: premiumColors.goldDark,
                    '&:disabled': {
                      color: alpha(premiumColors.gold, 0.3)
                    }
                  }
                }}
              />
            </Box>
          )}
        </Box>

        {/* Message Details Modal */}
        <MessageDetailsModal
          open={detailsOpen}
          onClose={() => setDetailsOpen(false)}
          contact={selectedContact}
          onStatusUpdate={updateContactStatus}
          onDelete={handleDeleteClick}
        />

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmDialog
          open={deleteDialogOpen}
          onClose={() => {
            setDeleteDialogOpen(false);
            setContactToDelete(null);
          }}
          onConfirm={handleDeleteConfirm}
          contact={contactToDelete}
        />

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{
              bgcolor: premiumColors.surface,
              color: premiumColors.white,
              border: `1px solid ${
                snackbar.severity === 'success' ? alpha(premiumColors.success, 0.5) : 
                snackbar.severity === 'error' ? alpha(premiumColors.error, 0.5) : 
                alpha(premiumColors.gold, 0.5)
              }`,
              borderRadius: 2,
              boxShadow: premiumColors.shadowLg
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>

        <style jsx global>{`
          @import url('https://fonts.googleapis.com/css2?family=Fjalla+One&display=swap');
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
          
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }
          
          body {
            background-color: #ffffff;
            font-family: 'Inter', sans-serif;
          }
        `}</style>
      </Box>
    </LocalizationProvider>
  );
};

export default Messagerie;