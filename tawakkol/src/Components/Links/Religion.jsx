// src/pages/Religion.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
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
  Divider,
  Stack,
  Alert,
  Snackbar,
  Skeleton,
  Tooltip,
  Fade,
  Zoom,
  useTheme,
  useMediaQuery,
  Rating,
  alpha,
  styled,
  MobileStepper
} from '@mui/material';
import {
  Close,
  CheckCircle,
  Remove,
  Add,
  AddShoppingCart,
  ZoomIn,
  Star,
  Verified,
  Favorite,
  FavoriteBorder,
  Share,
  Mosque,
  ColorLens,
  Straighten,
  Inventory,
  ShoppingBag,
  LocalShipping,
  Security,
  AssignmentReturn,
  CurrencyExchange,
  PlayArrow,
  Pause,
  VolumeUp,
  VolumeOff,
  Fullscreen,
  FullscreenExit,
  KeyboardArrowLeft,
  KeyboardArrowRight,
  Image,
  VideoLibrary
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import religiousProducts from '../../data/relproduct.js'; // Import local religious products data

// ==================== ISLAMIC INSPIRED PALETTE ====================
const palette = {
  noir: '#0a0a0a',
  charcoal: '#1e1e1e',
  slate: '#2d2d2d',
  gray: '#6b7280',
  lightGray: '#f3f4f6',
  cream: '#faf7f2',
  white: '#ffffff',
  gold: '#c9a13b',
  goldLight: '#e5d3b0',
  goldDark: '#8b6b2b',
  success: '#059669',
  error: '#b91c1c',
  warning: '#b45309',
  info: '#1e40af',
  border: 'rgba(212, 175, 55, 0.15)',
  overlay: 'rgba(10, 10, 10, 0.7)',
};

// ==================== ISLAMIC INSPIRATIONAL TEXTS ====================
const ISLAMIC_TEXTS = [
  {
    arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
    french: "Au nom d'Allah, le Tout Miséricordieux, le Très Miséricordieux",
    reference: "Basmalah"
  },
  {
    arabic: "اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ",
    french: "Seigneur, prie sur Mohammed et sur la famille de Mohammed",
    reference: "Salawat"
  },
  {
    arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
    french: "Gloire et louange à Allah",
    reference: "Tasbih"
  },
  {
    arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
    french: "Louange à Allah, Seigneur des mondes",
    reference: "Al-Fatiha"
  },
  {
    arabic: "اللَّهُ أَكْبَرُ",
    french: "Allah est le Plus Grand",
    reference: "Takbir"
  },
  {
    arabic: "لَا إِلَٰهَ إِلَّا اللَّهُ",
    french: "Il n'y a de dieu qu'Allah",
    reference: "Tahlil"
  },
  {
    arabic: "رَبِّ زِدْنِي عِلْمًا",
    french: "Seigneur, accroît ma connaissance",
    reference: "Taha 114"
  },
 {
    arabic: "إِنَّ مَعَ الْعُسْرِ يُسْرًا",
    french: "Certes, avec la difficulté vient la facilité",
    reference: "Ash-Sharh 94:6",
    category: "comfort"
  },
  {
    arabic: "وَتَوَكَّلْ عَلَى الْحَيِّ الَّذِي لَا يَمُوتُ",
    french: "Et place ta confiance dans le Vivant qui ne meurt jamais",
    reference: "Al-Furqan 25:58",
    category: "tawakkul"
  },
  {
    arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً",
    french: "Notre Seigneur, accorde-nous belle part ici-bas et belle part dans l'au-delà",
    reference: "Al-Baqarah 2:201",
    category: "dua"
  }
];

// ==================== STYLED COMPONENTS ====================

// Background pattern component
const BackgroundPattern = styled(Box)({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: `linear-gradient(135deg, ${palette.noir} 0%, ${palette.goldDark} 100%)`,
  zIndex: -1,
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" opacity="0.15"><path d="M50 5 L95 50 L50 95 L5 50 Z" fill="white"/></svg>')`,
    backgroundSize: '60px 60px',
    opacity: 0.15,
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" opacity="0.1"><circle cx="25" cy="25" r="10" fill="none" stroke="%23c9a13b" stroke-width="0.5"/></svg>')`,
    backgroundSize: '40px 40px',
    opacity: 0.1,
  },
});

// Product Card
const ProductCard = styled(Card)({
  width: '100%',
  display: 'flex',
  flexDirection: 'row',
  backgroundColor: palette.white,
  borderRadius: 16,
  overflow: 'hidden',
  border: `1px solid ${palette.border}`,
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-6px)',
    boxShadow: `0 20px 40px ${alpha(palette.gold, 0.15)}`,
    borderColor: palette.gold,
  },
});

