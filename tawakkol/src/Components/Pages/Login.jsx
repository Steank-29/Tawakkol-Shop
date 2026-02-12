import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  Fade,
  Zoom,
  useTheme,
  useMediaQuery,
  Backdrop,
  CircularProgress
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Diamond,
  Close,
  StarBorder,
  ChevronRight,
  Check,
  Error as ErrorIcon,
  Security
} from '@mui/icons-material';
import { toast, Toaster } from 'sonner';
import { setAuthData } from '../../Config/auth';

const premiumColors = {
  noir: '#1a1a1a',
  gold: '#d4af37',
  goldLight: '#f4e4a6',
  goldDark: '#b8941f',
  charcoal: '#2d2d2d',
  white: '#ffffff',
  error: '#ff4757',
  success: '#2ed573',
  premiumGradient: 'linear-gradient(135deg, #d4af37 0%, #f9d423 50%, #d4af37 100%)'
};

const glassStyle = {
  background: `linear-gradient(135deg, ${premiumColors.noir}99 0%, ${premiumColors.charcoal}99 100%)`,
  backdropFilter: 'blur(32px)',
  WebkitBackdropFilter: 'blur(32px)',
  border: `1px solid ${premiumColors.gold}32`,
  boxShadow: `
    0 30px 90px ${premiumColors.gold}20,
    0 12px 45px ${premiumColors.noir}50,
    inset 0 1px 0 ${premiumColors.gold}25,
    inset 0 -1px 0 ${premiumColors.gold}15
  `,
  borderRadius: { xs: 12, lg: 16 },
  overflow: 'hidden'
};

// === CUSTOM TOAST COMPONENT ===
const CustomToast = ({ type, email, message, onDismiss, progress }) => {
  const isSuccess = type === 'success';

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
        fontFamily: "'Playfair Display', serif",
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
            }}
          >
            {email}
          </Typography>
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
          }}
        >
          {message}
        </Typography>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
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
      </Box>
    </Box>
  );
};

