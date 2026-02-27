// src/pages/ProductsCatalog.jsx
import React, { useState, useEffect, useMemo } from 'react';
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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Divider,
  Stack,
  Badge,
  Alert,
  Snackbar,
  Skeleton, // Add this import
} from '@mui/material';
import {
  Close,
  Search,
  FilterList,
  LocalShipping,
  CheckCircle,
  Remove,
  Add,
  AddShoppingCart,
  ZoomIn,
  Star,
  Verified,
  TrendingUp,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import axios from 'axios';
import API_BASE from '../../Config/api.js';

// Sophisticated color palette
const palette = {
  noir: '#0a0a0a',
  charcoal: '#111827',
  slate: '#374151',
  gold: '#d4af37',
  goldLight: '#f5e8b5',
  cream: '#fef6e4',
  white: '#ffffff',
  lightGray: '#f3f4f6',
  success: '#059669',
  error: '#dc2626',
};

// Skeleton Card Component - Updated with exact styles and xs responsiveness
const ProductCardSkeleton = () => (
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
      transition: 'all 0.3s ease',
    }}
  >
    {/* Image Container - Exact same as real product */}
    <Box sx={{ 
      position: 'relative', 
      overflow: 'hidden',
      pt: '100%', // 1:1 aspect ratio
      bgcolor: palette.lightGray
    }}>
      {/* Main Image Skeleton */}
      <Skeleton 
        variant="rectangular" 
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          bgcolor: 'rgba(0,0,0,0.04)',
          transform: 'none', // Remove default skeleton animation transform
        }}
      />
      
      {/* Badge Skeletons - Exact same positioning as real badges */}
      <Box sx={{ 
        position: 'absolute', 
        top: 12, 
        left: 12, 
        display: 'flex', 
        gap: 1,
        flexWrap: 'wrap',
        zIndex: 1
      }}>
        <Skeleton 
          variant="rounded" 
          width={70} 
          height={24} 
          sx={{ 
            bgcolor: 'rgba(0,0,0,0.08)',
            borderRadius: '16px', // Match Chip border radius
          }} 
        />
        <Skeleton 
          variant="rounded" 
          width={60} 
          height={24} 
          sx={{ 
            bgcolor: 'rgba(0,0,0,0.08)',
            borderRadius: '16px',
          }} 
        />
      </Box>
    </Box>

    {/* Content - Exact same padding as real card */}
    <CardContent sx={{ p: { xs: 2, sm: 2.5 }, flexGrow: 1 }}>
      {/* Title Skeleton - Exact same typography styles */}
      <Skeleton 
        variant="text" 
        width="80%" 
        height={28} 
        sx={{ 
          mb: 1,
          bgcolor: 'rgba(0,0,0,0.08)',
          fontSize: '1rem',
          borderRadius: 1
        }} 
      />

      {/* Description Skeleton - Two lines with exact same spacing */}
      <Skeleton 
        variant="text" 
        width="100%" 
        height={20} 
        sx={{ 
          bgcolor: 'rgba(0,0,0,0.06)',
          fontSize: '0.85rem',
          borderRadius: 1
        }} 
      />
      <Skeleton 
        variant="text" 
        width="70%" 
        height={20} 
        sx={{ 
          mb: 2,
          bgcolor: 'rgba(0,0,0,0.06)',
          fontSize: '0.85rem',
          borderRadius: 1
        }} 
      />

      {/* Price & Rating Row - Exact same flex layout */}
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mt: 'auto'
      }}>
        <Box sx={{ width: '40%' }}>
          {/* Price Skeleton */}
          <Skeleton 
            variant="text" 
            width="100%" 
            height={32} 
            sx={{ 
              bgcolor: 'rgba(0,0,0,0.08)',
              fontSize: '1.25rem',
              fontWeight: 800,
              borderRadius: 1
            }} 
          />
          {/* Variants text skeleton - matches "Available in X sizes • Y colors" */}
          <Skeleton 
            variant="text" 
            width="80%" 
            height={16} 
            sx={{ 
              mt: 0.5,
              bgcolor: 'rgba(0,0,0,0.06)',
              fontSize: '0.75rem',
              borderRadius: 1
            }} 
          />
        </Box>
        
        {/* Rating Skeleton - Exact same as rating chip */}
        <Skeleton 
          variant="rounded" 
          width={60} 
          height={32} 
          sx={{ 
            bgcolor: 'rgba(0,0,0,0.08)',
            borderRadius: 2,
          }} 
        />
      </Box>
    </CardContent>

    {/* Quick Add Button Skeleton - Exact same as real button */}
    <Box sx={{ p: { xs: 2, sm: 2 }, pt: 0 }}>
      <Skeleton 
        variant="rounded" 
        width="90vw" 
        height={36} 
        sx={{ 
          bgcolor: 'rgba(0,0,0,0.08)',
          borderRadius: 2,
        }} 
      />
    </Box>
  </Card>
);

