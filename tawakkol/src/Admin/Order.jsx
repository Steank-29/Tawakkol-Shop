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
  alpha
} from '@mui/material';
import {
  Search,
  Refresh,
  FilterList,
  Visibility,
  Close,
  CheckCircle,
  Cancel,
  LocalShipping,
  Inventory,
  Payment,
  Receipt,
  Download,
  Email,
  Phone,
  LocationOn,
  Person,
  ShoppingBag,
  AttachMoney,
  CalendarToday,
  AccessTime,
  ArrowUpward,
  ArrowDownward,
  MoreVert,
  Delete,
  Store,
  TrendingUp,
  TrendingDown,
  Warning,
  Info
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import frLocale from 'date-fns/locale/fr';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import API_BASE from '../Config/api';

// ============ PREMIUM COLOR PALETTE - WHITE BACKGROUND + BLACK CARDS ============
const premiumColors = {
  // Primary Colors - Elegant Gold Theme
  gold: '#d4af37',
  goldLight: '#f4e4a6',
  goldDark: '#b8941f',
  goldGradient: 'linear-gradient(135deg, #d4af37 0%, #f9d423 50%, #d4af37 100%)',
  
  // Card Theme - BLACK CARDS
  noir: '#000000',     // Pure black for cards
  charcoal: '#0a0a0a', // Dark black for surfaces
  surface: '#121212',  // Rich black for cards
  surfaceLight: '#1e1e1e', // Slightly lighter black for hover
  
  // Text Colors
  white: '#ffffff',
  textPrimary: '#ffffff',
  textSecondary: '#e0e0e0',
  textMuted: '#9e9e9e',
  
  // Status Colors - Vibrant and Clear
  pending: '#f59e0b',
  confirmed: '#3b82f6',
  processing: '#8b5cf6',
  shipped: '#06b6d4',
  delivered: '#10b981',
  cancelled: '#ef4444',
  
  // Status Backgrounds - Semi-transparent
  pendingBg: 'rgba(245, 158, 11, 0.15)',
  confirmedBg: 'rgba(59, 130, 246, 0.15)',
  processingBg: 'rgba(139, 92, 246, 0.15)',
  shippedBg: 'rgba(6, 182, 212, 0.15)',
  deliveredBg: 'rgba(16, 185, 129, 0.15)',
  cancelledBg: 'rgba(239, 68, 68, 0.15)',
  
  // Utility Colors
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
  
  // Shadows - Subtle for white background
  shadowSm: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
  shadowMd: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  shadowLg: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  shadowXl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  shadowGold: '0 10px 30px -5px rgba(212, 175, 55, 0.2)'
};

// ============ STATUS CONFIGURATION ============
const statusConfig = {
  pending: {
    label: 'En attente',
    color: premiumColors.pending,
    bgColor: premiumColors.pendingBg,
    icon: <AccessTime />,
    iconColor: premiumColors.pending,
    next: ['confirmed', 'cancelled']
  },
  confirmed: {
    label: 'Confirmée',
    color: premiumColors.confirmed,
    bgColor: premiumColors.confirmedBg,
    icon: <CheckCircle />,
    iconColor: premiumColors.confirmed,
    next: ['processing', 'cancelled']
  },
  processing: {
    label: 'En traitement',
    color: premiumColors.processing,
    bgColor: premiumColors.processingBg,
    icon: <Inventory />,
    iconColor: premiumColors.processing,
    next: ['shipped', 'cancelled']
  },
  shipped: {
    label: 'Expédiée',
    color: premiumColors.shipped,
    bgColor: premiumColors.shippedBg,
    icon: <LocalShipping />,
    iconColor: premiumColors.shipped,
    next: ['delivered', 'cancelled']
  },
  delivered: {
    label: 'Livrée',
    color: premiumColors.delivered,
    bgColor: premiumColors.deliveredBg,
    icon: <CheckCircle />,
    iconColor: premiumColors.delivered,
    next: []
  },
  cancelled: {
    label: 'Annulée',
    color: premiumColors.cancelled,
    bgColor: premiumColors.cancelledBg,
    icon: <Cancel />,
    iconColor: premiumColors.cancelled,
    next: []
  }
};

// ============ STATISTICS CARD COMPONENT - BLACK CARDS ============
const StatCard = ({ title, value, subtitle, icon, color, trend }) => {
  return (
    <Zoom in timeout={400}>
      <Card
        elevation={0}
        sx={{
          bgcolor: premiumColors.surface, // BLACK CARD
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
                {trend && (
                  <Chip
                    icon={trend > 0 ? <TrendingUp /> : <TrendingDown />}
                    label={`${Math.abs(trend)}%`}
                    size="small"
                    sx={{
                      height: 20,
                      fontSize: '0.7rem',
                      bgcolor: trend > 0 ? alpha(premiumColors.success, 0.15) : alpha(premiumColors.error, 0.15),
                      color: trend > 0 ? premiumColors.success : premiumColors.error,
                      '& .MuiChip-icon': {
                        fontSize: '0.7rem',
                        color: 'inherit'
                      }
                    }}
                  />
                )}
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

// ============ DELETE CONFIRMATION DIALOG ============
const DeleteConfirmDialog = ({ open, onClose, onConfirm, order }) => {
  if (!order) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: premiumColors.surface, // BLACK CARD
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
            Êtes-vous sûr de vouloir supprimer cette commande ?
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                bgcolor: alpha(premiumColors.gold, 0.1),
                color: premiumColors.gold,
                width: 48,
                height: 48,
                borderRadius: 1.5
              }}
            >
              <Store />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography
                sx={{
                  color: premiumColors.gold,
                  fontFamily: "'Fjalla One', sans-serif",
                  fontWeight: 700,
                  fontSize: '1rem'
                }}
              >
                {order.orderNumber}
              </Typography>
              <Typography
                sx={{
                  color: premiumColors.textSecondary,
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  mt: 0.25
                }}
              >
                <Person sx={{ fontSize: '0.8rem' }} />
                {order.customer?.fullName}
              </Typography>
              <Typography
                sx={{
                  color: premiumColors.textMuted,
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 0.5,
                  mt: 0.25
                }}
              >
                <AttachMoney sx={{ fontSize: '0.8rem' }} />
                {order.total?.toFixed(2)} DT
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
            Cette commande sera définitivement supprimée de la base de données
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
            onConfirm(order._id);
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

// ============ ORDER CARD COMPONENT - BLACK CARD WITH DELETE ICON ============
const OrderCard = ({ order, onView, onStatusUpdate, onDelete }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const status = statusConfig[order.status] || statusConfig.pending;
  const userRole = localStorage.getItem('userRole');

  const handleMenuOpen = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => setAnchorEl(null);
  
  const handleStatusChange = (newStatus) => {
    onStatusUpdate(order._id, newStatus);
    handleMenuClose();
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete(order);
  };

  return (
    <Zoom in timeout={400}>
      <Paper
        elevation={0}
        onClick={() => onView(order)}
        sx={{
          p: 2.5,
          mb: 2,
          bgcolor: premiumColors.surface, // BLACK CARD
          border: `1px solid ${alpha(premiumColors.gold, 0.15)}`,
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden',
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '6px',
            height: '100%',
            background: `linear-gradient(180deg, ${status.color}, ${premiumColors.gold})`,
            opacity: 0.8
          },
          '&:hover': {
            transform: 'translateY(-4px) scale(1.01)',
            boxShadow: premiumColors.shadowGold,
            borderColor: alpha(premiumColors.gold, 0.3),
            bgcolor: premiumColors.charcoal,
            '& .order-number': {
              color: premiumColors.gold
            },
            '& .view-button': {
              bgcolor: alpha(premiumColors.gold, 0.2),
              color: premiumColors.gold
            }
          }
        }}
      >
        <Grid container spacing={2} alignItems="center">
          {/* Order Info */}
          <Grid item xs={12} md={2.5}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                sx={{
                  bgcolor: alpha(premiumColors.gold, 0.1),
                  color: premiumColors.gold,
                  width: 52,
                  height: 52,
                  borderRadius: 2
                }}
              >
                <Store />
              </Avatar>
              <Box>
                <Typography
                  className="order-number"
                  sx={{
                    color: premiumColors.white,
                    fontFamily: "'Fjalla One', sans-serif",
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    transition: 'color 0.3s ease',
                    mb: 0.5
                  }}
                >
                  {order.orderNumber}
                </Typography>
                <Typography
                  sx={{
                    color: premiumColors.textMuted,
                    fontSize: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5
                  }}
                >
                  <CalendarToday sx={{ fontSize: '0.7rem' }} />
                  {format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm', { locale: fr })}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Customer Info */}
          <Grid item xs={12} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Avatar
                sx={{
                  bgcolor: alpha(premiumColors.gold, 0.05),
                  color: premiumColors.gold,
                  width: 44,
                  height: 44,
                  borderRadius: 1.5
                }}
              >
                <Person />
              </Avatar>
              <Box>
                <Typography
                  sx={{
                    color: premiumColors.white,
                    fontSize: '0.95rem',
                    fontWeight: 600,
                    mb: 0.25
                  }}
                >
                  {order.customer.fullName}
                </Typography>
                <Typography
                  sx={{
                    color: premiumColors.textMuted,
                    fontSize: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5
                  }}
                >
                  <Email sx={{ fontSize: '0.7rem' }} />
                  {order.customer.email.length > 20 
                    ? `${order.customer.email.substring(0, 20)}...` 
                    : order.customer.email}
                </Typography>
                <Typography
                  sx={{
                    color: premiumColors.textMuted,
                    fontSize: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5
                  }}
                >
                  <Phone sx={{ fontSize: '0.7rem' }} />
                  {order.customer.phone}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Items & Amount */}
          <Grid item xs={12} md={2}>
            <Box sx={{ textAlign: 'center' }}>
              <Chip
                label={`${order.items.length} article${order.items.length > 1 ? 's' : ''}`}
                size="small"
                sx={{
                  bgcolor: alpha(premiumColors.gold, 0.1),
                  color: premiumColors.goldLight,
                  fontSize: '0.7rem',
                  height: 22,
                  mb: 0.5,
                  '& .MuiChip-label': { px: 1 }
                }}
              />
              <Typography
                sx={{
                  color: premiumColors.gold,
                  fontFamily: "'Fjalla One', sans-serif",
                  fontSize: '1.3rem',
                  fontWeight: 700,
                  lineHeight: 1.2
                }}
              >
                {order.total.toFixed(2)} DT
              </Typography>
              <Typography
                sx={{
                  color: premiumColors.textMuted,
                  fontSize: '0.7rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                {order.paymentMethod === 'cash' ? 'Paiement à la livraison' : 
                 order.paymentMethod === 'card' ? 'Carte bancaire' : 'Virement'}
              </Typography>
            </Box>
          </Grid>

          {/* Status & Actions */}
          <Grid item xs={12} md={4.5}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1.5 }}>
              {/* Status Badge */}
              <Badge
                variant="dot"
                sx={{
                  '& .MuiBadge-badge': {
                    bgcolor: status.color,
                    boxShadow: `0 0 0 2px ${alpha(status.color, 0.3)}`,
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    right: 8,
                    top: 8
                  }
                }}
              >
                <Chip
                  icon={status.icon}
                  label={status.label}
                  sx={{
                    bgcolor: status.bgColor,
                    color: status.color,
                    border: `1px solid ${alpha(status.color, 0.3)}`,
                    fontWeight: 700,
                    fontSize: '0.8rem',
                    height: 32,
                    '& .MuiChip-icon': { 
                      color: status.iconColor,
                      fontSize: '1rem'
                    },
                    '& .MuiChip-label': { px: 1.5 }
                  }}
                />
              </Badge>

              {/* View Button - ELEGANT */}
              <Tooltip title="Voir les détails" arrow>
                <IconButton
                  className="view-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onView(order);
                  }}
                  sx={{
                    color: premiumColors.textSecondary,
                    bgcolor: alpha(premiumColors.gold, 0.08),
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: alpha(premiumColors.gold, 0.2),
                      color: premiumColors.gold,
                      transform: 'scale(1.1)',
                      boxShadow: `0 4px 12px ${alpha(premiumColors.gold, 0.3)}`
                    }
                  }}
                >
                  <Visibility fontSize="medium" />
                </IconButton>
              </Tooltip>

              {/* Status Update Button */}
              {status.next.length > 0 && (
                <>
                  <Button
                    variant="contained"
                    onClick={handleMenuOpen}
                    endIcon={<MoreVert />}
                    sx={{
                      bgcolor: alpha(premiumColors.gold, 0.9),
                      color: premiumColors.noir,
                      px: 2.5,
                      py: 0.75,
                      fontSize: '0.8rem',
                      fontWeight: 800,
                      textTransform: 'none',
                      borderRadius: 2,
                      boxShadow: `0 6px 12px -4px ${alpha(premiumColors.gold, 0.4)}`,
                      border: `1px solid ${alpha(premiumColors.gold, 0.5)}`,
                      '&:hover': {
                        bgcolor: premiumColors.gold,
                        transform: 'translateY(-2px)',
                        boxShadow: `0 12px 20px -8px ${alpha(premiumColors.gold, 0.6)}`,
                        borderColor: premiumColors.gold
                      },
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  >
                    Mettre à jour
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
                        mt: 1.5,
                        minWidth: 240,
                        boxShadow: premiumColors.shadowLg
                      }
                    }}
                  >
                    <Box sx={{ p: 1 }}>
                      <Typography
                        sx={{
                          color: premiumColors.textMuted,
                          fontSize: '0.7rem',
                          fontWeight: 600,
                          textTransform: 'uppercase',
                          letterSpacing: '1px',
                          px: 1.5,
                          py: 1
                        }}
                      >
                        Changer le statut
                      </Typography>
                    </Box>
                    {status.next.map((nextStatus) => (
                      <MenuItem
                        key={nextStatus}
                        onClick={() => handleStatusChange(nextStatus)}
                        sx={{
                          color: premiumColors.white,
                          mx: 1,
                          mb: 0.5,
                          px: 1.5,
                          py: 1.25,
                          borderRadius: 1.5,
                          '&:hover': {
                            bgcolor: statusConfig[nextStatus].bgColor
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, width: '100%' }}>
                          <Avatar
                            sx={{
                              bgcolor: alpha(statusConfig[nextStatus].color, 0.15),
                              color: statusConfig[nextStatus].color,
                              width: 32,
                              height: 32,
                              borderRadius: 1
                            }}
                          >
                            {statusConfig[nextStatus].icon}
                          </Avatar>
                          <Box sx={{ flex: 1 }}>
                            <Typography
                              sx={{
                                fontWeight: 700,
                                fontSize: '0.9rem',
                                color: statusConfig[nextStatus].color
                              }}
                            >
                              {statusConfig[nextStatus].label}
                            </Typography>
                            <Typography
                              sx={{
                                fontSize: '0.7rem',
                                color: premiumColors.textMuted
                              }}
                            >
                              Cliquer pour confirmer
                            </Typography>
                          </Box>
                        </Box>
                      </MenuItem>
                    ))}
                  </Menu>
                </>
              )}

              {/* DELETE ICON - ALWAYS VISIBLE FOR ALL USERS */}
              <Tooltip title="Supprimer la commande" arrow>
                <IconButton
                  onClick={handleDeleteClick}
                  sx={{
                    color: alpha(premiumColors.cancelled, 0.7),
                    bgcolor: alpha(premiumColors.cancelled, 0.08),
                    width: 40,
                    height: 40,
                    borderRadius: 2,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: alpha(premiumColors.cancelled, 0.15),
                      color: premiumColors.cancelled,
                      transform: 'scale(1.1)',
                      boxShadow: `0 4px 12px ${alpha(premiumColors.cancelled, 0.3)}`
                    }
                  }}
                >
                  <Delete fontSize="medium" />
                </IconButton>
              </Tooltip>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Zoom>
  );
};

