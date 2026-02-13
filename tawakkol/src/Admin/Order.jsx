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
  Badge,
  LinearProgress,
  Alert,
  Snackbar,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  ListItemText,
  Checkbox,
  CircularProgress,
  Zoom,
  Fade
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
  Print,
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
  Edit,
  Delete,
  CloudDownload,
  PictureAsPdf,
  Assessment
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import frLocale from 'date-fns/locale/fr';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import API_BASE from '../Config/api';

// ============ PREMIUM COLORS ============
const premiumColors = {
  noir: '#1a1a1a',
  gold: '#d4af37',
  goldLight: '#f4e4a6',
  goldDark: '#b8941f',
  charcoal: '#2d2d2d',
  white: '#ffffff',
  error: '#ff4757',
  success: '#2ed573',
  warning: '#ffa502',
  info: '#3498db',
  pending: '#ffa502',
  confirmed: '#3498db',
  processing: '#9b59b6',
  shipped: '#00b894',
  delivered: '#2ed573',
  cancelled: '#ff4757',
  premiumGradient: 'linear-gradient(135deg, #d4af37 0%, #f9d423 50%, #d4af37 100%)'
};

// ============ STATUS CONFIG ============
const statusConfig = {
  pending: {
    label: 'En attente',
    color: premiumColors.pending,
    bgColor: premiumColors.pending + '20',
    icon: <AccessTime />,
    next: ['confirmed', 'cancelled']
  },
  confirmed: {
    label: 'Confirmée',
    color: premiumColors.confirmed,
    bgColor: premiumColors.confirmed + '20',
    icon: <CheckCircle />,
    next: ['processing', 'cancelled']
  },
  processing: {
    label: 'En traitement',
    color: premiumColors.processing,
    bgColor: premiumColors.processing + '20',
    icon: <Inventory />,
    next: ['shipped', 'cancelled']
  },
  shipped: {
    label: 'Expédiée',
    color: premiumColors.shipped,
    bgColor: premiumColors.shipped + '20',
    icon: <LocalShipping />,
    next: ['delivered', 'cancelled']
  },
  delivered: {
    label: 'Livrée',
    color: premiumColors.delivered,
    bgColor: premiumColors.delivered + '20',
    icon: <CheckCircle />,
    next: []
  },
  cancelled: {
    label: 'Annulée',
    color: premiumColors.cancelled,
    bgColor: premiumColors.cancelled + '20',
    icon: <Cancel />,
    next: []
  }
};

