import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  IconButton,
  Fade,
  Zoom,
  useTheme,
  useMediaQuery,
  Backdrop,
  CircularProgress,
  InputAdornment,
  Tooltip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip
} from '@mui/material';
import {
  Close,
  Diamond,
  StarBorder,
  Upload,
  ChevronRight,
  Check,
  Error as ErrorIcon,
  Security,
  Phone,
  Email,
  PriorityHigh,
  Schedule,
  Whatshot,
  Warning
} from '@mui/icons-material';
import { toast, Toaster } from 'sonner';

// === PREMIUM COLORS & GLASS STYLE (Enhanced) ===
const premiumColors = {
  noir: '#1a1a1a',
  gold: '#d4af37',
  goldLight: '#f4e4a6',
  goldDark: '#b8941f',
  charcoal: '#2d2d2d',
  white: '#ffffff',
  error: '#ff4757',
  success: '#2ed573',
  warning: '#ffa502',
  urgent: '#ff3838',
  premiumGradient: 'linear-gradient(135deg, #d4af37 0%, #f9d423 50%, #d4af37 100%)'
};

const glassStyle = {
  background: `linear-gradient(135deg, ${premiumColors.noir}DD 0%, ${premiumColors.charcoal}DD 100%)`,
  backdropFilter: 'blur(32px) saturate(180%)',
  WebkitBackdropFilter: 'blur(32px) saturate(180%)',
  border: `1px solid ${premiumColors.gold}40`,
  boxShadow: `
    0 30px 90px ${premiumColors.gold}25,
    0 12px 45px ${premiumColors.noir}60,
    inset 0 1px 0 ${premiumColors.gold}30,
    inset 0 -1px 0 ${premiumColors.gold}20,
    0 0 100px ${premiumColors.gold}15
  `,
  borderRadius: { xs: 16, lg: 20 },
  overflow: 'hidden',
  position: 'relative'
};

// === IMPORTANCE LEVEL CONFIG ===
const importanceLevels = [
  {
    value: 'low',
    label: 'Faible Priorité',
    description: 'Question générale ou information',
    color: premiumColors.success,
    icon: <Schedule />,
    chipColor: 'success'
  },
  {
    value: 'medium',
    label: 'Priorité Moyenne',
    description: 'Problème standard à résoudre',
    color: premiumColors.warning,
    icon: <PriorityHigh />,
    chipColor: 'warning'
  },
  {
    value: 'high',
    label: 'Haute Priorité',
    description: 'Besoin urgent de réponse',
    color: premiumColors.gold,
    icon: <Warning />,
    chipColor: 'warning'
  },
  {
    value: 'urgent',
    label: 'Urgent',
    description: 'Problème critique nécessitant une attention immédiate',
    color: premiumColors.urgent,
    icon: <Whatshot />,
    chipColor: 'error'
  }
];

