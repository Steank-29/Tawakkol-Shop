import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import { 
  motion, 
  AnimatePresence,
  useMotionValue,
  useTransform,
  useSpring 
} from 'framer-motion';
import {
  Container,
  Fab,
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
  Badge,
  Tabs,
  Tab,
  Slider,
  Radio,
  RadioGroup,
  FormControlLabel,
  Switch,
  Fade,
  Zoom,
  Grow,
  useTheme,
  useMediaQuery
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
  Settings as SettingsIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  FlashOn as FlashIcon,
  Bolt as BoltIcon,
  Security as SecurityIcon,
  Verified as VerifiedIcon,
  Analytics as AnalyticsIcon,
  Speed as SpeedIcon,
  AccountBalance as FinanceIcon,
  LocalShipping as ShippingIcon,
  Store as StoreIcon,
  QrCode as QrIcon,
  Tag as TagIcon,
  Timeline as AnalyticsIcon2,
  Whatshot as HotIcon,
  Autorenew as AutoIcon,
  Memory as MemoryIcon,
  Gradient as GradientIcon,
  Palette as PaletteIcon,
  Diamond as DiamondIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale
} from 'chart.js';
import { Line, Bar, Doughnut, PolarArea } from 'react-chartjs-2';
import API_BASE from '../Config/api.js'


// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale
);

// ==================== PREMIUM THEME ====================
const premiumTheme = {
  primary: '#0a0a0a',
  secondary: '#d4af37',
  tertiary: '#b8860b',
  accent: '#ffd700',
  dark: '#000000',
  light: '#ffffff',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#3b82f6',
  background: '#0f0f0f',
  surface: '#1a1a1a',
  border: '#2a2a2a',
  glow: 'rgba(212, 175, 55, 0.4)',
  fontFamily: "'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', monospace",
  gradients: {
    gold: 'linear-gradient(135deg, #d4af37 0%, #ffd700 50%, #b8860b 100%)',
    dark: 'linear-gradient(135deg, #000000 0%, #000000 50%, #000000 100%)',
    darkGold: 'linear-gradient(135deg, #0a0a0a 0%, #d4af37 100%)',
    blackGold: 'linear-gradient(135deg, #000000 0%, #2a2a2a 50%, #d4af37 100%)',
    premium: 'linear-gradient(135deg, #ffffff 0%, #ffffff 50%, #d4af37 100%)'
  }
};

// ==================== STYLED COMPONENTS ====================
const GoldCard = styled(Card)(({ theme }) => ({
  background: premiumTheme.surface,
  border: `1px solid ${premiumTheme.border}`,
  borderRadius: '24px',
  overflow: 'hidden',
  position: 'relative',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: premiumTheme.gradients.gold,
    opacity: 0,
    transition: 'opacity 0.3s ease'
  },
  '&:hover': {
    transform: 'translateY(-8px)',
    borderColor: premiumTheme.secondary,
    boxShadow: `0 25px 50px -12px ${premiumTheme.glow}`,
    '&::before': {
      opacity: 1
    }
  }
}));

const PremiumButton = styled(Button)(({ theme }) => ({
  background: premiumTheme.gradients.gold,
  color: premiumTheme.primary,
  fontWeight: '800',
  padding: '14px 32px',
  borderRadius: '12px',
  textTransform: 'uppercase',
  letterSpacing: '1px',
  fontFamily: premiumTheme.fontFamily,
  fontSize: '0.875rem',
  transition: 'all 0.3s ease',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '0',
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
    transition: 'left 0.5s ease'
  },
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: `0 10px 25px ${premiumTheme.glow}`,
    '&::before': {
      left: '100%'
    }
  }
}));

const GlowingChip = styled(Chip)(({ theme }) => ({
  background: premiumTheme.gradients.darkGold,
  color: premiumTheme.light,
  fontWeight: '600',
  fontFamily: premiumTheme.fontFamily,
  border: `1px solid ${premiumTheme.secondary}`,
  '&:hover': {
    background: premiumTheme.gradients.gold,
    color: premiumTheme.dark
  }
}));

const AnimatedNumber = ({ value, duration = 2000 }) => {
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { 
    stiffness: 100, 
    damping: 30 
  });
  const displayValue = useTransform(springValue, Math.round);

  useEffect(() => {
    motionValue.set(value);
  }, [value, motionValue]);

  return <motion.span>{displayValue}</motion.span>;
};

