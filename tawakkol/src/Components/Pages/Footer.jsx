import React, { useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  Link,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  useTheme,
  useMediaQuery,
  alpha,
  Chip,
  Tooltip,
  Fade,
  Collapse
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  YouTube,
  Pinterest,
  Email,
  Phone,
  LocationOn,
  AccessTime,
  LocalShipping,
  Security,
  SupportAgent,
  Favorite,
  ExpandMore,
  ExpandLess,
  Verified,
  Shield,
  Lock,
  Star
} from '@mui/icons-material';

// Reuse the premium colors from your navbar
const premiumColors = {
  noir: '#1a1a1a',
  gold: '#d4af37',
  goldLight: '#f4e4a6',
  goldDark: '#b8941f',
  charcoal: '#2d2d2d',
  lightNoir: '#3a3a3a',
  white: '#ffffff'
};

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [openSections, setOpenSections] = useState({
    about: false,
    customer: false,
    policies: false
  });

  const toggleSection = (section) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const socialLinks = [
    { icon: <Facebook />, color: '#1877F2', href: 'https://facebook.com' },
    { icon: <Instagram />, color: '#E4405F', href: 'https://instagram.com/tawakkol_wear/' },
    { icon: <Twitter />, color: '#1DA1F2', href: 'https://twitter.com' },
    { icon: <YouTube />, color: '#FF0000', href: 'https://youtube.com' },
    { icon: <Pinterest />, color: '#E60023', href: 'https://pinterest.com' }
  ];

  const quickLinks = [
    { name: 'Nouveautés', path: '/new-arrivals' },
    { name: 'Collections Éditoriales', path: '/editorial-collections' },
    { name: 'Tendance du Mois', path: '/trending' },
    { name: 'Soldes Exclusives', path: '/sales' },
    { name: 'Lookbook', path: '/lookbook' },
    { name: 'Cadeaux', path: '/gifts' }
  ];

  const customerService = [
    { name: 'Contact & Support', path: '/contact' },
    { name: 'Livraison & Retours', path: '/shipping' },
    { name: 'Guide des Tailles', path: '/size-guide' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Programme Fidélité', path: '/loyalty' },
    { name: 'Cartes Cadeaux', path: '/gift-cards' }
  ];

  const companyInfo = [
    { name: 'À Propos de Tawakkol', path: '/about' },
    { name: 'Carrières', path: '/careers' },
    { name: 'Développement Durable', path: '/sustainability' },
    { name: 'Presse', path: '/press' },
    { name: 'Boutiques', path: '/stores' },
    { name: 'Programme Affiliés', path: '/affiliates' }
  ];

  const trustBadges = [
    { 
      icon: <Verified sx={{ fontSize: 28 }} />, 
      text: 'Authenticité Garantie', 
      desc: 'Produits 100% authentiques',
      feature: 'Premium'
    },
    { 
      icon: <Shield sx={{ fontSize: 28 }} />, 
      text: 'Paiement Sécurisé', 
      desc: 'Cryptage SSL 256-bit',
      feature: 'Sécurisé'
    },
    { 
      icon: <LocalShipping sx={{ fontSize: 28 }} />, 
      text: 'Livraison Express', 
      desc: 'Livraison en 24-48h',
      feature: 'Rapide'
    },
    { 
      icon: <SupportAgent sx={{ fontSize: 28 }} />, 
      text: 'Support Premium', 
      desc: 'Assistance 7j/7',
      feature: 'Élite'
    }
  ];

  return (
    <Box
      component="footer"
      sx={{
        background: `linear-gradient(180deg, ${premiumColors.noir} 0%, #1e1e1e 100%)`,
        color: premiumColors.white,
        borderTop: `1px solid ${alpha(premiumColors.gold, 0.2)}`,
        mt: 'auto',
        position: 'relative',
        overflow: 'hidden',
        pt: 8,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '1px',
          background: `linear-gradient(90deg, transparent, ${alpha(premiumColors.gold, 0.3)}, transparent)`,
        }
      }}
    >
      {/* Enhanced Decorative Elements */}
      <Box
        sx={{
          position: 'absolute',
          top: 50,
          right: 50,
          width: 200,
          height: 200,
          background: `radial-gradient(circle, ${alpha(premiumColors.gold, 0.03)} 0%, transparent 70%)`,
          borderRadius: '50%',
          zIndex: 0,
          animation: 'pulse 8s ease-in-out infinite',
          '@keyframes pulse': {
            '0%, 100%': { opacity: 0.3 },
            '50%': { opacity: 0.6 },
          }
        }}
      />
      
      <Box
        sx={{
          position: 'absolute',
          bottom: 30,
          left: 30,
          width: 150,
          height: 150,
          background: `radial-gradient(circle, ${alpha(premiumColors.gold, 0.02)} 0%, transparent 70%)`,
          borderRadius: '50%',
          zIndex: 0,
        }}
      />

      {/* Gold Accent Line */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100px',
          height: '3px',
          background: `linear-gradient(90deg, transparent, ${premiumColors.gold}, transparent)`,
        }}
      />

      <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1 }}>

        {/* Main Footer Content */}
        <Grid container spacing={4}>
          {/* Brand Column */}
          <Grid item xs={12} md={3}>
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h4"
                sx={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 700,
                  background: `linear-gradient(45deg, ${premiumColors.gold}, ${premiumColors.goldLight})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 2
                }}
              >
                Tawakkol
              </Typography>
              <Typography variant="body2" sx={{ color: alpha(premiumColors.white, 0.8), mb: 3 }}>
                Redéfinir l'élégance contemporaine à travers des créations uniques qui célèbrent l'artisanat d'exception et l'innovation stylistique.
              </Typography>
              
              {/* Social Links */}
              <Box sx={{ display: 'flex', gap: 1.5, mb: 3 }}>
                {socialLinks.map((social, index) => (
                  <IconButton
                    key={index}
                    href={social.href}
                    target="_blank"
                    sx={{
                      color: premiumColors.gold,
                      background: alpha(premiumColors.gold, 0.1),
                      border: `1px solid ${alpha(premiumColors.gold, 0.2)}`,
                      width: 44,
                      height: 44,
                      transition: 'all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                      '&:hover': {
                        background: alpha(social.color, 0.2),
                        color: social.color,
                        borderColor: alpha(social.color, 0.4),
                        transform: 'translateY(-3px) scale(1.1)',
                        boxShadow: `0 10px 25px ${alpha(social.color, 0.3)}`
                      },
                      '&:active': {
                        transform: 'translateY(-1px) scale(1.05)',
                      }
                    }}
                  >
                    {social.icon}
                  </IconButton>
                ))}
              </Box>
            </Box>

            {/* Contact Info */}
            <Paper
              elevation={0}
              sx={{
                background: alpha(premiumColors.gold, 0.03),
                border: `1px solid ${alpha(premiumColors.gold, 0.1)}`,
                borderRadius: 2,
                p: 2.5
              }}
            >
              <Typography variant="subtitle2" sx={{ color: premiumColors.gold, mb: 2, fontWeight: 600 }}>
                Contactez-nous
              </Typography>
              <List dense disablePadding>
                <ListItem sx={{ px: 0, py: 0.75 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Email sx={{ color: premiumColors.gold, fontSize: 18 }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="contact@tawakkol.com"
                    primaryTypographyProps={{
                      sx: { 
                        color: alpha(premiumColors.white, 0.9), 
                        fontSize: '0.9rem',
                        fontFamily: "'Inter', sans-serif"
                      }
                    }}
                  />
                </ListItem>
                <ListItem sx={{ px: 0, py: 0.75 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <Phone sx={{ color: premiumColors.gold, fontSize: 18 }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="+33 1 23 45 67 89"
                    primaryTypographyProps={{
                      sx: { 
                        color: alpha(premiumColors.white, 0.9), 
                        fontSize: '0.9rem',
                        fontFamily: "'Inter', sans-serif"
                      }
                    }}
                  />
                </ListItem>
                <ListItem sx={{ px: 0, py: 0.75 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <LocationOn sx={{ color: premiumColors.gold, fontSize: 18 }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="123 Avenue Montaigne, 75008 Tunis"
                    primaryTypographyProps={{
                      sx: { 
                        color: alpha(premiumColors.white, 0.9), 
                        fontSize: '0.9rem',
                        fontFamily: "'Inter', sans-serif"
                      }
                    }}
                  />
                </ListItem>
                <ListItem sx={{ px: 0, py: 0.75 }}>
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    <AccessTime sx={{ color: premiumColors.gold, fontSize: 18 }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Lun - Sam: 10h - 20h"
                    primaryTypographyProps={{
                      sx: { 
                        color: alpha(premiumColors.white, 0.9), 
                        fontSize: '0.9rem',
                        fontFamily: "'Inter', sans-serif"
                      }
                    }}
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>

          {/* Desktop Links - Hidden on Mobile */}
          {!isMobile ? (
            <>
              <Grid item xs={12} md={2}>
                <Typography variant="h6" sx={{ 
                  color: premiumColors.gold, 
                  mb: 3, 
                  fontWeight: 600, 
                  fontFamily: "'Playfair Display', serif",
                  position: 'relative',
                  display: 'inline-block',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -8,
                    left: 0,
                    width: '40%',
                    height: '2px',
                    background: `linear-gradient(90deg, ${premiumColors.gold}, transparent)`,
                    borderRadius: 2
                  }
                }}>
                  Découvrir
                </Typography>
                <List dense disablePadding>
                  {quickLinks.map((link) => (
                    <ListItem key={link.name} sx={{ px: 0, py: 0.75 }}>
                      <Link
                        href={link.path}
                        underline="none"
                        sx={{
                          color: alpha(premiumColors.white, 0.8),
                          fontSize: '0.9rem',
                          transition: 'all 0.3s ease',
                          display: 'flex',
                          alignItems: 'center',
                          '&:hover': {
                            color: premiumColors.goldLight,
                            paddingLeft: 1,
                            '&::before': {
                              content: '"›"',
                              marginRight: '8px',
                              color: premiumColors.gold,
                              fontWeight: 'bold'
                            }
                          }
                        }}
                      >
                        {link.name}
                      </Link>
                    </ListItem>
                  ))}
                </List>
              </Grid>

              <Grid item xs={12} md={2}>
                <Typography variant="h6" sx={{ 
                  color: premiumColors.gold, 
                  mb: 3, 
                  fontWeight: 600, 
                  fontFamily: "'Playfair Display', serif",
                  position: 'relative',
                  display: 'inline-block',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -8,
                    left: 0,
                    width: '40%',
                    height: '2px',
                    background: `linear-gradient(90deg, ${premiumColors.gold}, transparent)`,
                    borderRadius: 2
                  }
                }}>
                  Service Client
                </Typography>
                <List dense disablePadding>
                  {customerService.map((link) => (
                    <ListItem key={link.name} sx={{ px: 0, py: 0.75 }}>
                      <Link
                        href={link.path}
                        underline="none"
                        sx={{
                          color: alpha(premiumColors.white, 0.8),
                          fontSize: '0.9rem',
                          transition: 'all 0.3s ease',
                          display: 'flex',
                          alignItems: 'center',
                          '&:hover': {
                            color: premiumColors.goldLight,
                            paddingLeft: 1,
                            '&::before': {
                              content: '"›"',
                              marginRight: '8px',
                              color: premiumColors.gold,
                              fontWeight: 'bold'
                            }
                          }
                        }}
                      >
                        {link.name}
                      </Link>
                    </ListItem>
                  ))}
                </List>
              </Grid>

              <Grid item xs={12} md={2}>
                <Typography variant="h6" sx={{ 
                  color: premiumColors.gold, 
                  mb: 3, 
                  fontWeight: 600, 
                  fontFamily: "'Playfair Display', serif",
                  position: 'relative',
                  display: 'inline-block',
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -8,
                    left: 0,
                    width: '40%',
                    height: '2px',
                    background: `linear-gradient(90deg, ${premiumColors.gold}, transparent)`,
                    borderRadius: 2
                  }
                }}>
                  Entreprise
                </Typography>
                <List dense disablePadding>
                  {companyInfo.map((link) => (
                    <ListItem key={link.name} sx={{ px: 0, py: 0.75 }}>
                      <Link
                        href={link.path}
                        underline="none"
                        sx={{
                          color: alpha(premiumColors.white, 0.8),
                          fontSize: '0.9rem',
                          transition: 'all 0.3s ease',
                          display: 'flex',
                          alignItems: 'center',
                          '&:hover': {
                            color: premiumColors.goldLight,
                            paddingLeft: 1,
                            '&::before': {
                              content: '"›"',
                              marginRight: '8px',
                              color: premiumColors.gold,
                              fontWeight: 'bold'
                            }
                          }
                        }}
                      >
                        {link.name}
                      </Link>
                    </ListItem>
                  ))}
                </List>
              </Grid>
            </>
          ) : (
            /* Mobile Accordions */
            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <Box
                  onClick={() => toggleSection('about')}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    py: 2,
                    borderBottom: `1px solid ${alpha(premiumColors.gold, 0.1)}`,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: alpha(premiumColors.gold, 0.05),
                      paddingLeft: 2,
                    }
                  }}
                >
                  <Typography variant="h6" sx={{ color: premiumColors.gold, fontWeight: 600 }}>
                    Découvrir
                  </Typography>
                  {openSections.about ? <ExpandLess sx={{ color: premiumColors.gold }} /> : <ExpandMore sx={{ color: premiumColors.gold }} />}
                </Box>
                <Collapse in={openSections.about}>
                  <List dense disablePadding sx={{ py: 2 }}>
                    {quickLinks.map((link) => (
                      <ListItem key={link.name} sx={{ px: 0, py: 1 }}>
                        <Link
                          href={link.path}
                          underline="none"
                          sx={{
                            color: alpha(premiumColors.white, 0.8),
                            fontSize: '0.9rem',
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              color: premiumColors.goldLight,
                              paddingLeft: 1,
                              '&::before': {
                                content: '"›"',
                                marginRight: '8px',
                                color: premiumColors.gold,
                                fontWeight: 'bold'
                              }
                            }
                          }}
                        >
                          {link.name}
                        </Link>
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Box
                  onClick={() => toggleSection('customer')}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    py: 2,
                    borderBottom: `1px solid ${alpha(premiumColors.gold, 0.1)}`,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: alpha(premiumColors.gold, 0.05),
                      paddingLeft: 2,
                    }
                  }}
                >
                  <Typography variant="h6" sx={{ color: premiumColors.gold, fontWeight: 600 }}>
                    Service Client
                  </Typography>
                  {openSections.customer ? <ExpandLess sx={{ color: premiumColors.gold }} /> : <ExpandMore sx={{ color: premiumColors.gold }} />}
                </Box>
                <Collapse in={openSections.customer}>
                  <List dense disablePadding sx={{ py: 2 }}>
                    {customerService.map((link) => (
                      <ListItem key={link.name} sx={{ px: 0, py: 1 }}>
                        <Link
                          href={link.path}
                          underline="none"
                          sx={{
                            color: alpha(premiumColors.white, 0.8),
                            fontSize: '0.9rem',
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              color: premiumColors.goldLight,
                              paddingLeft: 1,
                              '&::before': {
                                content: '"›"',
                                marginRight: '8px',
                                color: premiumColors.gold,
                                fontWeight: 'bold'
                              }
                            }
                          }}
                        >
                          {link.name}
                        </Link>
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </Box>

              <Box sx={{ mb: 2 }}>
                <Box
                  onClick={() => toggleSection('policies')}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    py: 2,
                    borderBottom: `1px solid ${alpha(premiumColors.gold, 0.1)}`,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: alpha(premiumColors.gold, 0.05),
                      paddingLeft: 2,
                    }
                  }}
                >
                  <Typography variant="h6" sx={{ color: premiumColors.gold, fontWeight: 600 }}>
                    Entreprise
                  </Typography>
                  {openSections.policies ? <ExpandLess sx={{ color: premiumColors.gold }} /> : <ExpandMore sx={{ color: premiumColors.gold }} />}
                </Box>
                <Collapse in={openSections.policies}>
                  <List dense disablePadding sx={{ py: 2 }}>
                    {companyInfo.map((link) => (
                      <ListItem key={link.name} sx={{ px: 0, py: 1 }}>
                        <Link
                          href={link.path}
                          underline="none"
                          sx={{
                            color: alpha(premiumColors.white, 0.8),
                            fontSize: '0.9rem',
                            width: '100%',
                            display: 'flex',
                            alignItems: 'center',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              color: premiumColors.goldLight,
                              paddingLeft: 1,
                              '&::before': {
                                content: '"›"',
                                marginRight: '8px',
                                color: premiumColors.gold,
                                fontWeight: 'bold'
                              }
                            }
                          }}
                        >
                          {link.name}
                        </Link>
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              </Box>
            </Grid>
          )}
        </Grid>

        <Divider sx={{ 
          borderColor: alpha(premiumColors.gold, 0.1), 
          my: 6,
          background: `linear-gradient(90deg, transparent, ${alpha(premiumColors.gold, 0.1)}, transparent)`,
          height: '1px',
          border: 'none'
        }} />

        {/* Bottom Footer */}
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' }, 
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', md: 'center' },
          gap: 3,
          pb: 6
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Favorite sx={{ 
              fontSize: 20, 
              color: premiumColors.gold,
              '@keyframes heartbeat': {
                '0%': { transform: 'scale(1)' },
                '5%': { transform: 'scale(1.1)' },
                '10%': { transform: 'scale(1)' },
                '15%': { transform: 'scale(1.1)' },
                '20%': { transform: 'scale(1)' },
                '100%': { transform: 'scale(1)' },
              },
              animation: 'heartbeat 1.5s ease-in-out infinite'
            }} />
            <Typography variant="body2" sx={{ 
              color: alpha(premiumColors.white, 0.7),
              fontFamily: "'Playfair Display', serif",
              fontStyle: 'italic'
            }}>
              Conçu avec passion à Tunis
            </Typography>
          </Box>
          
          <Typography variant="body2" sx={{ 
            color: alpha(premiumColors.white, 0.6),
            fontFamily: "'Inter', sans-serif"
          }}>
            © {new Date().getFullYear()} Tawakkol Wear. Tous droits réservés.
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link
              href="/privacy"
              underline="hover"
              sx={{ 
                color: alpha(premiumColors.white, 0.6), 
                fontSize: '0.85rem',
                fontFamily: "'Inter', sans-serif",
                transition: 'all 0.2s ease',
                '&:hover': {
                  color: premiumColors.goldLight,
                }
              }}
            >
              Confidentialité
            </Link>
            <Link
              href="/terms"
              underline="hover"
              sx={{ 
                color: alpha(premiumColors.white, 0.6), 
                fontSize: '0.85rem',
                fontFamily: "'Inter', sans-serif",
                transition: 'all 0.2s ease',
                '&:hover': {
                  color: premiumColors.goldLight,
                }
              }}
            >
              Conditions
            </Link>
            <Link
              href="/cookies"
              underline="hover"
              sx={{ 
                color: alpha(premiumColors.white, 0.6), 
                fontSize: '0.85rem',
                fontFamily: "'Inter', sans-serif",
                transition: 'all 0.2s ease',
                '&:hover': {
                  color: premiumColors.goldLight,
                }
              }}
            >
              Cookies
            </Link>
            <Link
              href="/legal"
              underline="hover"
              sx={{ 
                color: alpha(premiumColors.white, 0.6), 
                fontSize: '0.85rem',
                fontFamily: "'Inter', sans-serif",
                transition: 'all 0.2s ease',
                '&:hover': {
                  color: premiumColors.goldLight,
                }
              }}
            >
              Mentions légales
            </Link>
          </Box>
        </Box>

        {/* Bottom Decorative Line */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '200px',
            height: '4px',
            background: `linear-gradient(90deg, 
              transparent, 
              ${alpha(premiumColors.gold, 0.3)}, 
              ${premiumColors.gold}, 
              ${alpha(premiumColors.gold, 0.3)}, 
              transparent)`,
            borderRadius: '2px',
          }}
        />
      </Container>
    </Box>
  );
};

export default Footer;