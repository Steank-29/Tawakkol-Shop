import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { Check, Error as ErrorIcon } from '@mui/icons-material';
// Assume you have a Tawakkol logo as an imported image or SVG component
import TawakkolLogo from '../assets/tawakkol.png';  

const CustomToast = ({ type, fullName, message, onDismiss }) => {
  const isSuccess = type === 'success';

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 2,
        p: 2,
        borderRadius: 2,
        background: `linear-gradient(135deg, ${premiumColors.noir}CC 0%, ${premiumColors.charcoal}CC 100%)`,
        border: `1px solid ${premiumColors.gold}32`,
        backdropFilter: 'blur(20px)',
        boxShadow: `0 8px 32px ${premiumColors.gold}20`,
        maxWidth: 400,
        fontFamily: "'Playfair Display', serif",
      }}
    >
      {/* Logo + Title Row */}
      <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 60 }}>
        <img src={TawakkolLogo} alt="Tawakkol" style={{ width: 40, height: 40, marginBottom: 4 }} />
        <Typography
          sx={{
            color: premiumColors.gold,
            fontSize: '0.85rem',
            fontWeight: 700,
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
          }}
        >
          Tawakkol
        </Typography>
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography
          sx={{
            color: premiumColors.white,
            fontSize: '0.9rem',
            fontWeight: 600,
            mb: 0.5,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {fullName}
        </Typography>
        <Typography
          sx={{
            color: premiumColors.goldLight,
            fontSize: '0.85rem',
            lineHeight: 1.3,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {message}
        </Typography>
      </Box>

      {/* Icon + Dismiss */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
        <IconButton
          onClick={onDismiss}
          sx={{ color: isSuccess ? premiumColors.gold : premiumColors.error, p: 0.5 }}
          size="small"
        >
          {isSuccess ? <Check /> : <ErrorIcon />}
        </IconButton>
        <IconButton onClick={onDismiss} size="small" sx={{ color: premiumColors.goldLight + '80', p: 0.5 }}>
          <Close fontSize="small" />  {/* Import Close from @mui/icons-material */}
        </IconButton>
      </Box>
    </Box>
  );
};

export default CustomToast;