// Left side container for image
const ProductImageContainer = styled(Box)({
  width: '33%',
  height: '100%',
  position: 'relative',
  overflow: 'hidden',
  backgroundColor: palette.lightGray,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const ProductImage = styled('img')({
  width: 'calc(100% - 20px)',
  height: 'calc(100% - 20px)',
  marginLeft: '10px',
  marginRight: '10px',
  objectFit: 'contain',
  transition: 'transform 0.6s ease',
  '&:hover': {
    transform: 'scale(1.08)',
  },
});

const QuickViewOverlay = styled(Box)({
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: `linear-gradient(135deg, ${alpha(palette.noir, 0.8)} 0%, ${alpha(palette.gold, 0.2)} 100%)`,
  backdropFilter: 'blur(2px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  opacity: 0,
  transition: 'opacity 0.3s ease',
  zIndex: 3,
  '&:hover': {
    opacity: 1,
  },
});

const CategoryChip = styled(Chip)({
  backgroundColor: alpha(palette.gold, 0.15),
  color: palette.goldDark,
  fontWeight: 700,
  fontSize: '0.7rem',
  backdropFilter: 'blur(4px)',
  border: `1px solid ${alpha(palette.gold, 0.3)}`,
  '& .MuiChip-icon': {
    color: palette.gold,
  },
});

const ColorSwatch = styled(Box)(({ color, selected }) => ({
  width: 36,
  height: 36,
  borderRadius: '50%',
  backgroundColor: color,
  cursor: 'pointer',
  border: `3px solid ${selected ? palette.gold : 'transparent'}`,
  transition: 'all 0.3s ease',
  position: 'relative',
  boxShadow: selected ? `0 0 15px ${alpha(palette.gold, 0.5)}` : 'none',
  '&:hover': {
    transform: 'scale(1.15)',
    boxShadow: `0 4px 15px ${alpha(color, 0.4)}`,
  },
  '&::after': selected ? {
    content: '""',
    position: 'absolute',
    top: -3,
    left: -3,
    right: -3,
    bottom: -3,
    border: `1px solid ${palette.gold}`,
    borderRadius: '50%',
    animation: 'pulse 2s infinite',
  } : {},
}));

const SizeButton = styled(Button)(({ selected }) => ({
  minWidth: 50,
  height: 40,
  borderColor: selected ? palette.gold : alpha(palette.gold, 0.3),
  backgroundColor: selected ? palette.gold : 'transparent',
  color: selected ? palette.white : palette.goldDark,
  fontWeight: 700,
  fontSize: '0.9rem',
  transition: 'all 0.2s ease',
  '&:hover': {
    borderColor: palette.gold,
    backgroundColor: selected ? palette.gold : alpha(palette.gold, 0.1),
    transform: 'scale(1.05)',
    boxShadow: `0 5px 15px ${alpha(palette.gold, 0.3)}`,
  },
}));

const InspirationalHeader = styled(Paper)({
  background: `linear-gradient(135deg, ${alpha(palette.noir, 0.85)} 0%, ${alpha(palette.goldDark, 0.85)} 100%)`,
  backdropFilter: 'blur(5px)',
  padding: '20px 20px',
  marginBottom: 20,
  borderRadius: 0,
  position: 'relative',
  overflow: 'hidden',
  borderBottom: `2px solid ${alpha(palette.gold, 0.3)}`,
  borderTop: `2px solid ${alpha(palette.gold, 0.3)}`,
});

const ContentWrapper = styled(Box)({
  backgroundColor: alpha(palette.white, 0.95),
  backdropFilter: 'blur(10px)',
  borderRadius: 24,
  padding: 24,
  boxShadow: `0 20px 40px ${alpha(palette.noir, 0.2)}`,
  border: `1px solid ${alpha(palette.gold, 0.2)}`,
});

// ==================== NEW VIDEO PLAYER COMPONENT ====================
const VideoPlayer = ({ src, onClose }) => {
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (videoRef.current) {
      if (playing) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [playing]);

  const togglePlay = () => setPlaying(!playing);
  const toggleMute = () => setMuted(!muted);
  
  const toggleFullscreen = () => {
    if (!fullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setFullscreen(!fullscreen);
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  return (
    <Box
      ref={containerRef}
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        minHeight: 300,
        backgroundColor: palette.noir,
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      <video
        ref={videoRef}
        src={src}
        loop
        muted={muted}
        playsInline
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
        }}
      />
      
      {/* Video Controls */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: `linear-gradient(to top, ${alpha(palette.noir, 0.8)}, transparent)`,
          p: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          opacity: 0,
          transition: 'opacity 0.3s ease',
          '&:hover': {
            opacity: 1,
          },
        }}
      >
        <IconButton onClick={togglePlay} sx={{ color: palette.white }}>
          {playing ? <Pause /> : <PlayArrow />}
        </IconButton>
        
        <IconButton onClick={toggleMute} sx={{ color: palette.white }}>
          {muted ? <VolumeOff /> : <VolumeUp />}
        </IconButton>
        
        <IconButton onClick={toggleFullscreen} sx={{ color: palette.white }}>
          {fullscreen ? <FullscreenExit /> : <Fullscreen />}
        </IconButton>
        
        {onClose && (
          <IconButton onClick={onClose} sx={{ color: palette.white, ml: 'auto' }}>
            <Close />
          </IconButton>
        )}
      </Box>
      
      {/* Video Badge */}
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          background: alpha(palette.gold, 0.9),
          color: palette.white,
          px: 1.5,
          py: 0.5,
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          fontSize: '0.75rem',
          fontWeight: 700,
        }}
      >
        <VideoLibrary sx={{ fontSize: 16 }} />
        VIDÉO
      </Box>
    </Box>
  );
};

