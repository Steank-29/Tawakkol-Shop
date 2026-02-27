// Facture.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
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
  TablePagination,
  Card,
  CardContent,
  Grid,
  Avatar,
  Tooltip,
  LinearProgress,
  Alert,
  Snackbar,
  FormControl,
  Select,
  ListItemText,
  Checkbox,
  Zoom,
  Badge,
  alpha,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  Divider
} from '@mui/material';
import {
  Search,
  Refresh,
  Visibility,
  Close,
  Email,
  Phone,
  Person,
  AttachMoney,
  CalendarToday,
  AccessTime,
  ArrowUpward,
  ArrowDownward,
  Delete,
  Warning,
  Info,
  LocalShipping,
  Payment,
  LocationOn,
  ShoppingBag,
  Receipt,
  CheckCircle,
  Cancel,
  Schedule,
  FileDownload,
  Inventory
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import frLocale from 'date-fns/locale/fr';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import API_BASE from '../Config/api';

// ============ PREMIUM COLOR PALETTE ============
const premiumColors = {
  gold: '#d4af37',
  goldDark: '#b8941f',
  noir: '#000000',
  charcoal: '#0a0a0a',
  surface: '#121212',
  surfaceLight: '#1e1e1e',
  white: '#ffffff',
  textPrimary: '#ffffff',
  textSecondary: '#e0e0e0',
  textMuted: '#9e9e9e',
  
  pending: '#f59e0b',
  confirmed: '#3b82f6',
  processing: '#8b5cf6',
  shipped: '#06b6d4',
  delivered: '#10b981',
  cancelled: '#ef4444',
  
  pendingBg: 'rgba(245, 158, 11, 0.15)',
  confirmedBg: 'rgba(59, 130, 246, 0.15)',
  processingBg: 'rgba(139, 92, 246, 0.15)',
  shippedBg: 'rgba(6, 182, 212, 0.15)',
  deliveredBg: 'rgba(16, 185, 129, 0.15)',
  cancelledBg: 'rgba(239, 68, 68, 0.15)',
  
  cash: '#10b981',
  card: '#3b82f6',
  bank_transfer: '#8b5cf6',
  
  cashBg: 'rgba(16, 185, 129, 0.15)',
  cardBg: 'rgba(59, 130, 246, 0.15)',
  bankTransferBg: 'rgba(139, 92, 246, 0.15)',
  
  shadowGold: '0 10px 30px -5px rgba(212, 175, 55, 0.2)'
};

// ============ STATUS CONFIGURATION ============
const statusConfig = {
  pending: { label: 'En attente', color: premiumColors.pending, bgColor: premiumColors.pendingBg, icon: <Schedule />, step: 0 },
  confirmed: { label: 'Confirmée', color: premiumColors.confirmed, bgColor: premiumColors.confirmedBg, icon: <CheckCircle />, step: 1 },
  processing: { label: 'En préparation', color: premiumColors.processing, bgColor: premiumColors.processingBg, icon: <Inventory />, step: 2 },
  shipped: { label: 'Expédiée', color: premiumColors.shipped, bgColor: premiumColors.shippedBg, icon: <LocalShipping />, step: 3 },
  delivered: { label: 'Livrée', color: premiumColors.delivered, bgColor: premiumColors.deliveredBg, icon: <CheckCircle />, step: 4 },
  cancelled: { label: 'Annulée', color: premiumColors.cancelled, bgColor: premiumColors.cancelledBg, icon: <Cancel />, step: -1 }
};

// ============ PAYMENT METHOD CONFIG ============
const paymentConfig = {
  cash: { label: 'Espèces', color: premiumColors.cash, bgColor: premiumColors.cashBg, icon: <AttachMoney /> },
  card: { label: 'Carte', color: premiumColors.card, bgColor: premiumColors.cardBg, icon: <Payment /> },
  bank_transfer: { label: 'Virement', color: premiumColors.bank_transfer, bgColor: premiumColors.bankTransferBg, icon: <Payment /> }
};

// Helper function for safe alpha
const safeAlpha = (color, value) => {
  if (!color) return 'rgba(0,0,0,0.1)';
  try {
    return alpha(color, value);
  } catch (error) {
    console.warn('Error applying alpha to color:', color);
    return 'rgba(0,0,0,0.1)';
  }
};

// ============ STATISTICS CARD COMPONENT ============
const StatCard = React.memo(({ title, value, subtitle, icon, color }) => (
  <Zoom in timeout={400}>
    <Card elevation={0} sx={{
      bgcolor: premiumColors.surface,
      border: `1px solid ${safeAlpha(premiumColors.gold, 0.15)}`,
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
        background: `linear-gradient(90deg, ${color || premiumColors.gold}, ${premiumColors.gold})`,
        opacity: 0.8
      },
      '&:hover': {
        transform: 'translateY(-8px)',
        boxShadow: premiumColors.shadowGold,
        borderColor: safeAlpha(premiumColors.gold, 0.3),
        bgcolor: premiumColors.charcoal
      }
    }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography sx={{ color: premiumColors.textMuted, fontSize: '0.85rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', mb: 1 }}>
              {title}
            </Typography>
            <Typography variant="h4" sx={{ color: premiumColors.white, fontFamily: "'Fjalla One', sans-serif", fontWeight: 700, fontSize: '2rem', lineHeight: 1.2, mb: 0.5 }}>
              {typeof value === 'number' ? value.toLocaleString('fr-FR') : value}
            </Typography>
            {subtitle && (
              <Typography sx={{ color: premiumColors.textMuted, fontSize: '0.75rem' }}>
                {subtitle}
              </Typography>
            )}
          </Box>
          <Avatar sx={{ bgcolor: safeAlpha(color || premiumColors.gold, 0.15), color: color || premiumColors.gold, width: 56, height: 56, borderRadius: 2, '& svg': { fontSize: '2rem' } }}>
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  </Zoom>
));

// ============ ORDER CARD COMPONENT ============
const OrderCard = React.memo(({ order, onView, onStatusUpdate, onDelete, onGeneratePDF }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const userRole = localStorage.getItem('userRole');
  const status = statusConfig[order?.status] || statusConfig.pending;

  const handleMenuOpen = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => setAnchorEl(null);
  
  const handleStatusChange = (newStatus) => {
    if (order?._id) {
      onStatusUpdate(order._id, newStatus);
    }
    handleMenuClose();
  };

  if (!order) return null;

  return (
    <Zoom in timeout={400}>
      <Paper elevation={0} onClick={() => onView(order)} sx={{
        p: 2.5, mb: 2, bgcolor: premiumColors.surface,
        border: `1px solid ${safeAlpha(premiumColors.gold, 0.15)}`,
        borderRadius: 3, position: 'relative', overflow: 'hidden',
        cursor: 'pointer', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        opacity: order.status === 'cancelled' ? 0.8 : 1,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '6px',
          height: '100%',
          background: `linear-gradient(180deg, ${status.color || premiumColors.gold}, ${premiumColors.gold})`,
          opacity: 0.8
        },
        '&:hover': {
          transform: 'translateY(-4px) scale(1.01)',
          boxShadow: premiumColors.shadowGold,
          borderColor: safeAlpha(premiumColors.gold, 0.3),
          bgcolor: premiumColors.charcoal
        }
      }}>
        <Grid container spacing={2} alignItems="center">
          {/* Order Info */}
          <Grid item xs={12} md={2.5}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Badge overlap="circular" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                badgeContent={
                  <Tooltip title={status.label}>
                    <Avatar sx={{ bgcolor: status.color || premiumColors.gold, width: 16, height: 16, border: `2px solid ${premiumColors.surface}` }}>
                      {status.icon}
                    </Avatar>
                  </Tooltip>
                }>
                <Avatar sx={{ bgcolor: safeAlpha(premiumColors.gold, 0.1), color: premiumColors.gold, width: 52, height: 52, borderRadius: 2, fontSize: '1.3rem', fontWeight: 700 }}>
                  {order.orderNumber?.slice(-4) || 'N/A'}
                </Avatar>
              </Badge>
              <Box>
                <Typography sx={{ color: premiumColors.white, fontFamily: "'Fjalla One', sans-serif", fontSize: '1rem', fontWeight: 700, mb: 0.5 }}>
                  {order.orderNumber || 'N/A'}
                </Typography>
                <Typography sx={{ color: premiumColors.textMuted, fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Person sx={{ fontSize: '0.7rem' }} />
                  {order.customer?.fullName?.length > 20 ? `${order.customer.fullName.substring(0, 20)}...` : order.customer?.fullName || 'N/A'}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Customer & Items */}
          <Grid item xs={12} md={3.5}>
            <Box sx={{ pl: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                <Chip size="small" label={`${order.items?.length || 0} article${order.items?.length > 1 ? 's' : ''}`}
                  sx={{ bgcolor: safeAlpha(premiumColors.gold, 0.1), color: premiumColors.gold, fontSize: '0.65rem', height: 22 }} />
                {order.paymentMethod && paymentConfig[order.paymentMethod] && (
                  <Chip icon={paymentConfig[order.paymentMethod]?.icon} label={paymentConfig[order.paymentMethod]?.label}
                    size="small" sx={{ bgcolor: paymentConfig[order.paymentMethod]?.bgColor || safeAlpha(premiumColors.gold, 0.1), color: paymentConfig[order.paymentMethod]?.color || premiumColors.gold, fontSize: '0.65rem', height: 22 }} />
                )}
              </Box>
              <Typography sx={{ color: premiumColors.textSecondary, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Email sx={{ fontSize: '0.7rem' }} /> {order.customer?.email || 'N/A'}
              </Typography>
            </Box>
          </Grid>

          {/* Total & Date */}
          <Grid item xs={12} md={2.5}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography sx={{ color: premiumColors.gold, fontFamily: "'Fjalla One', sans-serif", fontSize: '1.1rem', fontWeight: 700, mb: 0.5 }}>
                {order.total?.toLocaleString('fr-FR') || '0'} DT
              </Typography>
              <Typography sx={{ color: premiumColors.textMuted, fontSize: '0.7rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                <CalendarToday sx={{ fontSize: '0.7rem' }} />
                {order.createdAt ? format(new Date(order.createdAt), 'dd/MM/yyyy') : 'N/A'}
              </Typography>
            </Box>
          </Grid>

          {/* Actions */}
          <Grid item xs={12} md={3.5}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1 }}>
              {/* PDF Button */}
              <Tooltip title="Générer PDF" arrow>
                <IconButton onClick={(e) => { e.stopPropagation(); onGeneratePDF(order); }}
                  sx={{ color: premiumColors.textSecondary, bgcolor: safeAlpha(premiumColors.gold, 0.08), width: 36, height: 36, borderRadius: 2,
                    '&:hover': { bgcolor: safeAlpha(premiumColors.gold, 0.2), color: premiumColors.gold } }}>
                  <Receipt fontSize="small" />
                </IconButton>
              </Tooltip>

              {/* View Button */}
              <Tooltip title="Voir détails" arrow>
                <IconButton onClick={(e) => { e.stopPropagation(); onView(order); }}
                  sx={{ color: premiumColors.textSecondary, bgcolor: safeAlpha(premiumColors.gold, 0.08), width: 36, height: 36, borderRadius: 2,
                    '&:hover': { bgcolor: safeAlpha(premiumColors.gold, 0.2), color: premiumColors.gold } }}>
                  <Visibility fontSize="small" />
                </IconButton>
              </Tooltip>

              {/* Status Update Menu */}
              {order.status !== 'cancelled' && order.status !== 'delivered' && (
                <>
                  <Button variant="contained" onClick={handleMenuOpen} size="small"
                    sx={{ bgcolor: safeAlpha(premiumColors.gold, 0.9), color: premiumColors.noir, px: 2, py: 0.5, fontSize: '0.7rem', fontWeight: 800,
                      textTransform: 'none', borderRadius: 2, '&:hover': { bgcolor: premiumColors.gold } }}>
                    Mettre à jour
                  </Button>
                  <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}
                    onClick={(e) => e.stopPropagation()} PaperProps={{
                      sx: { bgcolor: premiumColors.surface, border: `1px solid ${safeAlpha(premiumColors.gold, 0.2)}`, borderRadius: 2, mt: 1, minWidth: 200 }
                    }}>
                    {Object.entries(statusConfig).map(([key, config]) => {
                      if (key === order.status || key === 'cancelled') return null;
                      return (
                        <MenuItem key={key} onClick={() => handleStatusChange(key)}
                          sx={{ color: premiumColors.white, gap: 1, '&:hover': { bgcolor: config.bgColor || safeAlpha(premiumColors.gold, 0.1) } }}>
                          {config.icon}
                          <Box>
                            <Typography sx={{ fontSize: '0.85rem', fontWeight: 600 }}>{config.label}</Typography>
                          </Box>
                        </MenuItem>
                      );
                    })}
                  </Menu>
                </>
              )}

              {/* Delete Button - Super Admin only */}
              {userRole === 'super-admin' && (
                <Tooltip title="Supprimer" arrow>
                  <IconButton onClick={(e) => { e.stopPropagation(); onDelete(order); }}
                    sx={{ color: safeAlpha(premiumColors.cancelled, 0.7), bgcolor: safeAlpha(premiumColors.cancelled, 0.08), width: 36, height: 36, borderRadius: 2,
                      '&:hover': { bgcolor: safeAlpha(premiumColors.cancelled, 0.15), color: premiumColors.cancelled } }}>
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
});

// ============ ORDER DETAILS MODAL ============
const OrderDetailsModal = React.memo(({ open, onClose, order, onStatusUpdate, onDelete, onGeneratePDF }) => {
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
    if (order?._id) {
      onStatusUpdate(order._id, newStatus);
    }
    handleStatusMenuClose();
  };

  const steps = ['En attente', 'Confirmée', 'En préparation', 'Expédiée', 'Livrée'];
  const activeStep = statusConfig[order.status]?.step ?? 0;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth
      PaperProps={{ sx: { bgcolor: premiumColors.surface, border: `1px solid ${safeAlpha(premiumColors.gold, 0.2)}`, borderRadius: 3, boxShadow: premiumColors.shadowGold } }}>
      
      {/* Header */}
      <DialogTitle sx={{ borderBottom: `1px solid ${safeAlpha(premiumColors.gold, 0.15)}`, p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Avatar sx={{ bgcolor: safeAlpha(premiumColors.gold, 0.1), color: premiumColors.gold, width: 56, height: 56, borderRadius: 2, fontSize: '1.5rem', fontWeight: 700 }}>
              {order.orderNumber?.slice(-4) || 'N/A'}
            </Avatar>
            <Box>
              <Typography variant="h5" sx={{ color: premiumColors.white, fontFamily: "'Fjalla One', sans-serif", fontWeight: 700, mb: 0.5 }}>
                Commande {order.orderNumber || 'N/A'}
              </Typography>
              <Box sx={{ display: 'flex', gap: 3 }}>
                <Typography sx={{ color: premiumColors.textMuted, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <CalendarToday sx={{ fontSize: '0.8rem' }} />
                  {order.createdAt ? format(new Date(order.createdAt), 'dd MMMM yyyy', { locale: fr }) : 'N/A'}
                </Typography>
                <Typography sx={{ color: premiumColors.textMuted, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <AccessTime sx={{ fontSize: '0.8rem' }} />
                  {order.createdAt ? format(new Date(order.createdAt), 'HH:mm', { locale: fr }) : 'N/A'}
                </Typography>
              </Box>
            </Box>
          </Box>
          <IconButton onClick={onClose} sx={{ color: premiumColors.textMuted, bgcolor: safeAlpha(premiumColors.gold, 0.05), width: 40, height: 40,
            '&:hover': { bgcolor: safeAlpha(premiumColors.gold, 0.15), color: premiumColors.gold } }}>
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Status Stepper */}
          <Grid item xs={12}>
            <Paper elevation={0} sx={{ p: 3, bgcolor: safeAlpha(premiumColors.surfaceLight, 0.5), border: `1px solid ${safeAlpha(premiumColors.gold, 0.1)}`, borderRadius: 2 }}>
              <Stepper activeStep={activeStep} alternativeLabel connector={<StepConnector sx={{ '& .MuiStepConnector-line': { borderColor: safeAlpha(premiumColors.gold, 0.3) } }} />}>
                {steps.map((label, index) => (
                  <Step key={label}>
                    <StepLabel StepIconProps={{ sx: { '&.Mui-active': { color: premiumColors.gold }, '&.Mui-completed': { color: premiumColors.delivered } } }}>
                      <Typography sx={{ color: index <= activeStep ? premiumColors.white : premiumColors.textMuted, fontSize: '0.8rem' }}>
                        {label}
                      </Typography>
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Paper>
          </Grid>

          {/* Customer Information */}
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 3, bgcolor: safeAlpha(premiumColors.surfaceLight, 0.5), border: `1px solid ${safeAlpha(premiumColors.gold, 0.1)}`, borderRadius: 2, height: '100%' }}>
              <Typography sx={{ color: premiumColors.gold, fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Person sx={{ fontSize: '1rem' }} /> INFORMATIONS CLIENT
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: safeAlpha(premiumColors.info, 0.1), color: premiumColors.info, width: 40, height: 40, borderRadius: 1.5 }}>
                    <Person sx={{ fontSize: '1.1rem' }} />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ color: premiumColors.textMuted, fontSize: '0.7rem', mb: 0.25 }}>Nom complet</Typography>
                    <Typography sx={{ color: premiumColors.white, fontSize: '0.95rem', fontWeight: 500 }}>{order.customer?.fullName || 'N/A'}</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: safeAlpha(premiumColors.info, 0.1), color: premiumColors.info, width: 40, height: 40, borderRadius: 1.5 }}>
                    <Email sx={{ fontSize: '1.1rem' }} />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ color: premiumColors.textMuted, fontSize: '0.7rem', mb: 0.25 }}>Email</Typography>
                    <Typography sx={{ color: premiumColors.white, fontSize: '0.95rem', wordBreak: 'break-all' }}>{order.customer?.email || 'N/A'}</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: safeAlpha(premiumColors.success, 0.1), color: premiumColors.success, width: 40, height: 40, borderRadius: 1.5 }}>
                    <Phone sx={{ fontSize: '1.1rem' }} />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ color: premiumColors.textMuted, fontSize: '0.7rem', mb: 0.25 }}>Téléphone</Typography>
                    <Typography sx={{ color: premiumColors.white, fontSize: '0.95rem' }}>{order.customer?.phone || 'N/A'}</Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: safeAlpha(premiumColors.warning, 0.1), color: premiumColors.warning, width: 40, height: 40, borderRadius: 1.5 }}>
                    <LocationOn sx={{ fontSize: '1.1rem' }} />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ color: premiumColors.textMuted, fontSize: '0.7rem', mb: 0.25 }}>Adresse</Typography>
                    <Typography sx={{ color: premiumColors.white, fontSize: '0.95rem' }}>
                      {order.customer?.address || 'N/A'}, {order.customer?.city || 'N/A'} {order.customer?.postalCode || ''}, {order.customer?.country || 'Tunisie'}
                    </Typography>
                  </Box>
                </Box>

                {order.customer?.clothingSize && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar sx={{ bgcolor: safeAlpha(premiumColors.gold, 0.1), color: premiumColors.gold, width: 40, height: 40, borderRadius: 1.5 }}>
                      <ShoppingBag sx={{ fontSize: '1.1rem' }} />
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ color: premiumColors.textMuted, fontSize: '0.7rem', mb: 0.25 }}>Taille</Typography>
                      <Typography sx={{ color: premiumColors.white, fontSize: '0.95rem' }}>{order.customer?.clothingSize}</Typography>
                    </Box>
                  </Box>
                )}
              </Box>
            </Paper>
          </Grid>

          {/* Order Summary */}
          <Grid item xs={12} md={6}>
            <Paper elevation={0} sx={{ p: 3, bgcolor: safeAlpha(premiumColors.surfaceLight, 0.5), border: `1px solid ${safeAlpha(premiumColors.gold, 0.1)}`, borderRadius: 2, height: '100%' }}>
              <Typography sx={{ color: premiumColors.gold, fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <AttachMoney sx={{ fontSize: '1rem' }} /> RÉCAPITULATIF
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: safeAlpha(status.color || premiumColors.gold, 0.1), color: status.color || premiumColors.gold, width: 40, height: 40, borderRadius: 1.5 }}>
                    {status.icon}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ color: premiumColors.textMuted, fontSize: '0.7rem', mb: 0.25 }}>Statut</Typography>
                    <Chip icon={status.icon} label={status.label} sx={{ bgcolor: status.bgColor || safeAlpha(premiumColors.gold, 0.1), color: status.color || premiumColors.gold, border: `1px solid ${safeAlpha(status.color || premiumColors.gold, 0.3)}`, fontWeight: 700 }} />
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: safeAlpha(paymentConfig[order.paymentMethod]?.color || premiumColors.gold, 0.1), color: paymentConfig[order.paymentMethod]?.color || premiumColors.gold, width: 40, height: 40, borderRadius: 1.5 }}>
                    {paymentConfig[order.paymentMethod]?.icon || <Payment />}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ color: premiumColors.textMuted, fontSize: '0.7rem', mb: 0.25 }}>Mode de paiement</Typography>
                    <Typography sx={{ color: premiumColors.white, fontSize: '0.95rem' }}>{paymentConfig[order.paymentMethod]?.label || order.paymentMethod || 'N/A'}</Typography>
                  </Box>
                </Box>

                <Divider sx={{ borderColor: safeAlpha(premiumColors.gold, 0.1), my: 1 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography sx={{ color: premiumColors.textMuted, fontSize: '0.85rem' }}>Sous-total</Typography>
                  <Typography sx={{ color: premiumColors.white, fontSize: '0.95rem' }}>{order.subtotal?.toFixed(2) || '0'} DT</Typography>
                </Box>

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography sx={{ color: premiumColors.textMuted, fontSize: '0.85rem' }}>Livraison</Typography>
                  <Typography sx={{ color: premiumColors.white, fontSize: '0.95rem' }}>{order.shippingCost?.toFixed(2) || '7.00'} DT</Typography>
                </Box>

                {order.tax > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography sx={{ color: premiumColors.textMuted, fontSize: '0.85rem' }}>TVA</Typography>
                    <Typography sx={{ color: premiumColors.white, fontSize: '0.95rem' }}>{order.tax?.toFixed(2)} DT</Typography>
                  </Box>
                )}

                <Divider sx={{ borderColor: safeAlpha(premiumColors.gold, 0.2), my: 1 }} />

                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography sx={{ color: premiumColors.gold, fontSize: '1.1rem', fontWeight: 700 }}>Total</Typography>
                  <Typography sx={{ color: premiumColors.gold, fontSize: '1.3rem', fontWeight: 800, fontFamily: "'Fjalla One', sans-serif" }}>
                    {order.total?.toFixed(2) || '0'} DT
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Order Items */}
          <Grid item xs={12}>
            <Paper elevation={0} sx={{ p: 3, bgcolor: safeAlpha(premiumColors.surfaceLight, 0.5), border: `1px solid ${safeAlpha(premiumColors.gold, 0.1)}`, borderRadius: 2 }}>
              <Typography sx={{ color: premiumColors.gold, fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
                <ShoppingBag sx={{ fontSize: '1rem' }} /> ARTICLES COMMANDÉS ({order.items?.length || 0})
              </Typography>

              {order.items && order.items.length > 0 ? (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow sx={{ '& th': { borderBottom: `1px solid ${safeAlpha(premiumColors.gold, 0.2)}`, color: premiumColors.textMuted, fontWeight: 600, fontSize: '0.75rem' } }}>
                        <TableCell>Produit</TableCell>
                        <TableCell align="center">Taille</TableCell>
                        <TableCell align="center">Couleur</TableCell>
                        <TableCell align="right">Prix unitaire</TableCell>
                        <TableCell align="center">Quantité</TableCell>
                        <TableCell align="right">Total</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {order.items.map((item, index) => (
                        <TableRow key={index} sx={{ '& td': { borderBottom: `1px solid ${safeAlpha(premiumColors.gold, 0.1)}`, color: premiumColors.white } }}>
                          <TableCell sx={{ color: premiumColors.white, fontSize: '0.85rem' }}>{item.name || 'N/A'}</TableCell>
                          <TableCell align="center" sx={{ color: premiumColors.white, fontSize: '0.85rem' }}>{item.selectedSize || '-'}</TableCell>
                          <TableCell align="center">
                            {item.selectedColor ? (
                              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                                <Box sx={{ width: 16, height: 16, borderRadius: '50%', bgcolor: item.selectedColor.toLowerCase(), border: '1px solid rgba(255,255,255,0.3)' }} />
                                <Typography sx={{ color: premiumColors.white, fontSize: '0.85rem' }}>{item.selectedColor}</Typography>
                              </Box>
                            ) : '-'}
                          </TableCell>
                          <TableCell align="right" sx={{ color: premiumColors.white, fontSize: '0.85rem' }}>{item.price?.toFixed(2) || '0'} DT</TableCell>
                          <TableCell align="center" sx={{ color: premiumColors.white, fontSize: '0.85rem' }}>{item.quantity || 0}</TableCell>
                          <TableCell align="right" sx={{ color: premiumColors.gold, fontSize: '0.85rem', fontWeight: 600 }}>{((item.price || 0) * (item.quantity || 0)).toFixed(2)} DT</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography sx={{ color: premiumColors.textMuted, textAlign: 'center', py: 3 }}>
                  Aucun article dans cette commande
                </Typography>
              )}

              {order.customer?.notes && (
                <Box sx={{ mt: 3, p: 2, bgcolor: safeAlpha(premiumColors.info, 0.05), borderRadius: 2, border: `1px solid ${safeAlpha(premiumColors.info, 0.2)}` }}>
                  <Typography sx={{ color: premiumColors.info, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Info sx={{ fontSize: '1rem' }} /> Notes du client
                  </Typography>
                  <Typography sx={{ color: premiumColors.textSecondary, fontSize: '0.9rem' }}>{order.customer?.notes}</Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </DialogContent>

      {/* Footer Actions */}
      <DialogActions sx={{ borderTop: `1px solid ${safeAlpha(premiumColors.gold, 0.15)}`, p: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Box>
          {userRole === 'super-admin' && (
            <Button variant="outlined" onClick={() => onDelete(order)} startIcon={<Delete />}
              sx={{ color: premiumColors.cancelled, borderColor: safeAlpha(premiumColors.cancelled, 0.3), borderWidth: 1.5, px: 3, py: 1,
                fontSize: '0.85rem', fontWeight: 600, textTransform: 'none', borderRadius: 2,
                '&:hover': { borderColor: premiumColors.cancelled, bgcolor: safeAlpha(premiumColors.cancelled, 0.1) } }}>
              Supprimer
            </Button>
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" onClick={() => onGeneratePDF(order)} startIcon={<Receipt />}
            sx={{ color: premiumColors.gold, borderColor: safeAlpha(premiumColors.gold, 0.3), borderWidth: 1.5, px: 3, py: 1,
              fontSize: '0.85rem', fontWeight: 600, textTransform: 'none', borderRadius: 2,
              '&:hover': { borderColor: premiumColors.gold, bgcolor: safeAlpha(premiumColors.gold, 0.1) } }}>
            Télécharger PDF
          </Button>
          {order.status !== 'cancelled' && order.status !== 'delivered' && (
            <Button variant="contained" onClick={handleStatusMenuOpen} startIcon={<LocalShipping />}
              sx={{ bgcolor: premiumColors.gold, color: premiumColors.noir, px: 3, py: 1, fontSize: '0.85rem', fontWeight: 600,
                textTransform: 'none', borderRadius: 2, '&:hover': { bgcolor: premiumColors.goldDark } }}>
              Mettre à jour le statut
            </Button>
          )}
          <Menu anchorEl={statusAnchorEl} open={Boolean(statusAnchorEl)} onClose={handleStatusMenuClose}
            PaperProps={{ sx: { bgcolor: premiumColors.surface, border: `1px solid ${safeAlpha(premiumColors.gold, 0.2)}`, borderRadius: 2, mt: 1, minWidth: 200 } }}>
            {Object.entries(statusConfig).map(([key, config]) => {
              if (key === order.status || key === 'cancelled') return null;
              return (
                <MenuItem key={key} onClick={() => handleStatusChange(key)}
                  sx={{ color: premiumColors.white, gap: 1, '&:hover': { bgcolor: config.bgColor || safeAlpha(premiumColors.gold, 0.1) } }}>
                  {config.icon}
                  <Typography sx={{ fontSize: '0.85rem', fontWeight: 600 }}>{config.label}</Typography>
                </MenuItem>
              );
            })}
          </Menu>
          <Button variant="contained" onClick={onClose}
            sx={{ bgcolor: premiumColors.gold, color: premiumColors.noir, px: 4, py: 1, fontSize: '0.9rem', fontWeight: 700,
              textTransform: 'none', borderRadius: 2, '&:hover': { bgcolor: premiumColors.goldDark } }}>
            Fermer
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
});

// ============ DELETE CONFIRMATION DIALOG ============
const DeleteConfirmDialog = React.memo(({ open, onClose, onConfirm, order }) => {
  if (!order) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth
      PaperProps={{ sx: { bgcolor: premiumColors.surface, border: `1px solid ${safeAlpha(premiumColors.gold, 0.2)}`, borderRadius: 3, boxShadow: premiumColors.shadowGold } }}>
      <DialogTitle sx={{ p: 3, pb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: safeAlpha(premiumColors.cancelled, 0.15), color: premiumColors.cancelled, width: 56, height: 56, borderRadius: 2 }}>
            <Warning sx={{ fontSize: '2rem' }} />
          </Avatar>
          <Box>
            <Typography variant="h5" sx={{ color: premiumColors.white, fontFamily: "'Fjalla One', sans-serif", fontWeight: 700, mb: 0.5 }}>
              Confirmer la suppression
            </Typography>
            <Typography sx={{ color: premiumColors.textMuted, fontSize: '0.9rem' }}>
              Cette action est irréversible
            </Typography>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Paper elevation={0} sx={{ p: 2.5, bgcolor: safeAlpha(premiumColors.cancelled, 0.05), border: `1px solid ${safeAlpha(premiumColors.cancelled, 0.2)}`, borderRadius: 2, mb: 2 }}>
          <Typography sx={{ color: premiumColors.white, fontSize: '0.95rem', mb: 2, fontWeight: 500 }}>
            Êtes-vous sûr de vouloir supprimer cette commande ?
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ bgcolor: safeAlpha(premiumColors.gold, 0.1), color: premiumColors.gold, width: 48, height: 48, borderRadius: 1.5 }}>
              {order.orderNumber?.slice(-4) || 'N/A'}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ color: premiumColors.white, fontWeight: 700, fontSize: '1rem' }}>
                Commande {order.orderNumber || 'N/A'}
              </Typography>
              <Typography sx={{ color: premiumColors.textMuted, fontSize: '0.8rem', mt: 0.25 }}>
                {order.customer?.fullName || 'N/A'} - {order.total?.toFixed(2) || '0'} DT
              </Typography>
            </Box>
          </Box>
        </Paper>

        <Box sx={{ p: 2, bgcolor: safeAlpha(premiumColors.cancelled, 0.05), borderRadius: 2, border: `1px solid ${safeAlpha(premiumColors.cancelled, 0.15)}` }}>
          <Typography sx={{ color: premiumColors.cancelled, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 1 }}>
            <Info sx={{ fontSize: '1rem' }} />
            Cette commande sera définitivement supprimée de la base de données
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0, gap: 2 }}>
        <Button fullWidth variant="outlined" onClick={onClose}
          sx={{ color: premiumColors.textSecondary, borderColor: safeAlpha(premiumColors.gold, 0.3), borderWidth: 1.5, py: 1.25,
            fontSize: '0.9rem', fontWeight: 600, textTransform: 'none', borderRadius: 2,
            '&:hover': { borderColor: premiumColors.gold, bgcolor: safeAlpha(premiumColors.gold, 0.05), color: premiumColors.white } }}>
          Annuler
        </Button>
        <Button fullWidth variant="contained" onClick={() => { onConfirm(order._id); onClose(); }}
          sx={{ bgcolor: premiumColors.cancelled, color: premiumColors.white, py: 1.25, fontSize: '0.9rem', fontWeight: 700,
            textTransform: 'none', borderRadius: 2, boxShadow: `0 8px 16px -4px ${safeAlpha(premiumColors.cancelled, 0.3)}`,
            '&:hover': { bgcolor: '#dc2626', transform: 'translateY(-2px)', boxShadow: `0 12px 20px -8px ${safeAlpha(premiumColors.cancelled, 0.4)}` },
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}>
          Supprimer définitivement
        </Button>
      </DialogActions>
    </Dialog>
  );
});

// ============ IMPROVED PDF GENERATION FUNCTION ============
const generateOrderPDF = (order) => {
  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    // Professional header with company info
    doc.setFillColor(32, 32, 32); // Dark gray background
    doc.rect(0, 0, pageWidth, 45, 'F');
    
    // Company name with gold color
    doc.setTextColor(212, 175, 55);
    doc.setFontSize(24);
    doc.setFont('Playfair Display', 'serif');
    doc.text('TAWAKKOL', 20, 25);
    
    // Invoice title
    doc.setFontSize(16);
    doc.setFont('Playfair Display', 'serif');
    doc.text('bon de livraison', pageWidth - 20, 25, { align: 'right' });
    
    // Decorative line
    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(0.5);
    doc.line(20, 35, pageWidth - 20, 35);
    
    // Order information box
    doc.setFillColor(245, 245, 245);
    doc.roundedRect(20, 50, pageWidth - 40, 40, 3, 3, 'F');
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont('Playfair Display', 'bold');
    doc.text(`COMMANDE N°: ${order?.orderNumber || 'N/A'}`, 25, 62);
    
    doc.setFontSize(10);
    doc.setFont('Playfair Display', 'bold');
    doc.text(`Date: ${order?.createdAt ? format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm') : 'N/A'}`, 25, 72);
    doc.text(`Nous vous remercions de votre confiance et de votre choix envers Tawakkol`, 25, 82);
    
    // Customer Information Section
    doc.setFontSize(12);
    doc.setFont('Playfair Display', 'bold');
    doc.setTextColor(212, 175, 55);
    doc.setFontSize(15);
    doc.text('INFORMATIONS CLIENT', 20, 100);
    
    // Customer Information Section with labels slightly bold
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);

    const customer = order?.customer || {};
    const customerInfo = [
      { label: "Nom:", value: customer.fullName || "N/A" },
      { label: "Email:", value: customer.email || "N/A" },
      { label: "Téléphone:", value: customer.phone || "N/A" },
      { label: "Adresse:", value: `${customer.address || "N/A"}, ${customer.city || "N/A"} ${customer.postalCode || ""}` },
      { label: "Pays:", value: customer.country || "Tunisie" }
    ];

    if (customer.clothingSize) {
      customerInfo.push({ label: "Taille:", value: customer.clothingSize });
    }

    let yPos = 110;
    customerInfo.forEach(item => {
      // Draw label in bold
      doc.setFont('Playfair Display', 'bold');
      doc.text(item.label, 20, yPos);

      // Measure label width to position value correctly
      const labelWidth = doc.getTextWidth(item.label + " "); // + space
      doc.setFont('Playfair Display', 'normal');
      doc.text(item.value, 20 + labelWidth, yPos);

      yPos += 7;
    });
    // Order Items Table
    const tableColumn = ['Produit', 'Taille', 'Couleur', 'Prix unit.', 'Qté', 'Total'];
    const tableRows = (order?.items || []).map(item => [
      item.name || 'N/A',
      item.selectedSize || '-',
      item.selectedColor || '-',
      `${(item.price || 0).toFixed(2)} DT`,
      (item.quantity || 0).toString(),
      `${((item.price || 0) * (item.quantity || 0)).toFixed(2)} DT`
    ]);
    
    autoTable(doc, {
      startY: yPos + 10,
      head: [tableColumn],
      body: tableRows,
      theme: 'grid',
      headStyles: { fillColor: [212, 175, 55], textColor: [0, 0, 0], fontStyle: 'bold', fontSize: 10 },
      bodyStyles: { fontSize: 9, textColor: [50, 50, 50] },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 20, halign: 'center' },
        2: { cellWidth: 25, halign: 'center' },
        3: { cellWidth: 30, halign: 'right' },
        4: { cellWidth: 15, halign: 'center' },
        5: { cellWidth: 30, halign: 'right' }
      },
      margin: { left: 20, right: 20 }
    });
    
    // Totals box
    const finalY = doc.lastAutoTable.finalY + 10;
    
    // Totals section with background
    doc.setFillColor(245, 245, 245);
    doc.roundedRect(pageWidth - 100, finalY, 80, (order?.tax || 0) > 0 ? 45 : 35, 3, 3, 'F');
    
    doc.setFontSize(10);
    doc.setFont('Playfair Display', 'normal');
    doc.setTextColor(80, 80, 80);
    
    const totalsX = pageWidth - 95;
    doc.setFont('Playfair Display', 'bold');
    doc.text('Sous-total:', totalsX, finalY + 7);
    doc.text(`${(order?.subtotal || 0).toFixed(2)} DT`, pageWidth - 25, finalY + 7, { align: 'right' });
    
    doc.setFont('Playfair Display', 'bold');
    doc.text('Livraison:', totalsX, finalY + 14);
    doc.text(`${(order?.shippingCost || 7).toFixed(2)} DT`, pageWidth - 25, finalY + 14, { align: 'right' });
    
    let totalY = finalY + 14;
    if (order?.tax > 0) {
      doc.setFont('Playfair Display', 'bold');
      doc.text('TVA:', totalsX, finalY + 21);
      doc.text(`${(order.tax || 0).toFixed(2)} DT`, pageWidth - 25, finalY + 21, { align: 'right' });
      totalY = finalY + 28;
    } else {
      totalY = finalY + 21;
    }
    
    // Total with gold color
    doc.setFontSize(12);
    doc.setFont('Playfair Display', 'bold');
    doc.setTextColor(212, 175, 55);
    doc.text('TOTAL:', totalsX, totalY);
    doc.text(`${(order?.total || 0).toFixed(2)} DT`, pageWidth - 25, totalY, { align: 'right' });
    
    // Payment Method with only method bold
    doc.setTextColor(80, 80, 80);
    doc.setFontSize(10);
    doc.setFont('Playfair Display', 'normal');

    const paymentText = "Mode de paiement: ";
    const paymentMethod = order?.paymentMethod
      ? (paymentConfig[order.paymentMethod]?.label || order.paymentMethod)
      : "N/A";

    // Draw normal text first
    doc.text(paymentText, 20, totalY + 15);

    // Measure width of normal text to position payment method correctly
    const paymentTextWidth = doc.getTextWidth(paymentText);

    // Draw the payment method in bold
    doc.setFont('Playfair Display', 'bold');
    doc.text(paymentMethod, 20 + paymentTextWidth, totalY + 15);


    // Code Promo Method
    doc.setTextColor(80, 80, 80);
    doc.setFontSize(10);
    doc.setFont('Playfair Display', 'normal');

    const promoText = "Pour vous remercier, profitez de -10% sur votre prochaine commande avec le code : ";
    const promoCode = "T1W0KK%L";

    // Draw the normal text first
    doc.text(promoText, 20, totalY + 22);

    // Measure width of normal text to position promo code correctly
    const textWidth = doc.getTextWidth(promoText);

    // Draw the promo code in bold
    doc.setFont('Playfair Display', 'bold');
    doc.text(promoCode, 20 + textWidth, totalY + 22);
    
    
    // Footer with thank you message and company details
    doc.setDrawColor(212, 175, 55);
    doc.setLineWidth(0.5);
    doc.line(20, pageHeight - 30, pageWidth - 20, pageHeight - 30);
    
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text('Merci de votre confiance !', pageWidth / 2, pageHeight - 20, { align: 'center' });
    doc.text('info@tawakkol.tn - +216 23 265 016', pageWidth / 2, pageHeight - 15, { align: 'center' });
    
    // Save PDF
    doc.save(`Facture_${order?.orderNumber || 'commande'}.pdf`);
  } catch (error) {
    console.error('Error generating PDF:', error);
  }
};

// ============ MAIN FACTURE COMPONENT ============
const Facture = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState([]);
  const [paymentFilter, setPaymentFilter] = useState([]);
  const [dateFilter, setDateFilter] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [stats, setStats] = useState({
    total: 0,
    totalRevenue: 0,
    pending: 0,
    delivered: 0,
    today: 0
  });

  // ============ API FUNCTIONS ============
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/api/orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success) {
        setOrders(data.data || []);
        calculateStats(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      showSnackbar('Erreur lors du chargement des commandes', 'error');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchOrderById = useCallback(async (id) => {
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
  }, []);

  const updateOrderStatus = useCallback(async (id, newStatus) => {
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
        calculateStats(updatedOrders);
        
        if (selectedOrder && selectedOrder._id === id) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
        
        showSnackbar('Statut mis à jour avec succès', 'success');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      showSnackbar('Erreur lors de la mise à jour du statut', 'error');
    }
  }, [orders, selectedOrder]);

  const deleteOrder = useCallback(async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/api/orders/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      const data = await response.json();
      
      if (data.success) {
        const updatedOrders = orders.filter(order => order._id !== id);
        setOrders(updatedOrders);
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
  }, [orders, selectedOrder]);

  // ============ UTILITY FUNCTIONS ============
  const calculateStats = useCallback((ordersData) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const stats = {
      total: ordersData.length,
      totalRevenue: ordersData.reduce((sum, order) => sum + (order.total || 0), 0),
      pending: ordersData.filter(o => o.status === 'pending').length,
      delivered: ordersData.filter(o => o.status === 'delivered').length,
      today: ordersData.filter(o => new Date(o.createdAt) >= today).length
    };
    
    setStats(stats);
  }, []);

  const applyFilters = useCallback(() => {
    let filtered = [...orders];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer?.phone?.includes(searchTerm)
      );
    }

    // Status filter
    if (statusFilter.length > 0) {
      filtered = filtered.filter(order => statusFilter.includes(order.status));
    }

    // Payment method filter
    if (paymentFilter.length > 0) {
      filtered = filtered.filter(order => paymentFilter.includes(order.paymentMethod));
    }

    // Date filter
    if (dateFilter) {
      const filterDate = new Date(dateFilter).setHours(0, 0, 0, 0);
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.createdAt).setHours(0, 0, 0, 0);
        return orderDate === filterDate;
      });
    }

    // Sorting
    filtered.sort((a, b) => {
      let valA, valB;
      
      switch(sortBy) {
        case 'orderNumber':
          valA = a.orderNumber || '';
          valB = b.orderNumber || '';
          return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        case 'total':
          valA = a.total || 0;
          valB = b.total || 0;
          break;
        case 'status':
          valA = a.status || '';
          valB = b.status || '';
          return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
        case 'createdAt':
        default:
          valA = new Date(a.createdAt).getTime();
          valB = new Date(b.createdAt).getTime();
      }
      
      return sortOrder === 'asc' ? valA - valB : valB - valA;
    });

    setFilteredOrders(filtered);
  }, [orders, searchTerm, statusFilter, paymentFilter, dateFilter, sortBy, sortOrder]);

  const getStatusCount = useCallback((status) => {
    return orders.filter(o => o.status === status).length;
  }, [orders]);

  const getPaymentCount = useCallback((method) => {
    return orders.filter(o => o.paymentMethod === method).length;
  }, [orders]);

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

  const exportToCSV = useCallback(() => {
    try {
      const headers = ['N° Commande', 'Client', 'Email', 'Téléphone', 'Total', 'Statut', 'Paiement', 'Date'];
      const data = filteredOrders.map(order => [
        order.orderNumber || 'N/A',
        order.customer?.fullName || 'N/A',
        order.customer?.email || 'N/A',
        order.customer?.phone || 'N/A',
        `${(order.total || 0).toFixed(2)} DT`,
        statusConfig[order.status]?.label || order.status || 'N/A',
        paymentConfig[order.paymentMethod]?.label || order.paymentMethod || 'N/A',
        order.createdAt ? format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm') : 'N/A'
      ]);
      
      const csv = [headers, ...data].map(row => row.join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `commandes_${format(new Date(), 'yyyyMMdd_HHmm')}.csv`;
      a.click();
      
      showSnackbar('Export CSV réussi', 'success');
    } catch (error) {
      console.error('Error exporting CSV:', error);
      showSnackbar('Erreur lors de l\'export CSV', 'error');
    }
  }, [filteredOrders]);

  const handleGeneratePDF = useCallback((order) => {
    generateOrderPDF(order);
    showSnackbar('PDF généré avec succès', 'success');
  }, []);

  // Effects
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters, orders, searchTerm, statusFilter, paymentFilter, dateFilter, sortBy, sortOrder]);

  // Memoized values
  const paginatedOrders = useMemo(() => {
    return filteredOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [filteredOrders, page, rowsPerPage]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={frLocale}>
      <Box sx={{ 
        width: '90%',
        minHeight: '100vh',
        bgcolor: '#ffffff',
        py: { xs: 2, lg: 5 },
        ml: 12
      }}>
        <Box sx={{
          maxWidth: '1600px',
          width: '95%',
          mx: 'auto'
        }}>
          
          {/* Header with Logo */}
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 4,
            p: 2,
            bgcolor: premiumColors.noir,
            borderRadius: 2,
            border: `1px solid ${safeAlpha(premiumColors.gold, 0.3)}`
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar 
                sx={{ 
                  bgcolor: premiumColors.gold,
                  color: premiumColors.noir,
                  width: 48,
                  height: 48,
                  borderRadius: 1
                }}
              >
                <Receipt />
              </Avatar>
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    color: premiumColors.gold,
                    fontFamily: "'Fjalla One', sans-serif",
                    fontWeight: 800,
                    letterSpacing: '1px',
                    lineHeight: 1.2
                  }}
                >
                  GESTION DES COMMANDES
                </Typography>
                <Typography
                  sx={{
                    color: premiumColors.textMuted,
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5
                  }}
                >
                  <Receipt sx={{ fontSize: '0.9rem', color: premiumColors.gold }} />
                  {filteredOrders.length} commande{filteredOrders.length > 1 ? 's' : ''} affichée{filteredOrders.length > 1 ? 's' : ''}
                  {filteredOrders.length !== orders.length && ` (sur ${orders.length} total)`}
                </Typography>
              </Box>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Tooltip title="Exporter CSV" arrow>
                <IconButton
                  onClick={exportToCSV}
                  sx={{
                    color: premiumColors.gold,
                    bgcolor: safeAlpha(premiumColors.gold, 0.1),
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    border: `1px solid ${safeAlpha(premiumColors.gold, 0.3)}`,
                    '&:hover': {
                      bgcolor: safeAlpha(premiumColors.gold, 0.2),
                      transform: 'scale(1.05)'
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  <FileDownload />
                </IconButton>
              </Tooltip>
              <Tooltip title="Actualiser" arrow>
                <IconButton
                  onClick={handleRefresh}
                  sx={{
                    color: premiumColors.gold,
                    bgcolor: safeAlpha(premiumColors.gold, 0.1),
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    border: `1px solid ${safeAlpha(premiumColors.gold, 0.3)}`,
                    '&:hover': {
                      bgcolor: safeAlpha(premiumColors.gold, 0.2),
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
                title="Total Commandes"
                value={stats.total}
                subtitle={`+${stats.today} aujourd'hui`}
                icon={<Receipt />}
                color={premiumColors.gold}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Chiffre d'affaires"
                value={`${stats.totalRevenue.toFixed(2)} DT`}
                icon={<AttachMoney />}
                color={premiumColors.success}
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
                title="Livrées"
                value={stats.delivered}
                subtitle={`${((stats.delivered / stats.total) * 100 || 0).toFixed(1)}% du total`}
                icon={<CheckCircle />}
                color={premiumColors.delivered}
              />
            </Grid>
          </Grid>

          {/* Filters Section */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 4,
              bgcolor: '#f4f4f4',
              border: '1px solid #e0e0e0',
              borderRadius: 10
            }}
          >
            <Grid container spacing={2} alignItems="center">
              {/* Search */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Rechercher par n° commande, client, email..."
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

              {/* Status Filter */}
              <Grid item xs={12} md={2.5}>
                <FormControl fullWidth size="small">
                  <Select
                    multiple
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    displayEmpty
                    renderValue={(selected) => {
                      if (selected.length === 0) return <Typography sx={{ color: '#666666', fontSize: '0.9rem' }}>Tous les statuts</Typography>;
                      return (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => (
                            <Chip
                              key={value}
                              label={statusConfig[value]?.label}
                              size="small"
                              sx={{
                                bgcolor: statusConfig[value]?.bgColor || safeAlpha(premiumColors.gold, 0.1),
                                color: statusConfig[value]?.color || premiumColors.gold,
                                fontSize: '0.7rem',
                                height: 24
                              }}
                            />
                          ))}
                        </Box>
                      );
                    }}
                    sx={{
                      color: '#333333',
                      bgcolor: '#ffffff',
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e0e0e0' },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: premiumColors.gold },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: premiumColors.gold, borderWidth: 1.5 }
                    }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          bgcolor: premiumColors.surface,
                          border: `1px solid ${safeAlpha(premiumColors.gold, 0.2)}`,
                          borderRadius: 2,
                          mt: 1,
                          maxHeight: 400
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
                          '&:hover': { bgcolor: statusConfig[status]?.bgColor || safeAlpha(premiumColors.gold, 0.1) }
                        }}
                      >
                        <Checkbox 
                          checked={statusFilter.indexOf(status) > -1} 
                          size="small"
                          sx={{
                            color: statusConfig[status]?.color || premiumColors.gold,
                            '&.Mui-checked': { color: statusConfig[status]?.color || premiumColors.gold }
                          }}
                        />
                        <ListItemText 
                          primary={statusConfig[status]?.label || status}
                          secondary={`${getStatusCount(status)} commande${getStatusCount(status) > 1 ? 's' : ''}`}
                          sx={{
                            '& .MuiListItemText-primary': { color: premiumColors.white },
                            '& .MuiListItemText-secondary': { color: premiumColors.textMuted }
                          }}
                        />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Payment Filter */}
              <Grid item xs={12} md={2.5}>
                <FormControl fullWidth size="small">
                  <Select
                    multiple
                    value={paymentFilter}
                    onChange={(e) => setPaymentFilter(e.target.value)}
                    displayEmpty
                    renderValue={(selected) => {
                      if (selected.length === 0) return <Typography sx={{ color: '#666666', fontSize: '0.9rem' }}>Tous les paiements</Typography>;
                      return (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                          {selected.map((value) => (
                            <Chip
                              key={value}
                              label={paymentConfig[value]?.label}
                              size="small"
                              sx={{
                                bgcolor: paymentConfig[value]?.bgColor || safeAlpha(premiumColors.gold, 0.1),
                                color: paymentConfig[value]?.color || premiumColors.gold,
                                fontSize: '0.7rem',
                                height: 24
                              }}
                            />
                          ))}
                        </Box>
                      );
                    }}
                    sx={{
                      color: '#333333',
                      bgcolor: '#ffffff',
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e0e0e0' },
                      '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: premiumColors.gold },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: premiumColors.gold, borderWidth: 1.5 }
                    }}
                    MenuProps={{
                      PaperProps: {
                        sx: {
                          bgcolor: premiumColors.surface,
                          border: `1px solid ${safeAlpha(premiumColors.gold, 0.2)}`,
                          borderRadius: 2,
                          mt: 1,
                          maxHeight: 400
                        }
                      }
                    }}
                  >
                    {Object.keys(paymentConfig).map((method) => (
                      <MenuItem 
                        key={method} 
                        value={method}
                        sx={{
                          color: premiumColors.white,
                          '&:hover': { bgcolor: paymentConfig[method]?.bgColor || safeAlpha(premiumColors.gold, 0.1) }
                        }}
                      >
                        <Checkbox 
                          checked={paymentFilter.indexOf(method) > -1} 
                          size="small"
                          sx={{
                            color: paymentConfig[method]?.color || premiumColors.gold,
                            '&.Mui-checked': { color: paymentConfig[method]?.color || premiumColors.gold }
                          }}
                        />
                        <ListItemText 
                          primary={paymentConfig[method]?.label || method}
                          secondary={`${getPaymentCount(method)} commande${getPaymentCount(method) > 1 ? 's' : ''}`}
                          sx={{
                            '& .MuiListItemText-primary': { color: premiumColors.white },
                            '& .MuiListItemText-secondary': { color: premiumColors.textMuted }
                          }}
                        />
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Date Filter */}
              <Grid item xs={12} md={2}>
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
                          '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e0e0e0' },
                          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: premiumColors.gold },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: premiumColors.gold, borderWidth: 1.5 }
                        },
                        '& .MuiInputLabel-root': {
                          color: '#666666',
                          '&.Mui-focused': { color: premiumColors.goldDark }
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
                    setStatusFilter([]);
                    setPaymentFilter([]);
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
                      bgcolor: safeAlpha(premiumColors.gold, 0.05)
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
                '&:hover': { color: premiumColors.goldDark, bgcolor: 'transparent' }
              }}
            >
              Date
            </Button>
            <Button
              size="small"
              onClick={() => handleSort('orderNumber')}
              endIcon={sortBy === 'orderNumber' && (sortOrder === 'asc' ? <ArrowUpward /> : <ArrowDownward />)}
              sx={{
                color: sortBy === 'orderNumber' ? premiumColors.goldDark : '#666666',
                fontSize: '0.8rem',
                fontWeight: 600,
                textTransform: 'none',
                '&:hover': { color: premiumColors.goldDark, bgcolor: 'transparent' }
              }}
            >
              N° Commande
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
                '&:hover': { color: premiumColors.goldDark, bgcolor: 'transparent' }
              }}
            >
              Montant
            </Button>
          </Box>

          {/* Orders List */}
          {loading ? (
            <Box sx={{ width: '100%', py: 8 }}>
              <LinearProgress
                sx={{
                  bgcolor: safeAlpha(premiumColors.gold, 0.1),
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
                border: `1px solid ${safeAlpha(premiumColors.gold, 0.15)}`,
                borderRadius: 3
              }}
            >
              <Receipt sx={{ fontSize: 80, color: safeAlpha(premiumColors.gold, 0.3), mb: 2 }} />
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
              {paginatedOrders.map((order) => (
                <OrderCard
                  key={order._id}
                  order={order}
                  onView={handleViewOrder}
                  onStatusUpdate={updateOrderStatus}
                  onDelete={handleDeleteClick}
                  onGeneratePDF={handleGeneratePDF}
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
                  '& .MuiTablePagination-select': { color: '#333333' },
                  '& .MuiTablePagination-selectIcon': { color: premiumColors.goldDark },
                  '& .MuiTablePagination-actions button': {
                    color: premiumColors.goldDark,
                    '&:disabled': { color: safeAlpha(premiumColors.gold, 0.3) }
                  }
                }}
              />
            </Box>
          )}
        </Box>

        {/* Modals */}
        <OrderDetailsModal
          open={detailsOpen}
          onClose={() => setDetailsOpen(false)}
          order={selectedOrder}
          onStatusUpdate={updateOrderStatus}
          onDelete={handleDeleteClick}
          onGeneratePDF={handleGeneratePDF}
        />

        <DeleteConfirmDialog
          open={deleteDialogOpen}
          onClose={() => {
            setDeleteDialogOpen(false);
            setOrderToDelete(null);
          }}
          onConfirm={handleDeleteConfirm}
          order={orderToDelete}
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
                snackbar.severity === 'success' ? safeAlpha(premiumColors.success, 0.5) : 
                snackbar.severity === 'error' ? safeAlpha(premiumColors.error, 0.5) : 
                safeAlpha(premiumColors.gold, 0.5)
              }`,
              borderRadius: 2,
              boxShadow: premiumColors.shadowGold
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

export default Facture;