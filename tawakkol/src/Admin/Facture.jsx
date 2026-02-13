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
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  TextareaAutosize
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
  Info,
  PictureAsPdf,
  Print,
  Share,
  Edit,
  Save,
  Add,
  Remove,
  Calculate,
  Business,
  Verified,
  FileCopy,
  Send,
  Schedule
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import frLocale from 'date-fns/locale/fr';
import { format, formatDistance } from 'date-fns';
import { fr } from 'date-fns/locale';
import API_BASE from '../Config/api';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

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
  
  // Status Colors
  paid: '#10b981',
  pending: '#f59e0b',
  cancelled: '#ef4444',
  draft: '#6b7280',
  
  paidBg: 'rgba(16, 185, 129, 0.15)',
  pendingBg: 'rgba(245, 158, 11, 0.15)',
  cancelledBg: 'rgba(239, 68, 68, 0.15)',
  draftBg: 'rgba(107, 114, 128, 0.15)',
  
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

// ============ INVOICE STATUS CONFIGURATION ============
const invoiceStatusConfig = {
  paid: {
    label: 'Payée',
    color: premiumColors.paid,
    bgColor: premiumColors.paidBg,
    icon: <CheckCircle />,
    iconColor: premiumColors.paid
  },
  pending: {
    label: 'En attente',
    color: premiumColors.pending,
    bgColor: premiumColors.pendingBg,
    icon: <Schedule />,
    iconColor: premiumColors.pending
  },
  cancelled: {
    label: 'Annulée',
    color: premiumColors.cancelled,
    bgColor: premiumColors.cancelledBg,
    icon: <Cancel />,
    iconColor: premiumColors.cancelled
  },
  draft: {
    label: 'Brouillon',
    color: premiumColors.draft,
    bgColor: premiumColors.draftBg,
    icon: <Edit />,
    iconColor: premiumColors.draft
  }
};

