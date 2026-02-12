import React, { useRef, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Chip,
  Stack,
  Grid,
  alpha,
  useTheme,
  useMediaQuery,
  IconButton,
  Card,
  CardContent,
  Rating,
  Avatar,
  AvatarGroup,
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  Paper,
  LinearProgress,
  Divider,
  Badge,
  CircularProgress,
  MobileStepper,
  SwipeableDrawer
} from '@mui/material';
import {
  FlashOn,
  ShoppingBag,
  ArrowForward,
  LocalShipping,
  Shield,
  TrendingUp,
  CheckCircle,
  Star,
  Favorite,
  Compare,
  Groups,
  Timer,
  Thermostat,
  WaterDrop,
  Air,
  Scale,
  Close,
  Verified,
  Diamond,
  WorkspacePremium,
  Loyalty,
  LocalFireDepartment,
  Inventory,
  Person,
  FitnessCenter,
  ExpandMore,
  Visibility,
  KeyboardArrowLeft,
  KeyboardArrowRight
} from '@mui/icons-material';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';

import heroImage from '../../assets/sport.png';
import jerseyImage from '../../assets/jersey.png';
import shortImage from '../../assets/short.png';
import sleevelessImage from '../../assets/sleeveless.png';
import hoodieImage from '../../assets/hoodie.png';
import pantsImage from '../../assets/pants.png';
import athlete1 from '../../assets/hoodie.png';
import athlete2 from '../../assets/pants.png';
import athlete3 from '../../assets/short.png';

/* =======================
   ENHANCED DESIGN TOKENS
======================= */
const colors = {
  black: '#0b0b0b',
  dark: '#121212',
  gold: '#d4af37',
  goldSoft: '#f4e4a6',
  platinum: '#e5e4e2',
  carbon: '#333333',
  white: '#ffffff',
  gradientGold: 'linear-gradient(135deg, #d4af37 0%, #f9d423 50%, #d4af37 100%)',
  gradientPlatinum: 'linear-gradient(135deg, #e5e4e2 0%, #ffffff 50%, #e5e4e2 100%)',
  gradientDark: 'linear-gradient(180deg, #121212 0%, #0b0b0b 100%)',
  gradientCarbon: 'linear-gradient(135deg, #333333 0%, #1a1a1a 50%, #333333 100%)',
};

/* =======================
   ENHANCED DATA
======================= */
const premiumStats = [
  { value: '1K+', label: 'Produits Premium', icon: Diamond, sub: 'Collections exclusives' },
  { value: '50+', label: 'Marques Élite', icon: WorkspacePremium, sub: 'Nike, Adidas, Under Armour' },
  { value: '10K+', label: 'Athlètes Satisfaits', icon: Verified, sub: '98% de satisfaction' },
  { value: '24h', label: 'Livraison Express', icon: Timer, sub: 'Gratuite dès 150€' },
];

const premiumFeatures = [
  { icon: Shield, text: 'Garantie Qualité 2 Ans', sub: 'Premium garantie' },
  { icon: LocalShipping, text: 'Retours Gratuits 60 Jours', sub: 'Sans frais' },
  { icon: Groups, text: 'Support Expert 24/7', sub: 'Conseils personnalisés' },
  { icon: Loyalty, text: 'Programme Fidélité', sub: 'Points & récompenses' },
  { icon: Thermostat, text: 'Technologie ClimatControl', sub: 'Régulation thermique' },
  { icon: WaterDrop, text: 'Hydrophobe & Respirant', sub: 'Matériaux avancés' },
];

const athleteTestimonials = [
  {
    name: 'Carlos Martinez',
    title: 'Champion de Tennis',
    avatar: athlete1,
    rating: 5,
    verified: true,
    text: 'Cette collection a transformé ma façon de jouer. La respirabilité est incomparable.',
    achievements: ['Roland Garros 2024', '3 Grands Chelems']
  },
  {
    name: 'Sophie Laurent',
    title: 'Athlète Olympique',
    avatar: athlete2,
    rating: 5,
    verified: true,
    text: 'Le confort et la liberté de mouvement sont exceptionnels. Je ne porte plus que ça.',
    achievements: ['Médaillée Or 2024', 'Record du Monde']
  },
  {
    name: 'James Chen',
    title: 'Coach Fitness',
    avatar: athlete3,
    rating: 5,
    verified: true,
    text: 'La durabilité est incroyable. Après 2 ans d\'utilisation intensive, comme neuf.',
    achievements: ['Top Trainer 2024', 'Nike Ambassador']
  }
];

const techSpecs = {
  jersey: {
    material: 'Dri-FIT Elite Pro',
    weight: '145g',
    breathability: '98%',
    moisture: '0.3s absorption',
    spf: '50+',
    durability: '200+ lavages'
  }
};

