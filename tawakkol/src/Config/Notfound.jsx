import React from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Zoom,
  Fade
} from '@mui/material';
import {
  Diamond,
  StarBorder,
  ArrowBack,
  Home
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const premiumColors = {
  noir: '#1a1a1a',
  gold: '#d4af37',
  goldLight: '#f4e4a6',
  goldDark: '#b8941f',
  charcoal: '#2d2d2d',
  white: '#ffffff'
};

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{
      width: '99vw',
      minHeight: '100vh',
      background: `linear-gradient(135deg, ${premiumColors.charcoal} 0%, ${premiumColors.noir} 50%, ${premiumColors.charcoal} 100%)`,
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      py: { xs: 3, lg: 5 },
      '&::before': {
        content: '""',
        position: 'absolute',
        inset: 0,
        background: `
          radial-gradient(circle at 12% 88%, ${premiumColors.gold}14 0%, transparent 48%),
          radial-gradient(circle at 88% 12%, ${premiumColors.gold}10 0%, transparent 52%),
          radial-gradient(circle at 50% 50%, ${premiumColors.gold}05 0%, transparent 70%)
        `,
        pointerEvents: 'none',
        animation: 'pulse 12s ease-in-out infinite',
        '@keyframes pulse': {
          '0%, 100%': { opacity: 0.8 },
          '50%': { opacity: 1 }
        }
      }
    }}>
      {/* Floating Ornaments */}
      <Box sx={{
        position: 'absolute',
        top: '15%',
        left: '8%',
        animation: 'float 9s ease-in-out infinite',
        '@keyframes float': {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-30px) rotate(8deg)' }
        }
      }}>
        <Diamond sx={{ 
          fontSize: { xs: 70, lg: 120 }, 
          color: premiumColors.gold, 
          opacity: 0.15,
          filter: 'drop-shadow(0 0 30px rgba(212, 175, 55, 0.4))'
        }} />
      </Box>

      <Box sx={{
        position: 'absolute',
        bottom: '20%',
        right: '10%',
        animation: 'float 11s ease-in-out infinite reverse',
        animationDelay: '2s'
      }}>
        <StarBorder sx={{ 
          fontSize: { xs: 60, lg: 100 }, 
          color: premiumColors.gold, 
          opacity: 0.13,
          filter: 'drop-shadow(0 0 25px rgba(212, 175, 55, 0.3))'
        }} />
      </Box>

      {/* 404 Content */}
      <Box sx={{
        position: 'relative',
        zIndex: 10,
        textAlign: 'center',
        px: { xs: 3, lg: 6 },
        maxWidth: '1000px'
      }}>
        <Zoom in timeout={800}>
          <Typography
            variant="h1"
            sx={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 900,
              background: `linear-gradient(135deg, ${premiumColors.gold}, ${premiumColors.goldLight})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: { xs: '6rem', sm: '9rem', md: '12rem', lg: '15rem' },
              letterSpacing: { xs: '-4px', lg: '-8px' },
              textShadow: `0 0 80px ${premiumColors.gold}40`,
              mb: { xs: 1, lg: 2 },
              lineHeight: 0.9
            }}
          >
            404
          </Typography>
        </Zoom>

        <Fade in timeout={1200}>
          <Typography
            variant="h4"
            sx={{
              color: premiumColors.white,
              fontFamily: "'Playfair Display', serif",
              fontWeight: 600,
              mb: 2,
              fontSize: { xs: '1.3rem', lg: '2rem' },
              letterSpacing: '0.5px'
            }}
          >
            Page introuvable
          </Typography>
        </Fade>

        <Fade in timeout={1600}>
          <Typography
            variant="body1"
            sx={{
              color: premiumColors.goldLight + 'CC',
              fontFamily: "'Playfair Display', serif",
              fontSize: { xs: '1rem', lg: '1.3rem' },
              mb: 5,
              maxWidth: '600px',
              mx: 'auto',
              lineHeight: 1.7
            }}
          >
            La page que vous recherchez a été déplacée, supprimée ou n'a jamais existé.  
            Ne vous inquiétez pas — votre trésor est toujours en sécurité chez Tawakkol.
          </Typography>
        </Fade>

        <Fade in timeout={2000}>
          <Box sx={{ 
            display: 'flex', 
            gap: 3, 
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <Button
              onClick={() => navigate('/')}
              startIcon={<Home sx={{ fontSize: 28 }} />}
              sx={{
                background: `linear-gradient(45deg, ${premiumColors.gold}, ${premiumColors.goldDark})`,
                color: premiumColors.noir,
                px: { xs: 4, lg: 6 },
                py: { xs: 2, lg: 2.5 },
                borderRadius: 3,
                fontFamily: "'Playfair Display', serif",
                fontWeight: 700,
                fontSize: { xs: '1rem', lg: '1.2rem' },
                textTransform: 'none',
                boxShadow: `0 15px 40px ${premiumColors.gold}40`,
                '&:hover': {
                  background: `linear-gradient(45deg, ${premiumColors.goldLight}, ${premiumColors.gold})`,
                  transform: 'translateY(-4px)',
                  boxShadow: `0 25px 60px ${premiumColors.gold}50`
                },
                transition: 'all 0.4s cubic-bezier(0.23, 1, 0.32, 1)'
              }}
            >
              Retour à l'accueil
            </Button>

            <Button
              onClick={() => navigate(-1)}
              startIcon={<ArrowBack sx={{ fontSize: 24 }} />}
              sx={{
                border: `2px solid ${premiumColors.gold}`,
                color: premiumColors.gold,
                px: { xs: 4, lg: 6 },
                py: { xs: 2, lg: 2.5 },
                borderRadius: 3,
                fontFamily: "'Playfair Display', serif",
                fontWeight: 600,
                fontSize: { xs: '1rem', lg: '1.2rem' },
                textTransform: 'none',
                background: 'transparent',
                '&:hover': {
                  background: premiumColors.gold + '20',
                  borderColor: premiumColors.goldLight,
                  color: premiumColors.goldLight,
                  transform: 'translateY(-3px)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Page précédente
            </Button>
          </Box>
        </Fade>

        {/* Premium Footer */}
        <Fade in timeout={2400}>
          <Typography
            variant="caption"
            sx={{
              display: 'block',
              mt: 8,
              color: premiumColors.goldLight + '80',
              fontFamily: "'Playfair Display', serif",
              fontSize: { xs: '0.9rem', lg: '1.1rem' },
              fontStyle: 'italic',
              letterSpacing: '1px'
            }}
          >
            Tawakkol — L'excellence n'est jamais perdue
          </Typography>
        </Fade>
      </Box>
    </Box>
  );
};

export default NotFound;