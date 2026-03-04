// src/pages/Religion.jsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Container,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  IconButton,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Stack,
  Alert,
  Snackbar,
  Skeleton,
  alpha,
  useTheme,
  useMediaQuery,
  Avatar,
  AvatarGroup,
  Rating,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from '@mui/material';
import {
  Close,
  Search,
  AddShoppingCart,
  ZoomIn,
  Star,
  Verified,
  LocalShipping,
  CheckCircle,
  Remove,
  Add,
  Diamond,
  WorkspacePremium,
  AutoStories,
  Spa,
  SelfImprovement,
  Psychology,
  Diversity3,
  Public,
  Timeline,
  FlashOn,
  ArrowForward,
  VolunteerActivism,
  NightsStay,
  WbSunny,
  Mood,
  Lightbulb,
  MenuBook,
  MusicNote,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import axios from 'axios';
import API_BASE from '../../Config/api.js';

// Sacred color palette inspired by both themes
const palette = {
  noir: '#0a0a0a',
  charcoal: '#111827',
  slate: '#374151',
  gold: '#d4af37',
  goldLight: '#f5e8b5',
  goldSoft: '#f4e4a6',
  cream: '#fef6e4',
  white: '#ffffff',
  lightGray: '#f3f4f6',
  success: '#059669',
  error: '#dc2626',
  purple: '#8b5cf6',
  purpleLight: '#ede9fe',
  sage: '#94a3b8',
  indigo: '#4f46e5',
  amber: '#f59e0b',
};

const gradientSacred = 'linear-gradient(135deg, #8b5cf6 0%, #d4af37 50%, #4f46e5 100%)';
const gradientGold = 'linear-gradient(135deg, #d4af37 0%, #f9d423 50%, #d4af37 100%)';
const gradientDark = 'linear-gradient(180deg, #111827 0%, #0a0a0a 100%)';

// Sacred categories
const categories = [
  { value: 'all', label: 'All Traditions', icon: Public, color: palette.gold },
  { value: 'Islam', label: 'Islamic', icon: Spa, color: '#059669' },
  { value: 'Christianity', label: 'Christian', icon: Spa, color: '#8b5cf6' },
  { value: 'Judaism', label: 'Jewish', icon: Spa, color: '#d4af37' },
  { value: 'Hinduism', label: 'Hindu', icon: SelfImprovement, color: '#f59e0b' },
  { value: 'Buddhism', label: 'Buddhist', icon: Spa, color: '#4f46e5' },
  { value: 'Meditation', label: 'Meditation', icon: Psychology, color: '#94a3b8' },
];

// Sacred features
const sacredFeatures = [
  { icon: Diamond, text: 'Sacred Materials', sub: 'Ethically sourced' },
  { icon: Verified, text: 'Blessed Collection', sub: 'Traditional blessings' },
  { icon: AutoStories, text: 'Sacred Knowledge', sub: 'Includes guidance' },
  { icon: Diversity3, text: 'Global Traditions', sub: 'Respectful representation' },
  { icon: VolunteerActivism, text: 'Charity Support', sub: '10% to sacred causes' },
  { icon: LocalShipping, text: 'Sacred Delivery', sub: 'Carefully packaged' },
];

// Sacred testimonials
const sacredTestimonials = [
  {
    name: 'Ibrahim Al-Rashid',
    title: 'Islamic Scholar',
    avatar: null,
    rating: 5,
    verified: true,
    text: 'The attention to detail and respect for tradition in these pieces is remarkable. Truly authentic.',
    achievements: ['Al-Azhar University', '15 years study']
  },
  {
    name: 'Sister Catherine',
    title: 'Monastic Community',
    avatar: null,
    rating: 5,
    verified: true,
    text: 'These sacred items have deepened our daily meditation practice. Beautifully crafted.',
    achievements: ['Benedictine Order', 'Spiritual Director']
  },
  {
    name: 'Rabbi David Cohen',
    title: 'Community Leader',
    avatar: null,
    rating: 5,
    verified: true,
    text: 'The quality and authenticity of these ritual items is exceptional. Highly recommended.',
    achievements: ['Synagogue Council', '30 years service']
  }
];

// Size guide for religious items
const sacredSizeGuide = [
  { size: 'Small', measurement: '6-8 inches', fit: 'Prayer Beads', purpose: 'Personal' },
  { size: 'Medium', measurement: '9-12 inches', fit: 'Wall Art', purpose: 'Home Altar' },
  { size: 'Large', measurement: '13-18 inches', fit: 'Ceremonial', purpose: 'Spa/Church' },
  { size: 'Extra Large', measurement: '19-24 inches', fit: 'Statement Piece', purpose: 'Sanctuary' }
];

// Skeleton Card Component
const SacredCardSkeleton = () => (
  <Card
    elevation={0}
    sx={{
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: 'white',
      borderRadius: 3,
      overflow: 'hidden',
      border: '1px solid',
      borderColor: 'rgba(0,0,0,0.08)',
    }}
  >
    <Box sx={{ position: 'relative', overflow: 'hidden', pt: '100%', bgcolor: palette.lightGray }}>
      <Skeleton variant="rectangular" sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', bgcolor: 'rgba(0,0,0,0.04)' }} />
      <Box sx={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 1, zIndex: 1 }}>
        <Skeleton variant="rounded" width={70} height={24} sx={{ bgcolor: 'rgba(0,0,0,0.08)', borderRadius: '16px' }} />
        <Skeleton variant="rounded" width={60} height={24} sx={{ bgcolor: 'rgba(0,0,0,0.08)', borderRadius: '16px' }} />
      </Box>
    </Box>
    <CardContent sx={{ p: { xs: 2, sm: 2.5 }, flexGrow: 1 }}>
      <Skeleton variant="text" width="80%" height={28} sx={{ mb: 1, bgcolor: 'rgba(0,0,0,0.08)' }} />
      <Skeleton variant="text" width="100%" height={20} sx={{ bgcolor: 'rgba(0,0,0,0.06)' }} />
      <Skeleton variant="text" width="70%" height={20} sx={{ mb: 2, bgcolor: 'rgba(0,0,0,0.06)' }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
        <Box sx={{ width: '40%' }}>
          <Skeleton variant="text" width="100%" height={32} sx={{ bgcolor: 'rgba(0,0,0,0.08)' }} />
          <Skeleton variant="text" width="80%" height={16} sx={{ mt: 0.5, bgcolor: 'rgba(0,0,0,0.06)' }} />
        </Box>
        <Skeleton variant="rounded" width={60} height={32} sx={{ bgcolor: 'rgba(0,0,0,0.08)', borderRadius: 2 }} />
      </Box>
    </CardContent>
    <Box sx={{ p: { xs: 2, sm: 2 }, pt: 0 }}>
      <Skeleton variant="rounded" width="90vw" height={36} sx={{ bgcolor: 'rgba(0,0,0,0.08)', borderRadius: 2 }} />
    </Box>
  </Card>
);

// Sacred Testimonial Carousel Component
const SacredTestimonialCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeIndex}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card
            sx={{
              background: alpha(palette.charcoal, 0.6),
              backdropFilter: 'blur(20px)',
              border: `1px solid ${alpha(palette.gold, 0.2)}`,
              borderRadius: 3,
              p: 3
            }}
          >
            <Stack spacing={2}>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                  src={sacredTestimonials[activeIndex].avatar}
                  sx={{
                    width: 60,
                    height: 60,
                    border: `2px solid ${palette.gold}`,
                    bgcolor: palette.purple,
                  }}
                >
                  {sacredTestimonials[activeIndex].name[0]}
                </Avatar>
                <Box>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="subtitle1" fontWeight={700} color={palette.white}>
                      {sacredTestimonials[activeIndex].name}
                    </Typography>
                    {sacredTestimonials[activeIndex].verified && (
                      <Verified sx={{ color: palette.gold, fontSize: 16 }} />
                    )}
                  </Stack>
                  <Typography variant="body2" color={palette.goldSoft}>
                    {sacredTestimonials[activeIndex].title}
                  </Typography>
                  <Rating
                    value={sacredTestimonials[activeIndex].rating}
                    readOnly
                    size="small"
                    sx={{ mt: 0.5 }}
                    icon={<Star sx={{ color: palette.gold }} />}
                    emptyIcon={<Star sx={{ color: alpha(palette.white, 0.3) }} />}
                  />
                </Box>
              </Stack>
              <Typography
                sx={{
                  fontStyle: 'italic',
                  color: alpha(palette.white, 0.9),
                  lineHeight: 1.6,
                  fontSize: '0.95rem'
                }}
              >
                "{sacredTestimonials[activeIndex].text}"
              </Typography>
              <Stack direction="row" spacing={0.5} flexWrap="wrap">
                {sacredTestimonials[activeIndex].achievements.map((ach, idx) => (
                  <Chip
                    key={idx}
                    label={ach}
                    size="small"
                    sx={{
                      background: alpha(palette.gold, 0.1),
                      color: palette.goldSoft,
                      border: `1px solid ${alpha(palette.gold, 0.3)}`,
                      fontSize: '0.7rem'
                    }}
                  />
                ))}
              </Stack>
            </Stack>
          </Card>
        </motion.div>
      </AnimatePresence>
      <Stack direction="row" justifyContent="center" spacing={1} sx={{ mt: 2 }}>
        {sacredTestimonials.map((_, idx) => (
          <Box
            key={idx}
            onClick={() => setActiveIndex(idx)}
            sx={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              bgcolor: idx === activeIndex ? palette.gold : alpha(palette.white, 0.3),
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
          />
        ))}
      </Stack>
    </Box>
  );
};