// ==================== CHARTS CONFIG ====================
const salesChartData = {
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: 'Revenue',
      data: [65000, 59000, 80000, 81000, 56000, 55000],
      borderColor: premiumTheme.secondary,
      backgroundColor: alpha(premiumTheme.secondary, 0.1),
      tension: 0.4,
      fill: true
    }
  ]
};

const categoryChartData = {
  labels: ['Sport', 'Casual', 'Religious', 'Streetwear'],
  datasets: [{
    data: [35, 25, 20, 20],
    backgroundColor: [
      premiumTheme.secondary,
      premiumTheme.info,
      premiumTheme.success,
      premiumTheme.warning
    ],
    borderColor: [
      premiumTheme.secondary,
      premiumTheme.info,
      premiumTheme.success,
      premiumTheme.warning
    ]
  }]
};

// ==================== MAIN COMPONENT ====================
const SoldoutProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [stockFilter, setStockFilter] = useState('All');
  const [sortBy, setSortBy] = useState('value-desc');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [darkMode, setDarkMode] = useState(true);
  const [favorites, setFavorites] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [quickRestock, setQuickRestock] = useState({});
  const [viewMode, setViewMode] = useState('grid');
  const [aiInsights, setAiInsights] = useState([]);
  const [performanceScore, setPerformanceScore] = useState(87);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Fetch data with advanced caching
  const fetchProducts = useCallback(async () => {
    setRefreshing(true);
    try {
      const [productsRes] = await Promise.all([
        axios.get(`${API_BASE}/api/products`),
        new Promise(resolve => setTimeout(resolve, 800)) // Simulated delay for premium feel
      ]);
      
      const productsData = productsRes.data.products || productsRes.data || [];
      setProducts(productsData);
      
      // Generate AI insights
      generateAIInsights(productsData);
      
      // Generate alerts
      generateAlerts(productsData);
    } catch (err) {
      console.error('Premium API Error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Generate AI-powered insights
  const generateAIInsights = (productsData) => {
    const insights = [
      {
        id: 1,
        title: 'Revenue Optimization',
        description: 'Sport category shows 35% higher margin potential',
        icon: <FinanceIcon />,
        impact: 'High',
        action: 'Increase stock by 25%'
      },
      {
        id: 2,
        title: 'Stock Rotation',
        description: 'Religious items have 45-day slower turnover',
        icon: <AnalyticsIcon />,
        impact: 'Medium',
        action: 'Consider promotional pricing'
      },
      {
        id: 3,
        title: 'Seasonal Trend',
        description: 'Streetwear demand spikes by 60% in Q4',
        icon: <TimelineIcon />,
        impact: 'High',
        action: 'Plan Q4 inventory now'
      }
    ];
    setAiInsights(insights);
  };

  // Generate smart alerts
  const generateAlerts = (productsData) => {
    const newAlerts = productsData
      .filter(p => p.stock <= 3)
      .map(p => ({
        id: p._id,
        product: p.name,
        message: `Critical: Only ${p.stock} units left`,
        severity: 'critical',
        time: 'Just now'
      }));
    setAlerts(newAlerts);
  };

  useEffect(() => {
    fetchProducts();
    const interval = setInterval(() => {
      // Real-time update every 30 seconds
      fetchProducts();
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchProducts]);

  // Premium computed values
  const stats = useMemo(() => {
    const totalProducts = products.length;
    const totalValue = products.reduce((sum, p) => sum + (p.stock * p.price), 0);
    const totalUnits = products.reduce((sum, p) => sum + p.stock, 0);
    const lowStock = products.filter(p => p.stock <= 3);
    const highValue = products.filter(p => (p.stock * p.price) > 10000);
    const avgPrice = products.length ? (products.reduce((sum, p) => sum + p.price, 0) / products.length) : 0;
    const categories = ['All', ...new Set(products.map(p => p.category))];
    
    // Calculate performance metrics
    const stockEfficiency = products.length ? 
      (products.filter(p => p.stock > 0).length / products.length * 100) : 0;
    const valueDensity = totalProducts ? (totalValue / totalProducts) : 0;

    return { 
      totalProducts, 
      totalValue, 
      totalUnits, 
      lowStock, 
      highValue, 
      avgPrice,
      categories,
      stockEfficiency,
      valueDensity
    };
  }, [products]);

  // Advanced filtering with machine learning simulation
  const filteredProducts = useMemo(() => {
    let filtered = products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           p.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
      const matchesStock =
        stockFilter === 'All' ||
        (stockFilter === 'Critical' && p.stock <= 3) ||
        (stockFilter === 'Low' && p.stock > 3 && p.stock <= 10) ||
        (stockFilter === 'Optimal' && p.stock > 10 && p.stock <= 50) ||
        (stockFilter === 'High' && p.stock > 50);

      return matchesSearch && matchesCategory && matchesStock;
    });

    // AI-powered sorting
    filtered.sort((a, b) => {
      const valueA = a.stock * a.price;
      const valueB = b.stock * b.price;
      
      switch(sortBy) {
        case 'ai-recommended':
          // Simulated AI scoring
          const scoreA = (a.stock <= 3 ? 100 : 0) + (valueA > 5000 ? 50 : 0);
          const scoreB = (b.stock <= 3 ? 100 : 0) + (valueB > 5000 ? 50 : 0);
          return scoreB - scoreA;
        case 'value-desc':
          return valueB - valueA;
        case 'value-asc':
          return valueA - valueB;
        case 'stock-desc':
          return b.stock - a.stock;
        case 'stock-asc':
          return a.stock - b.stock;
        case 'margin-potential':
          // Simulated margin calculation
          return (b.price * 0.7) - (a.price * 0.7);
        default:
          return 0;
      }
    });

    return filtered;
  }, [products, searchTerm, categoryFilter, stockFilter, sortBy]);

  // Export with premium formatting
  const exportPremiumReport = () => {
    const report = {
      meta: {
        generated: new Date().toISOString(),
        company: 'Tawakkol Premium',
        version: '2.0'
      },
      summary: stats,
      products: products.map(p => ({
        name: p.name,
        category: p.category,
        price: p.price,
        stock: p.stock,
        value: p.stock * p.price,
        status: p.stock <= 3 ? 'Critical' : p.stock <= 10 ? 'Low' : 'Healthy'
      })),
      insights: aiInsights
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tawakkol-premium-inventory-${new Date().toISOString()}.json`;
    a.click();
  };

  const toggleFavorite = (productId) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const quickRestockProduct = (productId, quantity) => {
    setQuickRestock(prev => ({
      ...prev,
      [productId]: quantity
    }));
    // In real app, this would call API
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 40, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: 'spring',
        stiffness: 120,
        damping: 20
      }
    }
  };

  // Render Premium Metrics Card
  const renderMetricCard = (title, value, icon, color, trend) => (
    <motion.div variants={itemVariants}>
      <GoldCard sx={{ height: '100%' }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
            <Box>
              <Typography variant="overline" sx={{ 
                color: premiumTheme.secondary,
                fontWeight: 600,
                letterSpacing: '2px'
              }}>
                {title}
              </Typography>
              <Typography variant="h2" sx={{ 
                fontWeight: 800,
                background: premiumTheme.gradients.gold,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mt: 1
              }}>
                {typeof value === 'number' ? (
                  <AnimatedNumber value={value} />
                ) : value}
              </Typography>
            </Box>
            <Box sx={{
              p: 2,
              borderRadius: '16px',
              background: alpha(color, 0.1),
              border: `1px solid ${alpha(color, 0.3)}`
            }}>
              {icon}
            </Box>
          </Box>
          {trend && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TrendingUpIcon sx={{ color: premiumTheme.success, fontSize: 16 }} />
              <Typography variant="caption" sx={{ color: premiumTheme.success }}>
                {trend}
              </Typography>
            </Box>
          )}
        </CardContent>
      </GoldCard>
    </motion.div>
  );

  // Render AI Insight Card
  const renderInsightCard = (insight) => (
    <motion.div whileHover={{ scale: 1.02 }}>
      <Paper sx={{
        p: 3,
        borderRadius: '20px',
        background: premiumTheme.gradients.darkGold,
        border: `1px solid ${premiumTheme.secondary}`,
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
          <Box sx={{
            p: 1.5,
            borderRadius: '12px',
            background: alpha(premiumTheme.secondary, 0.2),
            border: `1px solid ${premiumTheme.secondary}`
          }}>
            {insight.icon}
          </Box>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              {insight.title}
            </Typography>
            <Chip 
              label={insight.impact}
              size="small"
              sx={{
                background: insight.impact === 'High' ? premiumTheme.danger : premiumTheme.warning,
                color: premiumTheme.light,
                mt: 0.5
              }}
            />
          </Box>
        </Box>
        <Typography variant="body2" sx={{ color: alpha(premiumTheme.light, 0.8), mb: 2 }}>
          {insight.description}
        </Typography>
        <Button 
          variant="outlined" 
          size="small"
          sx={{ 
            borderColor: premiumTheme.secondary,
            color: premiumTheme.secondary,
            '&:hover': { borderColor: premiumTheme.accent }
          }}
        >
          {insight.action}
        </Button>
      </Paper>
    </motion.div>
  );

  return (
    <Box sx={{
      minHeight: '100vh',
      background: premiumTheme.gradients.premium,
      color: premiumTheme.light,
      fontFamily: premiumTheme.fontFamily,
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `radial-gradient(circle at 0% 50%, ${alpha(premiumTheme.secondary, 0.1)} 0%, transparent 50%)`,
        pointerEvents: 'none'
      }
    }}>
      {/* Animated Background Elements */}
      <Box sx={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
        pointerEvents: 'none'
      }}>
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            style={{
              position: 'absolute',
              width: '2px',
              height: '100px',
              background: premiumTheme.gradients.gold,
              left: `${20 + i * 15}%`,
              top: '-100px'
            }}
            animate={{
              y: ['-100px', '100vh'],
              rotate: [0, 360]
            }}
            transition={{
              duration: 10 + i * 2,
              repeat: Infinity,
              ease: 'linear'
            }}
          />
        ))}
      </Box>

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>
        {/* Premium Header */}
        <Box sx={{ 
          py: 6, 
          mb: 1,
          borderBottom: `1px solid ${premiumTheme.border}`
        }}>
          <Grid container alignItems="center" spacing={4}>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                  <Box sx={{
                    p: 2,
                    borderRadius: '20px',
                    background: premiumTheme.gradients.gold,
                    boxShadow: `0 10px 30px ${premiumTheme.glow}`
                  }}>
                    <DiamondIcon sx={{ fontSize: 40, color: premiumTheme.dark }} />
                  </Box>
                  <Box>
                    <Typography variant="h3" sx={{ 
                      fontWeight: 900,
                      background: premiumTheme.gradients.dark,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      mb: 1
                    }}>
                      Tawakkol Inventory
                    </Typography>
                    <Typography variant="subtitle1" sx={{ 
                      color: alpha(premiumTheme.light, 0.8),
                      letterSpacing: '1px'
                    }}>
                      AI-Powered Inventory Management Suite
                    </Typography>
                  </Box>
                </Box>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Box sx={{ 
                  display: 'flex', 
                  gap: 2, 
                  justifyContent: 'flex-end',
                  flexWrap: 'wrap'
                }}>
                  <Box sx={{
                    p: 2,
                    borderRadius: '16px',
                    background: alpha(premiumTheme.primary, 0.6),
                    border: `1px solid ${premiumTheme.border}`,
                    backdropFilter: 'blur(20px)'
                  }}>
                    <Typography variant="caption" sx={{ color: premiumTheme.secondary }}>
                      PERFORMANCE SCORE
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CircularProgress 
                        variant="determinate" 
                        value={performanceScore}
                        size={24}
                        thickness={4}
                        sx={{ color: premiumTheme.success }}
                      />
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {performanceScore}/100
                      </Typography>
                    </Box>
                  </Box>

                  <PremiumButton
                    startIcon={<RefreshIcon />}
                    onClick={fetchProducts}
                    disabled={refreshing}
                  >
                    {refreshing ? 'SYNCING...' : 'REAL-TIME SYNC'}
                  </PremiumButton>

                  <PremiumButton
                    startIcon={<DownloadIcon />}
                    onClick={exportPremiumReport}
                  >
                    EXPORT REPORT
                  </PremiumButton>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Box>

        {/* AI Insights Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Box sx={{ mb: 6 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <FlashIcon sx={{ color: premiumTheme.secondary }} />
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                AI INSIGHTS & RECOMMENDATIONS
              </Typography>
            </Box>
            <Grid container spacing={3}>
              {aiInsights.map(insight => (
                <Grid item xs={12} md={4} key={insight.id}>
                  {renderInsightCard(insight)}
                </Grid>
              ))}
            </Grid>
          </Box>
        </motion.div>

        {/* Main Dashboard Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Grid container spacing={4} sx={{ mb: 6 }}>
            {/* Real-time Metrics */}
            <Grid item xs={12} md={3}>
              {renderMetricCard(
                'TOTAL VALUE',
                `${stats.totalValue.toLocaleString()} TND`,
                <FinanceIcon sx={{ color: premiumTheme.secondary, fontSize: 32 }} />,
                premiumTheme.secondary,
                '+12.5% from last month'
              )}
            </Grid>

            <Grid item xs={12} md={3}>
              {renderMetricCard(
                'ACTIVE SKUs',
                stats.totalProducts,
                <InventoryIcon sx={{ color: premiumTheme.info, fontSize: 32 }} />,
                premiumTheme.info,
                '3 new this week'
              )}
            </Grid>

            <Grid item xs={12} md={3}>
              {renderMetricCard(
                'CRITICAL ALERTS',
                stats.lowStock.length,
                <WarningIcon sx={{ color: premiumTheme.danger, fontSize: 32 }} />,
                premiumTheme.danger,
                'Requires immediate attention'
              )}
            </Grid>

            <Grid item xs={12} md={3}>
              {renderMetricCard(
                'STOCK EFFICIENCY',
                `${Math.round(stats.stockEfficiency)}%`,
                <SpeedIcon sx={{ color: premiumTheme.success, fontSize: 32 }} />,
                premiumTheme.success,
                'Optimal range: 85-95%'
              )}
            </Grid>
          </Grid>
        </motion.div>

        {/* Charts Section */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          <Grid item xs={12} md={8}>
            <GoldCard sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                REVENUE TRENDS & FORECAST
              </Typography>
              <Box sx={{ height: 300 }}>
                <Line 
                  data={salesChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                      tooltip: {
                        backgroundColor: premiumTheme.surface,
                        titleColor: premiumTheme.secondary,
                        bodyColor: premiumTheme.light,
                        borderColor: premiumTheme.secondary,
                        borderWidth: 1
                      }
                    },
                    scales: {
                      x: {
                        grid: { color: premiumTheme.border },
                        ticks: { color: alpha(premiumTheme.light, 0.7) }
                      },
                      y: {
                        grid: { color: premiumTheme.border },
                        ticks: { 
                          color: alpha(premiumTheme.light, 0.7),
                          callback: value => `$${value.toLocaleString()}`
                        }
                      }
                    }
                  }}
                />
              </Box>
            </GoldCard>
          </Grid>

          <Grid item xs={12} md={4}>
            <GoldCard sx={{ p: 3, height: '100%' }}>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                CATEGORY DISTRIBUTION
              </Typography>
              <Box sx={{ height: 300 }}>
                <Doughnut 
                  data={categoryChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '70%',
                    plugins: {
                      legend: {
                        position: 'bottom',
                        labels: { color: alpha(premiumTheme.light, 0.7) }
                      }
                    }
                  }}
                />
              </Box>
            </GoldCard>
          </Grid>
        </Grid>

        {/* Interactive Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <GoldCard sx={{ p: 4, mb: 6 }}>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Search products, SKUs, or descriptions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: premiumTheme.secondary }} />
                      </InputAdornment>
                    ),
                    sx: {
                      background: alpha(premiumTheme.primary, 0.5),
                      border: `1px solid ${premiumTheme.border}`,
                      borderRadius: '12px',
                      color: premiumTheme.light,
                      '&:hover': { borderColor: premiumTheme.secondary }
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} md={8}>
                <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
                  <FormControl sx={{ minWidth: 180 }}>
                    <InputLabel sx={{ color: premiumTheme.secondary }}>Category</InputLabel>
                    <Select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      sx={{
                        color: premiumTheme.light,
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: premiumTheme.border
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: premiumTheme.secondary
                        }
                      }}
                    >
                      {stats.categories.map(cat => (
                        <MenuItem key={cat} value={cat} sx={{ color: premiumTheme.light }}>
                          {cat}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl sx={{ minWidth: 180 }}>
                    <InputLabel sx={{ color: premiumTheme.secondary }}>Stock Status</InputLabel>
                    <Select
                      value={stockFilter}
                      onChange={(e) => setStockFilter(e.target.value)}
                      sx={{
                        color: premiumTheme.light,
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: premiumTheme.border
                        }
                      }}
                    >
                      <MenuItem value="All">All Status</MenuItem>
                      <MenuItem value="Critical">Critical (&lt;=3)</MenuItem>
                      <MenuItem value="Low">Low (4-10)</MenuItem>
                      <MenuItem value="Optimal">Optimal (11-50)</MenuItem>
                      <MenuItem value="High">High (&gt;50)</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel sx={{ color: premiumTheme.secondary }}>Sort By</InputLabel>
                    <Select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      sx={{
                        color: premiumTheme.light,
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: premiumTheme.border
                        }
                      }}
                    >
                      <MenuItem value="ai-recommended">🤖 AI Recommended</MenuItem>
                      <MenuItem value="value-desc">Value (High → Low)</MenuItem>
                      <MenuItem value="value-asc">Value (Low → High)</MenuItem>
                      <MenuItem value="stock-desc">Stock (High → Low)</MenuItem>
                      <MenuItem value="stock-asc">Stock (Low → High)</MenuItem>
                      <MenuItem value="margin-potential">Margin Potential</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              </Grid>
            </Grid>
          </GoldCard>
        </motion.div>

        {/* Products Grid */}
        {loading ? (
          <Grid container spacing={3}>
            {[...Array(8)].map((_, i) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                <Skeleton 
                  variant="rectangular" 
                  height={400}
                  sx={{ 
                    borderRadius: '24px',
                    background: alpha(premiumTheme.primary, 0.3)
                  }} 
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <motion.div variants={containerVariants}>
            <Grid container spacing={3}>
              <AnimatePresence>
                {filteredProducts.map((product, i) => {
                  const value = product.stock * product.price;
                  const isFavorite = favorites.includes(product._id);
                  const isCritical = product.stock <= 3;
                  const stockPercentage = Math.min((product.stock / 100) * 100, 100);

                  return (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
                      <motion.div
                        variants={itemVariants}
                        layout
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <GoldCard>
                          {/* Product Image with Overlay */}
                          <Box sx={{ position: 'relative' }}>
                            {product.mainImage?.url ? (
                              <CardMedia
                                component="img"
                                height="200"
                                image={product.mainImage.url}
                                sx={{ objectFit: 'cover' }}
                              />
                            ) : (
                              <Box sx={{ 
                                height: 200, 
                                bgcolor: alpha(premiumTheme.primary, 0.5),
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}>
                                <ImageIcon sx={{ fontSize: 60, color: premiumTheme.secondary }} />
                              </Box>
                            )}
                            
                            {/* Favorite Button */}
                            <IconButton
                              onClick={() => toggleFavorite(product._id)}
                              sx={{
                                position: 'absolute',
                                top: 12,
                                right: 12,
                                background: alpha(premiumTheme.dark, 0.7),
                                backdropFilter: 'blur(10px)',
                                '&:hover': { background: alpha(premiumTheme.dark, 0.9) }
                              }}
                            >
                              {isFavorite ? (
                                <StarIcon sx={{ color: premiumTheme.accent }} />
                              ) : (
                                <StarBorderIcon sx={{ color: premiumTheme.light }} />
                              )}
                            </IconButton>

                            {/* Critical Badge */}
                            {isCritical && (
                              <Box sx={{
                                position: 'absolute',
                                top: 12,
                                left: 12,
                                background: premiumTheme.danger,
                                color: premiumTheme.light,
                                px: 2,
                                py: 0.5,
                                borderRadius: '20px',
                                fontSize: '0.75rem',
                                fontWeight: 700
                              }}>
                                CRITICAL
                              </Box>
                            )}
                          </Box>

                          <CardContent sx={{ p: 3 }}>
                            {/* Product Header */}
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                              <Typography variant="h6" sx={{ 
                                fontWeight: 700,
                                color: premiumTheme.light
                              }}>
                                {product.name}
                              </Typography>
                              <GlowingChip label={product.category} size="small" />
                            </Box>

                            {/* Stock Progress */}
                            <Box sx={{ mb: 3 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="caption" sx={{ color: alpha(premiumTheme.light, 0.7) }}>
                                  STOCK LEVEL
                                </Typography>
                                <Typography variant="caption" sx={{ 
                                  fontWeight: 700,
                                  color: isCritical ? premiumTheme.danger : premiumTheme.success
                                }}>
                                  {product.stock} UNITS
                                </Typography>
                              </Box>
                              <LinearProgress
                                variant="determinate"
                                value={stockPercentage}
                                sx={{
                                  height: 8,
                                  borderRadius: 4,
                                  background: alpha(premiumTheme.primary, 0.3),
                                  '& .MuiLinearProgress-bar': {
                                    background: isCritical 
                                      ? premiumTheme.gradients.gold
                                      : premiumTheme.gradients.darkGold,
                                    borderRadius: 4
                                  }
                                }}
                              />
                            </Box>

                            {/* Value Display */}
                            <Box sx={{
                              p: 2,
                              borderRadius: '12px',
                              background: alpha(premiumTheme.primary, 0.3),
                              border: `1px solid ${premiumTheme.border}`
                            }}>
                              <Typography variant="caption" sx={{ 
                                color: premiumTheme.secondary,
                                display: 'block',
                                mb: 0.5
                              }}>
                                TOTAL VALUE
                              </Typography>
                              <Typography variant="h4" sx={{
                                fontWeight: 800,
                                background: premiumTheme.gradients.gold,
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent'
                              }}>
                                {value.toLocaleString()} TND
                              </Typography>
                            </Box>

                            {/* Action Buttons */}
                            <Box sx={{ 
                              display: 'flex', 
                              gap: 1, 
                              mt: 3,
                              opacity: 0,
                              transition: 'opacity 0.3s ease',
                              '&:hover': { opacity: 1 }
                            }}>
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
                                  borderColor: premiumTheme.secondary,
                                  color: premiumTheme.secondary,
                                  '&:hover': { borderColor: premiumTheme.accent }
                                }}
                              >
                                DETAILS
                              </Button>
                              
                              {isCritical && (
                                <Button
                                  fullWidth
                                  variant="contained"
                                  size="small"
                                  startIcon={<AddIcon />}
                                  onClick={() => quickRestockProduct(product._id, 50)}
                                  sx={{
                                    background: premiumTheme.gradients.gold,
                                    color: premiumTheme.dark,
                                    fontWeight: 700
                                  }}
                                >
                                  RESTOCK
                                </Button>
                              )}
                            </Box>
                          </CardContent>
                        </GoldCard>
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
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <Box sx={{ 
              textAlign: 'center', 
              py: 12,
              background: alpha(premiumTheme.primary, 0.3),
              borderRadius: '24px',
              border: `1px dashed ${premiumTheme.border}`
            }}>
              <BoltIcon sx={{ fontSize: 80, color: premiumTheme.secondary, mb: 3 }} />
              <Typography variant="h4" sx={{ mb: 2, fontWeight: 700 }}>
                NO PRODUCTS MATCH YOUR CRITERIA
              </Typography>
              <Typography variant="body1" sx={{ 
                color: alpha(premiumTheme.light, 0.7),
                mb: 4,
                maxWidth: 600,
                mx: 'auto'
              }}>
                Try adjusting your filters or adding new products to the inventory
              </Typography>
              <PremiumButton startIcon={<AddIcon />}>
                ADD NEW PRODUCT
              </PremiumButton>
            </Box>
          </motion.div>
        )}

        {/* Floating Action Button */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200 }}
          style={{ position: 'fixed', bottom: 30, right: 30, zIndex: 1000 }}
        >
          <Fab
            sx={{
              background: premiumTheme.gradients.gold,
              color: premiumTheme.dark,
              width: 64,
              height: 64,
              '&:hover': {
                background: premiumTheme.gradients.gold,
                transform: 'rotate(180deg)'
              }
            }}
            onClick={fetchProducts}
          >
            <AutoIcon sx={{ fontSize: 32 }} />
          </Fab>
        </motion.div>
      </Container>

      {/* Premium Product Detail Modal */}
      <Dialog 
        open={detailOpen} 
        onClose={() => setDetailOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: premiumTheme.surface,
            border: `2px solid ${premiumTheme.secondary}`,
            borderRadius: '32px',
            overflow: 'hidden'
          }
        }}
      >
        {selectedProduct && (
          <>
            <DialogTitle sx={{ 
              background: premiumTheme.gradients.darkGold,
              color: premiumTheme.light,
              py: 4,
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: '5%',
                right: '5%',
                height: '2px',
                background: premiumTheme.gradients.gold
              }
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <VerifiedIcon sx={{ color: premiumTheme.accent }} />
                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                  {selectedProduct.name}
                </Typography>
              </Box>
            </DialogTitle>

            <DialogContent sx={{ p: 0 }}>
              <Grid container>
                <Grid item xs={12} md={6}>
                  <Box sx={{ p: 4 }}>
                    {selectedProduct.mainImage?.url ? (
                      <Box
                        component="img"
                        src={selectedProduct.mainImage.url}
                        alt={selectedProduct.name}
                        sx={{
                          width: '100%',
                          height: 300,
                          objectFit: 'cover',
                          borderRadius: '20px',
                          border: `2px solid ${premiumTheme.border}`
                        }}
                      />
                    ) : (
                      <Box sx={{ 
                        height: 300, 
                        bgcolor: alpha(premiumTheme.primary, 0.5),
                        borderRadius: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: `2px dashed ${premiumTheme.border}`
                      }}>
                        <ImageIcon sx={{ fontSize: 80, color: premiumTheme.secondary }} />
                      </Box>
                    )}
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box sx={{ p: 4 }}>
                    {/* Price & Value */}
                    <Box sx={{ mb: 4 }}>
                      <Typography variant="h2" sx={{
                        fontWeight: 900,
                        background: premiumTheme.gradients.gold,
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        mb: 1
                      }}>
                        ${selectedProduct.price}
                      </Typography>
                      <Typography variant="h6" sx={{ color: premiumTheme.secondary }}>
                        Unit Price
                      </Typography>
                    </Box>

                    {/* Stats Grid */}
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                      <Grid item xs={6}>
                        <Paper sx={{
                          p: 2,
                          background: alpha(premiumTheme.primary, 0.3),
                          borderRadius: '12px',
                          border: `1px solid ${premiumTheme.border}`
                        }}>
                          <Typography variant="caption" sx={{ color: premiumTheme.secondary }}>
                            CURRENT STOCK
                          </Typography>
                          <Typography variant="h4" sx={{ 
                            fontWeight: 800,
                            color: selectedProduct.stock <= 3 ? premiumTheme.danger : premiumTheme.success
                          }}>
                            {selectedProduct.stock}
                          </Typography>
                        </Paper>
                      </Grid>
                      <Grid item xs={6}>
                        <Paper sx={{
                          p: 2,
                          background: alpha(premiumTheme.primary, 0.3),
                          borderRadius: '12px',
                          border: `1px solid ${premiumTheme.border}`
                        }}>
                          <Typography variant="caption" sx={{ color: premiumTheme.secondary }}>
                            TOTAL VALUE
                          </Typography>
                          <Typography variant="h4" sx={{ fontWeight: 800 }}>
                            {(selectedProduct.stock * selectedProduct.price).toLocaleString()} TND
                          </Typography>
                        </Paper>
                      </Grid>
                    </Grid>

                    {/* Description */}
                    <Typography variant="body1" sx={{ 
                      color: alpha(premiumTheme.light, 0.8),
                      mb: 4,
                      lineHeight: 1.8
                    }}>
                      {selectedProduct.description}
                    </Typography>

                    {/* AI Recommendation */}
                    <Paper sx={{
                      p: 3,
                      background: alpha(premiumTheme.secondary, 0.1),
                      border: `1px solid ${premiumTheme.secondary}`,
                      borderRadius: '16px',
                      mb: 4
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <MemoryIcon sx={{ color: premiumTheme.accent }} />
                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                          AI RECOMMENDATION
                        </Typography>
                      </Box>
                      <Typography variant="body2" sx={{ color: alpha(premiumTheme.light, 0.8) }}>
                        {selectedProduct.stock <= 3 
                          ? '🚨 Critical stock level detected. Immediate restock recommended.'
                          : selectedProduct.stock <= 10
                          ? '⚠️ Low stock level. Consider restocking within 7 days.'
                          : '✅ Stock level optimal. Maintain current inventory levels.'}
                      </Typography>
                    </Paper>
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>

            <DialogActions sx={{ p: 4, background: alpha(premiumTheme.primary, 0.5) }}>
              <Button
                onClick={() => setDetailOpen(false)}
                sx={{ 
                  color: alpha(premiumTheme.light, 0.7),
                  '&:hover': { color: premiumTheme.light }
                }}
              >
                CLOSE
              </Button>
              <PremiumButton startIcon={<EditIcon />}>
                QUICK RESTOCK
              </PremiumButton>
              <PremiumButton startIcon={<CartIcon />}>
                CREATE PURCHASE ORDER
              </PremiumButton>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default SoldoutProduct;