const ProductsCatalog = () => {
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
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

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
      showSnackbar('Failed to load products', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const categories = [
    { value: 'all', label: 'All Collections', color: palette.gold },
    { value: 'Sport', label: 'Performance', color: '#3b82f6' },
    { value: 'Streetwear', label: 'Urban', color: '#ef4444' },
    { value: 'Religious', label: 'Spiritual', color: '#059669' },
    { value: 'Casual', label: 'Casual', color: '#f59e0b' },
  ];

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
    
    if (selectedProduct.sizes?.length > 0 && !selectedSize) {
      showSnackbar('Please select a size', 'warning');
      return;
    }
    
    if (selectedProduct.colors?.length > 0 && !selectedColor) {
      showSnackbar('Please select a color', 'warning');
      return;
    }
    
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
      showSnackbar(`Added ${quantity} × ${selectedProduct.name} to cart`, 'success');
      setSelectedProduct(null);
    } catch (error) {
      showSnackbar(error.message, 'error');
    }
  };

  const handleQuickAdd = (product) => {
    const defaultSize = product.sizes?.[0] || null;
    const defaultColor = product.colors?.[0]?.name || null;
    
    const itemToAdd = {
      _id: product._id,
      name: product.name,
      price: product.price,
      mainImage: product.mainImage,
      quantity: 1,
      selectedSize: defaultSize,
      selectedColor: defaultColor,
      description: product.description,
      category: product.category,
      stock: product.stock,
    };
    
    try {
      addToCart(itemToAdd, 1, defaultSize, defaultColor);
      showSnackbar(`Added ${product.name} to cart`, 'success');
    } catch (error) {
      showSnackbar(error.message, 'error');
    }
  };

  const getProductImages = (product) => {
    const images = [product.mainImage, ...(product.additionalImages || [])]
      .filter(img => img?.url)
      .map(img => img.url);
    return images.length > 0 ? images : ['/placeholder-product.jpg'];
  };

  // Render skeleton cards while loading
  const renderContent = () => {
    if (loading) {
      return (
        <Grid 
          container 
          spacing={{ xs: 2, md: 3 }} 
          columns={{ xs: 4, sm: 8, md: 12 }}
          sx={{ mb: 6 }}
        >
          {[...Array(8)].map((_, index) => (
            <Grid 
              key={`skeleton-${index}`} 
              size={{ xs: 2, sm: 4, md: 4 }}
              sx={{ display: 'flex' }}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                style={{ width: '100%' }}
              >
                <ProductCardSkeleton />
              </motion.div>
            </Grid>
          ))}
        </Grid>
      );
    }

    if (filteredProducts.length === 0) {
      return (
        <Box sx={{ 
          width: '100%',
          textAlign: 'center', 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Search sx={{ fontSize: 64, color: palette.gold, mb: 3, opacity: 0.3 }} />
          <Typography variant="h6" sx={{ color: palette.slate, mb: 1, fontWeight: 600 }}>
            No matches found
          </Typography>
          <Typography variant="body2" sx={{ color: palette.slate, opacity: 0.7 }}>
            Try different filters or search terms
          </Typography>
        </Box>
      );
    }

    return (
      <Grid 
        container 
        spacing={{ xs: 2, md: 3 }} 
        columns={{ xs: 4, sm: 8, md: 12 }}
        sx={{ mb: 6 }}
      >
        {filteredProducts.map((product, index) => (
          <Grid 
            key={product._id || index} 
            size={{ xs: 2, sm: 4, md: 4 }}
            sx={{ display: 'flex' }}
          >
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
                  bgcolor: 'white',
                  borderRadius: 3,
                  overflow: 'hidden',
                  border: '1px solid',
                  borderColor: 'rgba(0,0,0,0.08)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                    borderColor: palette.gold,
                  },
                  cursor: 'pointer',
                }}
                onClick={() => handleProductClick(product)}
              >
                {/* Image Container */}
                <Box sx={{ 
                  position: 'relative', 
                  overflow: 'hidden',
                  pt: '100%',
                  bgcolor: palette.lightGray
                }}>
                  <CardMedia
                    component="img"
                    image={product.mainImage?.url || '/placeholder.jpg'}
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
                      '&:hover': {
                        transform: 'scale(1.05)',
                      },
                    }}
                  />
                  
                  {/* Quick View Overlay */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      bgcolor: 'rgba(0,0,0,0.7)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                      '&:hover': {
                        opacity: 1,
                      },
                    }}
                  >
                    <ZoomIn sx={{ color: palette.goldLight, fontSize: 48 }} />
                  </Box>

                  {/* Product Badges */}
                  <Box sx={{ 
                    position: 'absolute', 
                    top: 12, 
                    left: 12, 
                    display: 'flex', 
                    gap: 1,
                    flexWrap: 'wrap' 
                  }}>
                    {product.category && (
                      <Chip
                        label={product.category}
                        size="small"
                        sx={{
                          bgcolor: 'rgba(0,0,0,0.8)',
                          color: palette.goldLight,
                          fontWeight: 600,
                          fontSize: '0.7rem',
                          backdropFilter: 'blur(4px)',
                        }}
                      />
                    )}
                    {product.colors?.length > 0 && (
                      <Chip
                        label={`${product.colors.length} colors`}
                        size="small"
                        sx={{
                          bgcolor: 'rgba(0,0,0,0.6)',
                          color: 'white',
                          fontSize: '0.65rem',
                        }}
                      />
                    )}
                  </Box>
                </Box>

                {/* Content */}
                <CardContent sx={{ p: 2.5, flexGrow: 1 }}>
                  {/* Title */}
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 700,
                      color: palette.noir,
                      mb: 1,
                      fontSize: '1rem',
                      lineHeight: 1.4,
                      minHeight: 40,
                    }}
                  >
                    {product.name}
                  </Typography>

                  {/* Description */}
                  <Typography
                    variant="body2"
                    sx={{
                      color: palette.slate,
                      opacity: 0.8,
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

                  {/* Price & Rating Row */}
                  <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    mt: 'auto'
                  }}>
                    <Box>
                      <Typography
                        variant="h6"
                        sx={{
                          color: palette.noir,
                          fontWeight: 800,
                          fontSize: '1.25rem',
                        }}
                      >
                        {product.price.toFixed(2)} TND
                      </Typography>
                      {(product.sizes?.length > 0 || product.colors?.length > 0) && (
                        <Typography variant="caption" sx={{ 
                          color: palette.slate, 
                          opacity: 0.7,
                          display: 'block',
                          mt: 0.5
                        }}>
                          Available in {product.sizes?.length || 0} sizes • {product.colors?.length || 0} colors
                        </Typography>
                      )}
                    </Box>
                    
                    {/* Rating */}
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      bgcolor: palette.lightGray,
                      px: 1.5,
                      py: 0.5,
                      borderRadius: 2
                    }}>
                      <Star sx={{ fontSize: 16, color: palette.gold, mr: 0.5 }} />
                      <Typography variant="body2" sx={{ 
                        color: palette.slate, 
                        fontSize: '0.875rem',
                        fontWeight: 600
                      }}>
                        {product.rating?.toFixed(1) || '4.8'}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>

                {/* Quick Add to Cart Button */}
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
                      bgcolor: palette.noir,
                      color: 'white',
                      fontWeight: 600,
                      borderRadius: 2,
                      py: 1,
                      '&:hover': {
                        bgcolor: palette.gold,
                        transform: 'translateY(-1px)',
                      },
                      transition: 'all 0.2s ease',
                    }}
                  >
                    Quick Add
                  </Button>
                </Box>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    );
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: palette.cream, py: 4 }}>
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Products Grid */}
      <Container maxWidth="xl" sx={{ mt: 6 }}>
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            style={{ width: '100%' }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </Container>

      {/* Enhanced Product Detail Modal */}
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
            bgcolor: 'white',
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
                bgcolor: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(4px)',
                border: '1px solid',
                borderColor: palette.lightGray,
                '&:hover': { bgcolor: 'white' },
              }}
            >
              <Close />
            </IconButton>

            <DialogContent sx={{ p: 0 }}>
              <Grid container sx={{ height: '100%' }}>
                {/* Left Column - Images */}
                <Grid size={{ xs: 12, md: 5 }} sx={{ bgcolor: palette.lightGray }}>
                  <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
                    {/* Main Image */}
                    <Box sx={{ 
                      flex: 1, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      mb: 2
                    }}>
                      <CardMedia
                        component="img"
                        image={getProductImages(selectedProduct)[selectedImage]}
                        alt={selectedProduct.name}
                        sx={{
                          width: '100%',
                          maxHeight: 300,
                          objectFit: 'contain',
                        }}
                      />
                    </Box>

                    {/* Thumbnail Images */}
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
                              '&:hover': { opacity: 1 },
                            }}
                          >
                            <CardMedia
                              component="img"
                              image={img}
                              sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                          </Box>
                        ))}
                      </Stack>
                    )}
                  </Box>
                </Grid>

                {/* Right Column - Details */}
                <Grid size={{ xs: 12, md: 7 }}>
                  <Box sx={{ p: 4, height: '100%', overflowY: 'auto' }}>
                    {/* Product Info */}
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h4" sx={{ 
                        fontWeight: 800, 
                        color: palette.noir, 
                        mb: 1,
                        fontSize: { xs: '1.5rem', md: '2rem' }
                      }}>
                        {selectedProduct.name}
                      </Typography>
                      
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Star sx={{ color: palette.gold, mr: 0.5 }} />
                          <Typography variant="body1" sx={{ fontWeight: 600, color: palette.slate }}>
                            {selectedProduct.rating?.toFixed(1) || '4.8'}
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ color: palette.slate, opacity: 0.7 }}>
                          • 124 reviews
                        </Typography>
                        <Chip
                          label={selectedProduct.stock > 0 ? "In Stock" : "Out of Stock"}
                          size="small"
                          sx={{
                            bgcolor: selectedProduct.stock > 0 ? palette.success + '15' : palette.error + '15',
                            color: selectedProduct.stock > 0 ? palette.success : palette.error,
                            fontWeight: 600,
                          }}
                        />
                      </Box>

                      {/* Price */}
                      <Typography variant="h3" sx={{ 
                        color: palette.gold, 
                        fontWeight: 900,
                        mb: 3,
                        fontSize: { xs: '2rem', md: '2.5rem' }
                      }}>
                        {selectedProduct.price.toFixed(2)} TND
                      </Typography>
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    {/* Description */}
                    <Box sx={{ mb: 4 }}>
                      <Typography variant="subtitle1" sx={{ 
                        fontWeight: 700, 
                        mb: 2, 
                        color: palette.noir,
                        fontSize: '1.1rem'
                      }}>
                        Description
                      </Typography>
                      <Typography variant="body1" sx={{ 
                        color: palette.slate, 
                        lineHeight: 1.7,
                        fontSize: '0.95rem'
                      }}>
                        {selectedProduct.description}
                      </Typography>
                    </Box>

                    {/* Sizes */}
                    {selectedProduct.sizes?.length > 0 && (
                      <Box sx={{ mb: 4 }}>
                        <Typography variant="subtitle1" sx={{ 
                          fontWeight: 700, 
                          mb: 2, 
                          color: palette.noir 
                        }}>
                          Select Size {!selectedSize && (
                            <Typography component="span" variant="caption" sx={{ color: palette.error, ml: 1 }}>
                              (Required)
                            </Typography>
                          )}
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                          {selectedProduct.sizes.map((size) => (
                            <Button
                              key={size}
                              variant={selectedSize === size ? "contained" : "outlined"}
                              onClick={() => setSelectedSize(size)}
                              size="small"
                              sx={{
                                minWidth: 50,
                                borderColor: selectedSize === size ? palette.gold : palette.lightGray,
                                bgcolor: selectedSize === size ? palette.gold : 'transparent',
                                color: selectedSize === size ? 'white' : palette.slate,
                                fontWeight: 600,
                                '&:hover': {
                                  borderColor: palette.gold,
                                  bgcolor: selectedSize === size ? palette.gold : palette.gold + '15',
                                },
                              }}
                            >
                              {size}
                            </Button>
                          ))}
                        </Stack>
                      </Box>
                    )}

                    {/* Colors */}
                    {selectedProduct.colors?.length > 0 && (
                      <Box sx={{ mb: 4 }}>
                        <Typography variant="subtitle1" sx={{ 
                          fontWeight: 700, 
                          mb: 2, 
                          color: palette.noir 
                        }}>
                          Select Color {!selectedColor && (
                            <Typography component="span" variant="caption" sx={{ color: palette.error, ml: 1 }}>
                              (Required)
                            </Typography>
                          )}
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
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                '&:hover::after': {
                                  content: '""',
                                  position: 'absolute',
                                  top: -4,
                                  left: -4,
                                  right: -4,
                                  bottom: -4,
                                  border: `1px solid ${palette.gold}`,
                                  borderRadius: '50%',
                                },
                              }}
                            >
                              {selectedColor?.name === color.name && (
                                <CheckCircle sx={{ 
                                  color: 'white', 
                                  fontSize: 20,
                                  filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.3))'
                                }} />
                              )}
                            </Box>
                          ))}
                          {selectedColor && (
                            <Typography variant="body2" sx={{ 
                              color: palette.slate, 
                              fontWeight: 600,
                              ml: 1
                            }}>
                              {selectedColor.name}
                            </Typography>
                          )}
                        </Stack>
                      </Box>
                    )}

                    {/* Quantity */}
                    <Box sx={{ mb: 4 }}>
                      <Typography variant="subtitle1" sx={{ 
                        fontWeight: 700, 
                        mb: 2, 
                        color: palette.noir 
                      }}>
                        Quantity
                      </Typography>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        maxWidth: 150,
                        border: '1px solid',
                        borderColor: palette.lightGray,
                        borderRadius: 2,
                        overflow: 'hidden'
                      }}>
                        <IconButton
                          size="small"
                          onClick={() => setQuantity(Math.max(1, quantity - 1))}
                          sx={{ color: palette.slate, borderRadius: 0 }}
                        >
                          <Remove />
                        </IconButton>
                        <Typography sx={{ 
                          flex: 1, 
                          textAlign: 'center', 
                          fontWeight: 700,
                          color: palette.noir
                        }}>
                          {quantity}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => setQuantity(quantity + 1)}
                          sx={{ color: palette.slate, borderRadius: 0 }}
                        >
                          <Add />
                        </IconButton>
                      </Box>
                    </Box>

                    {/* Selected Options Summary */}
                    {(selectedSize || selectedColor) && (
                      <Box sx={{ 
                        mb: 4, 
                        p: 2, 
                        bgcolor: palette.lightGray, 
                        borderRadius: 2,
                        border: `1px solid ${palette.goldLight}`
                      }}>
                        <Typography variant="subtitle2" sx={{ 
                          fontWeight: 700, 
                          mb: 1, 
                          color: palette.noir,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}>
                          Selected Options:
                        </Typography>
                        <Stack direction="row" spacing={2}>
                          {selectedSize && (
                            <Chip
                              label={`Size: ${selectedSize}`}
                              size="small"
                              sx={{
                                bgcolor: palette.gold + '20',
                                color: palette.goldDark,
                                fontWeight: 600,
                              }}
                            />
                          )}
                          {selectedColor && (
                            <Chip
                              label={`Color: ${selectedColor.name}`}
                              size="small"
                              sx={{
                                bgcolor: palette.gold + '20',
                                color: palette.goldDark,
                                fontWeight: 600,
                              }}
                              avatar={
                                <Box sx={{ 
                                  width: 12, 
                                  height: 12, 
                                  borderRadius: '50%',
                                  bgcolor: selectedColor.value,
                                  ml: -0.5
                                }} />
                              }
                            />
                          )}
                        </Stack>
                      </Box>
                    )}

                    {/* Action Buttons */}
                    <Stack spacing={2} sx={{ mb: 4 }}>
                      <Button
                        variant="contained"
                        size="large"
                        startIcon={<AddShoppingCart />}
                        onClick={handleAddToCart}
                        disabled={selectedProduct.stock === 0}
                        sx={{
                          bgcolor: palette.noir,
                          color: 'white',
                          fontWeight: 700,
                          py: 1.5,
                          borderRadius: 2,
                          fontSize: '1rem',
                          '&:hover': {
                            bgcolor: palette.gold,
                            transform: 'translateY(-2px)',
                          },
                          transition: 'all 0.2s ease',
                        }}
                      >
                        Add to Cart • {(selectedProduct.price * quantity).toFixed(2)} TND
                      </Button>

                      <Button
                        variant="outlined"
                        size="large"
                        onClick={() => setSelectedProduct(null)}
                        sx={{
                          borderColor: palette.lightGray,
                          color: palette.slate,
                          fontWeight: 600,
                          py: 1.5,
                          borderRadius: 2,
                          '&:hover': {
                            borderColor: palette.gold,
                            bgcolor: palette.gold + '08',
                          },
                        }}
                      >
                        Continue Shopping
                      </Button>
                    </Stack>

                    {/* Features */}
                    <Box sx={{ 
                      p: 3, 
                      bgcolor: palette.lightGray, 
                      borderRadius: 2 
                    }}>
                      <Stack spacing={2}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <LocalShipping sx={{ color: palette.gold }} />
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 700, color: palette.noir }}>
                              Free Delivery
                            </Typography>
                            <Typography variant="caption" sx={{ color: palette.slate }}>
                              Delivered in 3-5 days
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <Verified sx={{ color: palette.success }} />
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 700, color: palette.noir }}>
                              100% Authentic
                            </Typography>
                            <Typography variant="caption" sx={{ color: palette.slate }}>
                              Premium quality materials
                            </Typography>
                          </Box>
                        </Box>
                        
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <CheckCircle sx={{ color: palette.success }} />
                          <Box>
                            <Typography variant="body2" sx={{ fontWeight: 700, color: palette.noir }}>
                              Easy Returns
                            </Typography>
                            <Typography variant="caption" sx={{ color: palette.slate }}>
                              30-day return policy
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
    </Box>
  );
};

export default ProductsCatalog;