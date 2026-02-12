import React, { useState, useEffect } from 'react';
import { 
  IconButton, 
  Zoom, 
  Box,
  Tooltip
} from '@mui/material';
import { 
  KeyboardArrowUp,
  Diamond
} from '@mui/icons-material';

// Premium Noir & Doré Color Scheme
const premiumColors = {
  noir: '#1a1a1a',
  gold: '#d4af37',
  goldLight: '#f4e4a6',
  goldDark: '#b8941f',
  charcoal: '#2d2d2d',
  lightNoir: '#3a3a3a',
  white: '#ffffff'
};

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <Zoom in={isVisible} timeout={400}>
      <Box
        sx={{
          position: 'fixed',
          bottom: 32,
          right: 32,
          zIndex: 1000,
          animation: isVisible ? 'float 3s ease-in-out infinite' : 'none',
          '@keyframes float': {
            '0%, 100%': { 
              transform: 'translateY(0px)' 
            },
            '50%': { 
              transform: 'translateY(-8px)' 
            }
          }
        }}
      >
        <Tooltip 
          title="Retour en haut" 
          placement="left"
          componentsProps={{
            tooltip: {
              sx: {
                bgcolor: premiumColors.noir,
                color: premiumColors.gold,
                border: `1px solid ${premiumColors.gold}40`,
                fontFamily: "'Playfair Display', serif",
                fontWeight: 500,
                fontSize: '0.8rem',
                borderRadius: 2,
                boxShadow: `0 8px 32px ${premiumColors.gold}20`
              }
            }
          }}
        >
          <IconButton
            onClick={scrollToTop}
            sx={{
              background: `linear-gradient(135deg, ${premiumColors.gold} 0%, ${premiumColors.goldDark} 100%)`,
              color: premiumColors.noir,
              width: 60,
              height: 60,
              borderRadius: '50%',
              border: `2px solid ${premiumColors.gold}80`,
              boxShadow: `
                0 8px 32px ${premiumColors.gold}30,
                0 4px 16px ${premiumColors.noir}50,
                inset 0 2px 4px ${premiumColors.goldLight}40
              `,
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: `linear-gradient(135deg, transparent 0%, ${premiumColors.white}20 50%, transparent 100%)`,
                opacity: 0,
                transition: 'opacity 0.3s ease'
              },
              '&:hover': {
                transform: 'scale(1.1) translateY(-2px)',
                boxShadow: `
                  0 12px 40px ${premiumColors.gold}50,
                  0 6px 20px ${premiumColors.noir}60,
                  inset 0 2px 4px ${premiumColors.goldLight}60
                `,
                background: `linear-gradient(135deg, ${premiumColors.goldLight} 0%, ${premiumColors.gold} 100%)`,
                '&::before': {
                  opacity: 1
                }
              },
              '&:active': {
                transform: 'scale(1.05) translateY(0px)',
                transition: 'transform 0.1s ease'
              }
            }}
          >
            {/* Main Arrow Icon */}
            <KeyboardArrowUp 
              sx={{ 
                fontSize: 28,
                fontWeight: 'bold',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
              }} 
            />
            
            {/* Decorative Diamond */}
            <Diamond
              sx={{
                position: 'absolute',
                top: -2,
                right: -2,
                fontSize: 16,
                color: premiumColors.noir,
                opacity: 0.7,
                transform: 'rotate(45deg)'
              }}
            />
          </IconButton>
        </Tooltip>

        {/* Animated Ripple Effect */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 70,
            height: 70,
            borderRadius: '50%',
            border: `2px solid ${premiumColors.gold}30`,
            animation: 'pulse 2s ease-in-out infinite',
            '@keyframes pulse': {
              '0%': {
                transform: 'translate(-50%, -50%) scale(1)',
                opacity: 1
              },
              '100%': {
                transform: 'translate(-50%, -50%) scale(1.3)',
                opacity: 0
              }
            }
          }}
        />
      </Box>
    </Zoom>
  );
};

export default ScrollToTop;