// ==================== MEDIA SLIDER COMPONENT ====================
const MediaSlider = ({ media, initialIndex = 0, onClose }) => {
  const [activeStep, setActiveStep] = useState(initialIndex);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const handleNext = () => {
    setActiveStep((prevStep) => (prevStep + 1) % media.length);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => (prevStep - 1 + media.length) % media.length);
  };

  const currentMedia = media[activeStep];

  return (
    <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Media Display */}
      <Box sx={{ height: 400, bgcolor: palette.noir, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {currentMedia.type === 'video' ? (
          <VideoPlayer src={currentMedia.url} />
        ) : (
          <motion.img
            key={activeStep}
            src={currentMedia.url}
            alt={`Media ${activeStep + 1}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            style={{
              maxWidth: '100%',
              maxHeight: '100%',
              objectFit: 'contain',
            }}
          />
        )}
      </Box>

      {/* Media Type Indicator */}
      <Box
        sx={{
          position: 'absolute',
          top: 16,
          left: 16,
          background: alpha(palette.gold, 0.9),
          color: palette.white,
          px: 1.5,
          py: 0.5,
          borderRadius: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          fontSize: '0.75rem',
          fontWeight: 700,
        }}
      >
        {currentMedia.type === 'video' ? (
          <VideoLibrary sx={{ fontSize: 16 }} />
        ) : (
          <Image sx={{ fontSize: 16 }} />
        )}
        {currentMedia.type === 'video' ? 'VIDÉO' : `IMAGE ${activeStep + 1}/${media.length}`}
      </Box>

      {/* Navigation Arrows */}
      {media.length > 1 && (
        <>
          <IconButton
            onClick={handleBack}
            sx={{
              position: 'absolute',
              left: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: alpha(palette.white, 0.8),
              '&:hover': { bgcolor: palette.white },
              zIndex: 2,
            }}
          >
            <KeyboardArrowLeft />
          </IconButton>
          <IconButton
            onClick={handleNext}
            sx={{
              position: 'absolute',
              right: 8,
              top: '50%',
              transform: 'translateY(-50%)',
              bgcolor: alpha(palette.white, 0.8),
              '&:hover': { bgcolor: palette.white },
              zIndex: 2,
            }}
          >
            <KeyboardArrowRight />
          </IconButton>
        </>
      )}

      {/* Thumbnails */}
      {media.length > 1 && (
        <Box sx={{ mt: 2, display: 'flex', gap: 1, overflowX: 'auto', pb: 1 }}>
          {media.map((item, index) => (
            <Box
              key={index}
              onClick={() => setActiveStep(index)}
              sx={{
                flexShrink: 0,
                width: 60,
                height: 60,
                borderRadius: 1,
                overflow: 'hidden',
                cursor: 'pointer',
                border: `3px solid ${activeStep === index ? palette.gold : 'transparent'}`,
                opacity: activeStep === index ? 1 : 0.6,
                transition: 'all 0.2s ease',
                position: 'relative',
              }}
            >
              {item.type === 'video' ? (
                <Box
                  sx={{
                    width: '100%',
                    height: '100%',
                    bgcolor: palette.noir,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <VideoLibrary sx={{ color: palette.gold, fontSize: 24 }} />
                </Box>
              ) : (
                <img
                  src={item.url}
                  alt={`Thumbnail ${index + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              )}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
};

// ==================== SKELETON LOADER ====================
const ProductCardSkeleton = () => (
  <ProductCard sx={{ height: '45vh', width: '600px' }}>
    <ProductImageContainer>
      <Skeleton 
        variant="rectangular" 
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          bgcolor: 'rgba(0,0,0,0.04)',
        }}
      />
      <Box sx={{ 
        position: 'absolute', 
        top: 12, 
        left: 12, 
        display: 'flex', 
        gap: 1,
        zIndex: 1
      }}>
        <Skeleton variant="rounded" width={80} height={24} sx={{ bgcolor: 'rgba(0,0,0,0.08)' }} />
        <Skeleton variant="rounded" width={60} height={24} sx={{ bgcolor: 'rgba(0,0,0,0.08)' }} />
      </Box>
    </ProductImageContainer>

    <CardContent sx={{ width: '67%', p: 2.5 }}>
      <Skeleton variant="text" width="80%" height={32} sx={{ mb: 1, bgcolor: 'rgba(0,0,0,0.08)' }} />
      <Skeleton variant="text" width="100%" height={24} sx={{ bgcolor: 'rgba(0,0,0,0.06)' }} />
      <Skeleton variant="text" width="70%" height={24} sx={{ mb: 2, bgcolor: 'rgba(0,0,0,0.06)' }} />
      <Skeleton variant="text" width="90%" height={24} sx={{ mb: 2, bgcolor: 'rgba(0,0,0,0.06)' }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4 }}>
        <Box sx={{ width: '40%' }}>
          <Skeleton variant="text" width="100%" height={40} sx={{ bgcolor: 'rgba(0,0,0,0.08)' }} />
        </Box>
        <Skeleton variant="circular" width={48} height={48} sx={{ bgcolor: 'rgba(0,0,0,0.08)' }} />
      </Box>
    </CardContent>
  </ProductCard>
);

