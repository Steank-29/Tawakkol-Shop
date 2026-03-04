// src/pages/ReligionStat.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Box,
  Chip,
  Divider,
  CircularProgress,
  Button,
  Paper,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  InputAdornment,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  Skeleton,
  Avatar,
  AvatarGroup,
  Tooltip,
  Badge,
  Tabs,
  Tab,
  Fade,
  Zoom,
  useTheme,
  useMediaQuery,
  alpha
} from '@mui/material';
import {
  Inventory as InventoryIcon,
  Warning as WarningIcon,
  AttachMoney as MoneyIcon,
  TrendingDown as LowStockIcon,
  TrendingUp as HighStockIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  Visibility as ViewIcon,
  Edit as EditIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  ShoppingCart as CartIcon,
  Category as CategoryIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Notifications as AlertIcon,
  Timeline as TimelineIcon,
  BarChart as ChartIcon,
  PieChart as PieChartIcon,
  Dashboard as DashboardIcon,
  Analytics as AnalyticsIcon,
  Speed as SpeedIcon,
  Store as StoreIcon,
  Tag as TagIcon,
  TrendingUp as TrendingUpIcon,
  Close as CloseIcon,
  Check as CheckIcon,
  Image as ImageIcon
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import API_BASE from '../Config/api.js';

// ==================== PROFESSIONAL MONOCHROME PALETTE ====================
const palette = {
  black: '#1A1A1A',
  white: '#FFFFFF',
  gray50: '#FAFAFA',
  gray100: '#F5F5F5',
  gray200: '#EEEEEE',
  gray300: '#E0E0E0',
  gray400: '#BDBDBD',
  gray500: '#9E9E9E',
  gray600: '#757575',
  gray700: '#616161',
  gray800: '#424242',
  gray900: '#212121',
  gold: '#D4AF37',
  goldLight: 'rgba(212, 175, 55, 0.1)',
  goldHover: 'rgba(212, 175, 55, 0.2)',
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FF9800',
  info: '#2196F3',
};

// ==================== STYLED COMPONENTS ====================
const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: palette.white,
  border: `1px solid ${palette.gray200}`,
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
  transition: 'all 0.3s ease',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: `0 12px 24px -8px ${alpha(palette.gold, 0.2)}`,
    borderColor: palette.gold,
  }
}));

const StatCard = styled(Card)(({ theme }) => ({
  backgroundColor: palette.white,
  border: `1px solid ${palette.gray200}`,
  borderRadius: '12px',
  padding: theme.spacing(3),
  transition: 'all 0.2s ease',
  '&:hover': {
    borderColor: palette.gold,
    boxShadow: `0 8px 16px ${alpha(palette.gold, 0.1)}`,
  }
}));

const StyledButton = styled(Button)(({ variant }) => ({
  borderRadius: '10px',
  textTransform: 'none',
  fontWeight: 500,
  fontSize: '0.9rem',
  padding: '8px 20px',
  transition: 'all 0.2s ease',
  ...(variant === 'primary' && {
    backgroundColor: palette.black,
    color: palette.white,
    '&:hover': {
      backgroundColor: palette.gray800,
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    },
  }),
  ...(variant === 'secondary' && {
    backgroundColor: 'transparent',
    color: palette.gray700,
    border: `1px solid ${palette.gray300}`,
    '&:hover': {
      backgroundColor: palette.gray50,
      borderColor: palette.gray500,
    },
  }),
  ...(variant === 'gold' && {
    backgroundColor: palette.gold,
    color: palette.black,
    '&:hover': {
      backgroundColor: '#C4A030',
      color: palette.white,
      boxShadow: `0 4px 12px ${alpha(palette.gold, 0.3)}`,
    },
  }),
}));

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
    fontSize: '0.95rem',
    backgroundColor: palette.white,
    '& fieldset': {
      borderColor: palette.gray300,
      borderWidth: '1.5px',
    },
    '&:hover fieldset': {
      borderColor: palette.gray500,
    },
    '&.Mui-focused fieldset': {
      borderColor: palette.black,
      borderWidth: '1.5px',
    },
  },
  '& .MuiInputLabel-root': {
    fontSize: '0.95rem',
    color: palette.gray600,
    '&.Mui-focused': {
      color: palette.black,
    },
  },
});

