import React, { useState, useEffect, useRef } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useScrollTrigger,
  Badge,
  alpha,
  Container,
  Typography,
  Paper,
  Grid,
  Collapse,
  Chip,
} from '@mui/material';

import {
  Menu as MenuIcon,
  ShoppingBagOutlined,
  Facebook,
  Twitter,
  Instagram,
  Close,
  ExpandMore,
  SportsScore,
  Watch,
  Style,
  Spa,
  ChevronRight,
  ChevronLeft,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import tawakkol from '../../assets/tawakkol.png';

// Cart integration
import { useCart } from '../../context/CartContext'; // Adjust path if your folder structure is different
import CartDrawer from './CartDrawer'; // Adjust path according to where CartDrawer.jsx is located

const premiumColors = {
  noir: '#1a1a1a',
  gold: '#d4af37',
  goldLight: '#f4e4a6',
  goldDark: '#b8941f',
  charcoal: '#2d2d2d',
  lightNoir: '#3a3a3a',
  white: '#ffffff',
};

const PremiumAppBar = ({ children, window }) => {
  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    threshold: 50,
  });

  return (
    <AppBar
      position="fixed"
      sx={{
        background: trigger
          ? `linear-gradient(135deg, ${alpha(premiumColors.noir, 0.95)} 0%, ${alpha(premiumColors.charcoal, 0.92)} 100%)`
          : `linear-gradient(135deg, ${premiumColors.noir} 0%, ${premiumColors.charcoal} 100%)`,
        backdropFilter: trigger ? 'blur(25px)' : 'none',
        borderBottom: `1px solid ${alpha(premiumColors.gold, 0.2)}`,
        boxShadow: trigger
          ? `0 12px 40px ${alpha(premiumColors.gold, 0.15)}`
          : `0 6px 25px ${alpha(premiumColors.gold, 0.1)}`,
        color: premiumColors.white,
        transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      }}
    >
      {children}
    </AppBar>
  );
};