// ==================== AUTO-SWIPING TEXT COMPONENT ====================
const SwipingIslamicText = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ISLAMIC_TEXTS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Box sx={{ width: '100%', overflow: 'hidden', mt:3, mb: 1 }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ textAlign: 'center', color: 'white' }}>
            <Typography
              variant="h2"
              sx={{
                fontFamily: "'Amiri', 'Traditional Arabic', serif",
                fontSize: { xs: '2.5rem', md: '2rem', lg:'3rem' },
                mb: 1,
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                letterSpacing: '0.02em',
                fontWeight:'bold'
              }}
            >
              {ISLAMIC_TEXTS[currentIndex].arabic}
            </Typography>
          </Box>
        </motion.div>
      </AnimatePresence>
    </Box>
  );
};

// ==================== MAIN COMPONENT ====================
const Religion = () => {
  const { addToCart } = useCart();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // State
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedMediaIndex, setSelectedMediaIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [favorites, setFavorites] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  // ==================== LOAD LOCAL PRODUCTS ====================
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        // Simulate network delay for smooth loading experience
        await new Promise(resolve => setTimeout(resolve, 800));
        setProducts(religiousProducts);
      } catch (err) {
        console.error('Erreur chargement produits:', err);
        showNotification('Erreur lors du chargement des produits', 'error');
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, []);

  // ==================== UTILITIES ====================
  const showNotification = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { label: 'Rupture', color: palette.error };
    if (stock <= 2) return { label: 'Critique', color: palette.warning };
    if (stock <= 5) return { label: 'Faible', color: palette.info };
    return { label: 'Disponible', color: palette.success };
  };

  // ==================== MEDIA HANDLING ====================
  const getProductMedia = (product) => {
    const media = [];
    
    // Add main image
    if (product.mainImage?.url) {
      media.push({
        type: 'image',
        url: product.mainImage.url,
        id: 'main'
      });
    }
    
    // Add additional images
    if (product.additionalImages?.length > 0) {
      product.additionalImages.forEach((img, index) => {
        if (img?.url) {
          media.push({
            type: 'image',
            url: img.url,
            id: `additional-${index}`
          });
        }
      });
    }
    
    // Add video if available (you can add a video property to your product data)
    if (product.videoUrl) {
      media.push({
        type: 'video',
        url: product.videoUrl,
        id: 'video'
      });
    }
    
    return media;
  };

  // ==================== PRODUCT HANDLERS ====================
  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setSelectedMediaIndex(0);
    setSelectedSize(product.sizes?.[0] || '');
    setSelectedColor(product.colors?.[0] || null);
    setQuantity(1);
  };

  const handleAddToCart = () => {
    if (!selectedProduct) return;

    if (selectedProduct.sizes?.length > 0 && !selectedSize) {
      showNotification('Veuillez sélectionner une taille', 'warning');
      return;
    }

    if (selectedProduct.colors?.length > 0 && !selectedColor) {
      showNotification('Veuillez sélectionner une couleur', 'warning');
      return;
    }

    const itemToAdd = {
      _id: selectedProduct._id,
      name: selectedProduct.name,
      price: selectedProduct.price,
      mainImage: selectedProduct.mainImage,
      quantity,
      selectedSize: selectedSize || null,
      selectedColor: selectedColor?.name || null,
      description: selectedProduct.description,
      category: selectedProduct.category,
      stock: selectedProduct.stock,
    };

    try {
      addToCart(itemToAdd, quantity, selectedSize, selectedColor?.name || null);
      showNotification(`${quantity} × ${selectedProduct.name} ajouté au panier`, 'success');
      setSelectedProduct(null);
    } catch (error) {
      showNotification(error.message, 'error');
    }
  };

  const handleQuickAdd = (product, e) => {
    e.stopPropagation();
    
    const defaultSize = product.sizes?.[0] || null;
    const defaultColor = product.colors?.[0] || null;
    
    const itemToAdd = {
      _id: product._id,
      name: product.name,
      price: product.price,
      mainImage: product.mainImage,
      quantity: 1,
      selectedSize: defaultSize,
      selectedColor: defaultColor?.name || null,
      description: product.description,
      category: product.category,
      stock: product.stock,
    };

    try {
      addToCart(itemToAdd, 1, defaultSize, defaultColor?.name || null);
      showNotification(`${product.name} ajouté au panier`, 'success');
    } catch (error) {
      showNotification(error.message, 'error');
    }
  };

  const toggleFavorite = (productId, e) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  // ==================== RENDER FUNCTIONS ====================