// === ENHANCED CUSTOM TOAST COMPONENT ===
const CustomToast = ({ type, fullName, message, importance, onDismiss, progress }) => {
  const isSuccess = type === 'success';
  const importanceConfig = importanceLevels.find(level => level.value === importance) || importanceLevels[1];

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 2,
        p: 2,
        borderRadius: 3,
        background: `linear-gradient(135deg, ${premiumColors.noir}EE 0%, ${premiumColors.charcoal}EE 100%)`,
        border: `1px solid ${isSuccess ? premiumColors.success + '40' : premiumColors.error + '40'}`,
        backdropFilter: 'blur(25px)',
        boxShadow: `0 12px 40px ${isSuccess ? premiumColors.success + '25' : premiumColors.error + '25'}`,
        maxWidth: 450,
        fontFamily: "'Fjalla One', sans-serif",
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: isSuccess ? premiumColors.success : premiumColors.error,
          animation: progress ? `shrinkWidth ${progress.duration}ms linear` : 'none'
        }
      }}
    >
      {/* Animated Logo */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 60 }}>
        <Box
          component="img"
          src="/tawakkol-logo.svg"
          alt="Tawakkol"
          sx={{ 
            width: 40, 
            height: 40, 
            mb: 0.5,
            filter: 'drop-shadow(0 0 10px rgba(212, 175, 55, 0.4))',
            animation: 'pulse 2s ease-in-out infinite'
          }}
        />
        <Typography
          sx={{
            background: premiumColors.premiumGradient,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            fontSize: '0.75rem',
            fontWeight: 800,
            letterSpacing: '1px',
            textTransform: 'uppercase',
            fontFamily: "'Fjalla One', sans-serif",
          }}
        >
          Tawakkol
        </Typography>
      </Box>

      {/* Content */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <Typography
            sx={{
              color: premiumColors.white,
              fontSize: '0.95rem',
              fontWeight: 700,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              fontFamily: "'Fjalla One', sans-serif",
            }}
          >
            {fullName}
          </Typography>
          <Chip
            icon={importanceConfig.icon}
            label={importanceConfig.label}
            size="small"
            color={importanceConfig.chipColor}
            sx={{ 
              height: 20,
              fontSize: '0.7rem',
              fontFamily: "'Fjalla One', sans-serif",
              '& .MuiChip-icon': { fontSize: '0.9rem' }
            }}
          />
        </Box>
        <Typography
          sx={{
            color: premiumColors.goldLight,
            fontSize: '0.85rem',
            lineHeight: 1.4,
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            fontFamily: "'Fjalla One', sans-serif",
          }}
        >
          {message}
        </Typography>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Tooltip title={isSuccess ? "Message Sent" : "Sending Failed"}>
          <IconButton
            size="small"
            sx={{ 
              color: isSuccess ? premiumColors.success : premiumColors.error, 
              p: 0.5,
              background: isSuccess ? premiumColors.success + '20' : premiumColors.error + '20',
              '&:hover': {
                background: isSuccess ? premiumColors.success + '30' : premiumColors.error + '30',
                transform: 'scale(1.1)'
              }
            }}
          >
            {isSuccess ? <Check fontSize="small" /> : <ErrorIcon fontSize="small" />}
          </IconButton>
        </Tooltip>
        <Tooltip title="Dismiss">
          <IconButton
            size="small"
            onClick={onDismiss}
            sx={{ 
              color: premiumColors.goldLight + '80', 
              p: 0.5,
              '&:hover': {
                color: premiumColors.goldLight,
                background: premiumColors.gold + '20',
                transform: 'scale(1.1)'
              }
            }}
          >
            <Close fontSize="small" />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

// === ENHANCED CONTACT COMPONENT ===
const Contact = ({ onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    importance: 'medium',
    issue: '',
    file: null
  });
  const [errors, setErrors] = useState({});
  const [fileName, setFileName] = useState('');
  const [typingEffect, setTypingEffect] = useState('');

  const theme = useTheme();
  const isLarge = useMediaQuery(theme.breakpoints.up('lg'));
  const fileInputRef = useRef(null);

  // Typing effect for header
  useEffect(() => {
    const text = "Contactez Tawakkol";
    let i = 0;
    const typing = setInterval(() => {
      if (i < text.length) {
        setTypingEffect(text.substring(0, i + 1));
        i++;
      } else {
        clearInterval(typing);
      }
    }, 100);
    return () => clearInterval(typing);
  }, []);

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error("File size must be less than 10MB");
        return;
      }
      setFormData(prev => ({ ...prev, file }));
      setFileName(file.name);
      
      // Show success message
      toast.success(`File "${file.name}" uploaded successfully`);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, file }));
      setFileName(file.name);
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Nom complet requis';
    if (!formData.email.trim()) newErrors.email = 'Email requis';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email invalide';
    if (!formData.phone.trim()) newErrors.phone = 'Téléphone requis';
    if (!formData.issue.trim()) newErrors.issue = 'Veuillez décrire votre problème';
    else if (formData.issue.length < 10) newErrors.issue = 'Description trop courte (min. 10 caractères)';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Veuillez corriger les erreurs dans le formulaire");
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call with progress
      await new Promise((resolve, reject) => {
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          if (progress >= 100) {
            clearInterval(interval);
            resolve();
          }
        }, 200);
      });

      console.log('Contact Form Submitted:', formData);

      // SUCCESS TOAST with progress bar
      toast.custom(
        (t) => (
          <CustomToast
            type="success"
            fullName={formData.fullName}
            importance={formData.importance}
            message="Votre message a été envoyé avec succès! Nous vous répondrons dans les plus brefs délais."
            onDismiss={() => toast.dismiss(t)}
            progress={{ duration: 5000 }}
          />
        ),
        { 
          duration: 5000, 
          id: 'contact-success',
          position: 'top-center'
        }
      );

      // Reset form
      setFormData({ fullName: '', email: '', phone: '', importance: 'medium', issue: '', file: null });
      setFileName('');
      
    } catch (err) {
      toast.error("Échec de l'envoi. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const getImportanceColor = () => {
    const level = importanceLevels.find(l => l.value === formData.importance);
    return level ? level.color : premiumColors.gold;
  };

  return (
    <>
      {/* ENHANCED SONNER TOASTER */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'transparent',
            border: 'none',
            boxShadow: 'none',
            padding: 0,
          },
        }}
        richColors
        closeButton
        theme="dark"
      />

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
            radial-gradient(circle at 12% 88%, ${premiumColors.gold}20 0%, transparent 48%),
            radial-gradient(circle at 88% 12%, ${premiumColors.gold}15 0%, transparent 52%),
            radial-gradient(circle at 50% 50%, ${premiumColors.gold}10 0%, transparent 70%),
            linear-gradient(45deg, transparent 30%, ${premiumColors.gold}05 50%, transparent 70%)
          `,
          pointerEvents: 'none',
          animation: 'pulse 8s ease-in-out infinite',
        }
      }}>
        
        {/* Enhanced Animated Ornaments */}
        {[...Array(6)].map((_, i) => (
          <Box key={i} sx={{
            position: 'absolute',
            top: `${20 + i * 15}%`,
            left: `${10 + i * 15}%`,
            animation: `float ${6 + i * 2}s ease-in-out infinite`,
            animationDelay: `${i * 0.5}s`,
            opacity: 0.1 + i * 0.03,
          }}>
            <Diamond sx={{ 
              fontSize: { xs: 30 + i * 5, lg: 40 + i * 10 }, 
              color: premiumColors.gold,
              filter: 'drop-shadow(0 0 20px rgba(212, 175, 55, 0.4))'
            }} />
          </Box>
        ))}

        <Box sx={{ 
          width: '100%', 
          px: { xs: 2, sm: 3, md: 4, lg: 6 }, 
          maxWidth: { lg: 1200, xl: 1400 }
        }}>
          <Zoom in timeout={800} style={{ transitionDelay: '200ms' }}>
            <Paper elevation={0} sx={{
              ...glassStyle,
              width: '100%',
              mx: 'auto',
              position: 'relative',
              '&::before': {
                content: '""',
                position: 'absolute',
                inset: 0,
                background: `linear-gradient(135deg, ${premiumColors.gold}15 0%, transparent 50%)`,
                pointerEvents: 'none',
                borderRadius: 'inherit'
              }
            }}>
              
              {/* Enhanced Premium Header */}
              <Box sx={{
                background: `linear-gradient(135deg, ${premiumColors.gold} 0%, ${premiumColors.goldDark} 100%)`,
                py: { xs: 4, lg: 3 },
                px: { xs: 3, lg: 4 },
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0, left: 0, right: 0, bottom: 0,
                  background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)',
                  transform: 'translateX(-100%)',
                  animation: 'shimmer 3s infinite',
                }
              }}>
                {onClose && (
                  <Tooltip title="Close">
                    <IconButton
                      onClick={onClose}
                      sx={{
                        position: 'absolute',
                        right: { xs: 16, lg: 24 },
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: premiumColors.noir,
                        background: `linear-gradient(135deg, ${premiumColors.white}60, ${premiumColors.white}40)`,
                        width: { xs: 40, lg: 52 },
                        height: { xs: 40, lg: 52 },
                        backdropFilter: 'blur(12px)',
                        border: `1px solid ${premiumColors.white}30`,
                        '&:hover': { 
                          background: `linear-gradient(135deg, ${premiumColors.white}80, ${premiumColors.white}60)`,
                          transform: 'translateY(-50%) scale(1.08)',
                          boxShadow: `0 8px 32px ${premiumColors.gold}40`
                        },
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
                      }}
                    >
                      <Close sx={{ fontSize: { xs: 22, lg: 28 } }} />
                    </IconButton>
                  </Tooltip>
                )}

                <Typography
                  variant="h1"
                  sx={{
                    fontFamily: "'Fjalla One', sans-serif",
                    fontWeight: 900,
                    background: premiumColors.noir,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                    mb: 2,
                    fontSize: { xs: '2.5rem', sm: '3.5rem', md: '4.5rem', lg: '5.5rem' },
                    letterSpacing: { xs: '-1px', lg: '-2px' },
                    textShadow: `4px 4px 20px ${premiumColors.noir}60`,
                    minHeight: '1.2em'
                  }}
                >
                  {typingEffect}
                </Typography>

                <Typography
                  variant="h5"
                  sx={{
                    color: premiumColors.noir + 'F0',
                    fontFamily: "'Fjalla One', sans-serif",
                    fontWeight: 600,
                    fontSize: { xs: '1rem', lg: '1.3rem' },
                    maxWidth: '800px',
                    mx: 'auto',
                    letterSpacing: '0.5px',
                    lineHeight: 1.4
                  }}
                >
                  Nous sommes là pour vous aider avec vos commandes, retours ou questions sur nos collections.
                </Typography>
              </Box>

              {/* Form Body */}
              <Box sx={{ p: { xs: 3, md: 4, lg: 6 } }}>
                <Fade in timeout={1000}>
                  <Box component="form" onSubmit={handleSubmit}>
                    
                    <Box sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                      gap: { xs: 2, lg: 3 },
                      mb: { xs: 3, lg: 4 }
                    }}>
                      <TextField
                        fullWidth
                        label="Nom Complet"
                        value={formData.fullName}
                        onChange={handleChange('fullName')}
                        error={!!errors.fullName}
                        helperText={errors.fullName}
                        sx={inputStyle}
                        InputProps={{
                          ...inputProps,
                          endAdornment: formData.fullName && (
                            <InputAdornment position="end">
                              <Check sx={{ color: premiumColors.success }} />
                            </InputAdornment>
                          )
                        }}
                      />

                      <TextField
                        fullWidth
                        label="Adresse Email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange('email')}
                        error={!!errors.email}
                        helperText={errors.email}
                        sx={inputStyle}
                        InputProps={{
                          ...inputProps,
                          endAdornment: (
                            <InputAdornment position="end">
                              <Email sx={{ color: premiumColors.gold + '80' }} />
                            </InputAdornment>
                          )
                        }}
                      />

                      <TextField
                        fullWidth
                        label="Numéro de Téléphone"
                        value={formData.phone}
                        onChange={handleChange('phone')}
                        error={!!errors.phone}
                        helperText={errors.phone}
                        sx={inputStyle}
                        InputProps={{
                          ...inputProps,
                          endAdornment: (
                            <InputAdornment position="end">
                              <Phone sx={{ color: premiumColors.gold + '80' }} />
                            </InputAdornment>
                          )
                        }}
                      />

                      {/* Importance Level Selector */}
                      <FormControl fullWidth sx={selectStyle}>
                        <InputLabel 
                          sx={{ 
                            color: premiumColors.goldLight + 'C0',
                            fontFamily: "'Fjalla One', sans-serif",
                            fontWeight: 600,
                            '&.Mui-focused': { 
                              color: getImportanceColor(),
                              fontWeight: 800
                            }
                          }}
                        >
                          Niveau d'Importance
                        </InputLabel>
                        <Select
                          value={formData.importance}
                          onChange={handleChange('importance')}
                          label="Niveau d'Importance"
                          sx={{
                            color: premiumColors.white,
                            fontFamily: "'Fjalla One', sans-serif",
                            fontWeight: 600,
                            height: { xs: 56, lg: 64 },
                            borderRadius: 3,
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: premiumColors.gold + '80',
                              borderWidth: 2
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: getImportanceColor(),
                            },
                            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                              borderColor: getImportanceColor(),
                              boxShadow: `0 0 0 3px ${getImportanceColor()}40`
                            }
                          }}
                          renderValue={(value) => {
                            const level = importanceLevels.find(l => l.value === value);
                            return (
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                {level.icon}
                                <Typography sx={{ 
                                  fontFamily: "'Fjalla One', sans-serif",
                                  fontWeight: 700,
                                  color: level.color
                                }}>
                                  {level.label}
                                </Typography>
                              </Box>
                            );
                          }}
                        >
                          {importanceLevels.map((level) => (
                            <MenuItem key={level.value} value={level.value} sx={menuItemStyle}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                                <Box sx={{ color: level.color }}>{level.icon}</Box>
                                <Box>
                                  <Typography sx={{ 
                                    fontFamily: "'Fjalla One', sans-serif",
                                    fontWeight: 700,
                                    color: premiumColors.white
                                  }}>
                                    {level.label}
                                  </Typography>
                                  <Typography sx={{ 
                                    fontFamily: "'Fjalla One', sans-serif",
                                    fontSize: '0.8rem',
                                    color: premiumColors.goldLight + '80',
                                    mt: 0.5
                                  }}>
                                    {level.description}
                                  </Typography>
                                </Box>
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      <TextField
                        fullWidth
                        label="Décrivez votre problème"
                        multiline
                        rows={4}
                        value={formData.issue}
                        onChange={handleChange('issue')}
                        error={!!errors.issue}
                        helperText={errors.issue}
                        sx={{
                          ...inputStyle,
                          gridColumn: { xs: '1 / -1', md: '1 / -1' },
                          '& .MuiOutlinedInput-root': {
                            height: 'auto',
                            py: 2
                          }
                        }}
                        InputProps={inputProps}
                      />
                    </Box>

                    {/* Enhanced File Upload */}
                    <Tooltip title="Click or drag & drop to upload files">
                      <Box
                        sx={{
                          mb: { xs: 3, lg: 4 },
                          p: 4,
                          border: `2px dashed ${premiumColors.gold}80`,
                          borderRadius: 3,
                          textAlign: 'center',
                          background: `linear-gradient(135deg, ${premiumColors.charcoal}40, ${premiumColors.noir}40)`,
                          cursor: 'pointer',
                          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                          position: 'relative',
                          overflow: 'hidden',
                          '&:hover': {
                            borderColor: premiumColors.gold,
                            background: `linear-gradient(135deg, ${premiumColors.charcoal}60, ${premiumColors.noir}60)`,
                            transform: 'translateY(-4px)',
                            boxShadow: `0 20px 40px ${premiumColors.gold}20`
                          },
                          '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0, left: 0, right: 0, bottom: 0,
                            background: `linear-gradient(45deg, transparent 30%, ${premiumColors.gold}10 50%, transparent 70%)`,
                            transform: 'translateX(-100%)',
                            transition: 'transform 0.6s ease'
                          },
                          '&:hover::before': {
                            transform: 'translateX(100%)'
                          }
                        }}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                        onClick={triggerFileInput}
                      >
                        <Upload sx={{ 
                          fontSize: { xs: 48, lg: 56 }, 
                          color: premiumColors.gold, 
                          mb: 2,
                          filter: 'drop-shadow(0 4px 12px rgba(212, 175, 55, 0.3))'
                        }} />
                        <Typography sx={{
                          color: premiumColors.goldLight,
                          fontFamily: "'Fjalla One', sans-serif",
                          fontSize: { xs: '1.1rem', lg: '1.2rem' },
                          fontWeight: 700,
                          mb: 1
                        }}>
                          {fileName ? `📎 ${fileName}` : 'Glissez un fichier ici ou cliquez pour uploader'}
                        </Typography>
                        <Typography sx={{
                          color: premiumColors.goldLight + '80',
                          fontSize: '0.9rem',
                          fontFamily: "'Fjalla One', sans-serif",
                        }}>
                          Supports: PDF, JPG, PNG • Max: 10MB
                        </Typography>
                        <input
                          ref={fileInputRef}
                          id="file-input"
                          type="file"
                          hidden
                          onChange={handleFileChange}
                          accept=".pdf,.jpg,.jpeg,.png"
                        />
                      </Box>
                    </Tooltip>

                    {/* Enhanced Submit Button */}
                    <Button
                      type="submit"
                      fullWidth
                      disabled={isLoading}
                      sx={{
                        background: `linear-gradient(45deg, ${premiumColors.gold}, ${premiumColors.goldDark})`,
                        color: premiumColors.noir,
                        py: { xs: 2, lg: 3 },
                        borderRadius: 4,
                        fontFamily: "'Fjalla One', sans-serif",
                        fontWeight: 800,
                        fontSize: { xs: '1.1rem', lg: '1.3rem' },
                        textTransform: 'none',
                        mb: { xs: 3, lg: 4 },
                        position: 'relative',
                        overflow: 'hidden',
                        boxShadow: `
                          0 20px 50px ${premiumColors.gold}40, 
                          0 0 0 1px ${premiumColors.gold}60,
                          0 0 30px ${premiumColors.gold}30
                        `,
                        '&:hover': {
                          background: `linear-gradient(45deg, ${premiumColors.goldLight}, ${premiumColors.gold})`,
                          transform: 'translateY(-6px) scale(1.02)',
                          boxShadow: `
                            0 30px 70px ${premiumColors.gold}50, 
                            0 0 0 2px ${premiumColors.gold},
                            0 0 50px ${premiumColors.gold}40
                          `,
                        },
                        '&:disabled': {
                          background: premiumColors.charcoal,
                          color: premiumColors.goldLight + '80',
                          transform: 'none',
                          boxShadow: 'none'
                        },
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0, left: '-100%',
                          width: '100%',
                          height: '100%',
                          background: `linear-gradient(90deg, transparent, ${premiumColors.white}40, transparent)`,
                          transition: 'left 0.6s ease'
                        },
                        '&:hover::before': { left: '100%' },
                        transition: 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)'
                      }}
                    >
                      {isLoading ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <CircularProgress size={20} sx={{ color: premiumColors.noir }} />
                          <span>Envoi sécurisé en cours...</span>
                        </Box>
                      ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Security fontSize="small" />
                          <span>Envoyer le Message Sécurisé</span>
                          <ChevronRight fontSize="small" />
                        </Box>
                      )}
                    </Button>

                    {/* Enhanced Contact Options */}
                    <Box sx={{ 
                      display: 'grid', 
                      gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, 
                      gap: 3,
                      textAlign: 'center'
                    }}>
                      <Box>
                        <Typography sx={{
                          color: premiumColors.goldLight,
                          fontFamily: "'Fjalla One', sans-serif",
                          fontSize: '1rem',
                          fontWeight: 600,
                          mb: 1
                        }}>
                          📞 Support Urgent
                        </Typography>
                        <Button
                          href="tel:+21623265016"
                          startIcon={<Phone />}
                          sx={{
                            color: premiumColors.gold,
                            textTransform: 'none',
                            fontWeight: 700,
                            fontSize: '1.1rem',
                            fontFamily: "'Fjalla One', sans-serif",
                            p: 1,
                            borderRadius: 2,
                            '&:hover': {
                              color: premiumColors.goldLight,
                              background: premiumColors.gold + '20',
                              transform: 'scale(1.05)'
                            },
                            transition: 'all 0.3s ease'
                          }}
                        >
                          +216 23 265 016
                        </Button>
                      </Box>
                      <Box>
                        <Typography sx={{
                          color: premiumColors.goldLight,
                          fontFamily: "'Fjalla One', sans-serif",
                          fontSize: '1rem',
                          fontWeight: 600,
                          mb: 1
                        }}>
                          ✉️ Email Direct
                        </Typography>
                        <Button
                          href="mailto:support@tawakkol.com"
                          startIcon={<Email />}
                          sx={{
                            color: premiumColors.gold,
                            textTransform: 'none',
                            fontWeight: 700,
                            fontSize: '1.1rem',
                            fontFamily: "'Fjalla One', sans-serif",
                            p: 1,
                            borderRadius: 2,
                            '&:hover': {
                              color: premiumColors.goldLight,
                              background: premiumColors.gold + '20',
                              transform: 'scale(1.05)'
                            },
                            transition: 'all 0.3s ease'
                          }}
                        >
                          support@tawakkol.com
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                </Fade>
              </Box>
            </Paper>
          </Zoom>
        </Box>

        {/* Enhanced Loading Backdrop */}
        <Backdrop
          open={isLoading}
          sx={{
            color: premiumColors.gold,
            zIndex: 9999,
            background: `linear-gradient(135deg, ${premiumColors.noir}EE, ${premiumColors.charcoal}EE)`,
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)'
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress
              size={isLarge ? 100 : 80}
              thickness={2}
              sx={{ 
                color: premiumColors.gold, 
                mb: 4,
                filter: 'drop-shadow(0 0 40px rgba(212, 175, 55, 0.8))'
              }}
            />
            <Typography sx={{
              background: premiumColors.premiumGradient,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              fontFamily: "'Fjalla One', sans-serif",
              fontSize: { xs: '1.5rem', lg: '2rem' },
              fontWeight: 700,
              letterSpacing: '1px',
              mb: 2
            }}>
              Envoi Sécurisé en Cours...
            </Typography>
            <Typography sx={{
              color: premiumColors.goldLight,
              fontFamily: "'Fjalla One', sans-serif",
              fontSize: '1.1rem',
              fontWeight: 600
            }}>
              Cryptage et transmission des données
            </Typography>
          </Box>
        </Backdrop>
      </Box>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Fjalla+One&display=swap');
        
        @keyframes shrinkWidth {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </>
  );
};

// === ENHANCED INPUT STYLES ===
const inputStyle = {
  '& .MuiOutlinedInput-root': {
    color: premiumColors.white,
    fontSize: { xs: '1rem', lg: '1.1rem' },
    height: { xs: 56, lg: 64 },
    borderRadius: 3,
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    '& fieldset': {
      borderColor: premiumColors.gold + '80',
      borderWidth: 2
    },
    '&:hover fieldset': {
      borderColor: premiumColors.gold,
      boxShadow: `0 0 0 2px ${premiumColors.gold}40, 0 8px 24px ${premiumColors.gold}20`
    },
    '&.Mui-focused fieldset': {
      borderColor: premiumColors.gold,
      boxShadow: `0 0 0 3px ${premiumColors.gold}40, 0 12px 32px ${premiumColors.gold}30`
    }
  },
  '& .MuiInputLabel-root': {
    color: premiumColors.goldLight + 'C0',
    fontSize: { xs: '1rem', lg: '1.1rem' },
    fontWeight: 600,
    fontFamily: "'Fjalla One', sans-serif",
    '&.Mui-focused': { 
      color: premiumColors.gold,
      fontWeight: 800
    }
  },
  '& .MuiFormHelperText-root': {
    color: premiumColors.error,
    fontWeight: 600,
    fontSize: '0.85rem',
    marginLeft: 0,
    fontFamily: "'Fjalla One', sans-serif",
  }
};

const selectStyle = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 3,
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  }
};

const menuItemStyle = {
  fontFamily: "'Fjalla One', sans-serif",
  background: `linear-gradient(135deg, ${premiumColors.charcoal} 0%, ${premiumColors.noir} 100%)`,
  margin: '4px 8px',
  borderRadius: 2,
  '&:hover': {
    background: `linear-gradient(135deg, ${premiumColors.charcoal} 0%, ${premiumColors.noir} 100%)`,
  },
  '&.Mui-selected': {
    background: `linear-gradient(135deg, ${premiumColors.charcoal} 0%, ${premiumColors.noir} 100%)`,
    border: `1px solid ${premiumColors.gold}40`,
  },
  '&.Mui-selected:hover': {
    background: `linear-gradient(135deg, ${premiumColors.charcoal} 0%, ${premiumColors.noir} 100%)`,
  }
};

const inputProps = {
  style: { 
    color: premiumColors.white, 
    fontFamily: "'Fjalla One', sans-serif", 
    fontWeight: 600 
  }
};

export default Contact;