// Size Guide Modal
const SacredSizeGuideModal = ({ open, onClose }) => (
  <Dialog
    open={open}
    onClose={onClose}
    maxWidth="sm"
    PaperProps={{
      sx: {
        background: gradientDark,
        border: `2px solid ${palette.gold}`,
        borderRadius: 3
      }
    }}
  >
    <DialogContent sx={{ p: 3 }}>
      <Stack spacing={3}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight={700} sx={{ color: palette.gold }}>
            Sacred Size Guide
          </Typography>
          <IconButton onClick={onClose} size="small" sx={{ color: palette.gold }}>
            <Close />
          </IconButton>
        </Stack>
        <TableContainer>
          <Table size="small">
            <TableBody>
              {sacredSizeGuide.map((size, index) => (
                <TableRow key={index} sx={{ '&:hover': { background: alpha(palette.gold, 0.05) } }}>
                  <TableCell sx={{ color: palette.gold, fontWeight: 700 }}>{size.size}</TableCell>
                  <TableCell sx={{ color: palette.white }}>{size.measurement}</TableCell>
                  <TableCell sx={{ color: palette.white }}>{size.fit}</TableCell>
                  <TableCell>
                    <Chip
                      label={size.purpose}
                      size="small"
                      sx={{ background: alpha(palette.gold, 0.2), color: palette.gold }}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Card sx={{ background: alpha(palette.gold, 0.1), border: `1px solid ${alpha(palette.gold, 0.3)}`, borderRadius: 2, p: 2 }}>
          <Typography variant="subtitle2" color={palette.gold} fontWeight={700} gutterBottom>
            🕊️ Sacred Sizing Guidance
          </Typography>
          <Typography color={palette.white} opacity={0.9} fontSize="0.9rem">
            For ceremonial and meditation items, consider the intended sacred space and usage tradition.
          </Typography>
        </Card>
      </Stack>
    </DialogContent>
  </Dialog>
);

// Main Component
const Religion = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [searchQuery, setSearchQuery] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const titleRef = useRef(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/api/products`);
      setProducts(res.data.products || []);
    } catch (err) {
      console.error('Error loading products:', err);
      showSnackbar('Failed to load sacred items', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const filteredProducts = useMemo(() => {
    let filtered = [...products];
    
    if (category !== 'all') {
      filtered = filtered.filter(product => product.category === category);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query)
      );
    }
    
    switch(sortBy) {
      case 'price-low': return filtered.sort((a, b) => a.price - b.price);
      case 'price-high': return filtered.sort((a, b) => b.price - a.price);
      case 'newest': return filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'rating': return filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      default: return filtered;
    }
  }, [products, category, searchQuery, sortBy]);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setSelectedImage(0);
    setSelectedSize(product.sizes?.[0] || '');
    setSelectedColor(product.colors?.[0] || null);
    setQuantity(1);
  };

  const handleAddToCart = () => {
    if (!selectedProduct) return;
    
    const itemToAdd = {
      _id: selectedProduct._id,
      name: selectedProduct.name,
      price: selectedProduct.price,
      mainImage: selectedProduct.mainImage,
      quantity: quantity,
      selectedSize: selectedSize || null,
      selectedColor: selectedColor?.name || null,
      description: selectedProduct.description,
      category: selectedProduct.category,
      stock: selectedProduct.stock,
    };
    
    try {
      addToCart(itemToAdd, quantity, selectedSize, selectedColor?.name || null);
      showSnackbar(`Added ${quantity} × ${selectedProduct.name} to sacred collection`, 'success');
      setCartItems([...cartItems, itemToAdd]);
      setSelectedProduct(null);
    } catch (error) {
      showSnackbar(error.message, 'error');
    }
  };

  const handleQuickAdd = (product) => {
    const defaultSize = product.sizes?.[0] || null;
    const defaultColor = product.colors?.[0]?.name || null;
    
    try {
      addToCart({
        _id: product._id,
        name: product.name,
        price: product.price,
        mainImage: product.mainImage,
        quantity: 1,
        selectedSize: defaultSize,
        selectedColor: defaultColor,
      }, 1, defaultSize, defaultColor);
      showSnackbar(`Added ${product.name} to sacred collection`, 'success');
    } catch (error) {
      showSnackbar(error.message, 'error');
    }
  };

  const getProductImages = (product) => {
    const images = [product.mainImage, ...(product.additionalImages || [])]
      .filter(img => img?.url)
      .map(img => img.url);
    return images.length > 0 ? images : ['/placeholder-sacred.jpg'];
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: gradientDark,
        color: palette.white,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Sacred Background Effect */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at 30% 40%, ${alpha(palette.purple, 0.05)} 0%, transparent 50%),
                       radial-gradient(circle at 70% 60%, ${alpha(palette.gold, 0.05)} 0%, transparent 50%)`,
          zIndex: 0,
        }}
      />

      {/* Floating Sacred Cart Preview */}
      {cartItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}
        >
          <Card
            sx={{
              background: alpha(palette.charcoal, 0.95),
              backdropFilter: 'blur(20px)',
              border: `2px solid ${palette.gold}`,
              borderRadius: 2,
              p: 1.5,
            }}
          >
            <Stack spacing={1}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <VolunteerActivism sx={{ color: palette.gold, fontSize: 18 }} />
                <Typography color={palette.white} fontWeight={600} fontSize="0.9rem">
                  Sacred Collection ({cartItems.length})
                </Typography>
              </Stack>
              <AvatarGroup max={3}>
                {cartItems.slice(0, 3).map((item, idx) => (
                  <Avatar
                    key={idx}
                    src={item.mainImage?.url}
                    sx={{ width: 28, height: 28, border: `2px solid ${palette.gold}` }}
                  >
                    {item.name[0]}
                  </Avatar>
                ))}
              </AvatarGroup>
            </Stack>
          </Card>
        </motion.div>
      )}

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, py: 4 }}>
        {/* Hero Section */}
        <Grid container sx={{ minHeight: '80vh', alignItems: 'center', mb: 6 }}>
          <Grid item xs={12} md={7}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <Box sx={{ maxWidth: { md: '90%' } }}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Chip
                    icon={<Diamond sx={{ fontSize: '1.1rem' }} />}
                    label="SACRED COLLECTION - HONORING TRADITIONS"
                    sx={{
                      mb: 4,
                      background: gradientGold,
                      color: palette.black,
                      fontWeight: 900,
                      fontSize: { xs: '0.75rem', md: '0.85rem' },
                      py: 1,
                      px: 2,
                    }}
                  />
                </motion.div>

                <Typography
                  variant="h1"
                  component={motion.h1}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                  sx={{
                    fontWeight: 900,
                    fontSize: { xs: '2.2rem', sm: '2.8rem', md: '3.2rem', lg: '3.8rem' },
                    lineHeight: 1.1,
                    mb: 3,
                    background: `linear-gradient(90deg, ${palette.white} 40%, ${palette.gold} 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Sacred Artifacts
                  <Box
                    component="span"
                    sx={{
                      display: 'block',
                      background: gradientSacred,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    & Spiritual Treasures
                  </Box>
                </Typography>

                <Typography
                  component={motion.p}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.5 }}
                  sx={{
                    opacity: 0.9,
                    fontSize: { xs: '0.95rem', md: '1.05rem' },
                    lineHeight: 1.7,
                    mb: 4,
                    maxWidth: '90%',
                  }}
                >
                  Authentic religious items and spiritual artifacts from traditions worldwide. 
                  <Box component="span" sx={{ color: palette.gold, fontWeight: 700 }}>
                    {' '}Each piece carries sacred meaning and respectful craftsmanship.
                  </Box>
                </Typography>

                {/* Search Bar */}
                <Box sx={{ mb: 4 }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search sacred items by name or tradition..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    InputProps={{
                      startAdornment: <Search sx={{ color: palette.gold, mr: 1 }} />,
                      sx: {
                        bgcolor: alpha(palette.white, 0.05),
                        borderRadius: 2,
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: alpha(palette.gold, 0.3),
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: palette.gold,
                        },
                        color: palette.white,
                      }
                    }}
                  />
                </Box>

                {/* Filters */}
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 4 }}>
                  <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel sx={{ color: palette.gold }}>Tradition</InputLabel>
                    <Select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      label="Tradition"
                      sx={{
                        color: palette.white,
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: alpha(palette.gold, 0.3) },
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: palette.gold },
                      }}
                    >
                      {categories.map((cat) => (
                        <MenuItem key={cat.value} value={cat.value}>
                          <Stack direction="row" alignItems="center" spacing={1}>
                            <cat.icon sx={{ color: cat.color, fontSize: 16 }} />
                            <span>{cat.label}</span>
                          </Stack>
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel sx={{ color: palette.gold }}>Sort By</InputLabel>
                    <Select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      label="Sort By"
                      sx={{
                        color: palette.white,
                        '& .MuiOutlinedInput-notchedOutline': { borderColor: alpha(palette.gold, 0.3) },
                        '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: palette.gold },
                      }}
                    >
                      <MenuItem value="featured">Featured</MenuItem>
                      <MenuItem value="price-low">Price: Low to High</MenuItem>
                      <MenuItem value="price-high">Price: High to Low</MenuItem>
                      <MenuItem value="rating">Highest Rated</MenuItem>
                      <MenuItem value="newest">Newest</MenuItem>
                    </Select>
                  </FormControl>
                </Stack>
              </Box>
            </motion.div>
          </Grid>
        </Grid>

        {/* Sacred Features Grid */}
        <Box sx={{ mb: 8 }}>
          <Grid container spacing={2}>
            {sacredFeatures.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={feature.text}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      background: alpha(palette.charcoal, 0.6),
                      border: `1px solid ${alpha(palette.gold, 0.2)}`,
                      borderRadius: 2,
                      p: 2,
                      height: '100%',
                      '&:hover': {
                        borderColor: palette.gold,
                        transform: 'translateY(-2px)',
                      }
                    }}
                  >
                    <Stack spacing={1}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <feature.icon sx={{ color: palette.gold, fontSize: '1.2rem' }} />
                        <Typography sx={{ color: palette.white, fontWeight: 600, fontSize: '0.9rem' }}>
                          {feature.text}
                        </Typography>
                      </Box>
                      <Typography sx={{ color: palette.goldSoft, fontSize: '0.75rem', opacity: 0.8 }}>
                        {feature.sub}
                      </Typography>
                    </Stack>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Products Grid */}
        <Box ref={titleRef} sx={{ mb: 4 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 900,
              fontSize: { xs: '1.8rem', md: '2.2rem' },
              color: palette.gold,
              textAlign: 'center',
              mb: 2
            }}
          >
            Sacred Items Collection
          </Typography>
          <Typography sx={{ textAlign: 'center', color: alpha(palette.white, 0.7), mb: 4 }}>
            {filteredProducts.length} sacred items found
          </Typography>
        </Box>

        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {loading ? (
              <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                {[...Array(8)].map((_, index) => (
                  <Grid key={`skeleton-${index}`} size={{ xs: 2, sm: 4, md: 4 }} sx={{ display: 'flex' }}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      style={{ width: '100%' }}
                    >
                      <SacredCardSkeleton />
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            ) : filteredProducts.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Search sx={{ fontSize: 64, color: palette.gold, mb: 3, opacity: 0.3 }} />
                <Typography variant="h6" sx={{ color: palette.white, mb: 1, fontWeight: 600 }}>
                  No sacred items found
                </Typography>
                <Typography variant="body2" sx={{ color: alpha(palette.white, 0.7) }}>
                  Try different filters or search terms
                </Typography>
              </Box>
            ) : (
              <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                {filteredProducts.map((product, index) => (
                  <Grid key={product._id || index} size={{ xs: 2, sm: 4, md: 4 }} sx={{ display: 'flex' }}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      style={{ width: '100%' }}
                    >
                      <Card
                        elevation={0}
                        sx={{
                          width: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          bgcolor: alpha(palette.white, 0.02),
                          backdropFilter: 'blur(10px)',
                          borderRadius: 3,
                          overflow: 'hidden',
                          border: '1px solid',
                          borderColor: alpha(palette.gold, 0.2),
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-6px)',
                            boxShadow: `0 20px 40px ${alpha(palette.purple, 0.3)}`,
                            borderColor: palette.gold,
                          },
                          cursor: 'pointer',
                        }}
                        onClick={() => handleProductClick(product)}
                      >
                        <Box sx={{ position: 'relative', overflow: 'hidden', pt: '100%', bgcolor: alpha(palette.charcoal, 0.5) }}>
                          <CardMedia
                            component="img"
                            image={product.mainImage?.url || '/placeholder-sacred.jpg'}
                            alt={product.name}
                            sx={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              objectFit: 'contain',
                              p: 2,
                              transition: 'transform 0.6s ease',
                              '&:hover': { transform: 'scale(1.05)' },
                            }}
                          />
                          <Box
                            sx={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              bgcolor: alpha(palette.purple, 0.2),
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              opacity: 0,
                              transition: 'opacity 0.3s ease',
                              '&:hover': { opacity: 1 },
                            }}
                          >
                            <ZoomIn sx={{ color: palette.goldLight, fontSize: 48 }} />
                          </Box>
                          <Box sx={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                            {product.category && (
                              <Chip
                                label={product.category}
                                size="small"
                                sx={{
                                  bgcolor: alpha(palette.purple, 0.8),
                                  color: palette.white,
                                  fontWeight: 600,
                                  fontSize: '0.7rem',
                                  backdropFilter: 'blur(4px)',
                                }}
                              />
                            )}
                            {product.colors?.length > 0 && (
                              <Chip
                                label={`${product.colors.length} variants`}
                                size="small"
                                sx={{
                                  bgcolor: alpha(palette.charcoal, 0.6),
                                  color: palette.goldSoft,
                                  fontSize: '0.65rem',
                                }}
                              />
                            )}
                          </Box>
                        </Box>

                        <CardContent sx={{ p: 2.5, flexGrow: 1 }}>
                          <Typography
                            variant="subtitle1"
                            sx={{
                              fontWeight: 700,
                              color: palette.white,
                              mb: 1,
                              fontSize: '1rem',
                              lineHeight: 1.4,
                              minHeight: 40,
                            }}
                          >
                            {product.name}
                          </Typography>

                          <Typography
                            variant="body2"
                            sx={{
                              color: alpha(palette.white, 0.7),
                              mb: 2,
                              fontSize: '0.85rem',
                              lineHeight: 1.5,
                              minHeight: 40,
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                          >
                            {product.description}
                          </Typography>

                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
                            <Box>
                              <Typography
                                variant="h6"
                                sx={{
                                  color: palette.gold,
                                  fontWeight: 800,
                                  fontSize: '1.25rem',
                                }}
                              >
                                {product.price?.toFixed(2)} TND
                              </Typography>
                              {(product.sizes?.length > 0 || product.colors?.length > 0) && (
                                <Typography variant="caption" sx={{ color: alpha(palette.white, 0.6), display: 'block', mt: 0.5 }}>
                                  {product.sizes?.length || 0} sizes • {product.colors?.length || 0} colors
                                </Typography>
                              )}
                            </Box>
                            
                            <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: alpha(palette.purple, 0.2), px: 1.5, py: 0.5, borderRadius: 2 }}>
                              <Star sx={{ fontSize: 16, color: palette.gold, mr: 0.5 }} />
                              <Typography variant="body2" sx={{ color: palette.white, fontSize: '0.875rem', fontWeight: 600 }}>
                                {product.rating?.toFixed(1) || '4.9'}
                              </Typography>
                            </Box>
                          </Box>
                        </CardContent>

                        <Box sx={{ p: 2, pt: 0 }}>
                          <Button
                            variant="contained"
                            fullWidth
                            size="small"
                            startIcon={<AddShoppingCart />}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleQuickAdd(product);
                            }}
                            sx={{
                              bgcolor: palette.gold,
                              color: palette.black,
                              fontWeight: 600,
                              borderRadius: 2,
                              py: 1,
                              '&:hover': {
                                bgcolor: palette.purple,
                                color: palette.white,
                              },
                            }}
                          >
                            Add to Sacred Collection
                          </Button>
                        </Box>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Testimonials Section */}
        <Box sx={{ mt: 8, mb: 8 }}>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 900,
              fontSize: { xs: '1.8rem', md: '2.2rem' },
              color: palette.gold,
              textAlign: 'center',
              mb: 4
            }}
          >
            Voices of Faith
          </Typography>
          <SacredTestimonialCarousel />
        </Box>

        {/* Size Guide Link */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Button
            variant="outlined"
            onClick={() => setSizeGuideOpen(true)}
            startIcon={<AutoStories />}
            sx={{
              borderColor: palette.gold,
              color: palette.gold,
              '&:hover': { borderColor: palette.purple, color: palette.purple }
            }}
          >
            Sacred Size Guide
          </Button>
        </Box>

        {/* View All Button */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Button
            component={motion.button}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            variant="contained"
            endIcon={<ArrowForward />}
            href="/catalog"
            sx={{
              background: gradientGold,
              color: palette.black,
              px: 5,
              py: 1.5,
              borderRadius: 2,
              fontSize: '1rem',
              fontWeight: 600,
            }}
          >
            Explore All Sacred Items
          </Button>
        </Box>
      </Container>

      {/* Product Detail Modal */}
      <Dialog
        open={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            maxHeight: '85vh',
            overflow: 'hidden',
            background: gradientDark,
            border: `2px solid ${palette.gold}`,
          },
        }}
      >
        {selectedProduct && (
          <>
            <IconButton
              onClick={() => setSelectedProduct(null)}
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                zIndex: 10,
                bgcolor: alpha(palette.white, 0.1),
                backdropFilter: 'blur(4px)',
                border: `1px solid ${alpha(palette.gold, 0.3)}`,
                color: palette.gold,
                '&:hover': { bgcolor: alpha(palette.gold, 0.2) },
              }}
            >
              <Close />
            </IconButton>

            <DialogContent sx={{ p: 0 }}>
              <Grid container sx={{ height: '100%' }}>
                <Grid size={{ xs: 12, md: 5 }} sx={{ bgcolor: alpha(palette.charcoal, 0.8) }}>
                  <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
                      <CardMedia
                        component="img"
                        image={getProductImages(selectedProduct)[selectedImage]}
                        alt={selectedProduct.name}
                        sx={{ width: '100%', maxHeight: 300, objectFit: 'contain' }}
                      />
                    </Box>

                    {getProductImages(selectedProduct).length > 1 && (
                      <Stack direction="row" spacing={1} sx={{ overflowX: 'auto', py: 1 }}>
                        {getProductImages(selectedProduct).map((img, idx) => (
                          <Box
                            key={idx}
                            onClick={() => setSelectedImage(idx)}
                            sx={{
                              flexShrink: 0,
                              width: 64,
                              height: 64,
                              borderRadius: 1,
                              overflow: 'hidden',
                              cursor: 'pointer',
                              border: `2px solid ${selectedImage === idx ? palette.gold : 'transparent'}`,
                              opacity: selectedImage === idx ? 1 : 0.6,
                            }}
                          >
                            <CardMedia component="img" image={img} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </Box>
                        ))}
                      </Stack>
                    )}
                  </Box>
                </Grid>

                <Grid size={{ xs: 12, md: 7 }}>
                  <Box sx={{ p: 4, height: '100%', overflowY: 'auto' }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: palette.gold, mb: 1 }}>
                      {selectedProduct.name}
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Star sx={{ color: palette.gold, mr: 0.5 }} />
                        <Typography variant="body1" sx={{ fontWeight: 600, color: palette.white }}>
                          {selectedProduct.rating?.toFixed(1) || '4.9'}
                        </Typography>
                      </Box>
                      <Chip
                        label={selectedProduct.stock > 0 ? "In Stock" : "Out of Stock"}
                        size="small"
                        sx={{
                          bgcolor: selectedProduct.stock > 0 ? alpha(palette.success, 0.2) : alpha(palette.error, 0.2),
                          color: selectedProduct.stock > 0 ? palette.success : palette.error,
                        }}
                      />
                    </Box>

                    <Typography variant="h3" sx={{ color: palette.gold, fontWeight: 900, mb: 3 }}>
                      {selectedProduct.price?.toFixed(2)} TND
                    </Typography>

                    <Divider sx={{ my: 3, borderColor: alpha(palette.gold, 0.2) }} />

                    <Typography variant="body1" sx={{ color: palette.white, lineHeight: 1.7, mb: 4 }}>
                      {selectedProduct.description}
                    </Typography>

                    {selectedProduct.sizes?.length > 0 && (
                      <Box sx={{ mb: 4 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: palette.gold }}>
                          Sacred Size
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                          {selectedProduct.sizes.map((size) => (
                            <Button
                              key={size}
                              variant={selectedSize === size ? "contained" : "outlined"}
                              onClick={() => setSelectedSize(size)}
                              size="small"
                              sx={{
                                borderColor: selectedSize === size ? palette.gold : alpha(palette.gold, 0.3),
                                bgcolor: selectedSize === size ? palette.gold : 'transparent',
                                color: selectedSize === size ? palette.black : palette.gold,
                                '&:hover': { borderColor: palette.gold, bgcolor: selectedSize === size ? palette.gold : alpha(palette.gold, 0.1) },
                              }}
                            >
                              {size}
                            </Button>
                          ))}
                        </Stack>
                      </Box>
                    )}

                    {selectedProduct.colors?.length > 0 && (
                      <Box sx={{ mb: 4 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: palette.gold }}>
                          Sacred Color
                        </Typography>
                        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                          {selectedProduct.colors.map((color) => (
                            <Box
                              key={color.name}
                              onClick={() => setSelectedColor(color)}
                              sx={{
                                width: 40,
                                height: 40,
                                borderRadius: '50%',
                                bgcolor: color.value,
                                cursor: 'pointer',
                                border: `3px solid ${selectedColor?.name === color.name ? palette.gold : 'transparent'}`,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              {selectedColor?.name === color.name && (
                                <CheckCircle sx={{ color: 'white', fontSize: 20 }} />
                              )}
                            </Box>
                          ))}
                        </Stack>
                      </Box>
                    )}

                    <Box sx={{ mb: 4 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: palette.gold }}>
                        Quantity
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', maxWidth: 150, border: `1px solid ${alpha(palette.gold, 0.3)}`, borderRadius: 2 }}>
                        <IconButton size="small" onClick={() => setQuantity(Math.max(1, quantity - 1))} sx={{ color: palette.gold }}>
                          <Remove />
                        </IconButton>
                        <Typography sx={{ flex: 1, textAlign: 'center', fontWeight: 700, color: palette.white }}>
                          {quantity}
                        </Typography>
                        <IconButton size="small" onClick={() => setQuantity(quantity + 1)} sx={{ color: palette.gold }}>
                          <Add />
                        </IconButton>
                      </Box>
                    </Box>

                    <Button
                      variant="contained"
                      size="large"
                      fullWidth
                      startIcon={<VolunteerActivism />}
                      onClick={handleAddToCart}
                      disabled={selectedProduct.stock === 0}
                      sx={{
                        bgcolor: palette.gold,
                        color: palette.black,
                        fontWeight: 700,
                        py: 1.5,
                        borderRadius: 2,
                        mb: 2,
                        '&:hover': { bgcolor: palette.purple, color: palette.white },
                      }}
                    >
                      Add to Sacred Collection • {(selectedProduct.price * quantity).toFixed(2)} TND
                    </Button>

                    <Box sx={{ p: 3, bgcolor: alpha(palette.purple, 0.1), borderRadius: 2 }}>
                      <Stack spacing={2}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Verified sx={{ color: palette.gold }} />
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 700, color: palette.white }}>
                              Authentic & Blessed
                            </Typography>
                            <Typography variant="caption" sx={{ color: alpha(palette.white, 0.7) }}>
                              Traditional craftsmanship
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <VolunteerActivism sx={{ color: palette.gold }} />
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 700, color: palette.white }}>
                              10% to Sacred Causes
                            </Typography>
                            <Typography variant="caption" sx={{ color: alpha(palette.white, 0.7) }}>
                              Supporting communities
                            </Typography>
                          </Box>
                        </Box>
                      </Stack>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </DialogContent>
          </>
        )}
      </Dialog>

      {/* Size Guide Modal */}
      <SacredSizeGuideModal open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
    </Box>
  );
};

export default Religion;