const renderProductGrid = () => {
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <Grid container spacing={4} justifyContent="center" sx={{ maxWidth: '1600px' }}>
          {[...Array(8)].map((_, index) => (
            <Grid key={`skeleton-${index}`} item xs={12} sm={12} md={6} lg={4}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <ProductCardSkeleton />
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  if (products.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <Fade in>
          <ContentWrapper sx={{ 
            textAlign: 'center', 
            py: 12,
            maxWidth: '800px',
            mx: 'auto'
          }}>
            <Mosque sx={{ fontSize: 80, color: alpha(palette.gold, 0.3), mb: 3 }} />
            <Typography variant="h6" sx={{ color: palette.slate, mb: 1, fontWeight: 600 }}>
              Aucun article disponible
            </Typography>
            <Typography variant="body2" sx={{ color: palette.gray }}>
              Veuillez revenir plus tard
            </Typography>
          </ContentWrapper>
        </Fade>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' ,}}>
      <Grid 
        container 
        spacing={4} 
        justifyContent="center"
        sx={{ 
          maxWidth: '1600px',
          margin: '0 auto',
        }}
      >
        <AnimatePresence>
          {products.map((product, index) => (
            <Grid key={product._id} item xs={12} sm={12} md={6} lg={4}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                exit={{ opacity: 0, scale: 0.9 }}
                whileHover={{ scale: 1.02 }}
              >
                {/* Product Card */}
<ProductCard 
  onClick={() => handleProductClick(product)}
  sx={{
    height: { xs: 'auto', md: '60vh' },
    width: { xs: '100%', md: '1200px' },
    display: 'flex',
    flexDirection: { xs: 'column', md: 'row' },
    maxWidth: '100%',
    overflow: 'hidden',
  }}
>
  {/* LEFT SIDE - IMAGE */}
  <ProductImageContainer sx={{ 
    width: { xs: '100%', md: '33%' },
    height: { xs: '300px', md: '100%' },
    position: 'relative',
  }}>
    <ProductImage 
      src={product.mainImage?.url || '/placeholder.jpg'} 
      alt={product.name} 
      sx={{
        width: '100%',
        height: '100%',
        objectFit: 'cover',
      }}
    />
    
    {/* Video Badge - Show if product has video */}
    {product.videoUrl && (
      <Box
        sx={{
          position: 'absolute',
          top: 12,
          left: 12,
          background: alpha(palette.gold, 0.9),
          color: palette.white,
          px: 1,
          py: 0.5,
          borderRadius: 1,
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          fontSize: '0.65rem',
          fontWeight: 700,
          zIndex: 2,
        }}
      >
        <VideoLibrary sx={{ fontSize: 14 }} />
        VIDÉO
      </Box>
    )}
    
    <QuickViewOverlay>
      <ZoomIn sx={{ color: palette.goldLight, fontSize: { xs: 32, md: 48 } }} />
    </QuickViewOverlay>

    {/* Badges */}
    <Box sx={{ 
      position: 'absolute', 
      top: 12, 
      right: 12, 
      display: 'flex', 
      gap: 1,
      flexWrap: 'wrap',
      zIndex: 2,
    }}>
      <Chip
        label={getStockStatus(product.stock).label}
        size="small"
        sx={{
          bgcolor: alpha(getStockStatus(product.stock).color, 0.15),
          color: getStockStatus(product.stock).color,
          border: `1px solid ${alpha(getStockStatus(product.stock).color, 0.3)}`,
          fontWeight: 700,
          fontSize: '0.7rem',
        }}
      />
    </Box>

    {/* Favorite Button */}
    <IconButton
      onClick={(e) => toggleFavorite(product._id, e)}
      sx={{
        position: 'absolute',
        bottom: 12,
        right: 12,
        bgcolor: alpha(palette.white, 0.9),
        backdropFilter: 'blur(4px)',
        zIndex: 2,
        '&:hover': { bgcolor: palette.white },
      }}
      size="small"
    >
      {favorites.includes(product._id) ? (
        <Favorite sx={{ color: palette.error, fontSize: 20 }} />
      ) : (
        <FavoriteBorder sx={{ color: palette.gray, fontSize: 20 }} />
      )}
    </IconButton>
  </ProductImageContainer>

  {/* RIGHT SIDE - CONTENT */}
  <CardContent sx={{ 
    width: { xs: '100%', md: '67%' },
    height: { xs: 'auto', md: '100%' },
    p: { xs: 2, sm: 3 },
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  }}>
    {/* Product Title */}
    <Typography
      variant="h5"
      sx={{
        fontWeight: 900,
        color: palette.noir,
        mb: 1,
        fontSize: { xs: '1.2rem', sm: '1.3rem', md: '1.5rem' },
        textTransform: 'uppercase',
      }}
    >
      {product.name}
    </Typography>

    {/* Product Description */}
    <Typography
      variant="body1"
      sx={{
        color: palette.gray,
        fontSize: { xs: '0.9rem', md: '1rem' },
        overflow: 'hidden',
        display: '-webkit-box',
        WebkitLineClamp: { xs: 2, md: 3 },
        WebkitBoxOrient: 'vertical',
      }}
    >
      {product.description}
    </Typography>

    {/* Sizes Section */}
    {product.sizes?.length > 0 && (
      <Box sx={{ mb: { xs: 1.5, md: 2.5 } }}>
        <Typography 
          variant="subtitle2" 
          sx={{ 
            fontWeight: 700, 
            color: palette.noir,
            mt: 1,
            textTransform: 'uppercase',
            fontSize: { xs: '0.75rem', md: '0.85rem' },
            letterSpacing: '0.5px',
          }}
        >
          Tailles disponibles
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {product.sizes.slice(0, 4).map((size) => (
            <Chip
              key={size}
              label={size}
              size="small"
              sx={{
                bgcolor: alpha(palette.gold, 0.1),
                color: palette.goldDark,
                fontWeight: 600,
                borderRadius: '8px',
                fontSize: { xs: '0.7rem', md: '0.8rem' },
                '&:hover': {
                  bgcolor: alpha(palette.gold, 0.2),
                },
              }}
            />
          ))}
          {product.sizes.length > 4 && (
            <Typography variant="caption" sx={{ color: palette.gray, alignSelf: 'center' }}>
              +{product.sizes.length - 4}
            </Typography>
          )}
        </Stack>
      </Box>
    )}

    {/* Colors Section */}
    {product.colors?.length > 0 && (
      <Box sx={{ mb: { xs: 1.5, md: 2.5 } }}>
        <Typography 
          variant="subtitle2" 
          sx={{ 
            fontWeight: 700, 
            color: palette.noir,
            mt: 1,
            textTransform: 'uppercase',
            fontSize: { xs: '0.75rem', md: '0.85rem' },
            letterSpacing: '0.5px',
          }}
        >
          Couleurs disponibles
        </Typography>
        <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
          {product.colors.slice(0, 5).map((color) => (
            <Tooltip key={color.name} title={color.name} arrow>
              <Box
                sx={{
                  width: { xs: 24, md: 30 },
                  height: { xs: 24, md: 30 },
                  borderRadius: '50%',
                  backgroundColor: color.value,
                  border: `2px solid ${palette.white}`,
                  boxShadow: `0 2px 8px ${alpha(palette.noir, 0.15)}`,
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease',
                  '&:hover': {
                    transform: 'scale(1.15)',
                    boxShadow: `0 4px 12px ${alpha(color.value, 0.4)}`,
                  },
                }}
              />
            </Tooltip>
          ))}
          {product.colors.length > 5 && (
            <Typography variant="caption" sx={{ color: palette.gray }}>
              +{product.colors.length - 5}
            </Typography>
          )}
        </Stack>
      </Box>
    )}

    {/* Media Count Indicator */}
    {getProductMedia(product).length > 1 && (
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 1, 
        mt: 1,
        p: 1,
        bgcolor: alpha(palette.gold, 0.05),
        borderRadius: 1,
      }}>
        <Image sx={{ fontSize: 16, color: palette.gold }} />
        <Typography variant="caption" sx={{ color: palette.gray, fontWeight: 600 }}>
          {getProductMedia(product).filter(m => m.type === 'image').length} images
        </Typography>
        {product.videoUrl && (
          <>
            <Box sx={{ width: 1, height: 12, bgcolor: alpha(palette.gold, 0.2), mx: 1 }} />
            <VideoLibrary sx={{ fontSize: 16, color: palette.gold }} />
            <Typography variant="caption" sx={{ color: palette.gray, fontWeight: 600 }}>
              1 vidéo
            </Typography>
          </>
        )}
      </Box>
    )}

    {/* Spacer */}
    <Box sx={{ flexGrow: 1 }} />

    {/* Price and Quick Add Button */}
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      mt: 0,
      pt: { xs: 1.5, md: 2 },
      borderTop: `2px solid ${alpha(palette.gold, 0.2)}`,
    }}>
      {/* Price */}
      <Box>
        <Typography 
          variant="caption" 
          sx={{ 
            color: palette.gray,
            fontWeight: 500,
            textTransform: 'uppercase',
            fontSize: { xs: '0.65rem', md: '0.75rem' },
            letterSpacing: '1px',
            display: 'block',
            mb: 0.5,
          }}
        >
          Prix
        </Typography>
        <Typography
          variant="h4"
          sx={{
            color: palette.gold,
            fontWeight: 900,
            fontSize: { xs: '1.6rem', sm: '1.8rem', md: '2.2rem' },
            lineHeight: 1,
            letterSpacing: '-0.02em',
          }}
        >
          {product.price?.toFixed(2) || '0.00'} TND
        </Typography>
      </Box>
      
      {/* Quick Add Button */}
      <Tooltip title="Ajout rapide" arrow>
        <IconButton
          onClick={(e) => handleQuickAdd(product, e)}
          sx={{
            bgcolor: palette.gold,
            color: palette.white,
            width: { xs: 48, md: 56 },
            height: { xs: 48, md: 56 },
            mr:4,
            '&:hover': {
              bgcolor: palette.goldDark,
              transform: 'scale(1.1)',
              boxShadow: `0 8px 20px ${alpha(palette.gold, 0.4)}`,
            },
            transition: 'all 0.2s ease',
          }}
          size="large"
        >
          <AddShoppingCart sx={{ fontSize: { xs: 22, md: 28 } }} />
        </IconButton>
      </Tooltip>
    </Box>

    {/* Stock Status */}
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 1, 
      mt: { xs: 1, md: 1.5 },
    }}>
      <Box sx={{ 
        width: 8, 
        height: 8, 
        borderRadius: '50%', 
        bgcolor: getStockStatus(product.stock).color,
        boxShadow: `0 0 8px ${alpha(getStockStatus(product.stock).color, 0.5)}`,
      }} />
      <Typography variant="caption" sx={{ 
        color: palette.gray, 
        fontWeight: 500,
        fontSize: { xs: '0.65rem', md: '0.75rem' },
      }}>
        {getStockStatus(product.stock).label} • {product.stock} unités
      </Typography>
    </Box>
  </CardContent>
</ProductCard>
              </motion.div>
            </Grid>
          ))}
        </AnimatePresence>
      </Grid>
    </Box>
  );
};