// ============ COMPANY INFO ============
const companyInfo = {
  name: 'TAWAKKOL STORE',
  address: '123 Rue de la Liberté, 1000 Tunis',
  phone: '+216 71 123 456',
  email: 'contact@tawakkol-store.tn',
  website: 'www.tawakkol-store.tn',
  taxId: 'MT1234567',
  regNumber: 'B12345678',
  logo: '/logo.png',
  bankName: 'Banque de Tunisie',
  bankAccount: 'TN59 1234 5678 9012 3456 7890',
  iban: 'TN59 1234 5678 9012 3456 7890',
  swift: 'BTBKTTTN'
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

// ============ PDF GENERATION SERVICE ============
class InvoicePDFService {
  static generateInvoice(invoiceData) {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    // Set fonts
    doc.setFont('helvetica', 'normal');
    
    // Colors
    const goldColor = [212, 175, 55];
    const darkColor = [18, 18, 18];
    const lightGray = [245, 245, 245];
    const textGray = [100, 100, 100];

    // === HEADER SECTION ===
    
    // Background decoration
    doc.setFillColor(...darkColor);
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setFillColor(...goldColor);
    doc.rect(0, 38, 210, 2, 'F');
    
    // Company Name
    doc.setTextColor(...goldColor);
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.text('TAWAKKOL STORE', 15, 25);
    
    // Invoice Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text('FACTURE', 180, 25, { align: 'right' });
    
    // Invoice Number
    doc.setFontSize(10);
    doc.text(`N°: ${invoiceData.invoiceNumber}`, 180, 35, { align: 'right' });
    
    // === COMPANY INFO ===
    doc.setTextColor(...textGray);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(companyInfo.address, 15, 55);
    doc.text(`Tél: ${companyInfo.phone}`, 15, 62);
    doc.text(`Email: ${companyInfo.email}`, 15, 69);
    doc.text(`Matricule: ${companyInfo.regNumber}`, 15, 76);
    doc.text(`N° TVA: ${companyInfo.taxId}`, 15, 83);
    
    // === INVOICE DETAILS ===
    doc.setDrawColor(...goldColor);
    doc.setLineWidth(0.5);
    doc.line(120, 55, 195, 55);
    
    doc.setTextColor(...darkColor);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Date d\'émission:', 120, 65);
    doc.text('Date d\'échéance:', 120, 75);
    doc.text('Statut:', 120, 85);
    
    doc.setTextColor(...textGray);
    doc.setFont('helvetica', 'normal');
    doc.text(format(new Date(invoiceData.createdAt), 'dd/MM/yyyy'), 170, 65);
    doc.text(format(new Date(invoiceData.dueDate || invoiceData.createdAt), 'dd/MM/yyyy'), 170, 75);
    
    // Status Badge
    const status = invoiceStatusConfig[invoiceData.status] || invoiceStatusConfig.pending;
    doc.setFillColor(...status.color === premiumColors.paid ? [16, 185, 129] : 
                     status.color === premiumColors.pending ? [245, 158, 11] : 
                     status.color === premiumColors.cancelled ? [239, 68, 68] : [107, 114, 128]);
    doc.roundedRect(165, 80, 30, 8, 2, 2, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.text(status.label, 180, 86, { align: 'center' });
    
    // === CLIENT INFO ===
    doc.setFillColor(...lightGray);
    doc.rect(15, 100, 180, 35, 'F');
    
    doc.setTextColor(...goldColor);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('FACTURER À', 20, 115);
    
    doc.setTextColor(...darkColor);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(invoiceData.customer?.fullName || 'Client', 20, 125);
    
    doc.setTextColor(...textGray);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(invoiceData.customer?.email || '', 20, 135);
    doc.text(invoiceData.customer?.phone || '', 20, 145);
    doc.text(invoiceData.customer?.address || '', 20, 155);
    
    // === ITEMS TABLE ===
    const tableColumn = [
      { header: 'Description', dataKey: 'description' },
      { header: 'Qté', dataKey: 'quantity' },
      { header: 'Prix unit.', dataKey: 'price' },
      { header: 'Total', dataKey: 'total' }
    ];
    
    const tableRows = invoiceData.items.map(item => ({
      description: item.name,
      quantity: item.quantity.toString(),
      price: `${item.price.toFixed(2)} DT`,
      total: `${(item.price * item.quantity).toFixed(2)} DT`
    }));
    
    doc.autoTable({
      columns: tableColumn,
      body: tableRows,
      startY: 170,
      theme: 'grid',
      styles: {
        fontSize: 9,
        cellPadding: 5,
        lineColor: [212, 175, 55, 30],
        lineWidth: 0.1,
        textColor: [50, 50, 50]
      },
      headStyles: {
        fillColor: [212, 175, 55],
        textColor: [0, 0, 0],
        fontSize: 10,
        fontStyle: 'bold',
        halign: 'center'
      },
      columnStyles: {
        description: { cellWidth: 80 },
        quantity: { cellWidth: 25, halign: 'center' },
        price: { cellWidth: 35, halign: 'right' },
        total: { cellWidth: 35, halign: 'right' }
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      }
    });
    
    const finalY = doc.lastAutoTable.finalY + 10;
    
    // === TOTAL SECTION ===
    doc.setFillColor(...darkColor);
    doc.rect(120, finalY, 75, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('SOUS-TOTAL:', 125, finalY + 10);
    doc.text('LIVRAISON:', 125, finalY + 20);
    
    doc.setTextColor(...goldColor);
    doc.setFontSize(11);
    doc.text(`${invoiceData.subtotal?.toFixed(2) || 0} DT`, 185, finalY + 10, { align: 'right' });
    doc.text(`${invoiceData.shippingCost?.toFixed(2) || 0} DT`, 185, finalY + 20, { align: 'right' });
    
    doc.setDrawColor(...goldColor);
    doc.setLineWidth(0.5);
    doc.line(125, finalY + 25, 190, finalY + 25);
    
    doc.setTextColor(...goldColor);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('TOTAL:', 125, finalY + 35);
    doc.text(`${invoiceData.total?.toFixed(2) || 0} DT`, 185, finalY + 35, { align: 'right' });
    
    // === PAYMENT INFO ===
    doc.setTextColor(...darkColor);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('INFORMATIONS DE PAIEMENT', 15, finalY + 60);
    
    doc.setTextColor(...textGray);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(`Banque: ${companyInfo.bankName}`, 15, finalY + 70);
    doc.text(`IBAN: ${companyInfo.iban}`, 15, finalY + 77);
    doc.text(`SWIFT: ${companyInfo.swift}`, 15, finalY + 84);
    doc.text(`Mode: ${invoiceData.paymentMethod === 'cash' ? 'Paiement à la livraison' : 
                     invoiceData.paymentMethod === 'card' ? 'Carte bancaire' : 'Virement'}`, 15, finalY + 94);
    
    // === NOTES ===
    if (invoiceData.notes) {
      doc.setTextColor(...darkColor);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text('NOTES:', 15, finalY + 110);
      
      doc.setTextColor(...textGray);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'italic');
      doc.text(invoiceData.notes, 15, finalY + 120);
    }
    
    // === FOOTER ===
    doc.setFillColor(...lightGray);
    doc.rect(0, 280, 210, 20, 'F');
    
    doc.setTextColor(...textGray);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text(`Facture générée le ${format(new Date(), 'dd/MM/yyyy HH:mm')}`, 15, 290);
    doc.text(companyInfo.website, 180, 290, { align: 'right' });
    doc.text('Merci de votre confiance !', 105, 297, { align: 'center' });
    
    return doc;
  }
}

// ============ INVOICE CARD COMPONENT ============
const InvoiceCard = ({ invoice, onView, onDownload, onStatusUpdate, onDelete }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const status = invoiceStatusConfig[invoice.status] || invoiceStatusConfig.pending;
  const userRole = localStorage.getItem('userRole');

  const handleMenuOpen = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => setAnchorEl(null);
  
  const handleStatusChange = (newStatus) => {
    onStatusUpdate(invoice._id, newStatus);
    handleMenuClose();
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    onDelete(invoice);
  };

  const handleDownloadClick = (e) => {
    e.stopPropagation();
    onDownload(invoice);
  };

  return (
    <Zoom in timeout={400}>
      <Paper
        elevation={0}
        onClick={() => onView(invoice)}
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
            '& .invoice-number': {
              color: premiumColors.gold
            }
          }
        }}
      >
        <Grid container spacing={2} alignItems="center">
          {/* Invoice Info */}
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
                <Receipt />
              </Avatar>
              <Box>
                <Typography
                  className="invoice-number"
                  sx={{
                    color: premiumColors.white,
                    fontFamily: "'Fjalla One', sans-serif",
                    fontSize: '1rem',
                    fontWeight: 700,
                    transition: 'color 0.3s ease',
                    mb: 0.5
                  }}
                >
                  {invoice.invoiceNumber || `FACT-${invoice._id?.slice(-6)}`}
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
                  {format(new Date(invoice.createdAt), 'dd/MM/yyyy')}
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
                  {invoice.customer?.fullName || 'Client'}
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
                  <ShoppingBag sx={{ fontSize: '0.7rem' }} />
                  {invoice.items?.length || 0} article{(invoice.items?.length || 0) > 1 ? 's' : ''}
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Amount */}
          <Grid item xs={12} md={2}>
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                sx={{
                  color: premiumColors.gold,
                  fontFamily: "'Fjalla One', sans-serif",
                  fontSize: '1.3rem',
                  fontWeight: 700,
                  lineHeight: 1.2
                }}
              >
                {invoice.total?.toFixed(2)} DT
              </Typography>
              <Typography
                sx={{
                  color: premiumColors.textMuted,
                  fontSize: '0.7rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}
              >
                {invoice.paymentMethod === 'cash' ? 'Paiement livraison' : 
                 invoice.paymentMethod === 'card' ? 'Carte' : 'Virement'}
              </Typography>
            </Box>
          </Grid>

          {/* Status & Actions */}
          <Grid item xs={12} md={4.5}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 1.5 }}>
              {/* Status Chip */}
              <Chip
                icon={status.icon}
                label={status.label}
                sx={{
                  bgcolor: status.bgColor,
                  color: status.color,
                  border: `1px solid ${alpha(status.color, 0.3)}`,
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  height: 32
                }}
              />

              {/* Download PDF Button */}
              <Tooltip title="Télécharger PDF" arrow>
                <IconButton
                  onClick={handleDownloadClick}
                  sx={{
                    color: premiumColors.gold,
                    bgcolor: alpha(premiumColors.gold, 0.08),
                    width: 36,
                    height: 36,
                    borderRadius: 2,
                    '&:hover': {
                      bgcolor: alpha(premiumColors.gold, 0.2),
                      transform: 'scale(1.1)'
                    }
                  }}
                >
                  <PictureAsPdf fontSize="small" />
                </IconButton>
              </Tooltip>

              {/* View Button */}
              <Tooltip title="Voir détails" arrow>
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    onView(invoice);
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
              <Button
                variant="contained"
                onClick={handleMenuOpen}
                endIcon={<MoreVert />}
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
                Statut
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
                    minWidth: 180
                  }
                }}
              >
                {Object.keys(invoiceStatusConfig).map((statusKey) => (
                  <MenuItem
                    key={statusKey}
                    onClick={() => handleStatusChange(statusKey)}
                    sx={{
                      color: premiumColors.white,
                      gap: 1,
                      '&:hover': {
                        bgcolor: invoiceStatusConfig[statusKey]?.bgColor
                      }
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: alpha(invoiceStatusConfig[statusKey].color, 0.1),
                        color: invoiceStatusConfig[statusKey].color,
                        width: 28,
                        height: 28,
                        borderRadius: 1
                      }}
                    >
                      {invoiceStatusConfig[statusKey].icon}
                    </Avatar>
                    <Typography sx={{ fontSize: '0.85rem' }}>
                      {invoiceStatusConfig[statusKey].label}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>

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

// ============ INVOICE DETAILS MODAL ============
const InvoiceDetailsModal = ({ open, onClose, invoice, onDownload, onStatusUpdate, onDelete }) => {
  const [statusAnchorEl, setStatusAnchorEl] = useState(null);
  const userRole = localStorage.getItem('userRole');
  
  if (!invoice) return null;

  const status = invoiceStatusConfig[invoice.status] || invoiceStatusConfig.pending;

  const handleStatusMenuOpen = (event) => {
    event.stopPropagation();
    setStatusAnchorEl(event.currentTarget);
  };
  
  const handleStatusMenuClose = () => setStatusAnchorEl(null);
  
  const handleStatusChange = (newStatus) => {
    onStatusUpdate(invoice._id, newStatus);
    handleStatusMenuClose();
  };

  const handleDeleteClick = () => {
    onDelete(invoice);
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
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
                {invoice.invoiceNumber || `FACT-${invoice._id?.slice(-6)}`}
                <Chip
                  icon={status.icon}
                  label={status.label}
                  size="small"
                  sx={{
                    bgcolor: status.bgColor,
                    color: status.color,
                    border: `1px solid ${alpha(status.color, 0.3)}`,
                    height: 24
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
                  {format(new Date(invoice.createdAt), 'dd MMMM yyyy', { locale: fr })}
                </Typography>
                {invoice.dueDate && (
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
                    Échéance: {format(new Date(invoice.dueDate), 'dd/MM/yyyy')}
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Tooltip title="Télécharger PDF">
              <IconButton
                onClick={() => onDownload(invoice)}
                sx={{
                  color: premiumColors.gold,
                  bgcolor: alpha(premiumColors.gold, 0.1),
                  width: 40,
                  height: 40,
                  '&:hover': {
                    bgcolor: alpha(premiumColors.gold, 0.2)
                  }
                }}
              >
                <PictureAsPdf />
              </IconButton>
            </Tooltip>
            <Tooltip title="Imprimer">
              <IconButton
                sx={{
                  color: premiumColors.gold,
                  bgcolor: alpha(premiumColors.gold, 0.1),
                  width: 40,
                  height: 40,
                  '&:hover': {
                    bgcolor: alpha(premiumColors.gold, 0.2)
                  }
                }}
              >
                <Print />
              </IconButton>
            </Tooltip>
            <Tooltip title="Fermer">
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
            </Tooltip>
          </Box>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={3}>
          {/* Company Info */}
          <Grid item xs={12} md={6}>
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
                <Store sx={{ fontSize: '1rem' }} />
                VENDEUR
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: alpha(premiumColors.gold, 0.1),
                    color: premiumColors.gold,
                    width: 48,
                    height: 48,
                    borderRadius: 1.5
                  }}
                >
                  <Business />
                </Avatar>
                <Box>
                  <Typography sx={{ color: premiumColors.white, fontWeight: 700 }}>
                    {companyInfo.name}
                  </Typography>
                  <Typography sx={{ color: premiumColors.textMuted, fontSize: '0.8rem' }}>
                    {companyInfo.regNumber}
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography sx={{ color: premiumColors.textMuted, fontSize: '0.8rem', display: 'flex', gap: 1 }}>
                  <LocationOn sx={{ fontSize: '0.9rem' }} /> {companyInfo.address}
                </Typography>
                <Typography sx={{ color: premiumColors.textMuted, fontSize: '0.8rem', display: 'flex', gap: 1 }}>
                  <Phone sx={{ fontSize: '0.9rem' }} /> {companyInfo.phone}
                </Typography>
                <Typography sx={{ color: premiumColors.textMuted, fontSize: '0.8rem', display: 'flex', gap: 1 }}>
                  <Email sx={{ fontSize: '0.9rem' }} /> {companyInfo.email}
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Customer Info */}
          <Grid item xs={12} md={6}>
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
                <Person sx={{ fontSize: '1rem' }} />
                CLIENT
              </Typography>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                <Avatar
                  sx={{
                    bgcolor: alpha(premiumColors.gold, 0.1),
                    color: premiumColors.gold,
                    width: 48,
                    height: 48,
                    borderRadius: 1.5,
                    fontSize: '1.2rem',
                    fontWeight: 700
                  }}
                >
                  {invoice.customer?.fullName?.charAt(0) || 'C'}
                </Avatar>
                <Box>
                  <Typography sx={{ color: premiumColors.white, fontWeight: 700 }}>
                    {invoice.customer?.fullName || 'Client'}
                  </Typography>
                  {invoice.customer?.clothingSize && (
                    <Chip
                      label={`Taille: ${invoice.customer.clothingSize}`}
                      size="small"
                      sx={{
                        bgcolor: alpha(premiumColors.gold, 0.1),
                        color: premiumColors.goldLight,
                        height: 20,
                        fontSize: '0.65rem',
                        mt: 0.5
                      }}
                    />
                  )}
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography sx={{ color: premiumColors.textMuted, fontSize: '0.8rem', display: 'flex', gap: 1 }}>
                  <Email sx={{ fontSize: '0.9rem' }} /> {invoice.customer?.email || '—'}
                </Typography>
                <Typography sx={{ color: premiumColors.textMuted, fontSize: '0.8rem', display: 'flex', gap: 1 }}>
                  <Phone sx={{ fontSize: '0.9rem' }} /> {invoice.customer?.phone || '—'}
                </Typography>
                <Typography sx={{ color: premiumColors.textMuted, fontSize: '0.8rem', display: 'flex', gap: 1 }}>
                  <LocationOn sx={{ fontSize: '0.9rem' }} /> {invoice.customer?.address || '—'}
                  {invoice.customer?.city && `, ${invoice.customer.city}`}
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Items Table */}
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
                  ARTICLES FACTURÉS
                </Typography>
                <Chip
                  label={`${invoice.items?.length || 0} article${invoice.items?.length > 1 ? 's' : ''}`}
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
                        borderBottom: `1px solid ${alpha(premiumColors.gold, 0.2)}`
                      }}>
                        Produit
                      </TableCell>
                      <TableCell align="center" sx={{ 
                        color: premiumColors.textMuted, 
                        fontSize: '0.7rem', 
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        borderBottom: `1px solid ${alpha(premiumColors.gold, 0.2)}`
                      }}>
                        Qté
                      </TableCell>
                      <TableCell align="right" sx={{ 
                        color: premiumColors.textMuted, 
                        fontSize: '0.7rem', 
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        borderBottom: `1px solid ${alpha(premiumColors.gold, 0.2)}`
                      }}>
                        Prix unitaire
                      </TableCell>
                      <TableCell align="right" sx={{ 
                        color: premiumColors.textMuted, 
                        fontSize: '0.7rem', 
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        borderBottom: `1px solid ${alpha(premiumColors.gold, 0.2)}`
                      }}>
                        Total
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {invoice.items?.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell sx={{ borderBottom: `1px solid ${alpha(premiumColors.gold, 0.1)}` }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            {item.mainImage && (
                              <Avatar
                                src={typeof item.mainImage === 'string' ? item.mainImage : item.mainImage?.url}
                                variant="rounded"
                                sx={{
                                  width: 40,
                                  height: 40,
                                  border: `1px solid ${alpha(premiumColors.gold, 0.2)}`,
                                  borderRadius: 1
                                }}
                              />
                            )}
                            <Box>
                              <Typography sx={{ color: premiumColors.white, fontWeight: 600, fontSize: '0.9rem' }}>
                                {item.name}
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                                {item.selectedSize && (
                                  <Chip
                                    label={item.selectedSize}
                                    size="small"
                                    sx={{
                                      bgcolor: alpha(premiumColors.gold, 0.1),
                                      color: premiumColors.gold,
                                      fontSize: '0.65rem',
                                      height: 20
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
                                      fontSize: '0.65rem',
                                      height: 20
                                    }}
                                  />
                                )}
                              </Box>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell align="center" sx={{ borderBottom: `1px solid ${alpha(premiumColors.gold, 0.1)}` }}>
                          <Typography sx={{ color: premiumColors.white, fontWeight: 700 }}>
                            {item.quantity}
                          </Typography>
                        </TableCell>
                        <TableCell align="right" sx={{ borderBottom: `1px solid ${alpha(premiumColors.gold, 0.1)}` }}>
                          <Typography sx={{ color: premiumColors.textSecondary }}>
                            {item.price?.toFixed(2)} DT
                          </Typography>
                        </TableCell>
                        <TableCell align="right" sx={{ borderBottom: `1px solid ${alpha(premiumColors.gold, 0.1)}` }}>
                          <Typography sx={{ color: premiumColors.gold, fontWeight: 700 }}>
                            {(item.price * item.quantity).toFixed(2)} DT
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              <Divider sx={{ borderColor: alpha(premiumColors.gold, 0.2), my: 3 }} />

              {/* Totals */}
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                <Box sx={{ width: '300px' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography sx={{ color: premiumColors.textMuted }}>Sous-total</Typography>
                    <Typography sx={{ color: premiumColors.white }}>{invoice.subtotal?.toFixed(2)} DT</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography sx={{ color: premiumColors.textMuted }}>Livraison</Typography>
                    <Typography sx={{ color: premiumColors.white }}>{invoice.shippingCost?.toFixed(2)} DT</Typography>
                  </Box>
                  {invoice.tax > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography sx={{ color: premiumColors.textMuted }}>TVA (19%)</Typography>
                      <Typography sx={{ color: premiumColors.white }}>{invoice.tax?.toFixed(2)} DT</Typography>
                    </Box>
                  )}
                  <Divider sx={{ borderColor: alpha(premiumColors.gold, 0.2), my: 2 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography sx={{ color: premiumColors.white, fontSize: '1.1rem', fontWeight: 700 }}>
                      TOTAL
                    </Typography>
                    <Typography sx={{ color: premiumColors.gold, fontSize: '1.5rem', fontWeight: 800 }}>
                      {invoice.total?.toFixed(2)} DT
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Payment Info */}
          <Grid item xs={12} md={6}>
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
                <Payment sx={{ fontSize: '1rem' }} />
                INFORMATIONS DE PAIEMENT
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: alpha(premiumColors.gold, 0.1),
                      color: premiumColors.gold,
                      width: 36,
                      height: 36,
                      borderRadius: 1.5
                    }}
                  >
                    <Payment sx={{ fontSize: '1rem' }} />
                  </Avatar>
                  <Box>
                    <Typography sx={{ color: premiumColors.textMuted, fontSize: '0.7rem' }}>
                      Mode de paiement
                    </Typography>
                    <Typography sx={{ color: premiumColors.white, fontWeight: 600 }}>
                      {invoice.paymentMethod === 'cash' ? 'Paiement à la livraison' : 
                       invoice.paymentMethod === 'card' ? 'Carte bancaire' : 'Virement bancaire'}
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar
                    sx={{
                      bgcolor: alpha(premiumColors.info, 0.1),
                      color: premiumColors.info,
                      width: 36,
                      height: 36,
                      borderRadius: 1.5
                    }}
                  >
                    <Verified sx={{ fontSize: '1rem' }} />
                  </Avatar>
                  <Box>
                    <Typography sx={{ color: premiumColors.textMuted, fontSize: '0.7rem' }}>
                      Statut
                    </Typography>
                    <Chip
                      icon={status.icon}
                      label={status.label}
                      size="small"
                      sx={{
                        bgcolor: status.bgColor,
                        color: status.color,
                        border: `1px solid ${alpha(status.color, 0.3)}`,
                        height: 24,
                        mt: 0.5
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Bank Info */}
          <Grid item xs={12} md={6}>
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
                <Business sx={{ fontSize: '1rem' }} />
                COORDONNÉES BANCAIRES
              </Typography>
              
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Typography sx={{ color: premiumColors.textMuted, fontSize: '0.8rem' }}>
                  Banque: <span style={{ color: premiumColors.white, fontWeight: 600 }}>{companyInfo.bankName}</span>
                </Typography>
                <Typography sx={{ color: premiumColors.textMuted, fontSize: '0.8rem' }}>
                  IBAN: <span style={{ color: premiumColors.white, fontWeight: 600 }}>{companyInfo.iban}</span>
                </Typography>
                <Typography sx={{ color: premiumColors.textMuted, fontSize: '0.8rem' }}>
                  SWIFT: <span style={{ color: premiumColors.white, fontWeight: 600 }}>{companyInfo.swift}</span>
                </Typography>
              </Box>
            </Paper>
          </Grid>

          {/* Notes */}
          {invoice.notes && (
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
                    mb: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <Info sx={{ fontSize: '1rem' }} />
                  NOTES
                </Typography>
                <Typography
                  sx={{
                    color: premiumColors.textSecondary,
                    fontSize: '0.9rem',
                    fontStyle: 'italic',
                    p: 2,
                    bgcolor: alpha(premiumColors.gold, 0.03),
                    borderRadius: 1.5
                  }}
                >
                  {invoice.notes}
                </Typography>
              </Paper>
            </Grid>
          )}
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
          <Button
            variant="contained"
            onClick={() => onDownload(invoice)}
            startIcon={<PictureAsPdf />}
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
                bgcolor: premiumColors.goldDark
              }
            }}
          >
            Télécharger PDF
          </Button>
          <Button
            variant="contained"
            onClick={onClose}
            sx={{
              bgcolor: premiumColors.surfaceLight,
              color: premiumColors.white,
              px: 4,
              py: 1,
              fontSize: '0.9rem',
              fontWeight: 700,
              textTransform: 'none',
              borderRadius: 2,
              '&:hover': {
                bgcolor: premiumColors.charcoal
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
const DeleteConfirmDialog = ({ open, onClose, onConfirm, invoice }) => {
  if (!invoice) return null;

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
            Êtes-vous sûr de vouloir supprimer cette facture ?
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
              <Receipt />
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography
                sx={{
                  color: premiumColors.gold,
                  fontWeight: 700,
                  fontSize: '1rem'
                }}
              >
                {invoice.invoiceNumber || `FACT-${invoice._id?.slice(-6)}`}
              </Typography>
              <Typography
                sx={{
                  color: premiumColors.textMuted,
                  fontSize: '0.8rem',
                  mt: 0.25
                }}
              >
                {invoice.customer?.fullName || 'Client'} • {invoice.total?.toFixed(2)} DT
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
            Cette facture sera définitivement supprimée de la base de données
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
            onConfirm(invoice._id);
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

// ============ CREATE INVOICE MODAL ============
const CreateInvoiceModal = ({ open, onClose, onCreate }) => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [step, setStep] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [invoiceData, setInvoiceData] = useState({
    invoiceNumber: `FACT-${format(new Date(), 'yyyyMMdd')}-${Math.floor(Math.random() * 1000)}`,
    dueDate: format(new Date().setDate(new Date().getDate() + 30), 'yyyy-MM-dd'),
    notes: '',
    paymentMethod: 'cash'
  });

  useEffect(() => {
    if (open) {
      fetchOrders();
    }
  }, [open]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/api/orders`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        // Filter only delivered orders or pending orders
        setOrders(data.data.filter(order => 
          ['delivered', 'shipped', 'pending'].includes(order.status)
        ));
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const handleCreateInvoice = () => {
    if (selectedOrder) {
      const invoice = {
        ...selectedOrder,
        invoiceNumber: invoiceData.invoiceNumber,
        dueDate: invoiceData.dueDate,
        notes: invoiceData.notes,
        paymentMethod: invoiceData.paymentMethod,
        status: 'pending',
        createdAt: new Date(),
        isInvoice: true
      };
      onCreate(invoice);
    }
  };

  const filteredOrders = orders.filter(order =>
    order.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customer?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <DialogTitle sx={{ 
        borderBottom: `1px solid ${alpha(premiumColors.gold, 0.15)}`,
        p: 3
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
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
            <Typography
              variant="h5"
              sx={{
                color: premiumColors.white,
                fontFamily: "'Fjalla One', sans-serif",
                fontWeight: 700
              }}
            >
              Créer une nouvelle facture
            </Typography>
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
        <Stepper activeStep={step} orientation="vertical" sx={{ mt: 1 }}>
          {/* Step 1: Select Order */}
          <Step>
            <StepLabel
              StepIconProps={{
                sx: {
                  color: step > 0 ? premiumColors.gold : premiumColors.textMuted,
                  '&.Mui-active': {
                    color: premiumColors.gold
                  }
                }
              }}
            >
              <Typography sx={{ color: premiumColors.white, fontWeight: 600 }}>
                Sélectionner une commande
              </Typography>
            </StepLabel>
            <StepContent>
              <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Rechercher une commande..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search sx={{ color: premiumColors.gold }} />
                      </InputAdornment>
                    ),
                    sx: {
                      color: premiumColors.white,
                      bgcolor: premiumColors.surfaceLight,
                      borderRadius: 2,
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: alpha(premiumColors.gold, 0.3)
                      }
                    }
                  }}
                  sx={{ mb: 2 }}
                />

                <Box sx={{ maxHeight: 300, overflow: 'auto' }}>
                  {filteredOrders.map((order) => (
                    <Paper
                      key={order._id}
                      elevation={0}
                      onClick={() => setSelectedOrder(order)}
                      sx={{
                        p: 2,
                        mb: 1,
                        bgcolor: selectedOrder?._id === order._id 
                          ? alpha(premiumColors.gold, 0.15)
                          : alpha(premiumColors.surfaceLight, 0.5),
                        border: `1px solid ${selectedOrder?._id === order._id 
                          ? alpha(premiumColors.gold, 0.5)
                          : alpha(premiumColors.gold, 0.1)}`,
                        borderRadius: 2,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          bgcolor: alpha(premiumColors.gold, 0.1),
                          borderColor: alpha(premiumColors.gold, 0.3)
                        }
                      }}
                    >
                      <Grid container spacing={2} alignItems="center">
                        <Grid item xs={4}>
                          <Typography sx={{ color: premiumColors.gold, fontWeight: 700 }}>
                            {order.orderNumber}
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography sx={{ color: premiumColors.white }}>
                            {order.customer?.fullName}
                          </Typography>
                        </Grid>
                        <Grid item xs={4}>
                          <Typography sx={{ color: premiumColors.gold, textAlign: 'right', fontWeight: 700 }}>
                            {order.total?.toFixed(2)} DT
                          </Typography>
                        </Grid>
                      </Grid>
                    </Paper>
                  ))}
                </Box>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleNext}
                  disabled={!selectedOrder}
                  sx={{
                    bgcolor: premiumColors.gold,
                    color: premiumColors.noir,
                    px: 3,
                    '&:hover': {
                      bgcolor: premiumColors.goldDark
                    },
                    '&:disabled': {
                      bgcolor: alpha(premiumColors.gold, 0.3),
                      color: premiumColors.noir
                    }
                  }}
                >
                  Continuer
                </Button>
              </Box>
            </StepContent>
          </Step>

          {/* Step 2: Invoice Details */}
          <Step>
            <StepLabel
              StepIconProps={{
                sx: {
                  color: step > 1 ? premiumColors.gold : premiumColors.textMuted,
                  '&.Mui-active': {
                    color: premiumColors.gold
                  }
                }
              }}
            >
              <Typography sx={{ color: premiumColors.white, fontWeight: 600 }}>
                Détails de la facture
              </Typography>
            </StepLabel>
            <StepContent>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Numéro de facture"
                    value={invoiceData.invoiceNumber}
                    onChange={(e) => setInvoiceData({ ...invoiceData, invoiceNumber: e.target.value })}
                    size="small"
                    InputProps={{
                      sx: {
                        color: premiumColors.white,
                        bgcolor: premiumColors.surfaceLight,
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: alpha(premiumColors.gold, 0.3)
                        }
                      }
                    }}
                    InputLabelProps={{
                      sx: { color: premiumColors.textMuted }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Date d'échéance"
                    type="date"
                    value={invoiceData.dueDate}
                    onChange={(e) => setInvoiceData({ ...invoiceData, dueDate: e.target.value })}
                    size="small"
                    InputProps={{
                      sx: {
                        color: premiumColors.white,
                        bgcolor: premiumColors.surfaceLight,
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: alpha(premiumColors.gold, 0.3)
                        }
                      }
                    }}
                    InputLabelProps={{
                      shrink: true,
                      sx: { color: premiumColors.textMuted }
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth size="small">
                    <InputLabel sx={{ color: premiumColors.textMuted }}>
                      Mode de paiement
                    </InputLabel>
                    <Select
                      value={invoiceData.paymentMethod}
                      onChange={(e) => setInvoiceData({ ...invoiceData, paymentMethod: e.target.value })}
                      sx={{
                        color: premiumColors.white,
                        bgcolor: premiumColors.surfaceLight,
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: alpha(premiumColors.gold, 0.3)
                        }
                      }}
                    >
                      <MenuItem value="cash">Paiement à la livraison</MenuItem>
                      <MenuItem value="card">Carte bancaire</MenuItem>
                      <MenuItem value="bank">Virement bancaire</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Notes (optionnel)"
                    multiline
                    rows={3}
                    value={invoiceData.notes}
                    onChange={(e) => setInvoiceData({ ...invoiceData, notes: e.target.value })}
                    InputProps={{
                      sx: {
                        color: premiumColors.white,
                        bgcolor: premiumColors.surfaceLight,
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: alpha(premiumColors.gold, 0.3)
                        }
                      }
                    }}
                    InputLabelProps={{
                      sx: { color: premiumColors.textMuted }
                    }}
                  />
                </Grid>
              </Grid>
              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button
                  variant="outlined"
                  onClick={handleBack}
                  sx={{
                    color: premiumColors.gold,
                    borderColor: premiumColors.gold,
                    '&:hover': {
                      borderColor: premiumColors.goldDark,
                      bgcolor: alpha(premiumColors.gold, 0.05)
                    }
                  }}
                >
                  Retour
                </Button>
                <Button
                  variant="contained"
                  onClick={handleCreateInvoice}
                  sx={{
                    bgcolor: premiumColors.gold,
                    color: premiumColors.noir,
                    px: 3,
                    '&:hover': {
                      bgcolor: premiumColors.goldDark
                    }
                  }}
                >
                  Créer la facture
                </Button>
              </Box>
            </StepContent>
          </Step>
        </Stepper>
      </DialogContent>
    </Dialog>
  );
};

// ============ MAIN FACTURE COMPONENT ============
const Facture = () => {
  const [invoices, setInvoices] = useState([]);
  const [filteredInvoices, setFilteredInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [invoiceToDelete, setInvoiceToDelete] = useState(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
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
    paid: 0,
    pending: 0,
    cancelled: 0,
    draft: 0,
    revenue: 0,
    today: 0
  });

  // ============ API FUNCTIONS ============
  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE}/api/invoices`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      
      if (data.success) {
        setInvoices(data.data);
        applyFilters(data.data);
        calculateStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
      // For demo, use mock data
      const mockInvoices = generateMockInvoices();
      setInvoices(mockInvoices);
      applyFilters(mockInvoices);
      calculateStats(mockInvoices);
    } finally {
      setLoading(false);
    }
  };

  const generateMockInvoices = () => {
    const mockInvoices = [];
    for (let i = 1; i <= 25; i++) {
      mockInvoices.push({
        _id: `inv-${i}`,
        invoiceNumber: `FACT-2024-${String(i).padStart(3, '0')}`,
        orderNumber: `CMD-2024-${String(i).padStart(3, '0')}`,
        customer: {
          fullName: `Client ${i}`,
          email: `client${i}@example.com`,
          phone: `+216 99 ${String(i).padStart(2, '0')} 123`,
          address: `Rue ${i}, Tunis`,
          city: 'Tunis'
        },
        items: [
          {
            name: 'Produit A',
            quantity: Math.floor(Math.random() * 3) + 1,
            price: 129.99,
            selectedSize: 'M',
            selectedColor: 'Noir'
          },
          {
            name: 'Produit B',
            quantity: Math.floor(Math.random() * 2) + 1,
            price: 79.99,
            selectedSize: 'L',
            selectedColor: 'Blanc'
          }
        ],
        subtotal: 209.98,
        shippingCost: 10,
        tax: 41.99,
        total: 261.97,
        paymentMethod: ['cash', 'card', 'bank'][Math.floor(Math.random() * 3)],
        status: ['paid', 'pending', 'cancelled', 'draft'][Math.floor(Math.random() * 4)],
        createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        notes: i % 3 === 0 ? 'Livraison express' : ''
      });
    }
    return mockInvoices;
  };

  const calculateStats = (invoicesData) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const stats = {
      total: invoicesData.length,
      paid: invoicesData.filter(i => i.status === 'paid').length,
      pending: invoicesData.filter(i => i.status === 'pending').length,
      cancelled: invoicesData.filter(i => i.status === 'cancelled').length,
      draft: invoicesData.filter(i => i.status === 'draft').length,
      revenue: invoicesData
        .filter(i => i.status === 'paid')
        .reduce((sum, i) => sum + i.total, 0),
      today: invoicesData.filter(i => new Date(i.createdAt) >= today).length
    };
    
    setStats(stats);
  };

  const applyFilters = (invoicesData) => {
    let filtered = [...invoicesData];

    if (searchTerm) {
      filtered = filtered.filter(invoice => 
        invoice.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.customer?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.customer?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter.length > 0) {
      filtered = filtered.filter(invoice => statusFilter.includes(invoice.status));
    }

    if (dateFilter) {
      const filterDate = new Date(dateFilter).setHours(0, 0, 0, 0);
      filtered = filtered.filter(invoice => {
        const invoiceDate = new Date(invoice.createdAt).setHours(0, 0, 0, 0);
        return invoiceDate === filterDate;
      });
    }

    filtered.sort((a, b) => {
      let valA = a[sortBy];
      let valB = b[sortBy];
      
      if (sortBy === 'createdAt' || sortBy === 'dueDate') {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      }
      if (sortBy === 'total') {
        valA = parseFloat(valA);
        valB = parseFloat(valB);
      }
      
      return sortOrder === 'asc' ? valA - valB : valB - valA;
    });

    setFilteredInvoices(filtered);
  };

  const getStatusCount = (status) => {
    return invoices.filter(i => i.status === status).length;
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleViewInvoice = (invoice) => {
    setSelectedInvoice(invoice);
    setDetailsOpen(true);
  };

  const handleDownloadInvoice = (invoice) => {
    try {
      const doc = InvoicePDFService.generateInvoice(invoice);
      doc.save(`${invoice.invoiceNumber || 'facture'}.pdf`);
      showSnackbar('PDF généré avec succès', 'success');
    } catch (error) {
      console.error('Error generating PDF:', error);
      showSnackbar('Erreur lors de la génération du PDF', 'error');
    }
  };

  const handleDeleteClick = (invoice) => {
    setInvoiceToDelete(invoice);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = (id) => {
    const updatedInvoices = invoices.filter(invoice => invoice._id !== id);
    setInvoices(updatedInvoices);
    applyFilters(updatedInvoices);
    calculateStats(updatedInvoices);
    
    if (selectedInvoice && selectedInvoice._id === id) {
      setDetailsOpen(false);
      setSelectedInvoice(null);
    }
    
    showSnackbar('Facture supprimée avec succès', 'success');
  };

  const handleStatusUpdate = (id, newStatus) => {
    const updatedInvoices = invoices.map(invoice => 
      invoice._id === id ? { ...invoice, status: newStatus } : invoice
    );
    setInvoices(updatedInvoices);
    applyFilters(updatedInvoices);
    calculateStats(updatedInvoices);
    
    if (selectedInvoice && selectedInvoice._id === id) {
      setSelectedInvoice({ ...selectedInvoice, status: newStatus });
    }
    
    showSnackbar(`Statut mis à jour: ${invoiceStatusConfig[newStatus].label}`, 'success');
  };

  const handleCreateInvoice = (newInvoice) => {
    const updatedInvoices = [newInvoice, ...invoices];
    setInvoices(updatedInvoices);
    applyFilters(updatedInvoices);
    calculateStats(updatedInvoices);
    setCreateModalOpen(false);
    showSnackbar('Facture créée avec succès', 'success');
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
    fetchInvoices();
    showSnackbar('Données actualisées', 'success');
  };

  const exportToCSV = () => {
    const headers = ['N° Facture', 'N° Commande', 'Client', 'Date', 'Total', 'Statut', 'Paiement'];
    const data = filteredInvoices.map(invoice => [
      invoice.invoiceNumber || invoice._id,
      invoice.orderNumber || '-',
      invoice.customer?.fullName || 'Client',
      format(new Date(invoice.createdAt), 'dd/MM/yyyy'),
      invoice.total?.toFixed(2),
      invoiceStatusConfig[invoice.status]?.label || invoice.status,
      invoice.paymentMethod === 'cash' ? 'Paiement livraison' : 
      invoice.paymentMethod === 'card' ? 'Carte' : 'Virement'
    ]);
    
    const csv = [headers, ...data].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `factures_${format(new Date(), 'yyyyMMdd_HHmm')}.csv`;
    a.click();
    
    showSnackbar('Export CSV réussi', 'success');
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  useEffect(() => {
    applyFilters(invoices);
  }, [searchTerm, statusFilter, dateFilter, sortBy, sortOrder]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={frLocale}>
      {/* WHITE BACKGROUND */}
      <Box sx={{ 
        width: '100%',
        minHeight: '100vh',
        bgcolor: '#ffffff',
        py: { xs: 2, lg: 5 }
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
                Gestion des Factures
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
                <Receipt sx={{ fontSize: '1.1rem', color: premiumColors.goldDark }} />
                {filteredInvoices.length} facture{filteredInvoices.length > 1 ? 's' : ''} affichée{filteredInvoices.length > 1 ? 's' : ''}
                {filteredInvoices.length !== invoices.length && ` (sur ${invoices.length} total)`}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="contained"
                onClick={() => setCreateModalOpen(true)}
                startIcon={<Add />}
                sx={{
                  bgcolor: premiumColors.gold,
                  color: premiumColors.noir,
                  px: 3,
                  py: 1,
                  fontWeight: 700,
                  textTransform: 'none',
                  borderRadius: 2,
                  '&:hover': {
                    bgcolor: premiumColors.goldDark,
                    transform: 'translateY(-2px)',
                    boxShadow: premiumColors.shadowGold
                  },
                  transition: 'all 0.2s ease'
                }}
              >
                Nouvelle facture
              </Button>
              <Tooltip title="Exporter CSV" arrow>
                <IconButton
                  onClick={exportToCSV}
                  sx={{
                    color: premiumColors.goldDark,
                    bgcolor: alpha(premiumColors.gold, 0.1),
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
                    bgcolor: alpha(premiumColors.gold, 0.1),
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
            <Grid item xs={12} sm={6} md={2.4}>
              <StatCard
                title="Total Factures"
                value={stats.total}
                subtitle={`+${stats.today} aujourd'hui`}
                icon={<Receipt />}
                color={premiumColors.gold}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <StatCard
                title="Payées"
                value={stats.paid}
                subtitle={`${((stats.paid / stats.total) * 100 || 0).toFixed(1)}%`}
                icon={<CheckCircle />}
                color={premiumColors.paid}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <StatCard
                title="En attente"
                value={stats.pending}
                subtitle={`${((stats.pending / stats.total) * 100 || 0).toFixed(1)}%`}
                icon={<Schedule />}
                color={premiumColors.pending}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <StatCard
                title="Brouillons"
                value={stats.draft}
                subtitle={`${((stats.draft / stats.total) * 100 || 0).toFixed(1)}%`}
                icon={<Edit />}
                color={premiumColors.draft}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={2.4}>
              <StatCard
                title="Chiffre d'affaires"
                value={`${stats.revenue.toFixed(2)} DT`}
                subtitle={`Moyenne: ${(stats.revenue / (stats.paid || 1)).toFixed(2)} DT`}
                icon={<AttachMoney />}
                color={premiumColors.gold}
              />
            </Grid>
          </Grid>

          {/* Filters Section */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 4,
              bgcolor: '#f8f8f8',
              border: '1px solid #e0e0e0',
              borderRadius: 3
            }}
          >
            <Grid container spacing={2} alignItems="center">
              {/* Search */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Rechercher par n° facture, client..."
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

              {/* Status Filter - Matching Order.jsx style */}
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
                    Statut de la facture
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
                              label={invoiceStatusConfig[value]?.label}
                              size="small"
                              sx={{
                                bgcolor: invoiceStatusConfig[value]?.bgColor,
                                color: invoiceStatusConfig[value]?.color,
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
                    {Object.keys(invoiceStatusConfig).map((status) => (
                      <MenuItem 
                        key={status} 
                        value={status}
                        sx={{
                          color: premiumColors.white,
                          '&:hover': {
                            bgcolor: invoiceStatusConfig[status]?.bgColor
                          },
                          '&.Mui-selected': {
                            bgcolor: alpha(invoiceStatusConfig[status]?.color, 0.2),
                            '&:hover': {
                              bgcolor: alpha(invoiceStatusConfig[status]?.color, 0.3)
                            }
                          }
                        }}
                      >
                        <Checkbox 
                          checked={statusFilter.indexOf(status) > -1} 
                          size="small"
                          sx={{
                            color: invoiceStatusConfig[status]?.color,
                            '&.Mui-checked': {
                              color: invoiceStatusConfig[status]?.color
                            }
                          }}
                        />
                        <ListItemText 
                          primary={invoiceStatusConfig[status].label}
                          secondary={`${getStatusCount(status)} facture${getStatusCount(status) > 1 ? 's' : ''}`}
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

          {/* Invoices List */}
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
          ) : filteredInvoices.length === 0 ? (
            <Paper
              sx={{
                p: 8,
                textAlign: 'center',
                bgcolor: premiumColors.surface,
                border: `1px solid ${alpha(premiumColors.gold, 0.15)}`,
                borderRadius: 3
              }}
            >
              <Receipt sx={{ fontSize: 80, color: alpha(premiumColors.gold, 0.3), mb: 2 }} />
              <Typography
                variant="h5"
                sx={{
                  color: premiumColors.white,
                  fontFamily: "'Fjalla One', sans-serif",
                  fontWeight: 700,
                  mb: 1
                }}
              >
                Aucune facture trouvée
              </Typography>
              <Typography sx={{ color: premiumColors.textMuted, fontSize: '0.95rem' }}>
                Commencez par créer une nouvelle facture
              </Typography>
              <Button
                variant="contained"
                onClick={() => setCreateModalOpen(true)}
                startIcon={<Add />}
                sx={{
                  mt: 3,
                  bgcolor: premiumColors.gold,
                  color: premiumColors.noir,
                  px: 4,
                  py: 1.5,
                  '&:hover': {
                    bgcolor: premiumColors.goldDark
                  }
                }}
              >
                Créer une facture
              </Button>
            </Paper>
          ) : (
            <Box>
              {filteredInvoices
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((invoice) => (
                  <InvoiceCard
                    key={invoice._id}
                    invoice={invoice}
                    onView={handleViewInvoice}
                    onDownload={handleDownloadInvoice}
                    onStatusUpdate={handleStatusUpdate}
                    onDelete={handleDeleteClick}
                  />
                ))}
              
              <TablePagination
                component="div"
                count={filteredInvoices.length}
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

        {/* Invoice Details Modal */}
        <InvoiceDetailsModal
          open={detailsOpen}
          onClose={() => setDetailsOpen(false)}
          invoice={selectedInvoice}
          onDownload={handleDownloadInvoice}
          onStatusUpdate={handleStatusUpdate}
          onDelete={handleDeleteClick}
        />

        {/* Create Invoice Modal */}
        <CreateInvoiceModal
          open={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onCreate={handleCreateInvoice}
        />

        {/* Delete Confirmation Dialog */}
        <DeleteConfirmDialog
          open={deleteDialogOpen}
          onClose={() => {
            setDeleteDialogOpen(false);
            setInvoiceToDelete(null);
          }}
          onConfirm={handleDeleteConfirm}
          invoice={invoiceToDelete}
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

export default Facture;