// ============ ORDER CARD COMPONENT ============
const OrderCard = ({ order, onView, onStatusUpdate }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const status = statusConfig[order.status] || statusConfig.pending;

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  
  const handleStatusChange = (newStatus) => {
    onStatusUpdate(order._id, newStatus);
    handleMenuClose();
  };

  return (
    <Zoom in timeout={500}>
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 2,
          background: `linear-gradient(135deg, ${premiumColors.noir} 0%, ${premiumColors.charcoal} 100%)`,
          border: `1px solid ${premiumColors.gold}20`,
          borderRadius: 3,
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: `0 20px 40px ${premiumColors.gold}20`,
            borderColor: premiumColors.gold + '40',
            '& .order-number': {
              color: premiumColors.gold
            }
          },
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '4px',
            height: '100%',
            background: status.color,
            boxShadow: `0 0 20px ${status.color}`
          }
        }}
      >
        <Grid container spacing={2} alignItems="center">
          {/* Order Info */}
          <Grid item xs={12} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                sx={{
                  bgcolor: premiumColors.gold + '20',
                  color: premiumColors.gold,
                  width: 48,
                  height: 48
                }}
              >
                <ShoppingBag />
              </Avatar>
              <Box>
                <Typography
                  className="order-number"
                  sx={{
                    color: premiumColors.white,
                    fontFamily: "'Fjalla One', sans-serif",
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    transition: 'color 0.3s ease'
                  }}
                >
                  {order.orderNumber}
                </Typography>
                <Typography
                  sx={{
                    color: premiumColors.goldLight,
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    mt: 0.5
                  }}
                >
                  <CalendarToday sx={{ fontSize: '0.8rem' }} />
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
                  bgcolor: premiumColors.gold + '10',
                  color: premiumColors.gold,
                  width: 40,
                  height: 40
                }}
              >
                <Person />
              </Avatar>
              <Box>
                <Typography
                  sx={{
                    color: premiumColors.white,
                    fontFamily: "'Fjalla One', sans-serif",
                    fontSize: '0.95rem',
                    fontWeight: 600
                  }}
                >
                  {order.customer.fullName}
                </Typography>
                <Typography
                  sx={{
                    color: premiumColors.goldLight + 'CC',
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5
                  }}
                >
                  <Email sx={{ fontSize: '0.75rem' }} />
                  {order.customer.email}
                </Typography>
                <Typography
                  sx={{
                    color: premiumColors.goldLight + 'CC',
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5
                  }}
                >
                  <Phone sx={{ fontSize: '0.75rem' }} />
                  {order.customer.phone}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Items & Amount */}
          <Grid item xs={12} md={2}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                sx={{
                  color: premiumColors.white,
                  fontSize: '0.9rem',
                  mb: 0.5
                }}
              >
                {order.items.length} article{order.items.length > 1 ? 's' : ''}
              </Typography>
              <Typography
                sx={{
                  color: premiumColors.gold,
                  fontFamily: "'Fjalla One', sans-serif",
                  fontSize: '1.2rem',
                  fontWeight: 700
                }}
              >
                {order.total.toFixed(2)} DT
              </Typography>
              <Typography
                sx={{
                  color: premiumColors.goldLight + '80',
                  fontSize: '0.75rem'
                }}
              >
                {order.paymentMethod === 'cash' ? 'Paiement à la livraison' : 
                 order.paymentMethod === 'card' ? 'Carte bancaire' : 'Virement'}
              </Typography>
            </Box>
          </Grid>

          {/* Status & Actions */}
          <Grid item xs={12} md={4}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 2 }}>
              <Chip
                icon={status.icon}
                label={status.label}
                sx={{
                  bgcolor: status.bgColor,
                  color: status.color,
                  border: `1px solid ${status.color}40`,
                  fontWeight: 600,
                  fontFamily: "'Fjalla One', sans-serif",
                  '& .MuiChip-icon': { color: status.color }
                }}
              />
              
              <Tooltip title="Voir les détails">
                <IconButton
                  onClick={() => onView(order)}
                  sx={{
                    color: premiumColors.gold,
                    bgcolor: premiumColors.gold + '10',
                    '&:hover': {
                      bgcolor: premiumColors.gold + '20',
                      transform: 'scale(1.1)'
                    }
                  }}
                >
                  <Visibility />
                </IconButton>
              </Tooltip>

              {status.next.length > 0 && (
                <>
                  <Tooltip title="Changer le statut">
                    <IconButton
                      onClick={handleMenuOpen}
                      sx={{
                        color: premiumColors.goldLight,
                        bgcolor: premiumColors.gold + '10',
                        '&:hover': {
                          bgcolor: premiumColors.gold + '20',
                          transform: 'scale(1.1)'
                        }
                      }}
                    >
                      <MoreVert />
                    </IconButton>
                  </Tooltip>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    PaperProps={{
                      sx: {
                        bgcolor: premiumColors.charcoal,
                        border: `1px solid ${premiumColors.gold}40`,
                        borderRadius: 2,
                        mt: 1
                      }
                    }}
                  >
                    {status.next.map((nextStatus) => (
                      <MenuItem
                        key={nextStatus}
                        onClick={() => handleStatusChange(nextStatus)}
                        sx={{
                          color: premiumColors.white,
                          '&:hover': {
                            bgcolor: premiumColors.gold + '20'
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {statusConfig[nextStatus].icon}
                          <Typography sx={{ fontFamily: "'Fjalla One', sans-serif" }}>
                            {statusConfig[nextStatus].label}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Menu>
                </>
              )}
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Zoom>
  );
};

// ============ ORDER DETAILS MODAL ============
const OrderDetailsModal = ({ open, onClose, order, onStatusUpdate }) => {
  const [statusAnchorEl, setStatusAnchorEl] = useState(null);
  if (!order) return null;

  const status = statusConfig[order.status] || statusConfig.pending;

  const handleStatusMenuOpen = (event) => setStatusAnchorEl(event.currentTarget);
  const handleStatusMenuClose = () => setStatusAnchorEl(null);
  
  const handleStatusChange = (newStatus) => {
    onStatusUpdate(order._id, newStatus);
    handleStatusMenuClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: premiumColors.noir,
          backgroundImage: `linear-gradient(135deg, ${premiumColors.noir}DD, ${premiumColors.charcoal}DD)`,
          backdropFilter: 'blur(20px)',
          border: `1px solid ${premiumColors.gold}40`,
          borderRadius: 3,
          boxShadow: `0 30px 90px ${premiumColors.gold}20`
        }
      }}
    >
      <DialogTitle sx={{ 
        borderBottom: `1px solid ${premiumColors.gold}30`,
        pb: 2
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar
              sx={{
                bgcolor: premiumColors.gold + '20',
                color: premiumColors.gold,
                width: 56,
                height: 56
              }}
            >
              <Receipt />
            </Avatar>
            <Box>
              <Typography
                variant="h5"
                sx={{
                  color: premiumColors.gold,
                  fontFamily: "'Fjalla One', sans-serif",
                  fontWeight: 700
                }}
              >
                Commande {order.orderNumber}
              </Typography>
              <Typography
                sx={{
                  color: premiumColors.goldLight,
                  fontSize: '0.9rem'
                }}
              >
                Créée le {format(new Date(order.createdAt), 'dd MMMM yyyy à HH:mm', { locale: fr })}
              </Typography>
            </Box>
          </Box>
          <IconButton
            onClick={onClose}
            sx={{
              color: premiumColors.goldLight,
              '&:hover': {
                color: premiumColors.gold,
                transform: 'rotate(90deg)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ py: 3 }}>
        <Grid container spacing={3}>
          {/* Status Card */}
          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                bgcolor: premiumColors.charcoal + '80',
                border: `1px solid ${status.color}40`,
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: status.bgColor,
                    color: status.color,
                    width: 48,
                    height: 48
                  }}
                >
                  {status.icon}
                </Avatar>
                <Box>
                  <Typography
                    sx={{
                      color: premiumColors.white,
                      fontSize: '0.9rem'
                    }}
                  >
                    Statut actuel
                  </Typography>
                  <Typography
                    sx={{
                      color: status.color,
                      fontFamily: "'Fjalla One', sans-serif",
                      fontSize: '1.2rem',
                      fontWeight: 700
                    }}
                  >
                    {status.label}
                  </Typography>
                </Box>
              </Box>
              
              {status.next.length > 0 && (
                <>
                  <Button
                    variant="outlined"
                    onClick={handleStatusMenuOpen}
                    endIcon={<MoreVert />}
                    sx={{
                      color: premiumColors.gold,
                      borderColor: premiumColors.gold + '60',
                      '&:hover': {
                        borderColor: premiumColors.gold,
                        bgcolor: premiumColors.gold + '10'
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
                        bgcolor: premiumColors.charcoal,
                        border: `1px solid ${premiumColors.gold}40`,
                        borderRadius: 2
                      }
                    }}
                  >
                    {status.next.map((nextStatus) => (
                      <MenuItem
                        key={nextStatus}
                        onClick={() => handleStatusChange(nextStatus)}
                        sx={{
                          color: premiumColors.white,
                          '&:hover': {
                            bgcolor: premiumColors.gold + '20'
                          }
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          {statusConfig[nextStatus].icon}
                          <Typography sx={{ fontFamily: "'Fjalla One', sans-serif" }}>
                            {statusConfig[nextStatus].label}
                          </Typography>
                        </Box>
                      </MenuItem>
                    ))}
                  </Menu>
                </>
              )}
            </Paper>
          </Grid>

          {/* Customer Information */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                bgcolor: premiumColors.charcoal + '80',
                border: `1px solid ${premiumColors.gold}20`,
                borderRadius: 2,
                height: '100%'
              }}
            >
              <Typography
                sx={{
                  color: premiumColors.gold,
                  fontFamily: "'Fjalla One', sans-serif",
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <Person /> Informations client
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: premiumColors.gold + '20',
                      color: premiumColors.gold,
                      width: 56,
                      height: 56
                    }}
                  >
                    {order.customer.fullName.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography
                      sx={{
                        color: premiumColors.white,
                        fontFamily: "'Fjalla One', sans-serif",
                        fontSize: '1.2rem',
                        fontWeight: 700
                      }}
                    >
                      {order.customer.fullName}
                    </Typography>
                    <Typography
                      sx={{
                        color: premiumColors.goldLight,
                        fontSize: '0.9rem'
                      }}
                    >
                      {order.customer.clothingSize && `Taille: ${order.customer.clothingSize}`}
                    </Typography>
                  </Box>
                </Box>

                <Divider sx={{ borderColor: premiumColors.gold + '20' }} />

                <Box sx={{ display: 'grid', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Email sx={{ color: premiumColors.gold, fontSize: '1.2rem' }} />
                    <Typography sx={{ color: premiumColors.white }}>
                      {order.customer.email}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Phone sx={{ color: premiumColors.gold, fontSize: '1.2rem' }} />
                    <Typography sx={{ color: premiumColors.white }}>
                      {order.customer.phone}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LocationOn sx={{ color: premiumColors.gold, fontSize: '1.2rem' }} />
                    <Typography sx={{ color: premiumColors.white }}>
                      {order.customer.address}, {order.customer.city}
                      {order.customer.postalCode && `, ${order.customer.postalCode}`}
                      {order.customer.country && `, ${order.customer.country}`}
                    </Typography>
                  </Box>
                </Box>

                {order.customer.notes && (
                  <>
                    <Divider sx={{ borderColor: premiumColors.gold + '20' }} />
                    <Box>
                      <Typography
                        sx={{
                          color: premiumColors.goldLight,
                          fontSize: '0.9rem',
                          mb: 0.5
                        }}
                      >
                        Notes:
                      </Typography>
                      <Typography
                        sx={{
                          color: premiumColors.white,
                          fontSize: '0.95rem',
                          fontStyle: 'italic'
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

          {/* Order Summary */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                bgcolor: premiumColors.charcoal + '80',
                border: `1px solid ${premiumColors.gold}20`,
                borderRadius: 2,
                height: '100%'
              }}
            >
              <Typography
                sx={{
                  color: premiumColors.gold,
                  fontFamily: "'Fjalla One', sans-serif",
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <Receipt /> Récapitulatif
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography sx={{ color: premiumColors.goldLight }}>Sous-total</Typography>
                  <Typography sx={{ color: premiumColors.white, fontWeight: 600 }}>
                    {order.subtotal.toFixed(2)} DT
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography sx={{ color: premiumColors.goldLight }}>Livraison</Typography>
                  <Typography sx={{ color: premiumColors.white, fontWeight: 600 }}>
                    {order.shippingCost.toFixed(2)} DT
                  </Typography>
                </Box>
                {order.tax > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography sx={{ color: premiumColors.goldLight }}>TVA</Typography>
                    <Typography sx={{ color: premiumColors.white, fontWeight: 600 }}>
                      {order.tax.toFixed(2)} DT
                    </Typography>
                  </Box>
                )}
                <Divider sx={{ borderColor: premiumColors.gold + '20' }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography
                    sx={{
                      color: premiumColors.gold,
                      fontFamily: "'Fjalla One', sans-serif",
                      fontSize: '1.1rem',
                      fontWeight: 700
                    }}
                  >
                    Total
                  </Typography>
                  <Typography
                    sx={{
                      color: premiumColors.gold,
                      fontFamily: "'Fjalla One', sans-serif",
                      fontSize: '1.3rem',
                      fontWeight: 800
                    }}
                  >
                    {order.total.toFixed(2)} DT
                  </Typography>
                </Box>

                <Box
                  sx={{
                    mt: 2,
                    p: 2,
                    bgcolor: premiumColors.gold + '10',
                    borderRadius: 2,
                    border: `1px solid ${premiumColors.gold}30`
                  }}
                >
                  <Typography
                    sx={{
                      color: premiumColors.goldLight,
                      fontSize: '0.9rem',
                      mb: 0.5
                    }}
                  >
                    Mode de paiement
                  </Typography>
                  <Typography
                    sx={{
                      color: premiumColors.white,
                      fontFamily: "'Fjalla One', sans-serif",
                      fontSize: '1rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    <Payment sx={{ color: premiumColors.gold }} />
                    {order.paymentMethod === 'cash' ? 'Paiement à la livraison' : 
                     order.paymentMethod === 'card' ? 'Carte bancaire' : 'Virement bancaire'}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Products List */}
          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                bgcolor: premiumColors.charcoal + '80',
                border: `1px solid ${premiumColors.gold}20`,
                borderRadius: 2
              }}
            >
              <Typography
                sx={{
                  color: premiumColors.gold,
                  fontFamily: "'Fjalla One', sans-serif",
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                <ShoppingBag /> Articles ({order.items.length})
              </Typography>

              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: premiumColors.goldLight, borderBottom: `1px solid ${premiumColors.gold}30` }}>Produit</TableCell>
                      <TableCell sx={{ color: premiumColors.goldLight, borderBottom: `1px solid ${premiumColors.gold}30` }}>Variante</TableCell>
                      <TableCell align="center" sx={{ color: premiumColors.goldLight, borderBottom: `1px solid ${premiumColors.gold}30` }}>Quantité</TableCell>
                      <TableCell align="right" sx={{ color: premiumColors.goldLight, borderBottom: `1px solid ${premiumColors.gold}30` }}>Prix unitaire</TableCell>
                      <TableCell align="right" sx={{ color: premiumColors.goldLight, borderBottom: `1px solid ${premiumColors.gold}30` }}>Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {order.items.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell sx={{ borderBottom: `1px solid ${premiumColors.gold}20` }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            {item.mainImage && (
                              <Avatar
                                src={typeof item.mainImage === 'string' ? item.mainImage : item.mainImage?.url}
                                variant="rounded"
                                sx={{
                                  width: 50,
                                  height: 50,
                                  border: `1px solid ${premiumColors.gold}30`
                                }}
                              />
                            )}
                            <Typography sx={{ color: premiumColors.white, fontWeight: 600 }}>
                              {item.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell sx={{ borderBottom: `1px solid ${premiumColors.gold}20` }}>
                          {item.selectedSize && (
                            <Chip
                              label={`Taille: ${item.selectedSize}`}
                              size="small"
                              sx={{
                                bgcolor: premiumColors.gold + '10',
                                color: premiumColors.gold,
                                mr: 1
                              }}
                            />
                          )}
                          {item.selectedColor && (
                            <Chip
                              label={`Couleur: ${item.selectedColor}`}
                              size="small"
                              sx={{
                                bgcolor: premiumColors.gold + '10',
                                color: premiumColors.gold
                              }}
                            />
                          )}
                        </TableCell>
                        <TableCell align="center" sx={{ borderBottom: `1px solid ${premiumColors.gold}20` }}>
                          <Typography sx={{ color: premiumColors.white }}>
                            {item.quantity}
                          </Typography>
                        </TableCell>
                        <TableCell align="right" sx={{ borderBottom: `1px solid ${premiumColors.gold}20` }}>
                          <Typography sx={{ color: premiumColors.white }}>
                            {item.price.toFixed(2)} DT
                          </Typography>
                        </TableCell>
                        <TableCell align="right" sx={{ borderBottom: `1px solid ${premiumColors.gold}20` }}>
                          <Typography sx={{ color: premiumColors.gold, fontWeight: 700 }}>
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

      <DialogActions sx={{ 
        borderTop: `1px solid ${premiumColors.gold}30`,
        p: 2,
        gap: 2
      }}>
        <Button
          variant="outlined"
          startIcon={<Print />}
          sx={{
            color: premiumColors.goldLight,
            borderColor: premiumColors.gold + '60',
            '&:hover': {
              borderColor: premiumColors.gold,
              bgcolor: premiumColors.gold + '10'
            }
          }}
        >
          Imprimer
        </Button>
        <Button
          variant="outlined"
          startIcon={<CloudDownload />}
          sx={{
            color: premiumColors.goldLight,
            borderColor: premiumColors.gold + '60',
            '&:hover': {
              borderColor: premiumColors.gold,
              bgcolor: premiumColors.gold + '10'
            }
          }}
        >
          Télécharger PDF
        </Button>
        <Button
          variant="contained"
          onClick={onClose}
          sx={{
            bgcolor: premiumColors.gold,
            color: premiumColors.noir,
            '&:hover': {
              bgcolor: premiumColors.goldLight,
              transform: 'translateY(-2px)'
            }
          }}
        >
          Fermer
        </Button>
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

  // Fetch orders
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/api/orders`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
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

  // Fetch single order by ID
  const fetchOrderById = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/api/orders/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
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

  // Fetch order by order number
  const fetchOrderByNumber = async (orderNumber) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/api/orders/number/${orderNumber}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setSelectedOrder(data.data);
        setDetailsOpen(true);
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      showSnackbar('Commande non trouvée', 'error');
    }
  };

  // Update order status
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
        // Update orders list
        const updatedOrders = orders.map(order => 
          order._id === id ? { ...order, status: newStatus } : order
        );
        setOrders(updatedOrders);
        applyFilters(updatedOrders);
        calculateStats(updatedOrders);
        
        // Update selected order if open
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

  // Calculate statistics
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

  // Apply filters
  const applyFilters = (ordersData) => {
    let filtered = [...ordersData];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.phone.includes(searchTerm)
      );
    }

    // Status filter
    if (statusFilter.length > 0) {
      filtered = filtered.filter(order => statusFilter.includes(order.status));
    }

    // Date filter
    if (dateFilter) {
      const filterDate = new Date(dateFilter).setHours(0, 0, 0, 0);
      filtered = filtered.filter(order => {
        const orderDate = new Date(order.createdAt).setHours(0, 0, 0, 0);
        return orderDate === filterDate;
      });
    }

    // Sort
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
      
      if (sortOrder === 'asc') {
        return valA > valB ? 1 : -1;
      } else {
        return valA < valB ? 1 : -1;
      }
    });

    setFilteredOrders(filtered);
  };

  // Show snackbar
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  // Handle view order
  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setDetailsOpen(true);
  };

  // Handle status filter change
  const handleStatusFilterChange = (event) => {
    setStatusFilter(event.target.value);
  };

  // Handle sort
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  // Refresh data
  const handleRefresh = () => {
    fetchOrders();
    showSnackbar('Données actualisées', 'success');
  };

  // Export to CSV
  const exportToCSV = () => {
    const headers = ['Order Number', 'Date', 'Customer', 'Email', 'Phone', 'Total', 'Status', 'Payment'];
    const data = filteredOrders.map(order => [
      order.orderNumber,
      format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm'),
      order.customer.fullName,
      order.customer.email,
      order.customer.phone,
      order.total.toFixed(2),
      statusConfig[order.status]?.label || order.status,
      order.paymentMethod
    ]);
    
    const csv = [headers, ...data].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders_${format(new Date(), 'yyyyMMdd_HHmm')}.csv`;
    a.click();
    
    showSnackbar('Export CSV réussi', 'success');
  };

  // Export to PDF (simulated)
  const exportToPDF = () => {
    showSnackbar('Export PDF démarré', 'info');
    // PDF generation would go here
  };

  // Load orders on mount
  useEffect(() => {
    fetchOrders();
  }, []);

  // Apply filters when filter criteria change
  useEffect(() => {
    applyFilters(orders);
  }, [searchTerm, statusFilter, dateFilter, sortBy, sortOrder]);

  // Get status count for filter
  const getStatusCount = (status) => {
    return orders.filter(o => o.status === status).length;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={frLocale}>
      <Box sx={{ 
        minHeight: '100vh',
        bgcolor: premiumColors.noir,
        p: { xs: 2, lg: 4 }
      }}>
        {/* Header */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          mb: 4
        }}>
          <Box>
            <Typography
              variant="h4"
              sx={{
                color: premiumColors.gold,
                fontFamily: "'Fjalla One', sans-serif",
                fontWeight: 800,
                mb: 1
              }}
            >
              Gestion des Commandes
            </Typography>
            <Typography
              sx={{
                color: premiumColors.goldLight,
                fontSize: '1rem'
              }}
            >
              {filteredOrders.length} commande{filteredOrders.length > 1 ? 's' : ''} affichée{filteredOrders.length > 1 ? 's' : ''}
              {filteredOrders.length !== orders.length && ` (sur ${orders.length} total)`}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Tooltip title="Exporter CSV">
              <IconButton
                onClick={exportToCSV}
                sx={{
                  color: premiumColors.gold,
                  bgcolor: premiumColors.gold + '10',
                  '&:hover': {
                    bgcolor: premiumColors.gold + '20',
                    transform: 'scale(1.1)'
                  }
                }}
              >
                <Download />
              </IconButton>
            </Tooltip>
            <Tooltip title="Exporter PDF">
              <IconButton
                onClick={exportToPDF}
                sx={{
                  color: premiumColors.gold,
                  bgcolor: premiumColors.gold + '10',
                  '&:hover': {
                    bgcolor: premiumColors.gold + '20',
                    transform: 'scale(1.1)'
                  }
                }}
              >
                <PictureAsPdf />
              </IconButton>
            </Tooltip>
            <Tooltip title="Actualiser">
              <IconButton
                onClick={handleRefresh}
                sx={{
                  color: premiumColors.gold,
                  bgcolor: premiumColors.gold + '10',
                  '&:hover': {
                    bgcolor: premiumColors.gold + '20',
                    transform: 'rotate(180deg)'
                  },
                  transition: 'all 0.3s ease'
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
            <Fade in timeout={500}>
              <Card
                sx={{
                  bgcolor: premiumColors.charcoal + '80',
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${premiumColors.gold}20`,
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: `0 20px 40px ${premiumColors.gold}20`,
                    borderColor: premiumColors.gold + '40'
                  }
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography
                        sx={{
                          color: premiumColors.goldLight,
                          fontSize: '0.9rem',
                          mb: 1
                        }}
                      >
                        Total Commandes
                      </Typography>
                      <Typography
                        variant="h4"
                        sx={{
                          color: premiumColors.white,
                          fontFamily: "'Fjalla One', sans-serif",
                          fontWeight: 800
                        }}
                      >
                        {stats.total}
                      </Typography>
                      <Typography
                        sx={{
                          color: premiumColors.goldLight + 'CC',
                          fontSize: '0.8rem',
                          mt: 1
                        }}
                      >
                        +{stats.today} aujourd'hui
                      </Typography>
                    </Box>
                    <Avatar
                      sx={{
                        bgcolor: premiumColors.gold + '20',
                        color: premiumColors.gold,
                        width: 56,
                        height: 56
                      }}
                    >
                      <ShoppingBag />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Fade>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Fade in timeout={600}>
              <Card
                sx={{
                  bgcolor: premiumColors.charcoal + '80',
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${premiumColors.gold}20`,
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: `0 20px 40px ${premiumColors.gold}20`,
                    borderColor: premiumColors.gold + '40'
                  }
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography
                        sx={{
                          color: premiumColors.goldLight,
                          fontSize: '0.9rem',
                          mb: 1
                        }}
                      >
                        En attente
                      </Typography>
                      <Typography
                        variant="h4"
                        sx={{
                          color: statusConfig.pending.color,
                          fontFamily: "'Fjalla One', sans-serif",
                          fontWeight: 800
                        }}
                      >
                        {stats.pending}
                      </Typography>
                      <Typography
                        sx={{
                          color: premiumColors.goldLight + 'CC',
                          fontSize: '0.8rem',
                          mt: 1
                        }}
                      >
                        {((stats.pending / stats.total) * 100 || 0).toFixed(1)}% du total
                      </Typography>
                    </Box>
                    <Avatar
                      sx={{
                        bgcolor: statusConfig.pending.bgColor,
                        color: statusConfig.pending.color,
                        width: 56,
                        height: 56
                      }}
                    >
                      <AccessTime />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Fade>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Fade in timeout={700}>
              <Card
                sx={{
                  bgcolor: premiumColors.charcoal + '80',
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${premiumColors.gold}20`,
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: `0 20px 40px ${premiumColors.gold}20`,
                    borderColor: premiumColors.gold + '40'
                  }
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography
                        sx={{
                          color: premiumColors.goldLight,
                          fontSize: '0.9rem',
                          mb: 1
                        }}
                      >
                        Livrées
                      </Typography>
                      <Typography
                        variant="h4"
                        sx={{
                          color: statusConfig.delivered.color,
                          fontFamily: "'Fjalla One', sans-serif",
                          fontWeight: 800
                        }}
                      >
                        {stats.delivered}
                      </Typography>
                      <Typography
                        sx={{
                          color: premiumColors.goldLight + 'CC',
                          fontSize: '0.8rem',
                          mt: 1
                        }}
                      >
                        {((stats.delivered / stats.total) * 100 || 0).toFixed(1)}% du total
                      </Typography>
                    </Box>
                    <Avatar
                      sx={{
                        bgcolor: statusConfig.delivered.bgColor,
                        color: statusConfig.delivered.color,
                        width: 56,
                        height: 56
                      }}
                    >
                      <CheckCircle />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Fade>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Fade in timeout={800}>
              <Card
                sx={{
                  bgcolor: premiumColors.charcoal + '80',
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${premiumColors.gold}20`,
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: `0 20px 40px ${premiumColors.gold}20`,
                    borderColor: premiumColors.gold + '40'
                  }
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography
                        sx={{
                          color: premiumColors.goldLight,
                          fontSize: '0.9rem',
                          mb: 1
                        }}
                      >
                        Chiffre d'affaires
                      </Typography>
                      <Typography
                        variant="h4"
                        sx={{
                          color: premiumColors.gold,
                          fontFamily: "'Fjalla One', sans-serif",
                          fontWeight: 800
                        }}
                      >
                        {stats.revenue.toFixed(2)} DT
                      </Typography>
                      <Typography
                        sx={{
                          color: premiumColors.goldLight + 'CC',
                          fontSize: '0.8rem',
                          mt: 1
                        }}
                      >
                        Moyenne: {(stats.revenue / (stats.total - stats.cancelled) || 0).toFixed(2)} DT
                      </Typography>
                    </Box>
                    <Avatar
                      sx={{
                        bgcolor: premiumColors.gold + '20',
                        color: premiumColors.gold,
                        width: 56,
                        height: 56
                      }}
                    >
                      <AttachMoney />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            </Fade>
          </Grid>
        </Grid>

        {/* Filters */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 4,
            bgcolor: premiumColors.charcoal + '80',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${premiumColors.gold}20`,
            borderRadius: 3
          }}
        >
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Rechercher par numéro, nom, email, téléphone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
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
                        sx={{ color: premiumColors.goldLight }}
                      >
                        <Close />
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: {
                    color: premiumColors.white,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: premiumColors.gold + '60'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: premiumColors.gold
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: premiumColors.gold,
                      boxShadow: `0 0 0 2px ${premiumColors.gold}20`
                    }
                  }
                }}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel 
                  sx={{ 
                    color: premiumColors.goldLight,
                    '&.Mui-focused': { color: premiumColors.gold }
                  }}
                >
                  Statut
                </InputLabel>
                <Select
                  multiple
                  value={statusFilter}
                  onChange={handleStatusFilterChange}
                  input={<OutlinedInput label="Statut" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip
                          key={value}
                          label={statusConfig[value]?.label}
                          size="small"
                          sx={{
                            bgcolor: statusConfig[value]?.bgColor,
                            color: statusConfig[value]?.color,
                            border: `1px solid ${statusConfig[value]?.color}40`
                          }}
                        />
                      ))}
                    </Box>
                  )}
                  sx={{
                    color: premiumColors.white,
                    '& .MuiOutlinedInput-notchedOutline': {
                      borderColor: premiumColors.gold + '60'
                    },
                    '&:hover .MuiOutlinedInput-notchedOutline': {
                      borderColor: premiumColors.gold
                    },
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: premiumColors.gold,
                      boxShadow: `0 0 0 2px ${premiumColors.gold}20`
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
                          bgcolor: premiumColors.gold + '20'
                        }
                      }}
                    >
                      <Checkbox 
                        checked={statusFilter.indexOf(status) > -1} 
                        sx={{
                          color: premiumColors.gold,
                          '&.Mui-checked': {
                            color: premiumColors.gold
                          }
                        }}
                      />
                      <ListItemText 
                        primary={statusConfig[status].label}
                        secondary={`${getStatusCount(status)} commandes`}
                        sx={{
                          '& .MuiListItemText-primary': {
                            color: premiumColors.white
                          },
                          '& .MuiListItemText-secondary': {
                            color: premiumColors.goldLight + '80'
                          }
                        }}
                      />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} md={3}>
              <DatePicker
                label="Filtrer par date"
                value={dateFilter}
                onChange={setDateFilter}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    InputProps: {
                      sx: {
                        color: premiumColors.white,
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: premiumColors.gold + '60'
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: premiumColors.gold
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: premiumColors.gold,
                          boxShadow: `0 0 0 2px ${premiumColors.gold}20`
                        }
                      }
                    },
                    InputLabelProps: {
                      sx: {
                        color: premiumColors.goldLight,
                        '&.Mui-focused': { color: premiumColors.gold }
                      }
                    }
                  }
                }}
              />
            </Grid>

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
                  color: premiumColors.goldLight,
                  borderColor: premiumColors.gold + '60',
                  height: 56,
                  '&:hover': {
                    borderColor: premiumColors.gold,
                    bgcolor: premiumColors.gold + '10'
                  }
                }}
              >
                Réinitialiser
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
            px: 2
          }}
        >
          <Typography sx={{ color: premiumColors.goldLight, fontSize: '0.9rem' }}>
            Trier par:
          </Typography>
          <Button
            size="small"
            onClick={() => handleSort('createdAt')}
            endIcon={sortBy === 'createdAt' && (sortOrder === 'asc' ? <ArrowUpward /> : <ArrowDownward />)}
            sx={{
              color: sortBy === 'createdAt' ? premiumColors.gold : premiumColors.goldLight,
              '&:hover': { color: premiumColors.gold }
            }}
          >
            Date
          </Button>
          <Button
            size="small"
            onClick={() => handleSort('total')}
            endIcon={sortBy === 'total' && (sortOrder === 'asc' ? <ArrowUpward /> : <ArrowDownward />)}
            sx={{
              color: sortBy === 'total' ? premiumColors.gold : premiumColors.goldLight,
              '&:hover': { color: premiumColors.gold }
            }}
          >
            Total
          </Button>
          <Button
            size="small"
            onClick={() => handleSort('status')}
            endIcon={sortBy === 'status' && (sortOrder === 'asc' ? <ArrowUpward /> : <ArrowDownward />)}
            sx={{
              color: sortBy === 'status' ? premiumColors.gold : premiumColors.goldLight,
              '&:hover': { color: premiumColors.gold }
            }}
          >
            Statut
          </Button>
        </Box>

        {/* Orders List */}
        {loading ? (
          <Box sx={{ width: '100%', py: 8 }}>
            <LinearProgress 
              sx={{
                bgcolor: premiumColors.gold + '20',
                '& .MuiLinearProgress-bar': {
                  bgcolor: premiumColors.gold
                }
              }}
            />
          </Box>
        ) : filteredOrders.length === 0 ? (
          <Paper
            sx={{
              p: 8,
              textAlign: 'center',
              bgcolor: premiumColors.charcoal + '80',
              border: `1px solid ${premiumColors.gold}20`,
              borderRadius: 3
            }}
          >
            <ShoppingBag sx={{ fontSize: 64, color: premiumColors.gold + '80', mb: 2 }} />
            <Typography
              variant="h6"
              sx={{
                color: premiumColors.goldLight,
                fontFamily: "'Fjalla One', sans-serif",
                mb: 1
              }}
            >
              Aucune commande trouvée
            </Typography>
            <Typography sx={{ color: premiumColors.goldLight + '80' }}>
              Essayez de modifier vos filtres ou d'actualiser la page
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
              sx={{
                color: premiumColors.white,
                '& .MuiTablePagination-select': {
                  color: premiumColors.white
                },
                '& .MuiTablePagination-selectIcon': {
                  color: premiumColors.gold
                },
                '& .MuiTablePagination-actions button': {
                  color: premiumColors.gold,
                  '&:disabled': {
                    color: premiumColors.gold + '40'
                  }
                }
              }}
            />
          </Box>
        )}

        {/* Order Details Modal */}
        <OrderDetailsModal
          open={detailsOpen}
          onClose={() => setDetailsOpen(false)}
          order={selectedOrder}
          onStatusUpdate={updateOrderStatus}
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
              bgcolor: premiumColors.charcoal,
              color: premiumColors.white,
              border: `1px solid ${
                snackbar.severity === 'success' ? premiumColors.success : 
                snackbar.severity === 'error' ? premiumColors.error : 
                premiumColors.gold
              }40`,
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
          
          ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
          }
          
          ::-webkit-scrollbar-track {
            background: ${premiumColors.charcoal};
          }
          
          ::-webkit-scrollbar-thumb {
            background: ${premiumColors.gold}40;
            border-radius: 4px;
          }
          
          ::-webkit-scrollbar-thumb:hover {
            background: ${premiumColors.gold}60;
          }
        `}</style>
      </Box>
    </LocalizationProvider>
  );
};

export default Order;