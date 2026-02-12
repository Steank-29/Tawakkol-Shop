import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Chip,
  IconButton,
  Fade,
  useTheme,
  useMediaQuery,
  alpha,
  Stack
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  VolumeUp,
  VolumeOff,
  ShoppingBag,
  Diamond,
  ArrowForward,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import HomeV from '../../assets/Home_video.mp4';
import casual from '../../assets/slider/casual.jpg';
import official from '../../assets/slider/official.jpg';
import sport from '../../assets/slider/sport.jpg';
import religious from '../../assets/slider/religious.jpg';

// === PALETTE DE COULEURS PREMIUM ===
const premiumColors = {
  noir: '#0a0a0a',
  gold: '#d4af37',
  goldLight: '#f4e4a6',
  goldDark: '#b8941f',
  charcoal: '#1a1a1a',
  white: '#ffffff',
  premiumGradient: 'linear-gradient(135deg, #d4af37 0%, #f9d423 50%, #d4af37 100%)',
  darkGradient: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
};

const Home = () => {
  const [lectureEnCours, setLectureEnCours] = useState(true);
  const [sonActif, setSonActif] = useState(false);
  const videoRef = useRef(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Images for carousel
  const carouselImages = [
    { src: casual, title: 'Style Décontracté', subtitle: 'Élégance au quotidien' },
    { src: official, title: 'Tenue Officielle', subtitle: 'Sophistication et prestige' },
    { src: sport, title: 'Sport & Performance', subtitle: 'Performance et style' },
    { src: religious, title: 'Spiritualité', subtitle: 'Élégance sacrée' }
  ];

  // Carousel configuration
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 3
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1
    }
  };

  // Contrôle de la vidéo
  useEffect(() => {
    if (videoRef.current) {
      if (lectureEnCours) {
        videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
    }
  }, [lectureEnCours]);

  const basculerLecture = () => setLectureEnCours(!lectureEnCours);
  const basculerSon = () => setSonActif(!sonActif);

  const faireDefilerVers = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({
      behavior: 'smooth'
    });
  };

  return (
    <Box sx={{ width: '99vw', background: premiumColors.darkGradient }}>
      {/* === CAROUSEL SECTION === */}


      {/* === HÉRO AVEC VIDÉO PLEINE LARGEUR === */}
      <Box sx={{ 
        position: 'relative', 
        width: '99.5vw', 
        height: '90vh',
        left: '50%', 
        right: '50%', 
        marginLeft: '-50vw', 
        marginRight: '-50vw' 
      }}>
        {/* Vidéo de fond */}
        <video
          ref={videoRef}
          muted={!sonActif}
          loop
          playsInline
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1
          }}
        >
          <source src={HomeV} type="video/mp4" />
          Votre navigateur ne supporte pas la lecture vidéo.
        </video>

        {/* Superposition de la vidéo */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `linear-gradient(45deg, ${premiumColors.noir}DD 0%, ${premiumColors.charcoal}99 50%, ${premiumColors.noir}DD 100%)`,
          zIndex: 2
        }} />

        {/* Contenu principal */}
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 3, height: '100%', display: 'flex', alignItems: 'center' }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} lg={6}>
              <Fade in timeout={1200}>
                <Box>
                  <Chip
                    icon={<Diamond sx={{ fontSize: 18 }} />}
                    label="Marketplace de Luxe"
                    sx={{
                      background: premiumColors.premiumGradient,
                      color: premiumColors.noir,
                      fontWeight: 800,
                      fontSize: '0.85rem',
                      fontFamily: "'Playfair Display', serif",
                      mb: 1,
                      px: 3,
                      py: 1.5,
                      ml: 2,
                      boxShadow: `0 8px 25px ${premiumColors.gold}30`
                    }}
                  />
                  
                  <Typography
                    variant="h1"
                    sx={{
                      fontFamily: "'Playfair Display', serif",
                      fontWeight: 900,
                      fontSize: { xs: '2.8rem', sm: '4rem', md: '5.5rem', lg: '6.5rem' },
                      background: premiumColors.premiumGradient,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      color: 'transparent',
                      lineHeight: 1.05,
                      mb: 1,
                      letterSpacing: { xs: '-1px', lg: '-3px' },
                      textShadow: `0 5px 15px ${premiumColors.gold}20`,
                      ml: 2,
                    }}
                  >
                    L'Excellence
                    <br />
                    <Box component="span" sx={{ color: premiumColors.white, textShadow: `0 5px 15px ${premiumColors.gold}30` }}>
                      Redéfinie
                    </Box>
                  </Typography>

                  <Typography
                    variant="h4"
                    sx={{
                      color: premiumColors.goldLight,
                      fontFamily: "'Playfair Display', serif",
                      fontSize: { xs: '1.2rem', lg: '1.6rem' },
                      mb: 2,
                      maxWidth: '600px',
                      lineHeight: 1.5,
                      opacity: 0.95,
                      ml: 2,
                    }}
                  >
                    Découvrez une collection exclusive de produits de luxe soigneusement sélectionnés par des artisans d'exception.
                  </Typography>

                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} sx={{ mb: 2, ml: 2 }}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => faireDefilerVers('produits')}
                      startIcon={<ShoppingBag />}
                      endIcon={<ArrowForward />}
                      sx={{
                        background: premiumColors.premiumGradient,
                        color: premiumColors.noir,
                        py: 2.5,
                        px: 5,
                        borderRadius: 3,
                        fontFamily: "'Playfair Display', serif",
                        fontWeight: 800,
                        fontSize: '1.1rem',
                        textTransform: 'none',
                        boxShadow: `0 15px 40px ${premiumColors.gold}40`,
                        minWidth: { xs: '100%', sm: 'auto' },
                        '&:hover': {
                          background: `linear-gradient(45deg, ${premiumColors.goldLight}, ${premiumColors.gold})`,
                          transform: 'translateY(-3px)',
                          boxShadow: `0 25px 60px ${premiumColors.gold}50`
                        },
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                    >
                      Découvrir la Collection
                    </Button>

                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => faireDefilerVers('avantages')}
                      sx={{
                        border: `2px solid ${premiumColors.gold}`,
                        color: premiumColors.gold,
                        py: 2.5,
                        px: 4,
                        borderRadius: 3,
                        fontFamily: "'Playfair Display', serif",
                        fontWeight: 800,
                        fontSize: '1.1rem',
                        textTransform: 'none',
                        background: alpha(premiumColors.gold, 0.08),
                        minWidth: { xs: '100%', sm: 'auto' },
                        '&:hover': {
                          background: alpha(premiumColors.gold, 0.15),
                          border: `2px solid ${premiumColors.goldLight}`,
                          color: premiumColors.goldLight,
                          transform: 'translateY(-3px)'
                        },
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                    >
                      En Savoir Plus
                    </Button>
                  </Stack>

                  {/* Statistiques */}
                  <Stack direction="row" spacing={4} sx={{ opacity: 0.9, ml: 2 }}>
                    {[
                      { nombre: "10K+", label: "Clients Satisfaits" },
                      { nombre: "500+", label: "Marques Premium" },
                      { nombre: "50+", label: "Pays Desservis" }
                    ].map((stat, index) => (
                      <Box key={index}>
                        <Typography sx={{ 
                          color: premiumColors.gold, 
                          fontSize: '1.4rem', 
                          fontWeight: 800,
                          fontFamily: "'Fjalla One', sans-serif"
                        }}>
                          {stat.nombre}
                        </Typography>
                        <Typography sx={{ 
                          color: premiumColors.goldLight, 
                          fontSize: '0.9rem',
                          fontFamily: "'Fjalla One', sans-serif"
                        }}>
                          {stat.label}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>
                </Box>
              </Fade>
            </Grid>
          </Grid>
        </Container>

        {/* Contrôles vidéo */}
        <Box sx={{
          position: 'absolute',
          bottom: 20,
          right: 40,
          zIndex: 4,
          display: 'flex',
          gap: 2
        }}>
          <IconButton
            onClick={basculerLecture}
            sx={{
              background: alpha(premiumColors.noir, 0.7),
              color: premiumColors.gold,
              backdropFilter: 'blur(20px)',
              border: `1px solid ${premiumColors.gold}30`,
              width: 56,
              height: 56,
              '&:hover': {
                background: alpha(premiumColors.noir, 0.9),
                transform: 'scale(1.1)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            {lectureEnCours ? <Pause /> : <PlayArrow />}
          </IconButton>

          <IconButton
            onClick={basculerSon}
            sx={{
              background: alpha(premiumColors.noir, 0.7),
              color: premiumColors.gold,
              backdropFilter: 'blur(20px)',
              border: `1px solid ${premiumColors.gold}30`,
              width: 56,
              height: 56,
              '&:hover': {
                background: alpha(premiumColors.noir, 0.9),
                transform: 'scale(1.1)'
              },
              transition: 'all 0.3s ease'
            }}
          >
            {sonActif ? <VolumeUp /> : <VolumeOff />}
          </IconButton>
        </Box>
      </Box>

            <Box sx={{ 
        position: 'relative', 
        width: '99.5vw',
        left: '50%', 
        right: '50%', 
        marginLeft: '-50vw', 
        marginRight: '-50vw',
        py: 8,
        background: `linear-gradient(180deg, ${premiumColors.charcoal} 0%, ${premiumColors.noir} 100%)`
      }}>
        <Container maxWidth="xl">
          {/* Animated Title */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Typography
              variant="h2"
              sx={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 700,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                background: premiumColors.premiumGradient,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                textAlign: 'center',
                mb: 2,
                textShadow: `0 5px 15px ${premiumColors.gold}20`
              }}
            >
              Collections Exclusives
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Typography
              variant="h6"
              sx={{
                color: premiumColors.goldLight,
                textAlign: 'center',
                mb: 6,
                maxWidth: '600px',
                margin: '0 auto',
                fontSize: { xs: '1rem', md: '1.2rem' },
                opacity: 0.9
              }}
            >
              Découvrez nos univers soigneusement sélectionnés pour chaque occasion
            </Typography>
          </motion.div>

          {/* Carousel */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <Carousel
              responsive={responsive}
              infinite={true}
              autoPlay={true}
              autoPlaySpeed={3000}
              keyBoardControl={true}
              customTransition="transform 600ms ease-in-out"
              transitionDuration={600}
              containerClass="carousel-container"
              itemClass="carousel-item-padding-40-px"
              removeArrowOnDeviceType={['mobile']}
              dotListClass="custom-dot-list-style"
              showDots={true}
              arrows={!isMobile}
              renderDotsOutside={true}
              swipeable={true}
              draggable={true}
            >
              {carouselImages.map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Box
                    sx={{
                      position: 'relative',
                      height: { xs: 300, md: 400 },
                      margin: 2,
                      borderRadius: 4,
                      overflow: 'hidden',
                      boxShadow: `0 20px 40px ${premiumColors.gold}20`,
                      border: `1px solid ${premiumColors.gold}30`,
                      '&:hover': {
                        boxShadow: `0 25px 50px ${premiumColors.gold}30`,
                        '& .carousel-overlay': {
                          opacity: 1,
                          background: `linear-gradient(0deg, ${premiumColors.noir}CC 0%, ${premiumColors.noir}00 100%)`
                        },
                        '& .carousel-content': {
                          transform: 'translateY(0)',
                          opacity: 1
                        }
                      },
                      transition: 'all 0.4s ease-in-out'
                    }}
                  >
                    <img
                      src={item.src}
                      alt={item.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block'
                      }}
                    />
                    
                    {/* Overlay */}
                    <Box 
                      className="carousel-overlay"
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: `linear-gradient(0deg, ${premiumColors.noir}99 0%, ${premiumColors.noir}00 50%)`,
                        opacity: 0.7,
                        transition: 'all 0.4s ease-in-out'
                      }}
                    />
                    
                    {/* Content */}
                    <Box 
                      className="carousel-content"
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        padding: 4,
                        transform: 'translateY(20px)',
                        opacity: 0.8,
                        transition: 'all 0.4s ease-in-out'
                      }}
                    >
                      <Typography
                        variant="h5"
                        sx={{
                          color: premiumColors.white,
                          fontFamily: "'Playfair Display', serif",
                          fontWeight: 700,
                          fontSize: { xs: '1.5rem', md: '1.8rem' },
                          mb: 1
                        }}
                      >
                        {item.title}
                      </Typography>
                      <Typography
                        variant="body1"
                        sx={{
                          color: premiumColors.goldLight,
                          fontFamily: "'Playfair Display', serif",
                          fontSize: { xs: '0.9rem', md: '1rem' },
                          opacity: 0.9
                        }}
                      >
                        {item.subtitle}
                      </Typography>
                    </Box>
                  </Box>
                </motion.div>
              ))}
            </Carousel>
          </motion.div>
        </Container>
        
      </Box>
            {/* === WINTER LUXURY COLLECTION === */}
      <Box 
        id="produits"
        sx={{ 
          position: 'relative', 
          width: '99.5vw',
          left: '50%', 
          right: '50%', 
          marginLeft: '-50vw', 
          marginRight: '-50vw',
          py: 12,
          background: `linear-gradient(180deg, #0a0a0a 0%, #121212 50%, #0a0a0a 100%)`,
          overflow: 'hidden'
        }}
      >
        {/* Animated Winter Background Elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.05 }}
          transition={{ duration: 2, delay: 0.5 }}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}
        >
          <Box sx={{
            position: 'absolute',
            top: '10%',
            left: '15%',
            width: 100,
            height: 100,
            background: premiumColors.goldLight,
            borderRadius: '50%',
            filter: 'blur(40px)',
            opacity: 0.3
          }} />
          <Box sx={{
            position: 'absolute',
            bottom: '20%',
            right: '10%',
            width: 150,
            height: 150,
            background: premiumColors.gold,
            borderRadius: '50%',
            filter: 'blur(50px)',
            opacity: 0.2
          }} />
          <Box sx={{
            position: 'absolute',
            top: '40%',
            left: '70%',
            width: 80,
            height: 80,
            background: '#e6f7ff',
            borderRadius: '50%',
            filter: 'blur(30px)',
            opacity: 0.15
          }} />
        </motion.div>
        
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 2 }}>
          {/* Section Header with Winter Theme */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Box sx={{ textAlign: 'center', mb: 8 }}>
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              >
                <Chip
                  icon={<Diamond sx={{ fontSize: 20 }} />}
                  label="Collection Hivernale Exclusive"
                  sx={{
                    background: `linear-gradient(135deg, #d4af37 0%, #e6f7ff 50%, #d4af37 100%)`,
                    color: premiumColors.noir,
                    fontWeight: 900,
                    fontSize: '0.9rem',
                    fontFamily: "'Playfair Display', serif",
                    mb: 3,
                    px: 4,
                    py: 1.5,
                    boxShadow: `0 10px 30px ${premiumColors.gold}40`,
                    border: `1px solid rgba(230, 247, 255, 0.3)`
                  }}
                />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <Typography
                  variant="h2"
                  sx={{
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 900,
                    fontSize: { xs: '2.8rem', md: '4rem' },
                    background: `linear-gradient(135deg, #d4af37 30%, #e6f7ff 70%, #d4af37 100%)`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    lineHeight: 1.1,
                    mb: 2,
                    letterSpacing: '-1px'
                  }}
                >
                  Élégance Hivernale
                </Typography>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: '#e6f7ff',
                    maxWidth: '700px',
                    margin: '0 auto',
                    fontSize: { xs: '1rem', md: '1.2rem' },
                    opacity: 0.9,
                    mb: 6,
                    fontFamily: "'Playfair Display', serif"
                  }}
                >
                  Découvrez notre collection exclusive conçue pour l'hiver, 
                  alliant chaleur et sophistication dans chaque pièce.
                </Typography>
              </motion.div>
            </Box>
          </motion.div>

          {/* Winter Products Grid - 4 Cards Exactly */}
          <Grid container spacing={4} justifyContent="center">
            {[
              {
                id: 1,
                name: 'SPORT PANTS',
                category: 'Haute Couture',
                price: '60 TND',
                oldPrice: '75 TND',
                discount: '-29%',
                rating: 4.9,
                reviews: 89,
                imageColor: '#1a1a1a',
                badge: 'Hiver 2024',
                winterTag: 'Chaleur Extrême'
              },
              {
                id: 2,
                name: 'T-SHIRT SPORT',
                category: 'Montres de Luxe',
                price: '40 TND',
                oldPrice: '',
                discount: '',
                rating: 5.0,
                reviews: 42,
                imageColor: '#0f0f0f',
                badge: 'Édition Limitée',
                winterTag: 'Résistant au Gel'
              },
              {
                id: 3,
                name: "SHORT COVER's KNEE",
                category: 'Bijoux d\'Exception',
                price: '50 TND',
                oldPrice: '70 TND',
                discount: '-16%',
                rating: 4.8,
                reviews: 156,
                imageColor: '#151515',
                badge: 'Best Seller',
                winterTag: 'Inspiré des Glaciers'
              },
              {
                id: 4,
                name: 'HOODIE TAWAKKOL SPORT',
                category: 'Chaussures Premium',
                price: '50 TND',
                oldPrice: '',
                discount: '',
                rating: 4.7,
                reviews: 73,
                imageColor: '#1a1a1a',
                badge: 'Nouvelle Collection',
                winterTag: 'Confort Arctique'
              }
            ].map((product, index) => (
              <Grid item xs={12} sm={6} md={3} key={product.id} sx={{ display: 'flex' }}>
                <motion.div
                  initial={{ opacity: 0, y: 60, scale: 0.9 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.6, 
                    delay: index * 0.15,
                    type: "spring",
                    stiffness: 100
                  }}
                  whileHover={{ 
                    y: -15,
                    transition: { type: "spring", stiffness: 300 }
                  }}
                  style={{ width: '100%' }}
                >
                  <Box
                    sx={{
                      position: 'relative',
                      background: `linear-gradient(145deg, #121212 0%, #0a0a0a 100%)`,
                      borderRadius: 3,
                      overflow: 'hidden',
                      border: `1px solid ${premiumColors.gold}20`,
                      boxShadow: `0 15px 35px rgba(212, 175, 55, 0.1)`,
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      height: '480px',
                      display: 'flex',
                      flexDirection: 'column',
                      width: '100%',
                      '&:hover': {
                        boxShadow: `0 25px 50px rgba(212, 175, 55, 0.2)`,
                        border: `1px solid ${premiumColors.gold}50`,
                        '& .product-image': {
                          transform: 'scale(1.08)'
                        },
                        '& .winter-tag': {
                          opacity: 1,
                          transform: 'translateY(0)'
                        }
                      }
                    }}
                  >
                    {/* Winter Badge */}
                    <motion.div
                      initial={{ rotate: -45, scale: 0 }}
                      whileInView={{ rotate: 0, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ type: "spring", delay: index * 0.2 + 0.5 }}
                    >
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 12,
                          left: 12,
                          background: `linear-gradient(135deg, #d4af37 0%, #e6f7ff 100%)`,
                          color: premiumColors.noir,
                          py: 0.5,
                          px: 1.5,
                          borderRadius: 1,
                          fontSize: '0.65rem',
                          fontWeight: 900,
                          fontFamily: "'Playfair Display', serif",
                          zIndex: 2,
                          boxShadow: `0 5px 15px rgba(212, 175, 55, 0.3)`
                        }}
                      >
                        {product.badge}
                      </Box>
                    </motion.div>

                    {/* Winter Tag (Shows on Hover) */}
                    <Box
                      className="winter-tag"
                      sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        background: 'rgba(230, 247, 255, 0.1)',
                        backdropFilter: 'blur(10px)',
                        color: '#e6f7ff',
                        py: 0.5,
                        px: 1.5,
                        borderRadius: 1,
                        fontSize: '0.65rem',
                        fontWeight: 700,
                        fontFamily: "'Playfair Display', serif",
                        zIndex: 2,
                        opacity: 0,
                        transform: 'translateY(-10px)',
                        transition: 'all 0.3s ease',
                        border: `1px solid rgba(230, 247, 255, 0.2)`
                      }}
                    >
                      {product.winterTag}
                    </Box>

                    {/* Product Image Area with Winter Theme */}
                    <Box sx={{ 
                      position: 'relative', 
                      height: 240,
                      overflow: 'hidden',
                      background: `linear-gradient(135deg, ${product.imageColor} 0%, #1a2a3a 100%)`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {/* Animated Winter Pattern Overlay */}
                      <Box
                        sx={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          background: `radial-gradient(circle at 20% 50%, rgba(230, 247, 255, 0.05) 0%, transparent 50%),
                                      radial-gradient(circle at 80% 20%, rgba(212, 175, 55, 0.05) 0%, transparent 50%)`,
                          zIndex: 1
                        }}
                      />
                      
                      {/* Product Image Container */}
                      <Box
                        className="product-image"
                        sx={{
                          width: '75%',
                          height: '75%',
                          background: `linear-gradient(45deg, rgba(212, 175, 55, 0.1), rgba(230, 247, 255, 0.05))`,
                          borderRadius: 2,
                          border: `2px solid rgba(212, 175, 55, 0.2)`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'transform 0.6s ease',
                          zIndex: 2,
                          position: 'relative',
                          overflow: 'hidden'
                        }}
                      >
                        {/* Snowflake Effect */}
                        <Box
                          sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            background: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M50 10L60 40L90 50L60 60L50 90L40 60L10 50L40 40L50 10Z' fill='rgba(230, 247, 255, 0.05)'/%3E%3C/svg%3E")`,
                            backgroundSize: '50px 50px',
                            opacity: 0.3
                          }}
                        />
                        
                        <Diamond sx={{ 
                          fontSize: 50, 
                          color: 'rgba(212, 175, 55, 0.5)',
                          filter: 'drop-shadow(0 0 10px rgba(212, 175, 55, 0.3))'
                        }} />
                      </Box>

                      {/* Small Add to Cart Button */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        whileHover={{ opacity: 1, scale: 1 }}
                        style={{
                          position: 'absolute',
                          bottom: 16,
                          right: 16,
                          zIndex: 3
                        }}
                      >
                        <IconButton
                          sx={{
                            background: `linear-gradient(135deg, #d4af37 0%, #e6f7ff 100%)`,
                            color: premiumColors.noir,
                            width: 40,
                            height: 40,
                            boxShadow: `0 8px 20px rgba(212, 175, 55, 0.4)`,
                            '&:hover': {
                              background: `linear-gradient(135deg, #e6f7ff 0%, #d4af37 100%)`,
                              transform: 'rotate(90deg) scale(1.1)'
                            },
                            transition: 'all 0.3s ease'
                          }}
                        >
                          <ShoppingBag sx={{ fontSize: 18 }} />
                        </IconButton>
                      </motion.div>
                    </Box>

                    {/* Product Info */}
                    <Box sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                      <Typography
                        sx={{
                          color: '#e6f7ff',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          letterSpacing: '1px',
                          mb: 1,
                          opacity: 0.7,
                          fontFamily: "'Playfair Display', serif"
                        }}
                      >
                        {product.category}
                      </Typography>
                      
                      <Typography
                        variant="h6"
                        sx={{
                          color: premiumColors.white,
                          fontFamily: "'Playfair Display', serif",
                          fontWeight: 700,
                          fontSize: '1.2rem',
                          mb: 2,
                          lineHeight: 1.3,
                          minHeight: '3.2rem'
                        }}
                      >
                        {product.name}
                      </Typography>

                      {/* Rating */}
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, gap: 0.5 }}>
                        <Box sx={{ display: 'flex' }}>
                          {[...Array(5)].map((_, i) => (
                            <motion.span
                              key={i}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: index * 0.1 + i * 0.1 }}
                            >
                              <Box
                                component="span"
                                sx={{
                                  color: i < Math.floor(product.rating) ? premiumColors.gold : 'rgba(212, 175, 55, 0.3)',
                                  fontSize: '0.9rem',
                                  textShadow: i < Math.floor(product.rating) ? '0 0 8px rgba(212, 175, 55, 0.5)' : 'none'
                                }}
                              >
                                ★
                              </Box>
                            </motion.span>
                          ))}
                        </Box>
                        <Typography sx={{ 
                          color: '#e6f7ff', 
                          fontSize: '0.75rem',
                          ml: 1,
                          opacity: 0.8
                        }}>
                          {product.rating} ({product.reviews})
                        </Typography>
                      </Box>

                      {/* Price & Action */}
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        mt: 'auto',
                        pt: 2,
                        borderTop: `1px solid rgba(212, 175, 55, 0.1)`
                      }}>
                        <Box>
                          {product.discount && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring" }}
                            >
                              <Typography
                                sx={{
                                  background: '#ff4757',
                                  color: premiumColors.white,
                                  fontSize: '0.7rem',
                                  fontWeight: 900,
                                  py: 0.3,
                                  px: 1,
                                  borderRadius: 1,
                                  display: 'inline-block',
                                  mb: 0.5
                                }}
                              >
                                {product.discount}
                              </Typography>
                            </motion.div>
                          )}
                          
                          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                            <Typography
                              sx={{
                                color: premiumColors.white,
                                fontFamily: "'Playfair Display', serif",
                                fontWeight: 900,
                                fontSize: '1.5rem',
                                lineHeight: 1
                              }}
                            >
                              {product.price}
                            </Typography>
                            {product.oldPrice && (
                              <Typography
                                sx={{
                                  color: 'rgba(255, 255, 255, 0.4)',
                                  fontSize: '0.9rem',
                                  textDecoration: 'line-through'
                                }}
                              >
                                {product.oldPrice}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                        
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <IconButton
                            sx={{
                              background: 'rgba(212, 175, 55, 0.1)',
                              color: premiumColors.gold,
                              border: `1px solid rgba(212, 175, 55, 0.3)`,
                              width: 40,
                              height: 40,
                              '&:hover': {
                                background: 'rgba(212, 175, 55, 0.2)',
                                border: `1px solid rgba(212, 175, 55, 0.5)`
                              },
                              transition: 'all 0.3s ease'
                            }}
                          >
                            <ArrowForward sx={{ fontSize: 18 }} />
                          </IconButton>
                        </motion.div>
                      </Box>
                    </Box>
                  </Box>
                </motion.div>
              </Grid>
            ))}
          </Grid>

          {/* Premium Service Banner - Centered and Enhanced */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <Box
              sx={{
                background: `linear-gradient(135deg, rgba(10, 10, 10, 0.8) 0%, rgba(26, 26, 26, 0.9) 100%)`,
                borderRadius: 3,
                border: `1px solid rgba(212, 175, 55, 0.2)`,
                p: { xs: 4, md: 6 },
                mt: 10,
                position: 'relative',
                overflow: 'hidden',
                backdropFilter: 'blur(10px)',
                maxWidth: '900px',
                margin: '20px auto',
                boxShadow: `0 20px 40px rgba(0, 0, 0, 0.3)`
              }}
            >
              {/* Animated Border */}
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '1px',
                  background: `linear-gradient(90deg, transparent, #d4af37, transparent)`,
                  animation: 'shimmer 3s infinite'
                }}
              />
              
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.8 }}
              >
                <Typography
                  sx={{
                    color: '#e6f7ff',
                    textAlign: 'center',
                    fontSize: { xs: '1.8rem', md: '2.2rem' },
                    fontWeight: 900,
                    fontFamily: "'Playfair Display', serif",
                    mb: 1,
                    background: `linear-gradient(135deg, #d4af37 30%, #e6f7ff 70%, #d4af37 100%)`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent'
                  }}
                >
                  Service Premium 24/7
                </Typography>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 1 }}
              >
                <Typography
                  sx={{
                    color: 'rgba(230, 247, 255, 0.8)',
                    textAlign: 'center',
                    fontSize: { xs: '1rem', md: '1.1rem' },
                    mb: 5,
                    maxWidth: '600px',
                    margin: '0 auto',
                    fontFamily: "'Playfair Display', serif"
                  }}
                >
                  Notre engagement pour votre expérience hivernale de luxe
                </Typography>
              </motion.div>

              <Grid container spacing={3} justifyContent="center">
                {[
                  { 
                    icon: '⏰', 
                    value: 'Assistance 24h/24', 
                    label: 'Service client disponible en permanence',
                    color: '#d4af37'
                  },
                  { 
                    icon: '🚚', 
                    value: 'Livraison Express', 
                    label: 'Délai garanti sous 48h',
                    color: '#e6f7ff'
                  },
                  { 
                    icon: '🔄', 
                    value: 'Retour Facile', 
                    label: '30 jours pour changer d\'avis',
                    color: '#d4af37'
                  },
                  { 
                    icon: '🎁', 
                    value: 'Emballage Luxe', 
                    label: 'Présentation hivernale exclusive',
                    color: '#e6f7ff'
                  }
                ].map((service, index) => (
                  <Grid item xs={12} sm={6} md={3} key={index}>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 + 0.8 }}
                      whileHover={{ y: -5 }}
                    >
                      <Box sx={{ 
                        textAlign: 'center',
                        p: 3,
                        borderRadius: 2,
                        background: 'rgba(212, 175, 55, 0.05)',
                        border: '1px solid rgba(212, 175, 55, 0.1)',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mt: 2
                      }}>
                        <Box
                          sx={{
                            fontSize: '2.5rem',
                            mb: 2,
                            color: service.color,
                            filter: 'drop-shadow(0 0 8px rgba(212, 175, 55, 0.3))'
                          }}
                        >
                          {service.icon}
                        </Box>
                        <Typography
                          sx={{
                            color: service.color,
                            fontSize: '1.2rem',
                            fontWeight: 900,
                            fontFamily: "'Playfair Display', serif",
                            mb: 1
                          }}
                        >
                          {service.value}
                        </Typography>
                        <Typography
                          sx={{
                            color: 'rgba(230, 247, 255, 0.7)',
                            fontSize: '0.85rem',
                            lineHeight: 1.4
                          }}
                        >
                          {service.label}
                        </Typography>
                      </Box>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </motion.div>

          {/* Winter Collection CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            <Box sx={{ textAlign: 'center', mt: 8 }}>
              <Button
                variant="contained"
                size="large"
                endIcon={<ArrowForward />}
                onClick={() => faireDefilerVers('produits')}
                sx={{
                  background: `linear-gradient(135deg, #d4af37 0%, #e6f7ff 100%)`,
                  color: premiumColors.noir,
                  py: 2,
                  px: 6,
                  borderRadius: 2,
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 900,
                  fontSize: '1rem',
                  textTransform: 'none',
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: `0 15px 35px rgba(212, 175, 55, 0.3)`,
                  '&:hover': {
                    background: `linear-gradient(135deg, #e6f7ff 0%, #d4af37 100%)`,
                    transform: 'translateY(-3px)',
                    boxShadow: `0 20px 40px rgba(212, 175, 55, 0.4)`,
                    '&::before': {
                      transform: 'translateX(100%)'
                    }
                  },
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: `linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)`,
                    transform: 'translateX(-100%)',
                    transition: 'transform 0.6s ease'
                  },
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                Explorer la Collection Hivernale Complète
              </Button>
            </Box>
          </motion.div>
        </Container>
      </Box>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        .carousel-container {
          position: relative;
        }
        
        .carousel-item-padding-40-px {
          padding: 10px;
        }
        
        .custom-dot-list-style {
          margin-top: 20px;
        }
        
        .react-multi-carousel-dot button {
          border: 2px solid ${premiumColors.gold};
          background: transparent;
          width: 12px;
          height: 12px;
        }
        
        .react-multi-carousel-dot--active button {
          background: ${premiumColors.gold};
        }
        
        .react-multiple-carousel__arrow {
          background: ${premiumColors.gold};
          border: 2px solid ${premiumColors.goldDark};
        }
        
        .react-multiple-carousel__arrow:hover {
          background: ${premiumColors.goldDark};
        }
        
        .react-multiple-carousel__arrow::before {
          color: ${premiumColors.noir};
          font-weight: bold;
        }
      `}</style>
    </Box>
  );
};

export default Home;