const performanceComparison = [
  {
    feature: 'Séchage rapide',
    standard: '45 minutes',
    premium: '8 minutes',
    improvement: '82% plus rapide'
  },
  {
    feature: 'Respiration',
    standard: 'Bon',
    premium: 'Excellente',
    improvement: '2.5x mieux'
  },
  {
    feature: 'Durabilité',
    standard: '6 mois',
    premium: '24 mois',
    improvement: 'Garantie 4x'
  },
  {
    feature: 'Confort',
    standard: 'Correct',
    premium: 'Premium',
    improvement: '98% satisfaction'
  }
];

const sizeGuide = [
  { size: 'XS', chest: '86-91cm', waist: '71-76cm', fit: 'Athlétique' },
  { size: 'S', chest: '91-97cm', waist: '76-81cm', fit: 'Athlétique' },
  { size: 'M', chest: '97-102cm', waist: '81-86cm', fit: 'Standard' },
  { size: 'L', chest: '102-107cm', waist: '86-91cm', fit: 'Standard' },
  { size: 'XL', chest: '107-112cm', waist: '91-97cm', fit: 'Large' }
];

const limitedEditions = [
  { id: 1, name: 'Carbon Elite Pro', remaining: 12, tag: 'Édition Limitée' },
  { id: 2, name: 'Olympic Collection', remaining: 8, tag: 'Exclusif' },
  { id: 3, name: 'Champions Bundle', remaining: 5, tag: 'Dernière Chance' }
];

const gridItems = [
  {
    id: 'a',
    title: 'T-SHIRTS',
    image: jerseyImage,
    link: '/catalog',
    tag: 'Performance',
    price: '€89',
    material: 'Dri-FIT Elite Pro',
    weight: '145g'
  },
  {
    id: 'b',
    title: 'SHORTS',
    image: shortImage,
    link: '/catalog',
    tag: 'Légèreté',
    price: '€79',
    material: 'Flexweave 4D',
    weight: '89g'
  },
  {
    id: 'c',
    title: 'HOODIES',
    image: hoodieImage,
    link: '/catalog',
    tag: 'Confort',
    price: '€119',
    material: 'ThermoTech Pro',
    weight: '320g'
  },
  {
    id: 'd',
    title: 'SLEEVELESS JERSEYS',
    image: sleevelessImage,
    link: '/catalog',
    tag: 'Flexibilité',
    price: '€69',
    material: 'AirFlow Mesh',
    weight: '110g'
  },
  {
    id: 'e',
    title: 'PANTS',
    image: pantsImage,
    link: '/catalog',
    tag: 'Endurance',
    price: '€99',
    material: 'Compression Elite',
    weight: '210g'
  }
];

/* =======================
   PREMIUM SUB-COMPONENTS
======================= */
const ProductShowcase3D = ({ product }) => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  return (
    <Box
      sx={{
        perspective: '1000px',
        width: '100%',
        height: 300,
        position: 'relative',
        cursor: 'grab',
        '&:active': { cursor: 'grabbing' }
      }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * -20;
        setRotation({ x, y });
      }}
      onMouseLeave={() => setRotation({ x: 0, y: 0 })}
    >
      <motion.div
        animate={{
          rotateY: rotation.x,
          rotateX: rotation.y
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d'
        }}
      >
        <Card
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            backfaceVisibility: 'hidden',
            background: colors.gradientCarbon,
            borderRadius: 3,
            overflow: 'hidden',
            border: `2px solid ${alpha(colors.gold, 0.3)}`,
            boxShadow: `0 20px 40px ${alpha(colors.black, 0.8)}`
          }}
        >
          <Box
            component={motion.div}
            animate={{
              scale: [1, 1.02, 1],
              x: rotation.x * 0.05,
              y: rotation.y * 0.05
            }}
            transition={{ duration: 4, repeat: Infinity }}
            sx={{
              width: '100%',
              height: '100%',
              backgroundImage: `url(${product.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'relative'
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                bottom: 16,
                left: 16,
                background: alpha(colors.black, 0.8),
                backdropFilter: 'blur(10px)',
                borderRadius: 2,
                p: 1.5,
                border: `1px solid ${alpha(colors.gold, 0.2)}`
              }}
            >
              <Stack spacing={0.5}>
                <Typography variant="caption" sx={{ color: colors.gold, fontWeight: 600 }}>
                  {product.material}
                </Typography>
                <Typography variant="caption" sx={{ color: colors.white, opacity: 0.8 }}>
                  Poids: {product.weight}
                </Typography>
              </Stack>
            </Box>

            <Box
              sx={{
                position: 'absolute',
                top: '30%',
                right: '20%',
                width: 30,
                height: 30,
                borderRadius: '50%',
                background: alpha(colors.gold, 0.2),
                border: `1px solid ${colors.gold}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                '&:hover': {
                  background: alpha(colors.gold, 0.4),
                  transform: 'scale(1.1)'
                }
              }}
            >
              <Thermostat sx={{ fontSize: 16, color: colors.gold }} />
            </Box>
          </Box>

          <Box
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              display: 'flex',
              gap: 0.5,
              flexDirection: 'column'
            }}
          >
            {['Dri-FIT Elite', 'SPF 50+'].map((tech, idx) => (
              <Chip
                key={idx}
                label={tech}
                size="small"
                sx={{
                  background: alpha(colors.gold, 0.9),
                  color: colors.black,
                  fontWeight: 700,
                  fontSize: '0.6rem',
                  backdropFilter: 'blur(10px)'
                }}
              />
            ))}
          </Box>
        </Card>
      </motion.div>
    </Box>
  );
};

const AthleteTestimonialCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  const handlers = useSwipeable({
    onSwipedLeft: () => setActiveIndex((prev) => (prev + 1) % athleteTestimonials.length),
    onSwipedRight: () => setActiveIndex((prev) => (prev - 1 + athleteTestimonials.length) % athleteTestimonials.length),
    trackMouse: true,
    trackTouch: true
  });

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % athleteTestimonials.length);
  };

  const handleBack = () => {
    setActiveIndex((prev) => (prev - 1 + athleteTestimonials.length) % athleteTestimonials.length);
  };

  return (
    <Box sx={{ position: 'relative', width: '100%' }}>
      <Box {...handlers} sx={{ px: 2 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.3 }}
          >
            <Card
              sx={{
                background: alpha(colors.black, 0.6),
                backdropFilter: 'blur(20px)',
                border: `1px solid ${alpha(colors.gold, 0.2)}`,
                borderRadius: 3,
                p: 3
              }}
            >
              <Stack spacing={2}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Avatar
                    src={athleteTestimonials[activeIndex].avatar}
                    sx={{
                      width: 60,
                      height: 60,
                      border: `2px solid ${colors.gold}`
                    }}
                  />
                  <Box>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography variant="subtitle1" fontWeight={700} color={colors.white}>
                        {athleteTestimonials[activeIndex].name}
                      </Typography>
                      {athleteTestimonials[activeIndex].verified && (
                        <Verified sx={{ color: colors.gold, fontSize: 16 }} />
                      )}
                    </Stack>
                    <Typography variant="body2" color={colors.goldSoft}>
                      {athleteTestimonials[activeIndex].title}
                    </Typography>
                    <Rating
                      value={athleteTestimonials[activeIndex].rating}
                      readOnly
                      size="small"
                      sx={{ mt: 0.5 }}
                      icon={<Star sx={{ color: colors.gold }} />}
                      emptyIcon={<Star sx={{ color: alpha(colors.white, 0.3) }} />}
                    />
                  </Box>
                </Stack>

                <Typography
                  sx={{
                    fontStyle: 'italic',
                    color: alpha(colors.white, 0.9),
                    lineHeight: 1.6,
                    fontSize: '0.95rem'
                  }}
                >
                  "{athleteTestimonials[activeIndex].text}"
                </Typography>

                <Stack direction="row" spacing={0.5} flexWrap="wrap">
                  {athleteTestimonials[activeIndex].achievements.map((ach, idx) => (
                    <Chip
                      key={idx}
                      label={ach}
                      size="small"
                      sx={{
                        background: alpha(colors.gold, 0.1),
                        color: colors.goldSoft,
                        border: `1px solid ${alpha(colors.gold, 0.3)}`,
                        fontSize: '0.7rem'
                      }}
                    />
                  ))}
                </Stack>
              </Stack>
            </Card>
          </motion.div>
        </AnimatePresence>
      </Box>

      <MobileStepper
        variant="dots"
        steps={athleteTestimonials.length}
        position="static"
        activeStep={activeIndex}
        sx={{
          background: 'transparent',
          justifyContent: 'center',
          mt: 2,
          '& .MuiMobileStepper-dot': {
            backgroundColor: alpha(colors.white, 0.3),
            '&-active': {
              backgroundColor: colors.gold
            }
          }
        }}
        nextButton={
          <IconButton
            onClick={handleNext}
            size="small"
            sx={{ color: colors.gold, '&:hover': { background: alpha(colors.gold, 0.1) } }}
          >
            <KeyboardArrowRight />
          </IconButton>
        }
        backButton={
          <IconButton
            onClick={handleBack}
            size="small"
            sx={{ color: colors.gold, '&:hover': { background: alpha(colors.gold, 0.1) } }}
          >
            <KeyboardArrowLeft />
          </IconButton>
        }
      />
    </Box>
  );
};