const SecondaryNavbar = ({ open, onClose, categories }) => {
  const navigate = useNavigate();

  const handleCategoryClick = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <Collapse
      in={open}
      timeout={200}
      mountOnEnter
      unmountOnExit
    >
      <Box
        sx={{
          position: 'fixed',
          top: 80,
          left: 0,
          right: 0,
          background: `linear-gradient(135deg, ${premiumColors.charcoal} 0%, ${premiumColors.noir} 100%)`,
          borderBottom: `1px solid ${alpha(premiumColors.gold, 0.3)}`,
          boxShadow: `0 8px 32px ${alpha(premiumColors.gold, 0.15)}`,
          zIndex: 1299,
          backdropFilter: 'blur(20px)',
        }}
      >
        <Container maxWidth="xl">
          <Box sx={{ py: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography
                variant="h6"
                sx={{
                  color: premiumColors.gold,
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 600,
                  fontSize: '1.5rem'
                }}
              >
                Nos Collections
              </Typography>
              <Button
                onClick={onClose}
                startIcon={<Close />}
                sx={{
                  color: premiumColors.gold,
                  border: `1px solid ${alpha(premiumColors.gold, 0.3)}`,
                  borderRadius: 2,
                  px: 2,
                  '&:hover': {
                    background: alpha(premiumColors.gold, 0.1),
                    border: `1px solid ${alpha(premiumColors.gold, 0.5)}`,
                  }
                }}
              >
                Fermer
              </Button>
            </Box>

            <Grid container spacing={4} sx={{ width: '100%' }}>
              {categories.map((category) => (
                <Grid item xs={12} sm={6} md={3} key={category.title} sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  flex: 1,
                  minWidth: 0
                }}>
                  <Box sx={{ mb: 2, width: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Box sx={{
                          background: alpha(premiumColors.gold, category.disabled ? 0.05 : 0.1),
                          borderRadius: 1,
                          p: 0.75,
                          mr: 1.5
                        }}>
                          {category.icon}
                        </Box>
                        <Typography
                          variant="subtitle1"
                          sx={{
                            color: category.disabled
                              ? alpha(premiumColors.white, 0.5)
                              : premiumColors.gold,
                            fontWeight: 600,
                            fontSize: '1.4rem',
                            fontFamily: "'Playfair Display', serif",
                            textDecoration: category.disabled ? 'line-through' : 'none',
                          }}
                        >
                          {category.title}
                        </Typography>
                      </Box>
                      {category.disabled && (
                        <Chip
                          label="Coming Soon"
                          size="small"
                          sx={{
                            background: alpha(premiumColors.gold, 0.15),
                            color: premiumColors.goldLight,
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            height: 24,
                            borderRadius: '12px',
                          }}
                        />
                      )}
                    </Box>

                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                      {category.items.map((item) => (
                        <Button
                          key={item.name}
                          onClick={() => !category.disabled && handleCategoryClick(item.path)}
                          disabled={category.disabled}
                          startIcon={<ChevronRight sx={{ fontSize: 16 }} />}
                          sx={{
                            justifyContent: 'flex-start',
                            color: category.disabled
                              ? alpha(premiumColors.white, 0.4)
                              : premiumColors.white,
                            textTransform: 'none',
                            fontSize: '0.9rem',
                            fontWeight: item.featured ? 600 : 400,
                            px: 1.5,
                            py: 1,
                            borderRadius: 1,
                            background: 'transparent',
                            border: '1px solid transparent',
                            transition: 'all 0.3s ease',
                            '&:hover': category.disabled ? {} : {
                              background: alpha(premiumColors.gold, 0.1),
                              color: premiumColors.goldLight,
                              border: `1px solid ${alpha(premiumColors.gold, 0.2)}`,
                              transform: 'translateX(8px)',
                            },
                            '&.Mui-disabled': {
                              color: alpha(premiumColors.white, 0.4),
                            }
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                            <Typography sx={{ flex: 1, textAlign: 'left' }}>
                              {item.name}
                            </Typography>
                            {item.featured && (
                              <Box
                                sx={{
                                  width: 6,
                                  height: 6,
                                  borderRadius: '50%',
                                  background: premiumColors.gold,
                                  ml: 1
                                }}
                              />
                            )}
                          </Box>
                        </Button>
                      ))}
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>

            <Paper
              sx={{
                mt: 3,
                p: 2,
                background: `linear-gradient(45deg, ${alpha(premiumColors.gold, 0.08)} 0%, ${alpha(premiumColors.gold, 0.04)} 100%)`,
                border: `1px solid ${alpha(premiumColors.gold, 0.15)}`,
                borderRadius: 2
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ color: premiumColors.goldLight, fontWeight: 600 }}>
                    Service Personnalisé
                  </Typography>
                  <Typography variant="caption" sx={{ color: alpha(premiumColors.white, 0.8) }}>
                    Conseils experts pour vos sélections
                  </Typography>
                </Box>
                <Button
                  variant="contained"
                  size="small"
                  endIcon={<ChevronRight sx={{ fontSize: 16 }} />}
                  sx={{
                    background: `linear-gradient(45deg, ${premiumColors.gold}, ${premiumColors.goldDark})`,
                    color: premiumColors.noir,
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    textTransform: 'none',
                    px: 2,
                    py: 1,
                    borderRadius: 1,
                    '&:hover': {
                      background: `linear-gradient(45deg, ${premiumColors.goldLight}, ${premiumColors.gold})`,
                      transform: 'translateY(-1px)',
                    }
                  }}
                >
                  Conseiller VIP
                </Button>
              </Box>
            </Paper>
          </Box>
        </Container>
      </Box>
    </Collapse>
  );
};

const MobileCategoriesMenu = ({ open, onClose, categories }) => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    if (category.disabled) return;
    setSelectedCategory(category);
  };

  const handleBackClick = () => {
    setSelectedCategory(null);
  };

  const handleItemClick = (path, disabled) => {
    if (disabled) return;
    navigate(path);
    onClose();
    setSelectedCategory(null);
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `linear-gradient(135deg, ${premiumColors.noir} 0%, ${premiumColors.charcoal} 100%)`,
        zIndex: 1300,
        transform: open ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s ease',
        display: { md: 'none' }
      }}
    >
      <Box sx={{
        p: 2,
        borderBottom: `1px solid ${alpha(premiumColors.gold, 0.2)}`,
        background: `linear-gradient(135deg, ${premiumColors.charcoal} 0%, ${premiumColors.noir} 100%)`
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography
            variant="h6"
            sx={{
              color: premiumColors.gold,
              fontFamily: "'Playfair Display', serif",
              fontWeight: 600
            }}
          >
            {selectedCategory ? selectedCategory.title : 'Catégories'}
          </Typography>
          <IconButton
            onClick={selectedCategory ? handleBackClick : onClose}
            sx={{
              color: premiumColors.gold,
              border: `1px solid ${alpha(premiumColors.gold, 0.3)}`,
            }}
          >
            {selectedCategory ? <ChevronLeft /> : <Close />}
          </IconButton>
        </Box>
      </Box>

      <Box sx={{ p: 2, height: 'calc(100vh - 80px)', overflow: 'auto' }}>
        {!selectedCategory ? (
          <List sx={{ py: 2 }}>
            {categories.map((category) => (
              <ListItem
                key={category.title}
                onClick={() => handleCategoryClick(category)}
                sx={{
                  py: 2.5,
                  borderBottom: `1px solid ${alpha(premiumColors.gold, 0.1)}`,
                  background: category.disabled ? alpha(premiumColors.charcoal, 0.4) : 'transparent',
                  opacity: category.disabled ? 0.6 : 1,
                  cursor: category.disabled ? 'not-allowed' : 'pointer',
                  '&:hover': category.disabled ? {} : {
                    background: alpha(premiumColors.gold, 0.05),
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box sx={{
                      background: alpha(premiumColors.gold, category.disabled ? 0.05 : 0.1),
                      borderRadius: 1,
                      p: 1,
                      mr: 2
                    }}>
                      {category.icon}
                    </Box>
                    <ListItemText
                      primary={category.title}
                      sx={{
                        '& .MuiListItemText-primary': {
                          fontFamily: "'Playfair Display', serif",
                          fontWeight: 500,
                          fontSize: '1.1rem',
                          color: category.disabled
                            ? alpha(premiumColors.white, 0.5)
                            : premiumColors.white,
                          textDecoration: category.disabled ? 'line-through' : 'none',
                        }
                      }}
                    />
                  </Box>
                  {category.disabled ? (
                    <Chip
                      label="Coming Soon"
                      size="small"
                      sx={{
                        background: alpha(premiumColors.gold, 0.2),
                        color: premiumColors.goldLight,
                        fontSize: '0.7rem',
                        height: 22,
                      }}
                    />
                  ) : (
                    <ExpandMore sx={{ color: premiumColors.gold }} />
                  )}
                </Box>
              </ListItem>
            ))}
          </List>
        ) : (
          <List sx={{ py: 2 }}>
            {selectedCategory.items.map((item) => (
              <ListItem
                key={item.name}
                onClick={() => handleItemClick(item.path, selectedCategory.disabled)}
                sx={{
                  py: 2,
                  borderBottom: `1px solid ${alpha(premiumColors.gold, 0.1)}`,
                  cursor: selectedCategory.disabled ? 'not-allowed' : 'pointer',
                  '&:hover': selectedCategory.disabled ? {} : {
                    background: alpha(premiumColors.gold, 0.05),
                  }
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <ChevronRight sx={{ color: premiumColors.gold, mr: 2, fontSize: 20 }} />
                  <ListItemText
                    primary={item.name}
                    sx={{
                      '& .MuiListItemText-primary': {
                        fontFamily: "'Playfair Display', serif",
                        fontWeight: item.featured ? 600 : 400,
                        fontSize: '1rem',
                        color: premiumColors.white,
                      }
                    }}
                  />
                  {item.featured && (
                    <Box
                      sx={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        background: premiumColors.gold,
                        ml: 1
                      }}
                    />
                  )}
                </Box>
              </ListItem>
            ))}
          </List>
        )}
      </Box>
    </Box>
  );
};

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState(null);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const categoriesRef = useRef(null);
  const navbarRef = useRef(null);
  const navigate = useNavigate();

  // Cart integration
  const { cartCount, setIsCartOpen } = useCart();

  const categories = [
    {
      title: 'Sport',
      icon: <SportsScore sx={{ fontSize: 18, color: premiumColors.gold }} />,
      items: [
        { name: 'T-shirt', path: '/sport' },
        { name: 'Workout Hoodie', path: '/sport', featured: true },
        { name: 'Jersey', path: '/sport' },
        { name: 'Long Sleeve Shirt', path: '/sport' },
        { name: 'Cropped Pants', path: '/sport' },
        { name: 'Sleeveless T-Shirt', path: '/sport' },
        { name: 'Sport Pants', path: '/sport' },
      ],
      disabled: false
    },
    {
      title: 'Streetwear',
      icon: <Watch sx={{ fontSize: 18, color: premiumColors.gold }} />,
      items: [
        { name: 'Hoodies', path: '/streetwear' },
        { name: 'Long Sleeve Shirt', path: '/streetwear' },
        { name: 'Zipper Shirt', path: '/streetwear' },
        { name: 'Cargo Pants', path: '/streetwear', featured: true },
        { name: 'Baggy Pants', path: '/streetwear' },
        { name: 'Oversized T-Shirts', path: '/streetwear' },
        { name: 'Normal Pants', path: '/streetwear' },
      ],
      disabled: true
    },
    {
      title: 'Religious Wear',
      icon: <Style sx={{ fontSize: 18, color: premiumColors.gold }} />,
      items: [
        { name: 'Qamiss', path: '/religious', featured: true },
        { name: 'Qachabeeya', path: '/religious' },
        { name: 'Qamiss & Pants', path: '/religious' },
      ],
      disabled: true
    },
    {
      title: 'Casual',
      icon: <Spa sx={{ fontSize: 18, color: premiumColors.gold }} />,
      items: [
        { name: 'Sweater', path: '/casual' },
        { name: 'Jacket', path: '/casual' },
        { name: 'Pants', path: '/casual' },
        { name: 'Coats', path: '/casual', featured: true },
      ],
      disabled: true
    }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoriesOpen &&
        categoriesRef.current &&
        !categoriesRef.current.contains(event.target) &&
        navbarRef.current &&
        !navbarRef.current.contains(event.target)) {
        setCategoriesOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [categoriesOpen]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
    if (categoriesOpen) setCategoriesOpen(false);
    if (mobileCategoriesOpen) setMobileCategoriesOpen(false);
  };

  const handleCategoriesToggle = () => {
    setCategoriesOpen(!categoriesOpen);
  };

  const handleMobileCategoriesToggle = () => {
    setMobileCategoriesOpen(!mobileCategoriesOpen);
  };

  const handleCategoriesClose = () => {
    setCategoriesOpen(false);
  };

  const handleMobileCategoriesClose = () => {
    setMobileCategoriesOpen(false);
  };

  const handleNavLinkClick = (link) => {
    if (link.disabled) return; // Don't do anything if disabled
    if (link.hasMenu) {
      if (window.innerWidth < 960) {
        handleMobileCategoriesToggle();
      } else {
        handleCategoriesToggle();
      }
    } else {
      navigate(link.path);
      setCategoriesOpen(false);
      setMobileOpen(false);
    }
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const navLinks = [
    { name: 'Accueil', path: '/', hasMenu: false, disabled: false },
    { name: 'Catégories', path: '#', hasMenu: true, disabled: false },
    { name: 'Collection', path: '/collection', hasMenu: false, disabled: true, comingSoon: true },
    { name: 'Offers', path: '/about', hasMenu: false, disabled: true, comingSoon: true },
    { name: 'Contact', path: '/contact', hasMenu: false, disabled: false }
  ];

  const socialIcons = [
    { icon: <Facebook sx={{ fontSize: 20 }} />, color: '#1877F2' },
    { icon: <Twitter sx={{ fontSize: 20 }} />, color: '#1DA1F2' },
    { icon: <Instagram sx={{ fontSize: 20 }} />, color: '#E4405F', path: 'https://www.instagram.com/tawakkol_wear/' },
  ];

  const drawer = (
    <Box sx={{
      width: 320,
      background: `linear-gradient(135deg, ${premiumColors.noir} 0%, ${premiumColors.charcoal} 100%)`,
      height: '100%',
      color: premiumColors.white,
      display: 'flex',
      flexDirection: 'column'
    }}>
      <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: `1px solid ${alpha(premiumColors.gold, 0.2)}` }}>
        <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }} onClick={handleLogoClick}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 2,
              border: `2px solid ${alpha(premiumColors.gold, 0.3)}`,
              boxShadow: `0 4px 15px ${alpha(premiumColors.gold, 0.3)}`,
              overflow: 'hidden'
            }}
          >
            <img
              src={tawakkol}
              alt="Tawakkol"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </Box>
          <Box sx={{
            fontFamily: "'Playfair Display', serif",
            fontSize: '1.5rem',
            fontWeight: 'bold',
            background: `linear-gradient(45deg, ${premiumColors.gold}, ${premiumColors.goldLight})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Tawakkol
          </Box>
        </Box>
        <IconButton
          onClick={handleDrawerToggle}
          sx={{
            color: premiumColors.gold,
            border: `1px solid ${alpha(premiumColors.gold, 0.3)}`,
            '&:hover': {
              background: alpha(premiumColors.gold, 0.1)
            }
          }}
        >
          <Close />
        </IconButton>
      </Box>

      <List sx={{ flex: 1, py: 2 }}>
        {navLinks.map((item) => (
          <ListItem
            key={item.name}
            onClick={() => handleNavLinkClick(item)}
            sx={{
              py: 2.5,
              borderBottom: `1px solid ${alpha(premiumColors.gold, 0.1)}`,
              background: item.disabled ? alpha(premiumColors.charcoal, 0.4) : 'transparent',
              opacity: item.disabled ? 0.6 : 1,
              cursor: item.disabled ? 'not-allowed' : 'pointer',
              '&:hover': item.disabled ? {} : {
                background: alpha(premiumColors.gold, 0.05),
              }
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <ListItemText
                  primary={item.name}
                  sx={{
                    '& .MuiListItemText-primary': {
                      fontFamily: "'Playfair Display', serif",
                      fontWeight: 500,
                      fontSize: '1.3rem',
                      color: item.disabled ? alpha(premiumColors.white, 0.5) : premiumColors.white,
                      textDecoration: item.disabled ? 'line-through' : 'none',
                    }
                  }}
                />
              </Box>
              {item.disabled && item.comingSoon && (
                <Chip
                  label="Coming Soon"
                  size="small"
                  sx={{
                    background: alpha(premiumColors.gold, 0.2),
                    color: premiumColors.goldLight,
                    fontSize: '0.7rem',
                    height: 22,
                    fontWeight: 600,
                  }}
                />
              )}
              {item.hasMenu && !item.disabled && <ExpandMore sx={{ color: premiumColors.gold, ml: 1 }} />}
            </Box>
          </ListItem>
        ))}
      </List>

      {/* Uncomment this section if you want to bring back login & social icons in mobile drawer */}
      {/*
      <Box sx={{ p: 3, borderTop: `1px solid ${alpha(premiumColors.gold, 0.1)}` }}>
        <Button 
          variant="contained"
          onClick={() => {
            navigate('/login');
            handleDrawerToggle();
          }}
          fullWidth
          sx={{
            background: `linear-gradient(45deg, ${premiumColors.gold}, ${premiumColors.goldDark})`,
            color: premiumColors.noir,
            fontWeight: 'bold',
            py: 1.5,
            mb: 3,
            borderRadius: 2,
            '&:hover': {
              background: `linear-gradient(45deg, ${premiumColors.goldLight}, ${premiumColors.gold})`,
              transform: 'translateY(-2px)',
              boxShadow: `0 8px 25px ${alpha(premiumColors.gold, 0.4)}`,
            },
            transition: 'all 0.3s ease'
          }}
        >
          Connexion
        </Button>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
          {socialIcons.map((social, index) => (
            <IconButton 
              href={social.path ? social.path : '#'}
              key={index} 
              sx={{ 
                color: premiumColors.gold,
                border: `1px solid ${alpha(premiumColors.gold, 0.3)}`,
                '&:hover': {
                  background: alpha(social.color, 0.1),
                  color: social.color,
                  transform: 'scale(1.1)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              {social.icon}
            </IconButton>
          ))}
        </Box>
      </Box>
      */}
    </Box>
  );

  return (
    <div ref={navbarRef}>
      <PremiumAppBar>
        <Container maxWidth="xl">
          <Toolbar sx={{ py: 1.5 }}>
            <Box sx={{
              flexGrow: { xs: 1, md: 0 },
              mr: { md: 6 },
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer'
            }} onClick={handleLogoClick}>
              <Box
                sx={{
                  width: { xs: 35, md: 45 },
                  height: { xs: 35, md: 45 },
                  borderRadius: 2,
                  background: `linear-gradient(45deg, ${premiumColors.gold}, ${premiumColors.goldDark})`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mr: 2,
                  border: `2px solid ${alpha(premiumColors.gold, 0.3)}`,
                  boxShadow: `0 4px 15px ${alpha(premiumColors.gold, 0.3)}`,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: `0 6px 20px ${alpha(premiumColors.gold, 0.5)}`,
                  },
                  overflow: 'hidden'
                }}
              >
                <img
                  src={tawakkol}
                  alt="Tawakkol"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                />
              </Box>
              <Box sx={{
                fontFamily: "'Playfair Display', serif",
                fontSize: { xs: '1.5rem', md: '2.2rem' },
                fontWeight: 'bold',
                background: `linear-gradient(45deg, ${premiumColors.gold}, ${premiumColors.goldLight})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                transition: 'all 0.3s ease'
              }}>
                Tawakkol
              </Box>
            </Box>

            <Box sx={{
              display: { xs: 'none', md: 'flex' },
              flexGrow: 1,
              justifyContent: 'center',
              gap: 4
            }}>
              {navLinks.map((link, index) => (
                <Box
                  key={link.name}
                  sx={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <Button
                    onClick={() => handleNavLinkClick(link)}
                    onMouseEnter={() => !link.disabled && setHoveredLink(index)}
                    onMouseLeave={() => setHoveredLink(null)}
                    disabled={link.disabled}
                    sx={{
                      color: link.disabled
                        ? alpha(premiumColors.white, 0.5)
                        : hoveredLink === index
                          ? premiumColors.gold
                          : premiumColors.white,
                      fontWeight: 600,
                      fontSize: '1.15rem',
                      position: 'relative',
                      textTransform: 'none',
                      fontFamily: "'Playfair Display', serif",
                      minWidth: 'auto',
                      px: 2,
                      textDecoration: link.disabled ? 'line-through' : 'none',
                      '&::after': {
                        content: link.disabled ? '""' : '""',
                        position: 'absolute',
                        bottom: -4,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: !link.disabled && hoveredLink === index ? '80%' : '0%',
                        height: '2px',
                        background: `linear-gradient(45deg, ${premiumColors.gold}, ${premiumColors.goldLight})`,
                        transition: 'width 0.3s ease-in-out',
                        borderRadius: 2
                      },
                      '&:hover': !link.disabled && {
                        color: premiumColors.gold,
                        background: 'transparent',
                      },
                      '&.Mui-disabled': {
                        color: alpha(premiumColors.white, 0.5),
                        textDecoration: 'line-through',
                      }
                    }}
                  >
                    {link.name}
                    {link.hasMenu && !link.disabled && (
                      <ExpandMore sx={{
                        fontSize: '1.2rem',
                        ml: 0.5,
                        color: link.disabled
                          ? alpha(premiumColors.white, 0.5)
                          : hoveredLink === index
                            ? premiumColors.gold
                            : premiumColors.white,
                        transition: 'color 0.3s ease',
                        transform: categoriesOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                      }} />
                    )}
                  </Button>
                  {link.disabled && link.comingSoon && (
                    <Chip
                      label="Coming Soon"
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: -10,
                        right: -5,
                        background: alpha(premiumColors.gold, 0.15),
                        color: premiumColors.goldLight,
                        fontWeight: 600,
                        fontSize: '0.65rem',
                        height: 20,
                        borderRadius: '10px',
                        border: `1px solid ${alpha(premiumColors.gold, 0.3)}`,
                      }}
                    />
                  )}
                </Box>
              ))}
            </Box>

            <Box sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 1, md: 2 },
              ml: 'auto'
            }}>
              {/* Desktop Actions */}
              <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2 }}>
                <Box sx={{ display: { xs: 'none', lg: 'flex' }, gap: 1 }}>
                  {socialIcons.map((social, index) => (
                    <IconButton
                      href={social.path ? social.path : '#'}
                      key={index}
                      sx={{
                        color: premiumColors.gold,
                        background: alpha(premiumColors.gold, 0.1),
                        border: `1px solid ${alpha(premiumColors.gold, 0.2)}`,
                        '&:hover': {
                          background: alpha(social.color, 0.2),
                          color: social.color,
                          border: `1px solid ${alpha(social.color, 0.4)}`,
                          transform: 'translateY(-2px)',
                          boxShadow: `0 6px 20px ${alpha(social.color, 0.3)}`
                        },
                        transition: 'all 0.3s ease',
                        width: 40,
                        height: 40
                      }}
                    >
                      {social.icon}
                    </IconButton>
                  ))}
                </Box>

                <Box sx={{
                  width: 32,
                  borderLeft: `1px solid ${alpha(premiumColors.gold, 0.2)}`,
                  height: 30
                }} />

                <IconButton
                  onClick={() => setIsCartOpen(true)}
                  sx={{
                    background: `linear-gradient(45deg, ${premiumColors.gold}, ${premiumColors.goldDark})`,
                    color: premiumColors.noir,
                    border: `2px solid ${alpha(premiumColors.gold, 0.5)}`,
                    '&:hover': {
                      background: `linear-gradient(45deg, ${premiumColors.goldLight}, ${premiumColors.gold})`,
                      transform: 'translateY(-3px) scale(1.05)',
                      boxShadow: `0 12px 35px ${alpha(premiumColors.gold, 0.5)}`,
                    },
                    transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                    width: 48,
                    height: 48,
                    position: 'relative'
                  }}
                >
                  <Badge
                    badgeContent={cartCount}
                    color="error"
                    sx={{
                      '& .MuiBadge-badge': {
                        background: '#ff4757',
                        color: premiumColors.white,
                        fontWeight: 'bold',
                        fontSize: '0.7rem',
                        minWidth: 20,
                        height: 20,
                        border: `2px solid ${premiumColors.noir}`
                      }
                    }}
                  >
                    <ShoppingBagOutlined />
                  </Badge>
                </IconButton>
              </Box>

              {/* Mobile Actions */}
              <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1 }}>
                <IconButton
                  onClick={() => setIsCartOpen(true)}
                  sx={{
                    background: `linear-gradient(45deg, ${premiumColors.gold}, ${premiumColors.goldDark})`,
                    color: premiumColors.noir,
                    border: `2px solid ${alpha(premiumColors.gold, 0.5)}`,
                    width: 42,
                    height: 42,
                  }}
                >
                  <Badge
                    badgeContent={cartCount}
                    color="error"
                    sx={{
                      '& .MuiBadge-badge': {
                        background: '#ff4757',
                        color: premiumColors.white,
                        fontWeight: 'bold',
                        fontSize: '0.6rem',
                        minWidth: 18,
                        height: 18,
                      }
                    }}
                  >
                    <ShoppingBagOutlined sx={{ fontSize: 20 }} />
                  </Badge>
                </IconButton>

                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="end"
                  onClick={handleDrawerToggle}
                  sx={{
                    color: premiumColors.gold,
                    border: `1px solid ${alpha(premiumColors.gold, 0.3)}`,
                    '&:hover': {
                      background: alpha(premiumColors.gold, 0.1)
                    }
                  }}
                >
                  <MenuIcon />
                </IconButton>
              </Box>
            </Box>
          </Toolbar>
        </Container>
      </PremiumAppBar>

      <div ref={categoriesRef}>
        <SecondaryNavbar open={categoriesOpen} onClose={handleCategoriesClose} categories={categories} />
      </div>

      <MobileCategoriesMenu
        open={mobileCategoriesOpen}
        onClose={handleMobileCategoriesClose}
        categories={categories}
      />

      <Box sx={{ height: '64px' }} />

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 320,
            background: `linear-gradient(135deg, ${premiumColors.noir} 0%, ${premiumColors.charcoal} 100%)`,
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Cart Drawer */}
      <CartDrawer />
    </div>
  );
};

export default Navbar;