const renderProductDialog = () => {
  if (!selectedProduct) return null;
  
  const media = getProductMedia(selectedProduct);
  
  return (
    <Dialog
      open={!!selectedProduct}
      onClose={() => setSelectedProduct(null)}
      maxWidth="lg"
      fullWidth
      TransitionComponent={Zoom}
      PaperProps={{
        sx: {
          borderRadius: 4,
          maxHeight: '90vh',
          overflow: 'hidden',
          bgcolor: palette.white,
          border: `2px solid ${alpha(palette.gold, 0.3)}`,
        },
      }}
    >
      <>
        <IconButton
          onClick={() => setSelectedProduct(null)}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            zIndex: 10,
            bgcolor: alpha(palette.white, 0.9),
            backdropFilter: 'blur(4px)',
            border: `1px solid ${alpha(palette.gold, 0.3)}`,
            '&:hover': { bgcolor: palette.white },
          }}
        >
          <Close />
        </IconButton>

        <DialogContent sx={{ p: 0 }}>
          <Grid container>
            {/* Media Section - Left Side */}
            <Grid item xs={12} md={6} sx={{ bgcolor: palette.lightGray }}>
              <Box sx={{ p: 4 }}>
                <MediaSlider 
                  media={media} 
                  initialIndex={selectedMediaIndex}
                  onClose={() => setSelectedProduct(null)}
                />
              </Box>
            </Grid>

            {/* Product Info Section - Right Side */}
            <Grid item xs={12} md={6}>
              <Box sx={{ p: 4, height: '100%', overflowY: 'auto' }}>
                <Typography variant="h4" sx={{ 
                  fontWeight: 900, 
                  color: palette.noir, 
                  mb: 2,
                }}>
                  {selectedProduct.name}
                </Typography>

                <Typography variant="h2" sx={{ 
                  color: palette.gold, 
                  fontWeight: 900,
                  mb: 3,
                  fontSize: { xs: '2rem', md: '2.5rem' },
                }}>
                  {selectedProduct.price.toFixed(2)} TND
                </Typography>

                <Paper
                  elevation={0}
                  sx={{
                    p: 2,
                    mb: 3,
                    bgcolor: alpha(getStockStatus(selectedProduct.stock).color, 0.1),
                    border: `1px solid ${alpha(getStockStatus(selectedProduct.stock).color, 0.3)}`,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                  }}
                >
                  <Inventory sx={{ color: getStockStatus(selectedProduct.stock).color }} />
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: getStockStatus(selectedProduct.stock).color }}>
                      {getStockStatus(selectedProduct.stock).label}
                    </Typography>
                    <Typography variant="caption" sx={{ color: palette.gray }}>
                      {selectedProduct.stock} unités disponibles
                    </Typography>
                  </Box>
                </Paper>

                <Divider sx={{ my: 3, borderColor: alpha(palette.gold, 0.2) }} />

                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" sx={{ fontWeight: 800, mb: 2, color: palette.noir }}>
                    Description
                  </Typography>
                  <Typography variant="body1" sx={{ 
                    color: palette.gray, 
                    lineHeight: 1.8,
                  }}>
                    {selectedProduct.description}
                  </Typography>
                </Box>

                {selectedProduct.sizes?.length > 0 && (
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle1" sx={{ 
                      fontWeight: 800, 
                      mb: 2, 
                      color: palette.noir,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}>
                      <Straighten />
                      Taille {!selectedSize && (
                        <Typography component="span" variant="caption" sx={{ color: palette.error, ml: 1 }}>
                          (Requis)
                        </Typography>
                      )}
                    </Typography>
                    <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
                      {selectedProduct.sizes.map((size) => (
                        <SizeButton
                          key={size}
                          variant="outlined"
                          onClick={() => setSelectedSize(size)}
                          selected={selectedSize === size}
                        >
                          {size}
                        </SizeButton>
                      ))}
                    </Stack>
                  </Box>
                )}

                {selectedProduct.colors?.length > 0 && (
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="subtitle1" sx={{ 
                      fontWeight: 800, 
                      mb: 2, 
                      color: palette.noir,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                    }}>
                      <ColorLens />
                      Couleur {!selectedColor && (
                        <Typography component="span" variant="caption" sx={{ color: palette.error, ml: 1 }}>
                          (Requis)
                        </Typography>
                      )}
                    </Typography>
                    <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
                      {selectedProduct.colors.map((color) => (
                        <Tooltip key={color.name} title={color.name} arrow>
                          <ColorSwatch
                            color={color.value}
                            selected={selectedColor?.name === color.name}
                            onClick={() => setSelectedColor(color)}
                          >
                            {selectedColor?.name === color.name && (
                              <CheckCircle sx={{ 
                                color: palette.white, 
                                fontSize: 20,
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
                              }} />
                            )}
                          </ColorSwatch>
                        </Tooltip>
                      ))}
                    </Stack>
                  </Box>
                )}

                <Box sx={{ mb: 4 }}>
                  <Typography variant="subtitle1" sx={{ 
                    fontWeight: 800, 
                    mb: 2, 
                    color: palette.noir 
                  }}>
                    Quantité
                  </Typography>
                  <Box sx={{ 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    border: `1px solid ${alpha(palette.gold, 0.3)}`,
                    borderRadius: 2,
                    overflow: 'hidden'
                  }}>
                    <IconButton
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      sx={{ borderRadius: 0, px: 2, color: palette.gold }}
                    >
                      <Remove />
                    </IconButton>
                    <Typography sx={{ 
                      px: 4, 
                      py: 1, 
                      fontWeight: 800,
                      borderLeft: `1px solid ${alpha(palette.gold, 0.3)}`,
                      borderRight: `1px solid ${alpha(palette.gold, 0.3)}`,
                      color: palette.noir,
                    }}>
                      {quantity}
                    </Typography>
                    <IconButton
                      onClick={() => setQuantity(quantity + 1)}
                      sx={{ borderRadius: 0, px: 2, color: palette.gold }}
                    >
                      <Add />
                    </IconButton>
                  </Box>
                </Box>

                {(selectedSize || selectedColor) && (
                  <Fade in>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        mb: 4,
                        bgcolor: alpha(palette.gold, 0.05),
                        borderRadius: 2,
                        border: `1px solid ${alpha(palette.gold, 0.3)}`,
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ fontWeight: 800, mb: 1, color: palette.goldDark }}>
                        Votre sélection
                      </Typography>
                      <Stack direction="row" spacing={2}>
                        {selectedSize && (
                          <Chip
                            label={`Taille: ${selectedSize}`}
                            size="small"
                            sx={{ bgcolor: palette.white, fontWeight: 600 }}
                          />
                        )}
                        {selectedColor && (
                          <Chip
                            label={`Couleur: ${selectedColor.name}`}
                            size="small"
                            sx={{ bgcolor: palette.white, fontWeight: 600 }}
                            avatar={
                              <Box sx={{ 
                                width: 12, 
                                height: 12, 
                                borderRadius: '50%',
                                bgcolor: selectedColor.value,
                                ml: 0.5
                              }} />
                            }
                          />
                        )}
                      </Stack>
                    </Paper>
                  </Fade>
                )}

                <Stack spacing={2} sx={{ mb: 4 }}>
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    startIcon={<ShoppingBag sx={{ fontSize: 24 }} />}
                    onClick={handleAddToCart}
                    disabled={selectedProduct.stock === 0}
                    sx={{
                      bgcolor: palette.gold,
                      color: palette.noir,
                      fontWeight: 900,
                      py: 2,
                      borderRadius: 3,
                      fontSize: '1.2rem',
                      letterSpacing: '1px',
                      border: `2px solid ${palette.goldDark}`,
                      '&:hover': {
                        bgcolor: palette.goldDark,
                        color: palette.white,
                        transform: 'translateY(-3px)',
                        boxShadow: `0 15px 30px ${alpha(palette.gold, 0.4)}`,
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    ACHETER MAINTENANT • {(selectedProduct.price * quantity).toFixed(2)} TND
                  </Button>
                </Stack>

                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <LocalShipping sx={{ color: palette.gold }} />
                      <Typography variant="caption" sx={{ color: palette.gray, fontWeight: 500 }}>
                        Livraison gratuite
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Security sx={{ color: palette.gold }} />
                      <Typography variant="caption" sx={{ color: palette.gray, fontWeight: 500 }}>
                        Paiement sécurisé
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <AssignmentReturn sx={{ color: palette.gold }} />
                      <Typography variant="caption" sx={{ color: palette.gray, fontWeight: 500 }}>
                        Retour gratuit 30j
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={6}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <CurrencyExchange sx={{ color: palette.gold }} />
                      <Typography variant="caption" sx={{ color: palette.gray, fontWeight: 500 }}>
                        Prix TTC
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
      </>
    </Dialog>
  );
};

  return (
    <>
      {/* Background Pattern - Fixed behind everything */}
      <BackgroundPattern />
      
      {/* Main Content */}
      <Box
        sx={{
          minHeight: '100vh',
          width: '99vw',
          color: 'black',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        {/* Inspirational Header with Auto-Swiping Text */}
        <InspirationalHeader>
          <Container maxWidth="xl">
            <SwipingIslamicText />
          </Container>
        </InspirationalHeader>

        {/* Main Content - Product Grid */}
        <Container maxWidth="xl" sx={{ py: 2 }}>
          {renderProductGrid()}
        </Container>

        {/* Product Detail Dialog */}
        {renderProductDialog()}

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          TransitionComponent={Zoom}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{
              borderRadius: 2,
              boxShadow: `0 10px 30px ${alpha(palette.gold, 0.2)}`,
              fontWeight: 600,
              border: `1px solid ${alpha(palette.gold, 0.3)}`,
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </>
  );
};

export default Religion;