const StatusChip = styled(Chip)(({ status }) => ({
  borderRadius: '8px',
  fontWeight: 500,
  fontSize: '0.8rem',
  height: '28px',
  ...(status === 'critical' && {
    backgroundColor: alpha(palette.error, 0.1),
    color: palette.error,
    border: `1px solid ${alpha(palette.error, 0.3)}`,
  }),
  ...(status === 'low' && {
    backgroundColor: alpha(palette.warning, 0.1),
    color: palette.warning,
    border: `1px solid ${alpha(palette.warning, 0.3)}`,
  }),
  ...(status === 'optimal' && {
    backgroundColor: alpha(palette.success, 0.1),
    color: palette.success,
    border: `1px solid ${alpha(palette.success, 0.3)}`,
  }),
}));

const ProductImage = styled(Box)(({ src }) => ({
  width: '100%',
  height: '200px',
  backgroundImage: `url(${src})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  transition: 'all 0.3s ease',
}));

// ==================== OPTIONS ====================
const CATEGORY_OPTIONS = ['All', 'Sport', 'Casual', 'Religious', 'Streetwear'];

// ==================== MAIN COMPONENT ====================
const ReligionStat = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('value-desc');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [favorites, setFavorites] = useState([]);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Fetch data
  const fetchProducts = useCallback(async () => {
    setRefreshing(true);
    try {
      const response = await axios.get(`${API_BASE}/api/relproducts`);
      setProducts(response.data.products || []);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Computed stats
  const stats = useMemo(() => {
    const totalProducts = products.length;
    const totalValue = products.reduce((sum, p) => sum + (p.stock * p.price), 0);
    const totalUnits = products.reduce((sum, p) => sum + p.stock, 0);
    const lowStock = products.filter(p => p.stock <= 5);
    const criticalStock = products.filter(p => p.stock <= 2);
    const outOfStock = products.filter(p => p.stock === 0);
    const avgPrice = products.length ? (products.reduce((sum, p) => sum + p.price, 0) / products.length) : 0;
    
    // Category distribution
    const categoryCount = products.reduce((acc, p) => {
      acc[p.category] = (acc[p.category] || 0) + 1;
      return acc;
    }, {});

    return { 
      totalProducts, 
      totalValue, 
      totalUnits, 
      lowStock, 
      criticalStock,
      outOfStock,
      avgPrice,
      categoryCount
    };
  }, [products]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           p.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
      return matchesSearch && matchesCategory;
    }).sort((a, b) => {
      const valueA = a.stock * a.price;
      const valueB = b.stock * b.price;
      
      switch(sortBy) {
        case 'value-desc':
          return valueB - valueA;
        case 'value-asc':
          return valueA - valueB;
        case 'stock-desc':
          return b.stock - a.stock;
        case 'stock-asc':
          return a.stock - b.stock;
        case 'critical-first':
          return (a.stock <= 2 ? 0 : 1) - (b.stock <= 2 ? 0 : 1);
        default:
          return 0;
      }
    });
  }, [products, searchTerm, categoryFilter, sortBy]);

  // Get stock status
  const getStockStatus = (stock) => {
    if (stock === 0) return { label: 'Rupture', status: 'critical' };
    if (stock <= 2) return { label: 'Critique', status: 'critical' };
    if (stock <= 5) return { label: 'Faible', status: 'low' };
    return { label: 'Optimal', status: 'optimal' };
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05,
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: 'spring',
        stiffness: 100,
        damping: 15
      }
    }
  };

  // Export report
  const exportReport = () => {
    const report = {
      generated: new Date().toISOString(),
      summary: {
        totalProducts: stats.totalProducts,
        totalValue: stats.totalValue,
        totalUnits: stats.totalUnits,
        lowStock: stats.lowStock.length,
        criticalStock: stats.criticalStock.length,
        outOfStock: stats.outOfStock.length,
      },
      products: products.map(p => ({
        name: p.name,
        category: p.category,
        price: p.price,
        stock: p.stock,
        value: p.stock * p.price,
        status: getStockStatus(p.stock).label
      }))
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `inventory-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: palette.gray50,
      py: 4
    }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ 
            fontWeight: 700, 
            color: palette.gray900,
            mb: 1,
            letterSpacing: '-0.02em',
          }}>
            Statistiques des Produits Religieux
          </Typography>
          <Typography variant="body1" sx={{ color: palette.gray500 }}>
            Analyse et gestion de votre inventaire
          </Typography>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <motion.div variants={itemVariants}>
              <StatCard>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="overline" sx={{ color: palette.gray500 }}>
                    Produits Totaux
                  </Typography>
                  <Avatar sx={{ bgcolor: alpha(palette.gold, 0.1), width: 40, height: 40 }}>
                    <InventoryIcon sx={{ color: palette.gold, fontSize: 20 }} />
                  </Avatar>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 700, color: palette.gray900 }}>
                  {stats.totalProducts}
                </Typography>
                <Typography variant="caption" sx={{ color: palette.gray500 }}>
                  Articles en catalogue
                </Typography>
              </StatCard>
            </motion.div>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <motion.div variants={itemVariants}>
              <StatCard>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="overline" sx={{ color: palette.gray500 }}>
                    Valeur Totale
                  </Typography>
                  <Avatar sx={{ bgcolor: alpha(palette.gold, 0.1), width: 40, height: 40 }}>
                    <MoneyIcon sx={{ color: palette.gold, fontSize: 20 }} />
                  </Avatar>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 700, color: palette.gray900 }}>
                  {stats.totalValue.toLocaleString()} TND
                </Typography>
                <Typography variant="caption" sx={{ color: palette.gray500 }}>
                  Capital en stock
                </Typography>
              </StatCard>
            </motion.div>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <motion.div variants={itemVariants}>
              <StatCard>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="overline" sx={{ color: palette.gray500 }}>
                    Stock Critique
                  </Typography>
                  <Avatar sx={{ bgcolor: alpha(palette.error, 0.1), width: 40, height: 40 }}>
                    <WarningIcon sx={{ color: palette.error, fontSize: 20 }} />
                  </Avatar>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 700, color: palette.error }}>
                  {stats.criticalStock.length}
                </Typography>
                <Typography variant="caption" sx={{ color: palette.gray500 }}>
                  Produits ≤ 2 unités
                </Typography>
              </StatCard>
            </motion.div>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <motion.div variants={itemVariants}>
              <StatCard>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="overline" sx={{ color: palette.gray500 }}>
                    En Rupture
                  </Typography>
                  <Avatar sx={{ bgcolor: alpha(palette.error, 0.1), width: 40, height: 40 }}>
                    <DeleteIcon sx={{ color: palette.error, fontSize: 20 }} />
                  </Avatar>
                </Box>
                <Typography variant="h3" sx={{ fontWeight: 700, color: palette.error }}>
                  {stats.outOfStock.length}
                </Typography>
                <Typography variant="caption" sx={{ color: palette.gray500 }}>
                  Stock épuisé
                </Typography>
              </StatCard>
            </motion.div>
          </Grid>
        </Grid>

        {/* Filters */}
        <Paper sx={{ p: 3, mb: 4, borderRadius: '12px', border: `1px solid ${palette.gray200}` }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <StyledTextField
                fullWidth
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: palette.gray400 }} />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Catégorie</InputLabel>
                <Select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  label="Catégorie"
                >
                  {CATEGORY_OPTIONS.map(cat => (
                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel>Trier par</InputLabel>
                <Select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  label="Trier par"
                >
                  <MenuItem value="value-desc">Valeur (++ → --)</MenuItem>
                  <MenuItem value="value-asc">Valeur (-- → ++)</MenuItem>
                  <MenuItem value="stock-desc">Stock (++ → --)</MenuItem>
                  <MenuItem value="stock-asc">Stock (-- → ++)</MenuItem>
                  <MenuItem value="critical-first">Critique en premier</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="Actualiser">
                  <IconButton onClick={fetchProducts} disabled={refreshing}>
                    <RefreshIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Exporter">
                  <IconButton onClick={exportReport}>
                    <DownloadIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Products Grid */}
        {loading ? (
          <Grid container spacing={3}>
            {[...Array(6)].map((_, i) => (
              <Grid item xs={12} sm={6} md={4} key={i}>
                <Skeleton variant="rectangular" height={320} sx={{ borderRadius: '16px' }} />
              </Grid>
            ))}
          </Grid>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Grid container spacing={3}>
              <AnimatePresence>
                {filteredProducts.map((product) => {
                  const value = product.stock * product.price;
                  const stockStatus = getStockStatus(product.stock);
                  const isFavorite = favorites.includes(product._id);

                  return (
                    <Grid item xs={12} sm={6} md={4} key={product._id}>
                      <motion.div
                        variants={itemVariants}
                        layout
                        whileHover={{ y: -4 }}
                      >
                        <StyledCard>
                          {/* Image */}
                          <Box sx={{ position: 'relative' }}>
                            {product.mainImage?.url ? (
                              <ProductImage src={product.mainImage.url} />
                            ) : (
                              <Box sx={{ 
                                height: 200, 
                                bgcolor: palette.gray100,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}>
                                <ImageIcon sx={{ fontSize: 48, color: palette.gray400 }} />
                              </Box>
                            )}
                            
                            {/* Favorite Button */}
                            <IconButton
                              onClick={() => setFavorites(prev => 
                                prev.includes(product._id) 
                                  ? prev.filter(id => id !== product._id)
                                  : [...prev, product._id]
                              )}
                              sx={{
                                position: 'absolute',
                                top: 12,
                                right: 12,
                                bgcolor: palette.white,
                                '&:hover': { bgcolor: palette.gray100 }
                              }}
                              size="small"
                            >
                              {isFavorite ? (
                                <StarIcon sx={{ color: palette.gold, fontSize: 20 }} />
                              ) : (
                                <StarBorderIcon sx={{ color: palette.gray600, fontSize: 20 }} />
                              )}
                            </IconButton>

                            {/* Status Badge */}
                            <Box sx={{
                              position: 'absolute',
                              top: 12,
                              left: 12,
                            }}>
                              <StatusChip
                                label={stockStatus.label}
                                status={stockStatus.status}
                                size="small"
                              />
                            </Box>
                          </Box>

                          <CardContent sx={{ p: 3 }}>
                            {/* Header */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                              <Box>
                                <Typography variant="h6" sx={{ fontWeight: 600, color: palette.gray900, mb: 0.5 }}>
                                  {product.name}
                                </Typography>
                                <Chip
                                  label={product.category}
                                  size="small"
                                  sx={{
                                    bgcolor: alpha(palette.gold, 0.1),
                                    color: palette.gold,
                                    fontSize: '0.75rem',
                                    height: 24
                                  }}
                                />
                              </Box>
                            </Box>

                            {/* Stock Progress */}
                            <Box sx={{ mb: 3 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                <Typography variant="caption" sx={{ color: palette.gray500 }}>
                                  Stock
                                </Typography>
                                <Typography variant="caption" sx={{ 
                                  fontWeight: 600,
                                  color: stockStatus.status === 'critical' ? palette.error : 
                                         stockStatus.status === 'low' ? palette.warning : 
                                         palette.success
                                }}>
                                  {product.stock} unités
                                </Typography>
                              </Box>
                              <LinearProgress
                                variant="determinate"
                                value={Math.min((product.stock / 20) * 100, 100)}
                                sx={{
                                  height: 6,
                                  borderRadius: 3,
                                  bgcolor: palette.gray200,
                                  '& .MuiLinearProgress-bar': {
                                    bgcolor: stockStatus.status === 'critical' ? palette.error :
                                            stockStatus.status === 'low' ? palette.warning :
                                            palette.success,
                                    borderRadius: 3
                                  }
                                }}
                              />
                            </Box>

                            {/* Value */}
                            <Box sx={{
                              p: 2,
                              bgcolor: palette.gray50,
                              borderRadius: '8px',
                              mb: 2
                            }}>
                              <Typography variant="caption" sx={{ color: palette.gray500, display: 'block', mb: 0.5 }}>
                                Valeur totale
                              </Typography>
                              <Typography variant="h6" sx={{ fontWeight: 700, color: palette.gold }}>
                                {value.toLocaleString()} TND
                              </Typography>
                            </Box>

                            {/* Actions */}
                            <Box sx={{ display: 'flex', gap: 1 }}>
                              <Button
                                fullWidth
                                variant="outlined"
                                size="small"
                                startIcon={<ViewIcon />}
                                onClick={() => {
                                  setSelectedProduct(product);
                                  setDetailOpen(true);
                                }}
                                sx={{
                                  borderColor: palette.gray300,
                                  color: palette.gray700,
                                  '&:hover': {
                                    borderColor: palette.gold,
                                    bgcolor: alpha(palette.gold, 0.05)
                                  }
                                }}
                              >
                                Détails
                              </Button>
                              <Button
                                fullWidth
                                variant="contained"
                                size="small"
                                startIcon={<EditIcon />}
                                href={`/Admin-Panel/Manage-Religion`}
                                sx={{
                                  bgcolor: palette.black,
                                  color: palette.white,
                                  '&:hover': {
                                    bgcolor: palette.gray800
                                  }
                                }}
                              >
                                Modifier
                              </Button>
                            </Box>
                          </CardContent>
                        </StyledCard>
                      </motion.div>
                    </Grid>
                  );
                })}
              </AnimatePresence>
            </Grid>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && filteredProducts.length === 0 && (
          <Box sx={{ 
            textAlign: 'center', 
            py: 12,
            bgcolor: palette.gray50,
            borderRadius: '16px',
            border: `1px dashed ${palette.gray300}`
          }}>
            <InventoryIcon sx={{ fontSize: 64, color: palette.gray400, mb: 2 }} />
            <Typography variant="h6" sx={{ color: palette.gray700, mb: 1 }}>
              Aucun produit trouvé
            </Typography>
            <Typography variant="body2" sx={{ color: palette.gray500, mb: 3 }}>
              Essayez de modifier vos filtres de recherche
            </Typography>
            <StyledButton
              variant="gold"
              startIcon={<AddIcon />}
              href="/Admin-Panel/Add-Religion"
            >
              Ajouter un produit
            </StyledButton>
          </Box>
        )}

        {/* Detail Dialog */}
        <Dialog
          open={detailOpen}
          onClose={() => setDetailOpen(false)}
          maxWidth="md"
          fullWidth
          TransitionComponent={Fade}
          PaperProps={{
            sx: {
              borderRadius: '20px',
              overflow: 'hidden'
            }
          }}
        >
          {selectedProduct && (
            <>
              <DialogTitle sx={{ 
                p: 3, 
                borderBottom: `1px solid ${palette.gray200}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <Box display="flex" alignItems="center" gap={1.5}>
                  <ViewIcon sx={{ color: palette.gold }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    {selectedProduct.name}
                  </Typography>
                </Box>
                <IconButton onClick={() => setDetailOpen(false)} size="small">
                  <CloseIcon />
                </IconButton>
              </DialogTitle>

              <DialogContent sx={{ p: 4 }}>
                <Grid container spacing={4}>
                  <Grid item xs={12} md={5}>
                    {selectedProduct.mainImage?.url ? (
                      <Box
                        component="img"
                        src={selectedProduct.mainImage.url}
                        alt={selectedProduct.name}
                        sx={{
                          width: '100%',
                          height: 250,
                          objectFit: 'cover',
                          borderRadius: '12px',
                          border: `1px solid ${palette.gray200}`
                        }}
                      />
                    ) : (
                      <Box sx={{
                        height: 250,
                        bgcolor: palette.gray100,
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <ImageIcon sx={{ fontSize: 64, color: palette.gray400 }} />
                      </Box>
                    )}
                  </Grid>

                  <Grid item xs={12} md={7}>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="body2" sx={{ color: palette.gray600, mb: 2 }}>
                        {selectedProduct.description}
                      </Typography>
                    </Box>

                    <Grid container spacing={3} sx={{ mb: 3 }}>
                      <Grid item xs={6}>
                        <Typography variant="caption" sx={{ color: palette.gray500 }}>
                          Prix unitaire
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600, color: palette.gold }}>
                          {selectedProduct.price} TND
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="caption" sx={{ color: palette.gray500 }}>
                          Stock actuel
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {selectedProduct.stock} unités
                        </Typography>
                      </Grid>
                    </Grid>

                    <Divider sx={{ my: 3 }} />

                    <Box sx={{ mb: 3 }}>
                      <Typography variant="caption" sx={{ color: palette.gray500, display: 'block', mb: 1 }}>
                        Tailles disponibles
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {selectedProduct.sizes?.map(size => (
                          <Chip
                            key={size}
                            label={size}
                            size="small"
                            sx={{ bgcolor: palette.gray100 }}
                          />
                        ))}
                      </Box>
                    </Box>

                    <Box>
                      <Typography variant="caption" sx={{ color: palette.gray500, display: 'block', mb: 1 }}>
                        Couleurs disponibles
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {selectedProduct.colors?.map((color, index) => (
                          <Tooltip key={index} title={color.name} arrow>
                            <Box
                              sx={{
                                width: 32,
                                height: 32,
                                borderRadius: '8px',
                                backgroundColor: color.value,
                                border: `2px solid ${palette.white}`,
                                boxShadow: `0 2px 4px ${alpha(palette.black, 0.1)}`
                              }}
                            />
                          </Tooltip>
                        ))}
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </DialogContent>

              <DialogActions sx={{ p: 3, pt: 0 }}>
                <StyledButton
                  variant="secondary"
                  onClick={() => setDetailOpen(false)}
                >
                  Fermer
                </StyledButton>
                <StyledButton
                  variant="gold"
                  startIcon={<EditIcon />}
                  href={`/Admin-Panel/Edit-Religion`}
                >
                  Modifier
                </StyledButton>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Container>
    </Box>
  );
};

export default ReligionStat;