const Login = ({ onClose, onSwitchToSignup }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ 
    email: '', 
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [typingEffect, setTypingEffect] = useState('');

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isLarge = useMediaQuery(theme.breakpoints.up('lg'));

  // Typing effect for header
  useEffect(() => {
    const text = "Connexion Admin";
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Clear previous errors
    setErrors({});
    
    // Basic validation
    const newErrors = {};
    if (!formData.email) newErrors.email = 'Email requis';
    if (!formData.password) newErrors.password = 'Mot de passe requis';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      
      // VALIDATION ERROR TOAST
      toast.custom(
        (t) => (
          <CustomToast
            type="error"
            email={formData.email || "Utilisateur"}
            message="Veuillez remplir tous les champs requis."
            onDismiss={() => toast.dismiss(t)}
          />
        ),
        { duration: 5000, id: 'login-validation-error' }
      );
      
      setIsLoading(false);
      return;
    }

    try {
      // Send login request to your backend using proxy
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Use our auth utility to save data properly
        setAuthData(data.token, data.admin);
        
        // Get admin role from backend response
        const adminRole = data.admin.role;
        const adminName = data.admin.firstName + ' ' + data.admin.lastName;
        const adminEmail = data.admin.email;
        
        // SUCCESS TOAST - Show role-specific message
        const welcomeMessage = adminRole === 'super-admin' 
          ? `Bienvenue Super Admin ${adminName}! Accès complet activé.`
          : `Bienvenue Admin ${adminName}! Accès à votre espace de gestion.`;
        
        toast.custom(
          (t) => (
            <CustomToast
              type="success"
              email={adminEmail}
              message={welcomeMessage}
              onDismiss={() => toast.dismiss(t)}
              progress={{ duration: 5000 }}
            />
          ),
          { 
            duration: 5000, 
            id: 'login-success',
            position: 'top-center'
          }
        );
        
        // Redirect based on admin role from backend
        setTimeout(() => {
          // Check if there's a redirect URL stored in sessionStorage
          const redirectAfterLogin = sessionStorage.getItem('redirectAfterLogin');
          
          if (redirectAfterLogin) {
            // Clear the stored redirect URL
            sessionStorage.removeItem('redirectAfterLogin');
            window.location.href = redirectAfterLogin;
          } else {
            // Default redirect based on role
            if (adminRole === 'super-admin') {
              window.location.href = '/Admin-Panel/Creating-New-Product';
            } else {
              window.location.href = '/Admin-Panel/Creating-New-Product';
            }
          }
        }, 2000);
        
      } else {
        // Handle different error cases
        let errorMessage = data.message || 'Échec de la connexion';
        
        if (data.message?.includes('Invalid credentials')) {
          errorMessage = 'Identifiants invalides. Veuillez vérifier votre email et mot de passe.';
        } else if (data.message?.includes('not authorized')) {
          errorMessage = 'Accès non autorisé. Contactez le super administrateur.';
        } else if (data.message?.includes('deactivated')) {
          errorMessage = 'Votre compte a été désactivé. Veuillez contacter le super administrateur.';
        } else if (data.message?.includes('not found')) {
          errorMessage = 'Aucun compte trouvé avec cet email.';
        } else if (response.status === 500) {
          errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
        } else if (response.status === 400) {
          errorMessage = 'Requête invalide. Vérifiez vos informations.';
        }
        
        throw new Error(errorMessage);
      }
      
    } catch (err) {
      console.error('Login error:', err);
      
      // Check if it's a network error
      let errorMessage = err.message || "Erreur de connexion. Veuillez réessayer.";
      
      if (err.message.includes('Failed to fetch')) {
        errorMessage = 'Impossible de se connecter au serveur. Vérifiez que le backend est en cours d\'exécution.';
      }
      
      // ERROR TOAST
      toast.custom(
        (t) => (
          <CustomToast
            type="error"
            email={formData.email}
            message={errorMessage}
            onDismiss={() => toast.dismiss(t)}
          />
        ),
        { duration: 6000, id: 'login-error' }
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field) => (e) => {
    const value = e.target.value;
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: '' }));
  };

  // Pre-fill demo credentials for testing
  const fillDemoCredentials = (type = 'super-admin') => {
    if (type === 'super-admin') {
      setFormData({
        email: 'superadmin@tawakkol.com',
        password: 'superadmin123'
      });
      toast.custom(
        (t) => (
          <CustomToast
            type="info"
            email="superadmin@tawakkol.com"
            message="Super Admin credentials filled. Click 'Se Connecter' to login."
            onDismiss={() => toast.dismiss(t)}
          />
        ),
        { duration: 4000, id: 'demo-filled' }
      );
    } else {
      setFormData({
        email: 'admin@tawakkol.com',
        password: 'admin123'
      });
      toast.custom(
        (t) => (
          <CustomToast
            type="info"
            email="admin@tawakkol.com"
            message="Admin credentials filled. Click 'Se Connecter' to login."
            onDismiss={() => toast.dismiss(t)}
          />
        ),
        { duration: 4000, id: 'demo-filled' }
      );
    }
  };

  return (
    <>
      {/* SONNER TOASTER */}
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
        {/* Animated Ornaments */}
        <Box sx={{
          position: 'absolute',
          top: '10%',
          left: '6%',
          animation: 'float 8s ease-in-out infinite',
          '@keyframes float': {
            '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
            '50%': { transform: 'translateY(-30px) rotate(6deg)' }
          }
        }}>
          <Diamond sx={{ 
            fontSize: { xs: 40, lg: 60 },
            color: premiumColors.gold, 
            opacity: 0.14,
            filter: 'drop-shadow(0 0 20px rgba(212, 175, 55, 0.3))'
          }} />
        </Box>

        <Box sx={{
          position: 'absolute',
          bottom: '16%',
          right: '8%',
          animation: 'float 10s ease-in-out infinite reverse',
          animationDelay: '2s'
        }}>
          <StarBorder sx={{ 
            fontSize: { xs: 30, lg: 50 },
            color: premiumColors.gold, 
            opacity: 0.12,
            filter: 'drop-shadow(0 0 15px rgba(212, 175, 55, 0.25))'
          }} />
        </Box>

        <Box sx={{ 
          width: '100%', 
          px: { xs: 2, sm: 3, md: 5, lg: 8, xl: 12 },
          maxWidth: 'none'
        }}>
          <Zoom in timeout={{ enter: 1000 }} style={{ transitionDelay: '150ms' }}>
            <Paper
              elevation={0}
              sx={{
                ...glassStyle,
                width: '100%',
                mx: 'auto',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(135deg, rgba(212, 175, 55, 0.03) 0%, transparent 50%)',
                  pointerEvents: 'none',
                  borderRadius: 'inherit'
                }
              }}
            >
              {/* Ultra-Premium Header */}
              <Box sx={{
                background: `linear-gradient(135deg, ${premiumColors.gold} 0%, ${premiumColors.goldDark} 100%)`,
                py: { xs: 3, lg: 2 },
                px: { xs: 3, lg: 3 },
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0, left: 0, right: 0, bottom: 0,
                  background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%)',
                  transform: 'translateX(-100%)',
                  animation: 'shimmer 2.5s infinite',
                  '@keyframes shimmer': {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(100%)' }
                  }
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '1px',
                  background: `linear-gradient(90deg, transparent, ${premiumColors.white}20, transparent)`
                }
              }}>
                {onClose && (
                  <IconButton
                    onClick={onClose}
                    sx={{
                      position: 'absolute',
                      right: { xs: 12, lg: 24 },
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: premiumColors.noir,
                      background: premiumColors.white + '50',
                      width: { xs: 36, lg: 48 },
                      height: { xs: 36, lg: 48 },
                      backdropFilter: 'blur(8px)',
                      '&:hover': { 
                        background: premiumColors.white + '70',
                        transform: 'translateY(-50%) scale(1.05)'
                      },
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                    }}
                  >
                    <Close sx={{ fontSize: { xs: 20, lg: 26 } }} />
                  </IconButton>
                )}

                <Typography
                  variant="h1"
                  sx={{
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 900,
                    color: premiumColors.noir,
                    mb: 1,
                    fontSize: { 
                      xs: '2rem', 
                      sm: '2.5rem', 
                      md: '3.5rem', 
                      lg: '4.5rem', 
                      xl: '5rem' 
                    },
                    letterSpacing: { xs: '-0.5px', lg: '-1px' },
                    textShadow: `3px 3px 12px ${premiumColors.noir}40`,
                    position: 'relative',
                    minHeight: '1.2em'
                  }}
                >
                  {typingEffect}
                </Typography>

                <Typography
                  variant="h5"
                  sx={{
                    color: premiumColors.noir + 'F0',
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 600,
                    fontSize: { xs: '0.9rem', lg: '1.2rem' },
                    maxWidth: '900px',
                    mx: 'auto',
                    letterSpacing: '0.3px'
                  }}
                >
                  Accédez à votre espace d'administration Tawakkol
                </Typography>
              </Box>

              {/* Form Body */}
              <Box sx={{ 
                p: { xs: 3, md: 5, lg: 8, xl: 10 },
                position: 'relative'
              }}>
                <Fade in timeout={1400}>
                  <Box component="form" onSubmit={handleSubmit}>
                    <Box sx={{
                      display: 'grid',
                      gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
                      gap: { xs: 2, lg: 4 },
                      mb: { xs: 3, lg: 5 }
                    }}>
                      <TextField
                        fullWidth
                        label="Adresse Email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange('email')}
                        error={!!errors.email}
                        helperText={errors.email}
                        placeholder="admin@tawakkol.com"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            color: premiumColors.white,
                            fontSize: { xs: '0.9rem', lg: '1rem' },
                            height: { xs: 50, lg: 60 },
                            borderRadius: 2,
                            transition: 'all 0.3s ease',
                            '& fieldset': {
                              borderColor: premiumColors.gold + '60',
                              borderWidth: 2
                            },
                            '&:hover fieldset': {
                              borderColor: premiumColors.gold + '80',
                              boxShadow: `0 0 0 1px ${premiumColors.gold}60`
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: premiumColors.gold,
                              boxShadow: `0 0 0 2px ${premiumColors.gold}40, 0 0 20px ${premiumColors.gold}30`
                            }
                          },
                          '& .MuiInputLabel-root': {
                            color: premiumColors.goldLight + 'A0',
                            fontSize: { xs: '0.9rem', lg: '1rem' },
                            fontWeight: 600,
                            '&.Mui-focused': { 
                              color: premiumColors.gold,
                              fontWeight: 700
                            }
                          },
                          '& .MuiFormHelperText-root': {
                            color: premiumColors.error,
                            fontWeight: 600,
                            fontSize: '0.8rem'
                          },
                        }}
                        InputProps={{
                          style: { 
                            color: premiumColors.white, 
                            fontFamily: "'Playfair Display', serif", 
                            fontWeight: 600 
                          }
                        }}
                      />

                      <TextField
                        fullWidth
                        label="Mot de Passe"
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={handleChange('password')}
                        error={!!errors.password}
                        helperText={errors.password}
                        placeholder="••••••••"
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            color: premiumColors.white,
                            fontSize: { xs: '0.9rem', lg: '1rem' },
                            height: { xs: 50, lg: 60 },
                            borderRadius: 2,
                            transition: 'all 0.3s ease',
                            '& fieldset': {
                              borderColor: premiumColors.gold + '60',
                              borderWidth: 2
                            },
                            '&:hover fieldset': {
                              borderColor: premiumColors.gold + '80',
                              boxShadow: `0 0 0 1px ${premiumColors.gold}60`
                            },
                            '&.Mui-focused fieldset': {
                              borderColor: premiumColors.gold,
                              boxShadow: `0 0 0 2px ${premiumColors.gold}40, 0 0 20px ${premiumColors.gold}30`
                            }
                          },
                          '& .MuiInputLabel-root': {
                            color: premiumColors.goldLight + 'A0',
                            fontSize: { xs: '0.9rem', lg: '1rem' },
                            fontWeight: 600,
                            '&.Mui-focused': { 
                              color: premiumColors.gold,
                              fontWeight: 700
                            }
                          }
                        }}
                        InputProps={{
                          style: { 
                            color: premiumColors.white, 
                            fontFamily: "'Playfair Display', serif", 
                            fontWeight: 600 
                          },
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowPassword(!showPassword)}
                                sx={{ 
                                  color: premiumColors.gold, 
                                  p: { xs: 1, lg: 1.5 },
                                  '&:hover': {
                                    background: premiumColors.gold + '20',
                                    transform: 'scale(1.1)'
                                  }
                                }}
                              >
                                {showPassword ? 
                                  <VisibilityOff sx={{ fontSize: { xs: 20, lg: 24 } }} /> :
                                  <Visibility sx={{ fontSize: { xs: 20, lg: 24 } }} />
                                }
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                      />
                    </Box>


                    <Box sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: { xs: 3, lg: 5 },
                      flexDirection: { xs: 'column', sm: 'row' },
                      gap: { xs: 2, sm: 0 }
                    }}>
                      <Box
                        sx={{
                          display: 'flex',
                          gap: { xs: 2, md: 3 },
                          alignItems: 'center',
                          flexWrap: 'wrap',
                        }}
                      >
                        {/* Keep Forgot Password Button */}
                      </Box>

                      <Button 
                        type="button"
                        onClick={() => {
                          // Handle forgot password
                          toast.custom(
                            (t) => (
                              <CustomToast
                                type="info"
                                email={formData.email || "Utilisateur"}
                                message="Fonctionnalité de réinitialisation du mot de passe bientôt disponible."
                                onDismiss={() => toast.dismiss(t)}
                              />
                            ),
                            { duration: 5000, id: 'forgot-password-info' }
                          );
                        }}
                        sx={{
                          color: premiumColors.gold,
                          textTransform: 'none',
                          fontSize: { xs: '0.9rem', lg: '1rem' },
                          fontWeight: 700,
                          fontFamily: "'Playfair Display', serif",
                          px: 2,
                          py: 1,
                          borderRadius: 2,
                          background: premiumColors.gold + '15',
                          '&:hover': {
                            color: premiumColors.goldLight,
                            background: premiumColors.gold + '25',
                            transform: 'translateY(-2px)',
                            boxShadow: `0 8px 25px ${premiumColors.gold}30`
                          },
                          transition: 'all 0.3s ease'
                        }}
                      >
                        Mot de passe oublié ?
                      </Button>
                    </Box>

                    <Button
                      type="submit"
                      fullWidth
                      disabled={isLoading}
                      sx={{
                        background: `linear-gradient(45deg, ${premiumColors.gold}, ${premiumColors.goldDark})`,
                        color: premiumColors.noir,
                        py: { xs: 1.8, lg: 2.5 },
                        borderRadius: 3,
                        fontFamily: "'Playfair Display', serif",
                        fontWeight: 800,
                        fontSize: { xs: '1rem', lg: '1.2rem' },
                        textTransform: 'none',
                        mb: { xs: 3, lg: 5 },
                        position: 'relative',
                        overflow: 'hidden',
                        boxShadow: `0 20px 50px ${premiumColors.gold}40, 0 0 0 1px ${premiumColors.gold}60`,
                        '&:hover': {
                          background: `linear-gradient(45deg, ${premiumColors.goldLight}, ${premiumColors.gold})`,
                          transform: 'translateY(-4px) scale(1.01)',
                          boxShadow: `0 30px 70px ${premiumColors.gold}50, 0 0 0 2px ${premiumColors.gold}`
                        },
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0, left: '-200%',
                          width: '200%',
                          height: '100%',
                          background: `linear-gradient(90deg, transparent, ${premiumColors.white}35, transparent)`,
                          transition: 'left 0.8s'
                        },
                        '&:hover::before': { left: '100%' },
                        transition: 'all 0.5s cubic-bezier(0.23, 1, 0.32, 1)'
                      }}
                    >
                      {isLoading ? (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                          <CircularProgress size={20} sx={{ color: premiumColors.noir }} />
                          <span>Connexion en cours...</span>
                        </Box>
                      ) : (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Security fontSize="small" />
                          <span>Se Connecter en tant qu'Admin</span>
                          <ChevronRight fontSize="small" />
                        </Box>
                      )}
                    </Button>

                    <Box sx={{ textAlign: 'center' }}>
                      <Typography sx={{
                        color: premiumColors.goldLight + 'E0',
                        fontFamily: "'Playfair Display', serif",
                        fontSize: { xs: '0.95rem', lg: '1.1rem' },
                        fontWeight: 600,
                        letterSpacing: '0.3px'
                      }}>
                        Nouvel administrateur ?{' '}
                        <Button
                          onClick={onSwitchToSignup}
                          endIcon={<ChevronRight sx={{ fontSize: { xs: 20, lg: 24 }, ml: -0.5 }} />}
                          sx={{
                            color: premiumColors.gold,
                            textTransform: 'none',
                            fontWeight: 800,
                            fontSize: { xs: '0.95rem', lg: '1.1rem' },
                            fontFamily: "'Playfair Display', serif",
                            p: 0,
                            '&:hover': {
                              color: premiumColors.goldLight,
                              background: 'transparent',
                              textDecoration: 'underline',
                              textUnderlineOffset: '4px'
                            }
                          }}
                        >
                          Créer un compte administrateur
                        </Button>
                      </Typography>
                    </Box>
                  </Box>
                </Fade>
              </Box>
            </Paper>
          </Zoom>
        </Box>

        {/* Ultra-Premium Loading */}
        <Backdrop
          open={isLoading}
          sx={{
            color: premiumColors.gold,
            zIndex: 9999,
            background: premiumColors.noir + 'F8',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)'
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress
              size={isLarge ? 80 : 60}
              thickness={2}
              sx={{ 
                color: premiumColors.gold, 
                mb: 3,
                filter: 'drop-shadow(0 0 30px rgba(212, 175, 55, 0.6))'
              }}
            />
            <Typography sx={{
              background: premiumColors.premiumGradient,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              fontFamily: "'Playfair Display', serif",
              fontSize: { xs: '1.2rem', lg: '1.6rem' },
              fontWeight: 700,
              letterSpacing: '1px',
              mb: 2
            }}>
              Connexion sécurisée...
            </Typography>
            <Typography sx={{
              color: premiumColors.goldLight,
              fontFamily: "'Playfair Display', serif",
              fontSize: '1.1rem',
              fontWeight: 600
            }}>
              Vérification de vos identifiants d'administration
            </Typography>
          </Box>
        </Backdrop>
      </Box>

      <style jsx global>{`
        @keyframes shrinkWidth {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </>
  );
};

export default Login;