// ============ REDESIGNED ORDER DETAILS MODAL - CLEAN & PROFESSIONAL ============
const OrderDetailsModal = ({ open, onClose, order, onStatusUpdate, onDelete }) => {
  const [statusAnchorEl, setStatusAnchorEl] = useState(null);
  const userRole = localStorage.getItem('userRole');
  
  if (!order) return null;

  const status = statusConfig[order.status] || statusConfig.pending;

  const handleStatusMenuOpen = (event) => {
    event.stopPropagation();
    setStatusAnchorEl(event.currentTarget);
  };
  
  const handleStatusMenuClose = () => setStatusAnchorEl(null);
  
  const handleStatusChange = (newStatus) => {
    onStatusUpdate(order._id, newStatus);
    handleStatusMenuClose();
  };

  const handleDeleteClick = () => {
    onDelete(order);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: premiumColors.surface, // BLACK CARD
          border: `1px solid ${alpha(premiumColors.gold, 0.2)}`,
          borderRadius: 3,
          boxShadow: premiumColors.shadowXl
        }
      }}
    >
      {/* CLEAN HEADER WITH GOLD ACCENTS */}
      <DialogTitle sx={{ 
        borderBottom: `1px solid ${alpha(premiumColors.gold, 0.15)}`,
        p: 3
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Avatar
              sx={{
                bgcolor: alpha(premiumColors.gold, 0.1),
                color: premiumColors.gold,
                width: 56,
                height: 56,
                borderRadius: 2
              }}
            >
              <Receipt sx={{ fontSize: '1.8rem' }} />
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
                {order.orderNumber}
                <Chip
                  icon={status.icon}
                  label={status.label}
                  size="small"
                  sx={{
                    ml: 1,
                    bgcolor: status.bgColor,
                    color: status.color,
                    border: `1px solid ${alpha(status.color, 0.3)}`,
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
                  {format(new Date(order.createdAt), 'dd MMMM yyyy', { locale: fr })}
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
                  {format(new Date(order.createdAt), 'HH:mm', { locale: fr })}
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
        {/* STATUS UPDATE SECTION - CLEAN */}
        {status.next.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                bgcolor: alpha(premiumColors.surfaceLight, 0.7),
                border: `1px solid ${alpha(premiumColors.gold, 0.1)}`,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: 4,
                    height: 40,
                    bgcolor: premiumColors.gold,
                    borderRadius: 2
                  }}
                />
                <Box>
                  <Typography
                    sx={{
                      color: premiumColors.textMuted,
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '1px'
                    }}
                  >
                    Action requise
                  </Typography>
                  <Typography
                    sx={{
                      color: premiumColors.white,
                      fontSize: '0.9rem',
                      fontWeight: 500
                    }}
                  >
                    Mettre à jour le statut de cette commande
                  </Typography>
                </Box>
              </Box>
              <Button
                variant="contained"
                onClick={handleStatusMenuOpen}
                endIcon={<MoreVert />}
                sx={{
                  bgcolor: premiumColors.gold,
                  color: premiumColors.noir,
                  px: 3,
                  py: 1,
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  textTransform: 'none',
                  borderRadius: 2,
                  '&:hover': {
                    bgcolor: premiumColors.goldDark,
                    transform: 'translateY(-2px)',
                    boxShadow: `0 8px 16px -4px ${alpha(premiumColors.gold, 0.4)}`
                  }
                }}
              >
                Mettre à jour
              </Button>
              <Menu
                anchorEl={statusAnchorEl}
                open={Boolean(statusAnchorEl)}
                onClose={handleStatusMenuClose}
                PaperProps={{
                  sx: {
                    bgcolor: premiumColors.surface,
                    border: `1px solid ${alpha(premiumColors.gold, 0.2)}`,
                    borderRadius: 2,
                    mt: 1,
                    minWidth: 260,
                    boxShadow: premiumColors.shadowLg
                  }
                }}
              >
                <Box sx={{ p: 1 }}>
                  <Typography
                    sx={{
                      color: premiumColors.textMuted,
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      px: 2,
                      py: 1
                    }}
                  >
                    Nouveau statut
                  </Typography>
                </Box>
                {status.next.map((nextStatus) => (
                  <MenuItem
                    key={nextStatus}
                    onClick={() => handleStatusChange(nextStatus)}
                    sx={{
                      mx: 1,
                      mb: 0.5,
                      px: 2,
                      py: 1.5,
                      borderRadius: 1.5,
                      '&:hover': {
                        bgcolor: statusConfig[nextStatus].bgColor
                      }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        sx={{
                          bgcolor: alpha(statusConfig[nextStatus].color, 0.1),
                          color: statusConfig[nextStatus].color,
                          width: 36,
                          height: 36,
                          borderRadius: 1
                        }}
                      >
                        {statusConfig[nextStatus].icon}
                      </Avatar>
                      <Box>
                        <Typography
                          sx={{
                            color: premiumColors.white,
                            fontWeight: 600,
                            fontSize: '0.9rem'
                          }}
                        >
                          {statusConfig[nextStatus].label}
                        </Typography>
                        <Typography
                          sx={{
                            color: premiumColors.textMuted,
                            fontSize: '0.7rem'
                          }}
                        >
                          Cliquez pour confirmer
                        </Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                ))}
              </Menu>
            </Paper>
          </Box>
        )}

        {/* TWO COLUMN LAYOUT - CLEAN & ORGANIZED */}
        <Grid container spacing={3}>
          {/* LEFT COLUMN - CUSTOMER INFO */}
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
                INFORMATIONS CLIENT
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                <Avatar
                  sx={{
                    bgcolor: alpha(premiumColors.gold, 0.1),
                    color: premiumColors.gold,
                    width: 56,
                    height: 56,
                    borderRadius: 2,
                    fontSize: '1.3rem',
                    fontWeight: 700
                  }}
                >
                  {order.customer.fullName.charAt(0)}
                </Avatar>
                <Box>
                  <Typography
                    sx={{
                      color: premiumColors.white,
                      fontSize: '1.2rem',
                      fontWeight: 700,
                      mb: 0.5
                    }}
                  >
                    {order.customer.fullName}
                  </Typography>
                  {order.customer.clothingSize && (
                    <Chip
                      label={`Taille: ${order.customer.clothingSize}`}
                      size="small"
                      sx={{
                        bgcolor: alpha(premiumColors.gold, 0.1),
                        color: premiumColors.goldLight,
                        height: 24,
                        fontSize: '0.7rem'
                      }}
                    />
                  )}
                </Box>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: alpha(premiumColors.info, 0.1),
                      color: premiumColors.info,
                      width: 32,
                      height: 32,
                      borderRadius: 1
                    }}
                  >
                    <Email sx={{ fontSize: '0.9rem' }} />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ color: premiumColors.textMuted, fontSize: '0.7rem', mb: 0.25 }}>
                      Email
                    </Typography>
                    <Typography sx={{ color: premiumColors.white, fontSize: '0.9rem' }}>
                      {order.customer.email}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: alpha(premiumColors.success, 0.1),
                      color: premiumColors.success,
                      width: 32,
                      height: 32,
                      borderRadius: 1
                    }}
                  >
                    <Phone sx={{ fontSize: '0.9rem' }} />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ color: premiumColors.textMuted, fontSize: '0.7rem', mb: 0.25 }}>
                      Téléphone
                    </Typography>
                    <Typography sx={{ color: premiumColors.white, fontSize: '0.9rem' }}>
                      {order.customer.phone}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: alpha(premiumColors.warning, 0.1),
                      color: premiumColors.warning,
                      width: 32,
                      height: 32,
                      borderRadius: 1
                    }}
                  >
                    <LocationOn sx={{ fontSize: '0.9rem' }} />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ color: premiumColors.textMuted, fontSize: '0.7rem', mb: 0.25 }}>
                      Adresse
                    </Typography>
                    <Typography sx={{ color: premiumColors.white, fontSize: '0.9rem' }}>
                      {order.customer.address}
                    </Typography>
                    <Typography sx={{ color: premiumColors.textMuted, fontSize: '0.8rem' }}>
                      {order.customer.city}
                      {order.customer.postalCode && `, ${order.customer.postalCode}`}
                    </Typography>
                  </Box>
                </Box>

                {order.customer.notes && (
                  <>
                    <Divider sx={{ borderColor: alpha(premiumColors.gold, 0.1), my: 1 }} />
                    <Box>
                      <Typography sx={{ color: premiumColors.textMuted, fontSize: '0.7rem', mb: 0.5 }}>
                        Notes client
                      </Typography>
                      <Typography
                        sx={{
                          color: premiumColors.textSecondary,
                          fontSize: '0.85rem',
                          fontStyle: 'italic',
                          p: 1.5,
                          bgcolor: alpha(premiumColors.gold, 0.03),
                          borderRadius: 1.5
                        }}
                      >
                        "{order.customer.notes}"
                      </Typography>
                    </Box>
                  </>
                )}
              </Box>
            </Paper>
          </Grid>

          {/* RIGHT COLUMN - ORDER SUMMARY */}
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
                <Receipt sx={{ fontSize: '1rem' }} />
                RÉCAPITULATIF
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                {/* Payment Method */}
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
                    <Payment sx={{ fontSize: '1.1rem' }} />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ color: premiumColors.textMuted, fontSize: '0.7rem', mb: 0.25 }}>
                      Mode de paiement
                    </Typography>
                    <Typography sx={{ color: premiumColors.white, fontSize: '0.95rem', fontWeight: 600 }}>
                      {order.paymentMethod === 'cash' ? 'Paiement à la livraison' : 
                       order.paymentMethod === 'card' ? 'Carte bancaire' : 'Virement bancaire'}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ borderColor: alpha(premiumColors.gold, 0.1) }} />

                {/* Amount Details */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography sx={{ color: premiumColors.textMuted, fontSize: '0.85rem' }}>
                      Sous-total
                    </Typography>
                    <Typography sx={{ color: premiumColors.white, fontSize: '0.95rem' }}>
                      {order.subtotal?.toFixed(2)} DT
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography sx={{ color: premiumColors.textMuted, fontSize: '0.85rem' }}>
                      Livraison
                    </Typography>
                    <Typography sx={{ color: premiumColors.white, fontSize: '0.95rem' }}>
                      {order.shippingCost?.toFixed(2)} DT
                    </Typography>
                  </Box>
                  {order.tax > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography sx={{ color: premiumColors.textMuted, fontSize: '0.85rem' }}>
                        TVA
                      </Typography>
                      <Typography sx={{ color: premiumColors.white, fontSize: '0.95rem' }}>
                        {order.tax?.toFixed(2)} DT
                      </Typography>
                    </Box>
                  )}
                  
                  <Box
                    sx={{
                      mt: 1,
                      pt: 2,
                      borderTop: `1px solid ${alpha(premiumColors.gold, 0.2)}`,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <Typography
                      sx={{
                        color: premiumColors.white,
                        fontSize: '1rem',
                        fontWeight: 700
                      }}
                    >
                      TOTAL
                    </Typography>
                    <Typography
                      sx={{
                        color: premiumColors.gold,
                        fontFamily: "'Fjalla One', sans-serif",
                        fontSize: '1.6rem',
                        fontWeight: 800,
                        lineHeight: 1
                      }}
                    >
                      {order.total?.toFixed(2)} DT
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* BOTTOM - PRODUCTS TABLE - CLEAN DESIGN */}
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
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography
                  sx={{
                    color: premiumColors.gold,
                    fontSize: '0.9rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <ShoppingBag sx={{ fontSize: '1rem' }} />
                  ARTICLES COMMANDÉS
                </Typography>
                <Chip
                  label={`${order.items.length} article${order.items.length > 1 ? 's' : ''} • ${order.items.reduce((acc, item) => acc + item.quantity, 0)} pièces`}
                  sx={{
                    bgcolor: alpha(premiumColors.gold, 0.1),
                    color: premiumColors.goldLight,
                    height: 28,
                    fontSize: '0.75rem',
                    fontWeight: 600
                  }}
                />
              </Box>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ 
                        color: premiumColors.textMuted, 
                        fontSize: '0.7rem', 
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        borderBottom: `1px solid ${alpha(premiumColors.gold, 0.2)}`,
                        py: 1.5
                      }}>
                        Produit
                      </TableCell>
                      <TableCell sx={{ 
                        color: premiumColors.textMuted, 
                        fontSize: '0.7rem', 
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        borderBottom: `1px solid ${alpha(premiumColors.gold, 0.2)}`,
                        py: 1.5
                      }}>
                        Variante
                      </TableCell>
                      <TableCell align="center" sx={{ 
                        color: premiumColors.textMuted, 
                        fontSize: '0.7rem', 
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        borderBottom: `1px solid ${alpha(premiumColors.gold, 0.2)}`,
                        py: 1.5
                      }}>
                        Qté
                      </TableCell>
                      <TableCell align="right" sx={{ 
                        color: premiumColors.textMuted, 
                        fontSize: '0.7rem', 
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        borderBottom: `1px solid ${alpha(premiumColors.gold, 0.2)}`,
                        py: 1.5
                      }}>
                        Prix unitaire
                      </TableCell>
                      <TableCell align="right" sx={{ 
                        color: premiumColors.textMuted, 
                        fontSize: '0.7rem', 
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        borderBottom: `1px solid ${alpha(premiumColors.gold, 0.2)}`,
                        py: 1.5
                      }}>
                        Total
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {order.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell sx={{ 
                          borderBottom: `1px solid ${alpha(premiumColors.gold, 0.1)}`,
                          py: 2
                        }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            {item.mainImage && (
                              <Avatar
                                src={typeof item.mainImage === 'string' ? item.mainImage : item.mainImage?.url}
                                variant="rounded"
                                sx={{
                                  width: 48,
                                  height: 48,
                                  border: `1px solid ${alpha(premiumColors.gold, 0.2)}`,
                                  borderRadius: 1.5
                                }}
                              />
                            )}
                            <Typography sx={{ 
                              color: premiumColors.white, 
                              fontWeight: 600, 
                              fontSize: '0.9rem' 
                            }}>
                              {item.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ borderBottom: `1px solid ${alpha(premiumColors.gold, 0.1)}` }}>
                          <Box sx={{ display: 'flex', gap: 0.5 }}>
                            {item.selectedSize && (
                              <Chip
                                label={item.selectedSize}
                                size="small"
                                sx={{
                                  bgcolor: alpha(premiumColors.gold, 0.1),
                                  color: premiumColors.gold,
                                  fontSize: '0.7rem',
                                  height: 24
                                }}
                              />
                            )}
                            {item.selectedColor && (
                              <Chip
                                label={item.selectedColor}
                                size="small"
                                sx={{
                                  bgcolor: alpha(premiumColors.gold, 0.1),
                                  color: premiumColors.gold,
                                  fontSize: '0.7rem',
                                  height: 24
                                }}
                              />
                            )}
                          </Box>
                        </TableCell>
                        <TableCell align="center" sx={{ borderBottom: `1px solid ${alpha(premiumColors.gold, 0.1)}` }}>
                          <Typography sx={{ 
                            color: premiumColors.white, 
                            fontWeight: 700,
                            fontSize: '0.95rem'
                          }}>
                            {item.quantity}
                          </Typography>
                        </TableCell>
                        <TableCell align="right" sx={{ borderBottom: `1px solid ${alpha(premiumColors.gold, 0.1)}` }}>
                          <Typography sx={{ color: premiumColors.textSecondary, fontSize: '0.9rem' }}>
                            {item.price?.toFixed(2)} DT
                          </Typography>
                        </TableCell>
                        <TableCell align="right" sx={{ borderBottom: `1px solid ${alpha(premiumColors.gold, 0.1)}` }}>
                          <Typography sx={{ 
                            color: premiumColors.gold, 
                            fontWeight: 700,
                            fontSize: '0.95rem'
                          }}>
                            {(item.price * item.quantity).toFixed(2)} DT
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>

      {/* CLEAN FOOTER ACTIONS */}
      <DialogActions sx={{ 
        borderTop: `1px solid ${alpha(premiumColors.gold, 0.15)}`,
        p: 3,
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <Box>
          {/* DELETE BUTTON IN MODAL - ALWAYS VISIBLE FOR ALL USERS */}
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
                bgcolor: alpha(premiumColors.cancelled, 0.1),
                transform: 'translateY(-2px)',
                boxShadow: `0 8px 16px -4px ${alpha(premiumColors.cancelled, 0.2)}`
              },
              transition: 'all 0.2s ease'
            }}
          >
            Supprimer
          </Button>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
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
                bgcolor: premiumColors.goldDark,
                transform: 'translateY(-2px)',
                boxShadow: `0 8px 16px -4px ${alpha(premiumColors.gold, 0.4)}`
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

// ============ MAIN ORDER COMPONENT ============
const Order = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
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
    confirmed: 0,
    processing: 0,
    shipped: 0,
    delivered: 0,
    cancelled: 0,
    today: 0,
    revenue: 0
  });

  // ============ API FUNCTIONS ============
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/api/orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success) {
        setOrders(data.data);
        applyFilters(data.data);
        calculateStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      showSnackbar('Erreur lors du chargement des commandes', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderById = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/api/orders/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setSelectedOrder(data.data);
        setDetailsOpen(true);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      showSnackbar('Erreur lors du chargement de la commande', 'error');
    }
  };

  const updateOrderStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/api/orders/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      const data = await response.json();
      
      if (data.success) {
        const updatedOrders = orders.map(order => 
          order._id === id ? { ...order, status: newStatus } : order
        );
        setOrders(updatedOrders);
        applyFilters(updatedOrders);
        calculateStats(updatedOrders);
        
        if (selectedOrder && selectedOrder._id === id) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
        
        showSnackbar(`Statut mis à jour: ${statusConfig[newStatus].label}`, 'success');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      showSnackbar('Erreur lors de la mise à jour du statut', 'error');
    }
  };

  // ============ DELETE ORDER FUNCTION ============
  const deleteOrder = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/api/orders/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        const updatedOrders = orders.filter(order => order._id !== id);
        setOrders(updatedOrders);
        applyFilters(updatedOrders);
        calculateStats(updatedOrders);
        
        if (selectedOrder && selectedOrder._id === id) {
          setDetailsOpen(false);
          setSelectedOrder(null);
        }
        
        showSnackbar('Commande supprimée avec succès', 'success');
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      showSnackbar('Erreur lors de la suppression de la commande', 'error');
    }
  };

  // ============ UTILITY FUNCTIONS ============
  const calculateStats = (ordersData) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const stats = {
      total: ordersData.length,
      pending: ordersData.filter(o => o.status === 'pending').length,
      confirmed: ordersData.filter(o => o.status === 'confirmed').length,
      processing: ordersData.filter(o => o.status === 'processing').length,
      shipped: ordersData.filter(o => o.status === 'shipped').length,
      delivered: ordersData.filter(o => o.status === 'delivered').length,
      cancelled: ordersData.filter(o => o.status === 'cancelled').length,
      today: ordersData.filter(o => new Date(o.createdAt) >= today).length,
      revenue: ordersData
        .filter(o => o.status !== 'cancelled')
        .reduce((sum, o) => sum + o.total, 0)
    };
    
    setStats(stats);
  };

  const applyFilters = (ordersData) => {
    let filtered = [...ordersData];

    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.phone.includes(searchTerm)
      );
    }

    if (statusFilter.length > 0) {
      filtered = filtered.filter(order => statusFilter.includes(order.status));
    }

    if (dateFilter) {
      const filterDate = new Date(dateFilter).setHours(0, 0, 0, 0);
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.createdAt).setHours(0, 0, 0, 0);
        return orderDate === filterDate;
      });
    }

    filtered.sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];
      
      if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      }
      if (sortBy === 'total') {
        valA = parseFloat(valA);
        valB = parseFloat(valB);
      }
      
      return sortOrder === 'asc' ? valA - valB : valB - valA;
    });

    setFilteredOrders(filtered);
  };

  const getStatusCount = (status) => {
    return orders.filter(o => o.status === status).length;
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setDetailsOpen(true);
  };

  const handleDeleteClick = (order) => {
    setOrderToDelete(order);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = (id) => {
    deleteOrder(id);
    setOrderToDelete(null);
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
    fetchOrders();
    showSnackbar('Données actualisées', 'success');
  };

  const exportToCSV = () => {
    const headers = ['Numéro', 'Date', 'Client', 'Email', 'Téléphone', 'Total', 'Statut', 'Paiement'];
    const data = filteredOrders.map(order => [
      order.orderNumber,
      format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm'),
      order.customer.fullName,
      order.customer.email,
      order.customer.phone,
      order.total.toFixed(2),
      statusConfig[order.status]?.label || order.status,
      order.paymentMethod === 'cash' ? 'Paiement livraison' : 
      order.paymentMethod === 'card' ? 'Carte' : 'Virement'
    ]);
    
    const csv = [headers, ...data].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `commandes_${format(new Date(), 'yyyyMMdd_HHmm')}.csv`;
    a.click();
    
    showSnackbar('Export CSV réussi', 'success');
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    applyFilters(orders);
  }, [searchTerm, statusFilter, dateFilter, sortBy, sortOrder]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={frLocale}>
      {/* WHITE BACKGROUND */}
      <Box sx={{ 
        width: '90%',
        minHeight: '100vh',
        bgcolor: '#ffffff', // PURE WHITE BACKGROUND
        py: { xs: 2, lg: 2 },
        ml:10
      }}>
        {/* CENTERED CONTAINER */}
        <Box sx={{
          maxWidth: '1600px',
          width: '95%',
          mx: 'auto'
        }}>
          {/* Header Section - Adjusted for white background */}
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
                Gestion des Commandes
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
                <Store sx={{ fontSize: '1.1rem', color: premiumColors.goldDark }} />
                {filteredOrders.length} commande{filteredOrders.length > 1 ? 's' : ''} affichée{filteredOrders.length > 1 ? 's' : ''}
                {filteredOrders.length !== orders.length && ` (sur ${orders.length} total)`}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2,  }}>
              <Tooltip title="Exporter CSV" arrow>
                <IconButton
                  onClick={exportToCSV}
                  sx={{
                    color: premiumColors.goldDark,
                    bgcolor: alpha(premiumColors.noir, 1),
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
                    color: premiumColors.goldDark,
                    bgcolor: alpha(premiumColors.noir, 1),
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

          {/* Statistics Cards - BLACK CARDS */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Total Commandes"
                value={stats.total}
                subtitle={`+${stats.today} aujourd'hui`}
                icon={<ShoppingBag />}
                color={premiumColors.gold}
                trend={stats.total > 0 ? ((stats.today / stats.total) * 100).toFixed(0) : 0}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="En attente"
                value={stats.pending}
                subtitle={`${((stats.pending / stats.total) * 100 || 0).toFixed(1)}% du total`}
                icon={<AccessTime />}
                color={premiumColors.pending}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Livrées"
                value={stats.delivered}
                subtitle={`${((stats.delivered / stats.total) * 100 || 0).toFixed(1)}% du total`}
                icon={<CheckCircle />}
                color={premiumColors.delivered}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Chiffre d'affaires"
                value={`${stats.revenue.toFixed(2)} DT`}
                subtitle={`Moyenne: ${(stats.revenue / (stats.total - stats.cancelled) || 0).toFixed(2)} DT`}
                icon={<AttachMoney />}
                color={premiumColors.gold}
              />
            </Grid>
          </Grid>

          {/* Filters Section - Light background with black text */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 4,
              bgcolor: premiumColors.gold ,
              border: '1px solid #e0e0e0',
              borderRadius: 3
            }}
          >
            <Grid container spacing={2} alignItems="center">
              {/* Search */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Rechercher par numéro, nom, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  size="small"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ color: premiumColors.gold }} />
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

              {/* Status Filter */}
              <Grid item xs={12} md={3}>
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
                    Statut de la commande
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
                          secondary={`${getStatusCount(status)} commande${getStatusCount(status) > 1 ? 's' : ''}`}
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
              <Grid item xs={12} md={3}>
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
              <Grid item xs={12} md={2}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter([]);
                    setDateFilter(null);
                  }}
                  startIcon={<FilterList />}
                  sx={{
                    color: premiumColors.goldDark,
                    borderColor: premiumColors.gold,
                    borderWidth: 1.5,
                    bgcolor: '#ffffff',
                    py: 1,
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    borderRadius: 2,
                    '&:hover': {
                      borderColor: premiumColors.goldDark,
                      bgcolor: alpha(premiumColors.gold, 0.05)
                    }
                  }}
                >
                  Réinitialiser
                </Button>
              </Grid>
            </Grid>
          </Paper>

          {/* Sort Bar - Adjusted for white background */}
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
              onClick={() => handleSort('total')}
              endIcon={sortBy === 'total' && (sortOrder === 'asc' ? <ArrowUpward /> : <ArrowDownward />)}
              sx={{
                color: sortBy === 'total' ? premiumColors.goldDark : '#666666',
                fontSize: '0.8rem',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': { 
                  color: premiumColors.goldDark,
                  bgcolor: 'transparent'
                }
              }}
            >
              Total
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

          {/* Orders List - BLACK CARDS */}
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
          ) : filteredOrders.length === 0 ? (
            <Paper
              sx={{
                p: 8,
                textAlign: 'center',
                bgcolor: premiumColors.surface,
                border: `1px solid ${alpha(premiumColors.gold, 0.15)}`,
                borderRadius: 3
              }}
            >
              <ShoppingBag sx={{ fontSize: 80, color: alpha(premiumColors.gold, 0.3), mb: 2 }} />
              <Typography
                variant="h5"
                sx={{
                  color: premiumColors.white,
                  fontFamily: "'Fjalla One', sans-serif",
                  fontWeight: 700,
                  mb: 1
                }}
              >
                Aucune commande trouvée
              </Typography>
              <Typography sx={{ color: premiumColors.textMuted, fontSize: '0.95rem' }}>
                Essayez de modifier vos filtres
              </Typography>
            </Paper>
          ) : (
            <Box>
              {filteredOrders
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((order) => (
                  <OrderCard
                    key={order._id}
                    order={order}
                    onView={handleViewOrder}
                    onStatusUpdate={updateOrderStatus}
                    onDelete={handleDeleteClick}
                  />
                ))}
              
              <TablePagination
                component="div"
                count={filteredOrders.length}
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

        {/* Order Details Modal - REDESIGNED CLEAN VERSION */}
        <OrderDetailsModal
          open={detailsOpen}
          onClose={() => setDetailsOpen(false)}
          order={selectedOrder}
          onStatusUpdate={updateOrderStatus}
          onDelete={handleDeleteClick}
        />

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmDialog
          open={deleteDialogOpen}
          onClose={() => {
            setDeleteDialogOpen(false);
            setOrderToDelete(null);
          }}
          onConfirm={handleDeleteConfirm}
          order={orderToDelete}
        />

        {/* Snackbar - Adjusted for white background */}
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
              boxShadow: premiumColors.shadowLg,
              '& .MuiAlert-icon': {
                color: snackbar.severity === 'success' ? premiumColors.success : 
                       snackbar.severity === 'error' ? premiumColors.error : 
                       premiumColors.gold
              }
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
          
          ::-webkit-scrollbar {
            width: 10px;
            height: 10px;
          }
          
          ::-webkit-scrollbar-track {
            background: #f0f0f0;
          }
          
          ::-webkit-scrollbar-thumb {
            background: ${alpha(premiumColors.gold, 0.3)};
            border-radius: 5px;
            border: 2px solid #f0f0f0;
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background: ${alpha(premiumColors.gold, 0.5)};
          }
        `}</style>
      </Box>
    </LocalizationProvider>
  );
};

export default Order;