const PerformanceComparisonTable = () => {
  return (
    <TableContainer
      component={Paper}
      sx={{
        background: alpha(colors.black, 0.6),
        backdropFilter: 'blur(10px)',
        border: `1px solid ${alpha(colors.gold, 0.2)}`,
        borderRadius: 2,
        overflow: 'hidden'
      }}
    >
      <Table size="small">
        <TableBody>
          {performanceComparison.map((row, index) => (
            <TableRow
              key={index}
              sx={{
                '&:hover': {
                  background: alpha(colors.gold, 0.05)
                }
              }}
            >
              <TableCell sx={{ borderColor: alpha(colors.gold, 0.1), color: colors.white, py: 1.5 }}>
                <Typography fontSize="0.9rem" fontWeight={600}>{row.feature}</Typography>
              </TableCell>
              <TableCell sx={{ borderColor: alpha(colors.gold, 0.1), color: alpha(colors.white, 0.6), py: 1.5, fontSize: '0.85rem' }}>
                {row.standard}
              </TableCell>
              <TableCell sx={{ borderColor: alpha(colors.gold, 0.1), color: colors.gold, py: 1.5 }}>
                <Stack direction="row" alignItems="center" spacing={0.5}>
                  <Typography fontSize="0.85rem" fontWeight={700}>{row.premium}</Typography>
                  <ArrowForward sx={{ fontSize: 14, color: colors.gold }} />
                </Stack>
              </TableCell>
              <TableCell sx={{ borderColor: alpha(colors.gold, 0.1), py: 1.5 }}>
                <Chip
                  label={row.improvement}
                  size="small"
                  sx={{
                    background: alpha(colors.gold, 0.2),
                    color: colors.gold,
                    fontWeight: 600,
                    fontSize: '0.7rem'
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

const SizeGuideModal = ({ open, onClose }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      PaperProps={{
        sx: {
          background: colors.gradientDark,
          border: `2px solid ${colors.gold}`,
          borderRadius: 3
        }
      }}
    >
      <DialogTitle sx={{ color: colors.gold, borderBottom: `1px solid ${alpha(colors.gold, 0.2)}`, py: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" fontWeight={700}>
            Guide des Tailles Professionnel
          </Typography>
          <IconButton onClick={onClose} size="small" sx={{ color: colors.gold }}>
            <Close />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ py: 2 }}>
          <TableContainer>
            <Table size="small">
              <TableBody>
                {sizeGuide.map((size, index) => (
                  <TableRow
                    key={index}
                    sx={{
                      '&:hover': {
                        background: alpha(colors.gold, 0.05)
                      }
                    }}
                  >
                    <TableCell sx={{ color: colors.gold, fontWeight: 700, fontSize: '0.9rem' }}>
                      {size.size}
                    </TableCell>
                    <TableCell sx={{ color: colors.white, fontSize: '0.9rem' }}>{size.chest}</TableCell>
                    <TableCell sx={{ color: colors.white, fontSize: '0.9rem' }}>{size.waist}</TableCell>
                    <TableCell>
                      <Chip
                        label={size.fit}
                        size="small"
                        sx={{
                          background: alpha(colors.gold, 0.2),
                          color: colors.gold,
                          fontSize: '0.75rem'
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Card
            sx={{
              background: alpha(colors.gold, 0.1),
              border: `1px solid ${alpha(colors.gold, 0.3)}`,
              borderRadius: 2,
              p: 2
            }}
          >
            <Stack spacing={1.5}>
              <Typography variant="subtitle2" color={colors.gold} fontWeight={700}>
                🎯 Recommandation IA Personnalisée
              </Typography>
              <Typography color={colors.white} opacity={0.9} fontSize="0.9rem">
                Notre intelligence artificielle analyse 15 points de mesure pour vous recommander la taille parfaite.
              </Typography>
              <Button
                variant="contained"
                size="small"
                sx={{
                  background: colors.gradientGold,
                  color: colors.black,
                  fontWeight: 700,
                  alignSelf: 'flex-start',
                  fontSize: '0.85rem'
                }}
              >
                Obtenir ma taille IA
              </Button>
            </Stack>
          </Card>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

/* =======================
   MAIN COMPONENT - ENHANCED
======================= */
export default function Sport() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [liveInventory, setLiveInventory] = useState(limitedEditions);
  const [selectedProduct, setSelectedProduct] = useState(gridItems[0]);

  const titleRef = useRef(null);
  const isTitleInView = useInView(titleRef, { once: true, amount: 0.5 });
  const gridRef = useRef(null);
  const isGridInView = useInView(gridRef, { once: true, amount: 0.3 });
  const testimonialRef = useRef(null);
  const isTestimonialInView = useInView(testimonialRef, { once: true, amount: 0.3 });

  const addToCart = (product) => {
    setCartItems([...cartItems, product]);
  };

  const updateInventory = (id) => {
    setLiveInventory(prev =>
      prev.map(item =>
        item.id === id ? { ...item, remaining: Math.max(0, item.remaining - 1) } : item
      )
    );
  };

  return (
    <Box
      sx={{
        minHeight: '250vh',
        width: '99vw',
        background: colors.gradientDark,
        color: colors.white,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Floating Cart Preview */}
      {cartItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            zIndex: 1000
          }}
        >
          <Card
            sx={{
              background: alpha(colors.black, 0.95),
              backdropFilter: 'blur(20px)',
              border: `2px solid ${colors.gold}`,
              borderRadius: 2,
              p: 1.5,
              boxShadow: `0 10px 30px ${alpha(colors.black, 0.8)}`
            }}
          >
            <Stack spacing={1}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <ShoppingBag sx={{ color: colors.gold, fontSize: 18 }} />
                <Typography color={colors.white} fontWeight={600} fontSize="0.9rem">
                  Kit Complet ({cartItems.length})
                </Typography>
              </Stack>
              <AvatarGroup max={3}>
                {cartItems.slice(0, 3).map((item, idx) => (
                  <Avatar
                    key={idx}
                    src={item.image}
                    sx={{ width: 28, height: 28, border: `2px solid ${colors.gold}` }}
                  />
                ))}
              </AvatarGroup>
              <Button
                size="small"
                sx={{
                  background: colors.gradientGold,
                  color: colors.black,
                  fontWeight: 700,
                  fontSize: '0.8rem'
                }}
              >
                Finaliser (€{cartItems.length * 89})
              </Button>
            </Stack>
          </Card>
        </motion.div>
      )}

      {/* Right Side Full Background Image */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: { xs: '100%', md: '50%' },
          height: '100%',
          zIndex: 0,
          overflow: 'hidden',
        }}
      >
        {/* Background Gradient Overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              linear-gradient(90deg, ${colors.black} 0%, transparent 30%, transparent 100%),
              linear-gradient(180deg, ${colors.black} 0%, transparent 60%, transparent 100%)
            `,
            zIndex: 2,
          }}
        />
        
        {/* Gold Edge Glow */}
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '3px',
            background: colors.gradientGold,
            zIndex: 3,
            boxShadow: `
              0 0 30px ${colors.gold},
              0 0 60px ${alpha(colors.gold, 0.5)},
              0 0 90px ${alpha(colors.gold, 0.2)}
            `,
          }}
        />
        
        {/* Main Image */}
        <Box
          component="img"
          src={heroImage}
          alt="Sport lifestyle"
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            filter: 'brightness(0.9) contrast(1.1)',
          }}
        />
        
        {/* Subtle Noise Texture */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E")`,
            opacity: 0.03,
            mixBlendMode: 'overlay',
            zIndex: 1,
          }}
        />
      </Box>

      {/* Background Effects - Left Side */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: { xs: 0, md: '50%' },
          bottom: 0,
          background: `radial-gradient(circle at 20% 40%, ${alpha(colors.gold, 0.08)} 0%, transparent 70%)`,
          zIndex: 0,
        }}
      />
      
      <Container 
        maxWidth={false}
        sx={{
          px: { xs: 3, md: 6, lg: 8 },
          height: '100%',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* =======================
           HERO SECTION - ENHANCED
        ======================= */}
        <Grid 
          container 
          sx={{
            minHeight: '100vh',
            alignItems: 'center',
          }}
        >
          {/* LEFT CONTENT - 2/3 width */}
          <Grid item xs={12} md={8}>
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <Box sx={{ 
                maxWidth: { md: '90%', lg: '85%' },
                mt: 6
              }}>
                {/* Premium Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Chip
                    icon={<Diamond sx={{ fontSize: '1.1rem' }} />}
                    label="ÉQUIPEMENT ÉLITE - ÉDITION PREMIUM"
                    sx={{
                      mb: { xs: 3, md: 4 },
                      background: colors.gradientGold,
                      color: colors.black,
                      fontWeight: 900,
                      fontSize: { xs: '0.75rem', md: '0.85rem' },
                      py: 1,
                      px: 2,
                      '& .MuiChip-icon': {
                        mr: 1,
                      },
                    }}
                  />
                </motion.div>

                {/* Main Heading */}
                <Typography
                  variant="h1"
                  component={motion.h1}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.3 }}
                  sx={{
                    fontWeight: 900,
                    fontSize: { 
                      xs: '2.2rem', 
                      sm: '2.8rem', 
                      md: '3.2rem', 
                      lg: '3.8rem' 
                    },
                    lineHeight: 1.1,
                    mb: 3,
                    background: `linear-gradient(90deg, ${colors.white} 40%, ${colors.gold} 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  Redéfinissez Vos
                  <Box
                    component="span"
                    sx={{
                      display: 'block',
                      background: colors.gradientGold,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    Limites de Performance
                  </Box>
                </Typography>

                {/* Premium Description */}
                <Typography
                  component={motion.p}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.5 }}
                  sx={{
                    opacity: 0.9,
                    fontSize: { xs: '0.95rem', md: '1.05rem', lg: '1.15rem' },
                    lineHeight: 1.7,
                    mb: { xs: 4, md: 5 },
                    maxWidth: '90%',
                  }}
                >
                  Technologies brevetées développées avec la NASA, matériaux innovants 
                  et design primé par les plus grands athlètes mondiaux. 
                  <Box component="span" sx={{ color: colors.gold, fontWeight: 700 }}>
                    {' '}L'équipement qui fait la différence.
                  </Box>
                </Typography>

                {/* Premium Features Grid */}
                <Grid container spacing={2} mb={{ xs: 4, md: 5 }}>
                  {premiumFeatures.map((feature, index) => (
                    <Grid item xs={12} sm={6} md={4} key={feature.text}>
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                      >
                        <Card
                          sx={{
                            background: alpha(colors.black, 0.6),
                            border: `1px solid ${alpha(colors.gold, 0.2)}`,
                            borderRadius: 2,
                            p: 2,
                            height: '100%',
                            transition: 'all 0.3s',
                            '&:hover': {
                              borderColor: colors.gold,
                              transform: 'translateY(-2px)',
                              boxShadow: `0 10px 20px ${alpha(colors.gold, 0.2)}`
                            }
                          }}
                        >
                          <Stack spacing={1}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <feature.icon sx={{ color: colors.gold, fontSize: '1.2rem' }} />
                              <Typography
                                sx={{
                                  color: colors.white,
                                  fontWeight: 600,
                                  fontSize: '0.9rem'
                                }}
                              >
                                {feature.text}
                              </Typography>
                            </Box>
                            <Typography
                              sx={{
                                color: colors.goldSoft,
                                fontSize: '0.75rem',
                                opacity: 0.8
                              }}
                            >
                              {feature.sub}
                            </Typography>
                          </Stack>
                        </Card>
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>

                {/* Premium CTA Buttons */}
                <Stack 
                  direction={{ xs: 'column', sm: 'row' }} 
                  spacing={2} 
                  mb={{ xs: 5, md: 6 }}
                >
                  <Button
                    component={motion.button}
                    whileHover={{ 
                      scale: 1.05,
                      boxShadow: `0 15px 30px ${alpha(colors.gold, 0.4)}`
                    }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    startIcon={<Diamond />}
                    endIcon={<ArrowForward />}
                    sx={{
                      background: colors.gradientGold,
                      color: colors.black,
                      fontWeight: 800,
                      px: { xs: 4, md: 5 },
                      py: { xs: 1.6, md: 1.8 },
                      borderRadius: 2,
                      fontSize: { xs: '0.9rem', md: '0.95rem' },
                      minWidth: { sm: 220 },
                      boxShadow: `0 5px 15px ${alpha(colors.gold, 0.3)}`,
                      zIndex: 2,
                      position: 'relative',
                    }}
                    onClick={() => addToCart(selectedProduct)}
                  >
                    Ajouter au Kit Élite (€89)
                  </Button>

                  <Button
                    component={motion.button}
                    whileHover={{ 
                      scale: 1.05,
                      backgroundColor: alpha(colors.gold, 0.12)
                    }}
                    whileTap={{ scale: 0.95 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.9 }}
                    variant="outlined"
                    startIcon={<WorkspacePremium />}
                    sx={{
                      borderColor: colors.gold,
                      color: colors.gold,
                      px: { xs: 4, md: 5 },
                      py: { xs: 1.6, md: 1.8 },
                      borderRadius: 2,
                      fontSize: { xs: '0.9rem', md: '0.95rem' },
                      fontWeight: 600,
                      minWidth: { sm: 180 },
                      '&:hover': {
                        borderColor: colors.goldSoft,
                        background: alpha(colors.gold, 0.08),
                      },
                      zIndex: 2,
                      position: 'relative',
                    }}
                  >
                    Configurer mon Kit
                  </Button>
                </Stack>

                {/* Enhanced Stats */}
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={{ xs: 3, sm: 4 }}
                  flexWrap="wrap"
                  sx={{ position: 'relative', zIndex: 2 }}
                >
                  {premiumStats.map((stat, index) => (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: 1 + index * 0.1 }}
                    >
                      <Card
                        sx={{
                          background: alpha(colors.black, 0.6),
                          border: `1px solid ${alpha(colors.gold, 0.1)}`,
                          borderRadius: 2,
                          p: 2,
                          minWidth: 150
                        }}
                      >
                        <Stack spacing={1}>
                          <Stack direction="row" alignItems="center" spacing={1.5}>
                            <Box
                              sx={{
                                background: alpha(colors.gold, 0.1),
                                borderRadius: 2,
                                p: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <stat.icon sx={{ color: colors.gold, fontSize: '1.5rem' }} />
                            </Box>
                            <Box>
                              <Typography fontWeight={900} color={colors.gold} sx={{ fontSize: '1.5rem' }}>
                                {stat.value}
                              </Typography>
                              <Typography fontSize="0.85rem" color={colors.white} fontWeight={600}>
                                {stat.label}
                              </Typography>
                              <Typography fontSize="0.7rem" opacity={0.7} color={colors.goldSoft}>
                                {stat.sub}
                              </Typography>
                            </Box>
                          </Stack>
                        </Stack>
                      </Card>
                    </motion.div>
                  ))}
                </Stack>
              </Box>
            </motion.div>
          </Grid>

          {/* Empty column for spacing - Image is in background */}
          <Grid item xs={12} md={4} />
        </Grid>

        {/* =======================
           INTERACTIVE TECHNOLOGY SECTION
        ======================= */}
        <Box sx={{ py: { xs: 6, md: 10 } }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                <Stack spacing={3}>
                  <Typography variant="h3" sx={{ color: colors.gold, fontWeight: 900, fontSize: { xs: '1.8rem', md: '2.2rem' } }}>
                    Visualisez la Technologie
                  </Typography>
                  <ProductShowcase3D product={selectedProduct} />
                  
                  {/* Tech Specs */}
                  <Card sx={{ background: alpha(colors.black, 0.6), p: 2.5 }}>
                    <Typography variant="h6" color={colors.white} mb={1.5} fontSize="1.1rem">
                      📊 Spécifications Techniques
                    </Typography>
                    <Grid container spacing={1.5}>
                      {Object.entries(techSpecs.jersey).map(([key, value]) => (
                        <Grid item xs={6} key={key}>
                          <Stack>
                            <Typography variant="caption" color={alpha(colors.white, 0.6)} fontSize="0.75rem">
                              {key.toUpperCase()}
                            </Typography>
                            <Typography color={colors.gold} fontWeight={600} fontSize="0.9rem">
                              {value}
                            </Typography>
                          </Stack>
                        </Grid>
                      ))}
                    </Grid>
                  </Card>
                </Stack>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={6}>
              <Stack spacing={4}>
                {/* Performance Comparison */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <Typography variant="h4" sx={{ color: colors.white, fontWeight: 900, mb: 2, fontSize: { xs: '1.5rem', md: '1.8rem' } }}>
                  Wellness-Focused Technology
                  </Typography>
                  <PerformanceComparisonTable />
                </motion.div>

                {/* Limited Edition Alert */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <Card
                    sx={{
                      background: `linear-gradient(135deg, ${colors.black}, ${colors.carbon})`,
                      border: `2px solid ${colors.gold}`,
                      borderRadius: 2,
                      p: 2.5,
                      position: 'relative',
                      overflow: 'hidden'
                    }}
                  >
                    <Stack spacing={1.5}>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <LocalFireDepartment sx={{ color: colors.gold }} />
                        <Typography variant="h6" color={colors.white} fontWeight={700} fontSize="1rem">
                          Éditions Limitées
                        </Typography>
                      </Stack>
                      <Typography color={colors.goldSoft} fontSize="0.9rem">
                        Ces collections exclusives partent rapidement. Ne manquez pas votre chance.
                      </Typography>
                      {liveInventory.map((item) => (
                        <Stack key={item.id} direction="row" justifyContent="space-between" alignItems="center">
                          <Typography color={colors.white} fontSize="0.9rem">{item.name}</Typography>
                          <Stack alignItems="flex-end" spacing={0.5}>
                            <Chip
                              label={item.tag}
                              size="small"
                              sx={{
                                background: alpha(colors.gold, 0.2),
                                color: colors.gold,
                                fontWeight: 600,
                                fontSize: '0.7rem'
                              }}
                            />
                            <Typography variant="caption" color={alpha(colors.white, 0.7)} fontSize="0.75rem">
                              {item.remaining} restants
                            </Typography>
                          </Stack>
                        </Stack>
                      ))}
                      <LinearProgress
                        variant="determinate"
                        value={50}
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          background: alpha(colors.white, 0.1),
                          '& .MuiLinearProgress-bar': {
                            background: colors.gradientGold
                          }
                        }}
                      />
                    </Stack>
                  </Card>
                </motion.div>
              </Stack>
            </Grid>
          </Grid>
        </Box>

        {/* =======================
           CENTERED TITLE SECTION
        ======================= */}
        <Box
          ref={titleRef}
          sx={{
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Background glow effect */}
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: '120%',
              height: '120%',
              background: `radial-gradient(circle, ${alpha(colors.gold, 0.05)} 0%, transparent 70%)`,
              filter: 'blur(60px)',
            }}
          />
        </Box>

        {/* =======================
           ENHANCED PRODUCT GRID - FIXED CARDS
        ======================= */}
        <Box
          ref={gridRef}
          sx={{
            width: '100%',
          }}
        >

        </Box>

        {/* =======================
           IMAGE GRID SECTION - ADDED FROM PREVIOUS CODE
        ======================= */}
        <Box
          sx={{
            width: '100%',
            mt: { xs: 2, md: 1 }
          }}
        >
          <Box
            sx={{
              display: 'grid',
              gap: 2,
              gridTemplateColumns: {
                xs: '1fr',
                md: 'repeat(3, 1fr)',
              },
              gridTemplateRows: {
                xs: 'repeat(5, minmax(200px, 1fr))',
                md: 'repeat(3, minmax(250px, 1fr))',
              },
              gridTemplateAreas: {
                xs: `
                  "a"
                  "b"
                  "c"
                  "d"
                  "e"
                `,
                md: `
                  "a c e"
                  "b c e"
                  "b d e"
                `,
              },
            }}
          >
            {gridItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={isGridInView ? { 
                  opacity: 1, 
                  y: 0, 
                  scale: 1 
                } : { 
                  opacity: 0, 
                  y: 30, 
                  scale: 0.95 
                }}
                transition={{ 
                  duration: 0.6, 
                  delay: (index + gridItems.length) * 0.1,
                  ease: "easeOut"
                }}
                style={{
                  gridArea: item.id,
                  height: '100%'
                }}
              >
                <Box
                  component={motion.div}
                  whileHover={{ 
                    scale: 1.02,
                    boxShadow: `0 30px 80px ${alpha(colors.gold, 0.3)}`
                  }}
                  transition={{ duration: 0.4 }}
                  sx={{
                    position: 'relative',
                    height: '100%',
                    borderRadius: 3,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    backgroundImage: `url(${item.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    boxShadow: `
                      0 20px 60px ${alpha(colors.black, 0.8)},
                      0 5px 15px ${alpha(colors.black, 0.4)},
                      inset 0 0 0 1px ${alpha(colors.gold, 0.1)}
                    `,
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      inset: 0,
                      background: `
                        linear-gradient(
                          180deg,
                          rgba(0,0,0,0.1) 0%,
                          rgba(0,0,0,0.9) 100%
                        )
                      `,
                      transition: '0.4s',
                    },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      inset: 0,
                      background: colors.gradientGold,
                      opacity: 0,
                      transition: '0.4s',
                      mixBlendMode: 'overlay',
                    },
                    '&:hover::before': {
                      background: `
                        linear-gradient(
                          180deg,
                          rgba(0,0,0,0.05) 0%,
                          rgba(0,0,0,0.95) 100%
                        )
                      `,
                    },
                    '&:hover::after': {
                      opacity: 0.1,
                    },
                  }}
                >
                  {/* Tag Badge */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 16,
                      left: 16,
                      zIndex: 3,
                    }}
                  >
                    <Chip
                      label={item.tag}
                      size="small"
                      sx={{
                        background: alpha(colors.gold, 0.9),
                        color: colors.black,
                        fontWeight: 700,
                        fontSize: '0.7rem',
                        backdropFilter: 'blur(10px)',
                      }}
                    />
                  </Box>

                  {/* Gradient Overlay */}
                  <Box
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '60%',
                      background: `linear-gradient(180deg, transparent 0%, ${alpha(colors.black, 0.9)} 100%)`,
                      zIndex: 2,
                    }}
                  />

                  {/* CENTER CONTENT */}
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      zIndex: 3,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column',
                      textAlign: 'center',
                      px: 2,
                    }}
                  >
                    <Typography
                      component={motion.div}
                      whileHover={{ scale: 1.05 }}
                      sx={{
                        fontSize: { xs: '1.5rem', md: '1.8rem' },
                        fontWeight: 900,
                        color: colors.white,
                        mb: 3,
                        letterSpacing: 2,
                        textShadow: `0 2px 10px ${alpha(colors.black, 0.8)}`,
                      }}
                    >
                      {item.title}
                    </Typography>

                    <Button
                      component={motion.button}
                      whileHover={{ 
                        scale: 1.1,
                        boxShadow: `0 15px 40px ${alpha(colors.gold, 0.5)}`
                      }}
                      whileTap={{ scale: 0.95 }}
                      sx={{
                        background: colors.gradientGold,
                        color: colors.black,
                        fontWeight: 800,
                        px: 3,
                        py: 1,
                        borderRadius: 2,
                        fontSize: '0.8rem',
                        minWidth: '120px',
                        boxShadow: `0 10px 30px ${alpha(colors.gold, 0.4)}`,
                        '&:hover': {
                          background: colors.gradientGold,
                        },
                      }}
                      onClick={() => window.location.href = item.link}
                    >
                      Buy Now
                    </Button>
                  </Box>

                  {/* Shine Effect */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      left: '-100%',
                      width: '100%',
                      height: '100%',
                      background: `linear-gradient(90deg, transparent, ${alpha(colors.white, 0.2)}, transparent)`,
                      zIndex: 2,
                      transition: '0.6s',
                    }}
                    className="shine-effect"
                  />
                </Box>
              </motion.div>
            ))}
          </Box>

          {/* View All Button */}
          <Box
            sx={{
              textAlign: 'center',
              mt: 3,
              mb: 3,
            }}
          >
            <Button
              component={motion.button}
              whileHover={{ 
                scale: 1.05,
                boxShadow: `0 20px 50px ${alpha(colors.gold, 0.4)}`
              }}
              whileTap={{ scale: 0.95 }}
              variant="outlined"
              endIcon={<ArrowForward />}
              sx={{
                borderColor: colors.gold,
                color: colors.black,
                px: 5,
                py: 1.5,
                borderRadius: 2,
                fontSize: '1rem',
                fontWeight: 600,
                background: colors.gradientGold,
                borderWidth: 2,
                '&:hover': {
                  borderColor: colors.gold,
                  background: colors.gradientGold,
                  borderWidth: 2,
                },
              }}
            >
              Voir toutes les collections
            </Button>
          </Box>
        </Box>
      </Container>

      {/* Size Guide Modal */}
      <SizeGuideModal open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />
    </Box>
  );
}