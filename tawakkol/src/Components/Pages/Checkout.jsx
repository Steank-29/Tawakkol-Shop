// src/pages/Checkout.jsx
import React, { useState, useEffect, useMemo } from 'react';
import {
  Container,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  Divider,
  Box,
  Alert,
  Stepper,
  Step,
  StepLabel,
  Fade,
  Zoom,
  IconButton,
  InputAdornment,
  CircularProgress,
  Chip,
  Tooltip,
  useTheme,
  useMediaQuery,
  Radio,
  RadioGroup,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Snackbar,
} from '@mui/material';
import {
  LocalShipping,
  Payment,
  Assignment,
  CheckCircle,
  Lock,
  CreditCard,
  Phone,
  Email,
  LocationOn,
  Person,
  Info,
  LocalAtm,
  ArrowBack,
  Home,
  Straighten,
  ShoppingBag,
  Receipt,
} from '@mui/icons-material';
import { useCart } from '../../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import API_BASE from '../../Config/api';

// Theme colors - White background with gold/black accents
const palette = {
  white: '#ffffff',
  gold: '#d4af37',
  goldLight: '#f5e8b5',
  goldDark: '#b8941f',
  noir: '#0a0a0a',
  charcoal: '#1a1a1a',
  slate: '#374151',
  lightGray: '#f5f5f5',
  borderGray: '#e5e7eb',
  success: '#10b981',
  error: '#dc2626',
  warning: '#f59e0b',
};

const steps = ['Livraison', 'Paiement', 'Confirmation'];

// Size options for clothing
const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '2XL', '3XL', '4XL'];

// Tunisian cities
const tunisianCities = [
  'Tunis', 'Ariana', 'Ben Arous', 'Manouba', 'Sfax', 'Sousse', 'Kairouan',
  'Bizerte', 'Gabès', 'Gafsa', 'Kébili', 'Le Kef', 'Mahdia', 'Médenine',
  'Monastir', 'Nabeul', 'Siliana', 'Tataouine', 'Tozeur', 'Zaghouan'
];

const Checkout = () => {
  const { cart, subtotal, shippingCost, tax, total, setIsCartOpen, clearCart } = useCart();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // State declarations
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [orderResult, setOrderResult] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info'
  });

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Tunisie',
    notes: '',
    clothingSize: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Pre-fill form from localStorage if available
    const savedFormData = localStorage.getItem('checkout_form_data');
    if (savedFormData) {
      try {
        const parsedData = JSON.parse(savedFormData);
        setFormData(parsedData);
      } catch (error) {
        console.error('Error parsing saved form data:', error);
      }
    }
  }, []);

  // Save form data to localStorage on change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      localStorage.setItem('checkout_form_data', JSON.stringify(formData));
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [formData]);

  const showSnackbar = (message, severity = 'info') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (activeStep === 0) {
      if (!formData.fullName.trim()) newErrors.fullName = 'Nom requis';
      if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = 'Email invalide';
      if (!formData.phone.match(/^[0-9]{8}$/)) newErrors.phone = 'Numéro de téléphone invalide (8 chiffres requis)';
      if (!formData.address.trim()) newErrors.address = 'Adresse requise';
      if (!formData.city.trim()) newErrors.city = 'Ville requise';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      if (activeStep === steps.length - 2) {
        handleSubmit();
      } else {
        setActiveStep((prev) => prev + 1);
      }
    } else {
      showSnackbar('Veuillez corriger les erreurs dans le formulaire', 'error');
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      // Preserve the cart values before clearing
      const preservedSubtotal = parseFloat(subtotal.toFixed(2));
      const preservedShippingCost = parseFloat(shippingCost.toFixed(2));
      const preservedTax = parseFloat(tax.toFixed(2));
      const preservedTotal = parseFloat(total.toFixed(2));
      
      // Prepare order data
      const orderData = {
        customer: {
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          address: formData.address.trim(),
          city: formData.city.trim(),
          postalCode: formData.postalCode.trim(),
          country: formData.country,
          notes: formData.notes.trim(),
          clothingSize: formData.clothingSize,
        },
        items: cart.map(item => ({
          productId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          selectedSize: item.selectedSize || null,
          selectedColor: item.selectedColor || null,
          mainImage: item.mainImage,
          variantKey: `${item._id}-${item.selectedSize || 'nosize'}-${item.selectedColor || 'nocolor'}`
        })),
        paymentMethod: 'cash',
        subtotal: preservedSubtotal,
        shippingCost: preservedShippingCost,
        tax: preservedTax,
        total: preservedTotal,
        notes: formData.notes.trim()
      };
      
      console.log('Submitting order to:', API_BASE);

      const response = await fetch(`${API_BASE}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();
      console.log('API Response:', data);

      if (response.ok && data.success) {
        // Clear saved form data
        localStorage.removeItem('checkout_form_data');
        
        // Store order result for confirmation page with preserved values
        const resultData = {
          orderNumber: data.data?.order?.orderNumber || `ORD${Date.now().toString().slice(-8)}`,
          orderId: data.data?.order?._id,
          emailSent: data.data?.emailSent || false,
          // Store the preserved values
          subtotal: preservedSubtotal,
          shippingCost: preservedShippingCost,
          tax: preservedTax,
          total: preservedTotal
        };
        
        setOrderResult(resultData);
        
        // Show success snackbar
        showSnackbar('Commande confirmée avec succès!', 'success');
        
        // Clear cart and move to confirmation
        clearCart();
        setActiveStep((prev) => prev + 1);
      } else {
        console.error('Order submission failed:', data);
        showSnackbar(`Erreur: ${data.message || 'Échec de la commande'}`, 'error');
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      
      if (error.message === 'Failed to fetch') {
        showSnackbar('Impossible de se connecter au serveur. Vérifiez votre connexion internet.', 'error');
      } else {
        showSnackbar('Erreur réseau. Veuillez réessayer.', 'error');
      }
    } finally {
      setLoading(false);
    }
  };

  const calculateDeliveryDate = () => {
    const today = new Date();
    const deliveryDate = new Date(today);
    
    // Add 3-5 business days (skip weekends)
    let daysToAdd = 3 + Math.floor(Math.random() * 3); // 3-5 days
    
    while (daysToAdd > 0) {
      deliveryDate.setDate(deliveryDate.getDate() + 1);
      // Skip weekends (0 = Sunday, 6 = Saturday)
      if (deliveryDate.getDay() !== 0 && deliveryDate.getDay() !== 6) {
        daysToAdd--;
      }
    }
    
    return deliveryDate.toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (cart.length === 0 && activeStep < 2) {
    return (
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Zoom in={true}>
          <Paper
            elevation={0}
            sx={{
              p: 6,
              textAlign: 'center',
              background: '#f8fafc',
              border: '1px solid',
              borderColor: palette.borderGray,
              borderRadius: 3,
              maxWidth: 600,
              mx: 'auto',
            }}
          >
            <ShoppingBag sx={{ fontSize: 64, color: palette.gold, mb: 3, opacity: 0.7 }} />
            <Typography variant="h5" sx={{ fontWeight: 700, color: palette.noir, mb: 2 }}>
              Votre panier est vide
            </Typography>
            <Typography variant="body1" sx={{ color: palette.slate, mb: 4, maxWidth: 400, mx: 'auto' }}>
              Ajoutez des articles à votre panier avant de procéder au paiement.
            </Typography>
            <Button
              variant="contained"
              onClick={() => navigate('/products')}
              sx={{
                background: palette.gold,
                color: palette.noir,
                fontWeight: 700,
                px: 4,
                py: 1.5,
                '&:hover': {
                  background: palette.goldDark,
                },
              }}
            >
              <ShoppingBag sx={{ mr: 1 }} />
              Voir les produits
            </Button>
          </Paper>
        </Zoom>
      </Container>
    );
  }

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                color: palette.noir,
                mb: 4,
                display: 'flex',
                alignItems: 'center',
                gap: 1.5,
              }}
            >
              <LocalShipping sx={{ color: palette.gold }} />
              Informations de livraison
            </Typography>

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Nom complet *"
                  name="fullName"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  required
                  error={!!errors.fullName}
                  helperText={errors.fullName}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person sx={{ color: palette.gold }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: palette.gold,
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: palette.gold,
                      },
                    },
                  }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Email *"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                  error={!!errors.email}
                  helperText={errors.email}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email sx={{ color: palette.gold }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Téléphone *"
                  name="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  required
                  error={!!errors.phone}
                  helperText={errors.phone || 'Format: 8 chiffres'}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Phone sx={{ color: palette.gold }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              
              {/* Clothing Size Select */}
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel id="clothing-size-label">Taille de vêtement (optionnel)</InputLabel>
                  <Select
                    labelId="clothing-size-label"
                    value={formData.clothingSize}
                    label="Taille de vêtement (optionnel)"
                    onChange={(e) => setFormData({...formData, clothingSize: e.target.value})}
                    startAdornment={
                      <InputAdornment position="start">
                        <Straighten sx={{ color: palette.gold, mr: 1 }} />
                      </InputAdornment>
                    }
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '&:hover fieldset': {
                          borderColor: palette.gold,
                        },
                      },
                    }}
                  >
                    <MenuItem value="">
                      <em>Sélectionnez votre taille</em>
                    </MenuItem>
                    {sizeOptions.map((size) => (
                      <MenuItem key={size} value={size}>
                        {size}
                      </MenuItem>
                    ))}
                  </Select>
                  <Typography variant="caption" sx={{ color: palette.slate, mt: 1, display: 'block' }}>
                    Cette taille sera utilisée pour tous les vêtements de votre commande
                  </Typography>
                </FormControl>
              </Grid>
              
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Adresse complète *"
                  name="address"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  required
                  error={!!errors.address}
                  helperText={errors.address || 'Rue, numéro, appartement, etc.'}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOn sx={{ color: palette.gold }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />
              </Grid>
              
              <Grid size={{ xs: 12, md: 6 }}>
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel id="city-label">Ville *</InputLabel>
                  <Select
                    labelId="city-label"
                    value={formData.city}
                    label="Ville *"
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    error={!!errors.city}
                  >
                    <MenuItem value="">
                      <em>Sélectionnez votre ville</em>
                    </MenuItem>
                    {tunisianCities.map((city) => (
                      <MenuItem key={city} value={city}>
                        {city}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.city && (
                    <Typography variant="caption" color="error">
                      {errors.city}
                    </Typography>
                  )}
                </FormControl>
              </Grid>
              
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  label="Code postal (optionnel)"
                  name="postalCode"
                  value={formData.postalCode}
                  onChange={(e) => setFormData({...formData, postalCode: e.target.value})}
                  sx={{ mb: 2 }}
                />
              </Grid>
              
              <Grid size={12}>
                <TextField
                  fullWidth
                  label="Notes de livraison (optionnel)"
                  name="notes"
                  multiline
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Instructions spéciales pour le livreur, code d'accès, etc."
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: palette.gold,
                      },
                    },
                  }}
                />
              </Grid>
            </Grid>
          </motion.div>
        );

      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Grid container spacing={4}>
              <Grid size={{ xs: 12, md: 7 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 3, md: 4 },
                    background: palette.white,
                    border: '1px solid',
                    borderColor: palette.borderGray,
                    borderRadius: 3,
                    height: '100%',
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      color: palette.noir,
                      mb: 4,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                    }}
                  >
                    <Payment sx={{ color: palette.gold }} />
                    Paiement
                  </Typography>

                  <Typography variant="h6" sx={{ fontWeight: 700, color: palette.noir, mb: 3 }}>
                    Méthode de paiement
                  </Typography>
                  
                  {/* Only Cash on Delivery Option */}
                  <Paper
                    elevation={0}
                    sx={{
                      p: 4,
                      borderRadius: 3,
                      border: `2px solid ${palette.gold}`,
                      background: '#fffdf6',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        background: '#fef9e7',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(212, 175, 55, 0.1)',
                      },
                      mb: 2,
                    }}
                    onClick={() => setPaymentMethod('cash')}
                  >
                    <FormControlLabel
                      value="cash"
                      control={
                        <Radio
                          checked={paymentMethod === 'cash'}
                          sx={{
                            color: palette.gold,
                            '&.Mui-checked': {
                              color: palette.gold,
                            },
                          }}
                        />
                      }
                      label={
                        <Box sx={{ ml: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                            <LocalAtm sx={{ color: palette.gold, fontSize: 28 }} />
                            <Typography sx={{ fontWeight: 700, color: palette.noir, fontSize: '1.1rem' }}>
                              Paiement à la livraison (Cash)
                            </Typography>
                          </Box>
                          <Typography variant="body1" sx={{ color: palette.slate, pl: 6, lineHeight: 1.6 }}>
                            Payez en espèces lorsque vous recevez votre commande. Notre livreur vous remettra un reçu officiel.
                          </Typography>
                        </Box>
                      }
                      sx={{ width: '100%', m: 0 }}
                    />
                  </Paper>

                  {/* Disabled Credit Card Option */}
                  <Paper
                    elevation={0}
                    sx={{
                      p: 4,
                      borderRadius: 3,
                      border: '1px solid',
                      borderColor: palette.borderGray,
                      opacity: 0.6,
                      cursor: 'not-allowed',
                    }}
                  >
                    <FormControlLabel
                      value="card"
                      disabled
                      control={<Radio />}
                      label={
                        <Box sx={{ ml: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                            <CreditCard sx={{ color: palette.slate, fontSize: 28 }} />
                            <Typography sx={{ color: palette.slate }}>
                              Paiement par carte (Bientôt disponible)
                            </Typography>
                          </Box>
                          <Typography variant="body1" sx={{ color: palette.slate, opacity: 0.7, pl: 6 }}>
                            Paiement sécurisé par carte bancaire
                          </Typography>
                        </Box>
                      }
                      sx={{ width: '100%', m: 0 }}
                    />
                  </Paper>

                  {/* Payment Info Note */}
                  <Alert
                    severity="info"
                    sx={{
                      mt: 3,
                      bgcolor: '#fffdf6',
                      border: '1px solid',
                      borderColor: palette.goldLight,
                      color: palette.charcoal,
                      '& .MuiAlert-icon': { color: palette.gold },
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                        Instructions importantes :
                      </Typography>
                      <Typography variant="body2">
                        • Préparez le montant exact en espèces pour faciliter la transaction.<br />
                        • Le livreur vous présentera la commande avant paiement.<br />
                        • Vous recevrez un reçu officiel après paiement.<br />
                        • Pour toute question, contactez-nous au 71 234 567.
                      </Typography>
                    </Box>
                  </Alert>
                </Paper>
              </Grid>

              {/* Right Column - Order Summary */}
              <Grid size={{ xs: 12, md: 5 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 3, md: 4 },
                    background: palette.white,
                    border: '1px solid',
                    borderColor: palette.borderGray,
                    borderRadius: 3,
                    height: '100%',
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 700, color: palette.noir, mb: 3 }}>
                    Récapitulatif du paiement
                  </Typography>
                  
                  <List sx={{ mb: 2 }}>
                    <ListItem sx={{ px: 0, py: 1 }}>
                      <ListItemText
                        primary="Sous-total"
                        primaryTypographyProps={{ color: palette.slate }}
                      />
                      <Typography sx={{ fontWeight: 600, color: palette.noir }}>
                        {subtotal.toFixed(2)} TND
                      </Typography>
                    </ListItem>
                    <ListItem sx={{ px: 0, py: 1 }}>
                      <ListItemText
                        primary="Frais de livraison"
                        primaryTypographyProps={{ color: palette.slate }}
                      />
                      <Typography sx={{ fontWeight: 600, color: palette.noir }}>
                        {shippingCost.toFixed(2)} TND
                      </Typography>
                    </ListItem>
                    <ListItem sx={{ px: 0, py: 1 }}>
                      <ListItemText
                        primary="TVA (18%)"
                        primaryTypographyProps={{ color: palette.slate }}
                      />
                      <Typography sx={{ fontWeight: 600, color: palette.noir }}>
                        {tax.toFixed(2)} TND
                      </Typography>
                    </ListItem>
                  </List>

                  <Divider sx={{ my: 2, background: palette.borderGray }} />

                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: palette.noir }}>
                        Montant total
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 900, color: palette.gold }}>
                        {total.toFixed(2)} TND
                      </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: palette.slate, display: 'block', textAlign: 'right' }}>
                      Calcul: {subtotal.toFixed(2)} + {shippingCost.toFixed(2)} + {tax.toFixed(2)} = {total.toFixed(2)} TND
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 3, background: palette.borderGray }} />

                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: palette.noir }}>
                    Instructions de paiement
                  </Typography>
                  
                  <Box sx={{ pl: 1 }}>
                    {[
                      'Préparez le montant exact en espèces',
                      'Vérifiez votre commande avant paiement',
                      'Le livreur vous remettra un reçu officiel',
                      'Livraison estimée : 2-4 jours ouvrables'
                    ].map((instruction, index) => (
                      <Typography 
                        key={index} 
                        variant="body2" 
                        sx={{ 
                          color: palette.slate, 
                          mb: 1.5, 
                          display: 'flex', 
                          alignItems: 'flex-start', 
                          gap: 1 
                        }}
                      >
                        <CheckCircle sx={{ color: palette.success, fontSize: 16, mt: 0.25, flexShrink: 0 }} />
                        <span>{instruction}</span>
                      </Typography>
                    ))}
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </motion.div>
        );

      case 2:
        const orderNumber = orderResult?.orderNumber || `ORD${Date.now().toString().slice(-8)}`;
        const deliveryDate = calculateDeliveryDate();
        
        // Use preserved values from orderResult or fallback to current cart values
        const confirmationSubtotal = orderResult?.subtotal || subtotal;
        const confirmationShipping = orderResult?.shippingCost || shippingCost;
        const confirmationTax = orderResult?.tax || tax;
        const confirmationTotal = orderResult?.total || total;
        
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Grid container spacing={4}>
              <Grid size={{ xs: 12, md: 7 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 3, md: 4 },
                    background: palette.white,
                    border: '1px solid',
                    borderColor: palette.borderGray,
                    borderRadius: 3,
                    height: '100%',
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      color: palette.noir,
                      mb: 4,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                    }}
                  >
                    <CheckCircle sx={{ color: palette.gold }} />
                    Confirmation de commande
                  </Typography>

                  <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    >
                      <Box sx={{ 
                        display: 'inline-flex', 
                        p: 3, 
                        background: '#10b98115', 
                        borderRadius: '50%', 
                        mb: 4 
                      }}>
                        <CheckCircle sx={{ fontSize: 80, color: palette.success }} />
                      </Box>
                    </motion.div>
                    
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Typography variant="h4" sx={{ fontWeight: 900, color: palette.noir, mb: 2 }}>
                        Commande confirmée !
                      </Typography>
                      <Typography variant="h6" sx={{ mb: 4, color: palette.slate, fontWeight: 400 }}>
                        Merci pour votre confiance, {formData.fullName.split(' ')[0]} !
                      </Typography>
                    </motion.div>
                  </Box>

                  <Typography variant="body1" sx={{ mb: 4, color: palette.slate, lineHeight: 1.7 }}>
                    Votre commande <strong>#{orderNumber}</strong> a été enregistrée avec succès.
                    {orderResult?.emailSent ? (
                      <> Un email de confirmation avec les détails de livraison a été envoyé à <strong>{formData.email}</strong>.</>
                    ) : (
                      <> Vous recevrez bientôt un email de confirmation à <strong>{formData.email}</strong>.</>
                    )}
                  </Typography>
                  
                  <Alert
                    severity="info"
                    sx={{
                      mb: 4,
                      bgcolor: '#f8fafc',
                      border: '1px solid',
                      borderColor: palette.borderGray,
                      color: palette.charcoal,
                      '& .MuiAlert-icon': { color: palette.gold },
                    }}
                  >
                    <Typography variant="body2">
                      <strong>Prochaine étape :</strong> Notre équipe va préparer votre commande. 
                      Vous recevrez un SMS de confirmation lorsque votre colis sera en route.
                    </Typography>
                  </Alert>

                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mt: 4 }}>
                    <Button
                      variant="contained"
                      onClick={() => {
                        navigate('/');
                        setIsCartOpen(false);
                      }}
                      sx={{
                        background: palette.noir,
                        color: 'white',
                        px: 4,
                        py: 1.5,
                        fontWeight: 600,
                        '&:hover': {
                          background: palette.gold,
                          transform: 'translateY(-2px)',
                        },
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <Home sx={{ mr: 1 }} />
                      Retour à l'accueil
                    </Button>
                    
                    <Button
                      variant="outlined"
                      onClick={() => navigate('/products')}
                      sx={{
                        borderColor: palette.gold,
                        color: palette.gold,
                        px: 4,
                        py: 1.5,
                        fontWeight: 600,
                        '&:hover': {
                          background: palette.gold + '10',
                          borderColor: palette.goldDark,
                        },
                      }}
                    >
                      <ShoppingBag sx={{ mr: 1 }} />
                      Continuer le shopping
                    </Button>
                  </Box>

                  {/* Order Receipt */}
                  <Paper
                    elevation={0}
                    sx={{
                      mt: 4,
                      p: 3,
                      border: `2px solid ${palette.gold}`,
                      borderRadius: 2,
                      background: '#fffdf6',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                      <Receipt sx={{ color: palette.gold }} />
                      <Typography variant="h6" sx={{ fontWeight: 700, color: palette.noir }}>
                        Votre reçu de commande
                      </Typography>
                    </Box>
                    <Typography variant="body2" sx={{ color: palette.slate, mb: 2 }}>
                      Conservez ce numéro de commande pour tout suivi :
                    </Typography>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        fontWeight: 900, 
                        color: palette.gold,
                        textAlign: 'center',
                        p: 2,
                        bgcolor: '#fef9e7',
                        borderRadius: 1,
                        mb: 1
                      }}
                    >
                      #{orderNumber}
                    </Typography>
                    <Typography variant="caption" sx={{ color: palette.slate, display: 'block', textAlign: 'center' }}>
                      Présentez ce numéro à notre livreur
                    </Typography>
                  </Paper>
                </Paper>
              </Grid>

              {/* Right Column - Order Details */}
              <Grid size={{ xs: 12, md: 5 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 3, md: 4 },
                    background: palette.white,
                    border: '1px solid',
                    borderColor: palette.borderGray,
                    borderRadius: 3,
                    height: '100%',
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 700, color: palette.noir, mb: 3 }}>
                    Récapitulatif de votre commande
                  </Typography>
                  
                  <List sx={{ mb: 2 }}>
                    <ListItem sx={{ px: 0, py: 1 }}>
                      <ListItemText
                        primary="Sous-total"
                        primaryTypographyProps={{ color: palette.slate }}
                      />
                      <Typography sx={{ fontWeight: 600, color: palette.noir }}>
                        {confirmationSubtotal.toFixed(2)} TND
                      </Typography>
                    </ListItem>
                    <ListItem sx={{ px: 0, py: 1 }}>
                      <ListItemText
                        primary="Frais de livraison"
                        primaryTypographyProps={{ color: palette.slate }}
                      />
                      <Typography sx={{ fontWeight: 600, color: palette.noir }}>
                        {confirmationShipping.toFixed(2)} TND
                      </Typography>
                    </ListItem>
                    <ListItem sx={{ px: 0, py: 1 }}>
                      <ListItemText
                        primary="TVA (18%)"
                        primaryTypographyProps={{ color: palette.slate }}
                      />
                      <Typography sx={{ fontWeight: 600, color: palette.noir }}>
                        {confirmationTax.toFixed(2)} TND
                      </Typography>
                    </ListItem>
                  </List>

                  <Divider sx={{ my: 2, background: palette.borderGray }} />

                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: palette.noir }}>
                        Montant total
                      </Typography>
                      <Typography variant="h5" sx={{ fontWeight: 900, color: palette.gold }}>
                        {confirmationTotal.toFixed(2)} TND
                      </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: palette.slate, display: 'block', textAlign: 'right' }}>
                      Calcul: {confirmationSubtotal.toFixed(2)} + {confirmationShipping.toFixed(2)} + {confirmationTax.toFixed(2)} = {confirmationTotal.toFixed(2)} TND
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 3, background: palette.borderGray }} />

                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: palette.noir }}>
                    Détails de la commande
                  </Typography>
                  
                  <List>
                    <ListItem sx={{ px: 0, py: 1.5 }}>
                      <ListItemText
                        primary="Numéro de commande"
                        primaryTypographyProps={{ color: palette.slate }}
                      />
                      <Typography sx={{ fontWeight: 700, color: palette.gold }}>
                        #{orderNumber}
                      </Typography>
                    </ListItem>
                    <ListItem sx={{ px: 0, py: 1.5 }}>
                      <ListItemText
                        primary="Statut"
                        primaryTypographyProps={{ color: palette.slate }}
                      />
                      <Chip
                        label="Confirmée"
                        size="small"
                        sx={{
                          bgcolor: `${palette.success}15`,
                          color: palette.success,
                          fontWeight: 700,
                        }}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0, py: 1.5 }}>
                      <ListItemText
                        primary="Méthode de paiement"
                        primaryTypographyProps={{ color: palette.slate }}
                      />
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <LocalAtm sx={{ color: palette.gold, fontSize: 20 }} />
                        <Typography sx={{ fontWeight: 600, color: palette.gold }}>
                          À la livraison
                        </Typography>
                      </Box>
                    </ListItem>
                    <ListItem sx={{ px: 0, py: 1.5 }}>
                      <ListItemText
                        primary="Date estimée de livraison"
                        primaryTypographyProps={{ color: palette.slate }}
                      />
                      <Typography sx={{ fontWeight: 600, color: palette.noir }}>
                        {deliveryDate}
                      </Typography>
                    </ListItem>
                    {formData.clothingSize && (
                      <ListItem sx={{ px: 0, py: 1.5 }}>
                        <ListItemText
                          primary="Taille de vêtement"
                          primaryTypographyProps={{ color: palette.slate }}
                        />
                        <Chip
                          label={formData.clothingSize}
                          size="small"
                          sx={{
                            bgcolor: `${palette.gold}15`,
                            color: palette.goldDark,
                            fontWeight: 600,
                          }}
                        />
                      </ListItem>
                    )}
                  </List>

                  <Divider sx={{ my: 3 }} />

                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: palette.noir }}>
                    Adresse de livraison
                  </Typography>
                  <Box sx={{ p: 2, bgcolor: palette.lightGray, borderRadius: 1, mb: 3 }}>
                    <Typography variant="body2" sx={{ color: palette.slate, fontWeight: 500, mb: 1 }}>
                      {formData.fullName}
                    </Typography>
                    <Typography variant="body2" sx={{ color: palette.slate, mb: 0.5 }}>
                      {formData.address}
                    </Typography>
                    <Typography variant="body2" sx={{ color: palette.slate, mb: 0.5 }}>
                      {formData.city}, {formData.postalCode}
                    </Typography>
                    <Typography variant="body2" sx={{ color: palette.slate, mb: 0.5 }}>
                      {formData.country}
                    </Typography>
                    <Typography variant="body2" sx={{ color: palette.slate }}>
                      📱 {formData.phone}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 3 }} />

                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: palette.noir }}>
                    Instructions importantes
                  </Typography>
                  
                  <Box sx={{ pl: 1 }}>
                    {[
                      'Préparez le montant exact en espèces',
                      'Vérifiez votre commande avant paiement',
                      'Le livreur vous remettra un reçu officiel',
                      'Livraison estimée : 2-4 jours ouvrables'
                    ].map((instruction, index) => (
                      <Typography 
                        key={index} 
                        variant="body2" 
                        sx={{ 
                          color: palette.slate, 
                          mb: 1.5, 
                          display: 'flex', 
                          alignItems: 'flex-start', 
                          gap: 1 
                        }}
                      >
                        <CheckCircle sx={{ color: palette.success, fontSize: 16, mt: 0.25, flexShrink: 0 }} />
                        <span>{instruction}</span>
                      </Typography>
                    ))}
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </motion.div>
        );

      default:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Grid container spacing={4}>
              <Grid size={{ xs: 12, md: 7 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 3, md: 4 },
                    background: palette.white,
                    border: '1px solid',
                    borderColor: palette.borderGray,
                    borderRadius: 3,
                    height: '100%',
                  }}
                >
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      color: palette.noir,
                      mb: 4,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                    }}
                  >
                    <Info sx={{ color: palette.gold }} />
                    Étape inconnue
                  </Typography>

                  <Box sx={{ textAlign: 'center', py: 6 }}>
                    <Box sx={{ 
                      display: 'inline-flex', 
                      p: 3, 
                      background: '#f59e0b15', 
                      borderRadius: '50%', 
                      mb: 4 
                    }}>
                      <Info sx={{ fontSize: 80, color: palette.warning }} />
                    </Box>
                    
                    <Typography variant="h4" sx={{ fontWeight: 900, color: palette.noir, mb: 2 }}>
                      Étape non reconnue
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 4, color: palette.slate, fontWeight: 400 }}>
                      Nous avons rencontré un problème avec votre navigation
                    </Typography>
                    
                    <Typography variant="body1" sx={{ mb: 4, color: palette.slate, lineHeight: 1.7 }}>
                      La page de commande que vous essayez d'accéder n'existe pas ou a rencontré une erreur.
                      Veuillez revenir à la première étape pour continuer votre commande.
                    </Typography>
                    
                    <Alert
                      severity="warning"
                      sx={{
                        maxWidth: 500,
                        mx: 'auto',
                        mb: 4,
                        bgcolor: '#fffdf6',
                        border: '1px solid',
                        borderColor: palette.goldLight,
                        color: palette.charcoal,
                        '& .MuiAlert-icon': { color: palette.warning },
                      }}
                    >
                      <Typography variant="body2">
                        <strong>Note :</strong> Votre panier est toujours intact. Vous pouvez continuer votre commande sans perdre vos articles.
                      </Typography>
                    </Alert>
                    
                    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mt: 4 }}>
                      <Button
                        variant="contained"
                        onClick={() => setActiveStep(0)}
                        sx={{
                          background: palette.noir,
                          color: 'white',
                          px: 4,
                          py: 1.5,
                          fontWeight: 600,
                          '&:hover': {
                            background: palette.gold,
                            transform: 'translateY(-2px)',
                          },
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <ArrowBack sx={{ mr: 1 }} />
                        Retour à la première étape
                      </Button>
                      
                      <Button
                        variant="outlined"
                        onClick={() => navigate('/')}
                        sx={{
                          borderColor: palette.gold,
                          color: palette.gold,
                          px: 4,
                          py: 1.5,
                          fontWeight: 600,
                          '&:hover': {
                            background: palette.gold + '10',
                            borderColor: palette.goldDark,
                          },
                        }}
                      >
                        <Home sx={{ mr: 1 }} />
                        Retour à l'accueil
                      </Button>
                    </Box>
                  </Box>
                </Paper>
              </Grid>

              <Grid size={{ xs: 12, md: 5 }}>
                <Paper
                  elevation={0}
                  sx={{
                    p: { xs: 3, md: 4 },
                    background: palette.white,
                    border: '1px solid',
                    borderColor: palette.borderGray,
                    borderRadius: 3,
                    height: '100%',
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 700, color: palette.noir, mb: 3 }}>
                    Assistance
                  </Typography>
                  
                  <Alert
                    severity="info"
                    sx={{
                      mb: 3,
                      bgcolor: '#f8fafc',
                      border: '1px solid',
                      borderColor: palette.borderGray,
                      color: palette.charcoal,
                      '& .MuiAlert-icon': { color: palette.gold },
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
                        Besoin d'aide ?
                      </Typography>
                      <Typography variant="body2">
                        Notre équipe de support est disponible pour vous aider avec votre commande.
                      </Typography>
                    </Box>
                  </Alert>
                  
                  <List>
                    <ListItem sx={{ px: 0, py: 1.5 }}>
                      <ListItemText
                        primary="Statut de votre panier"
                        primaryTypographyProps={{ color: palette.slate }}
                      />
                      <Chip
                        label={`${cart.length} article${cart.length > 1 ? 's' : ''}`}
                        size="small"
                        sx={{
                          bgcolor: `${palette.gold}15`,
                          color: palette.goldDark,
                          fontWeight: 600,
                        }}
                      />
                    </ListItem>
                    <ListItem sx={{ px: 0, py: 1.5 }}>
                      <ListItemText
                        primary="Étape actuelle"
                        primaryTypographyProps={{ color: palette.slate }}
                      />
                      <Typography sx={{ fontWeight: 600, color: palette.noir }}>
                        Erreur de navigation
                      </Typography>
                    </ListItem>
                  </List>

                  <Divider sx={{ my: 3 }} />

                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: palette.noir }}>
                    Contactez-nous
                  </Typography>
                  
                  <Box sx={{ p: 2, bgcolor: palette.lightGray, borderRadius: 1 }}>
                    <Typography variant="body2" sx={{ color: palette.slate, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Phone fontSize="small" sx={{ color: palette.gold }} />
                      <span>71 234 567</span>
                    </Typography>
                    <Typography variant="body2" sx={{ color: palette.slate, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Email fontSize="small" sx={{ color: palette.gold }} />
                      <span>contact@tawakkolshop.com</span>
                    </Typography>
                    <Typography variant="caption" sx={{ color: palette.slate, display: 'block', mt: 1 }}>
                      Disponible du lundi au vendredi, 9h-18h
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 3 }} />

                  <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: palette.noir }}>
                    Étapes disponibles
                  </Typography>
                  
                  <Box sx={{ pl: 1 }}>
                    {[
                      { step: 1, label: 'Livraison', description: 'Informations de livraison' },
                      { step: 2, label: 'Paiement', description: 'Méthode de paiement' },
                      { step: 3, label: 'Confirmation', description: 'Récapitulatif final' }
                    ].map((item, index) => (
                      <Box 
                        key={index} 
                        sx={{ 
                          mb: 2, 
                          p: 2, 
                          borderRadius: 1,
                          border: `1px solid ${palette.borderGray}`,
                          bgcolor: item.step === activeStep ? '#fffdf6' : 'transparent',
                          borderColor: item.step === activeStep ? palette.gold : palette.borderGray,
                        }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                          <Box sx={{
                            width: 32,
                            height: 32,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: item.step === activeStep ? palette.gold : palette.lightGray,
                            color: item.step === activeStep ? palette.noir : palette.slate,
                            fontWeight: 700,
                            fontSize: '0.875rem'
                          }}>
                            {item.step}
                          </Box>
                          <Typography sx={{ fontWeight: 700, color: palette.noir }}>
                            {item.label}
                          </Typography>
                        </Box>
                        <Typography variant="body2" sx={{ color: palette.slate, pl: 4 }}>
                          {item.description}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </motion.div>
        );
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: palette.white, py: 4 }}>
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 6 }}>
          {activeStep < 2 && (
            <IconButton
              onClick={() => navigate(-1)}
              sx={{
                color: palette.gold,
                mb: 3,
                '&:hover': { 
                  bgcolor: palette.goldLight + '20',
                  transform: 'translateX(-4px)',
                },
                transition: 'all 0.2s ease',
              }}
            >
              <ArrowBack />
            </IconButton>
          )}
          
          <Typography variant="h3" sx={{ fontWeight: 900, color: palette.noir, mb: 2 }}>
            {activeStep === 2 ? 'Confirmation' : 'Finalisez votre commande'}
          </Typography>
          <Typography sx={{ color: palette.slate, maxWidth: 600 }}>
            {activeStep === 2 
              ? 'Votre commande a été enregistrée avec succès' 
              : 'Complétez vos informations pour finaliser votre achat'}
          </Typography>
        </Box>

        {/* Stepper - Hidden on confirmation */}
        {activeStep < 2 && (
          <Stepper
            activeStep={activeStep}
            sx={{
              mb: 8,
              '& .MuiStepLabel-root .Mui-completed': {
                color: palette.gold,
              },
              '& .MuiStepLabel-root .Mui-active': {
                color: palette.gold,
              },
              '& .MuiStepConnector-root .MuiStepConnector-line': {
                borderColor: palette.borderGray,
              },
              '& .MuiStepConnector-root .Mui-active .MuiStepConnector-line': {
                borderColor: palette.gold,
              },
              '& .MuiStepLabel-label': {
                color: palette.noir,
                fontWeight: 500,
                fontSize: '0.9rem',
              },
              '& .MuiStepLabel-label.Mui-active': {
                fontWeight: 700,
              },
            }}
          >
            {steps.slice(0, 2).map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        )}

        {/* Main Content with Grid Layout */}
        <Grid container spacing={4}>
          {/* Left Column - Forms */}
          <Grid size={{ xs: 12, md: activeStep === 2 ? 12 : 7 }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 4 },
                background: palette.white,
                border: '1px solid',
                borderColor: palette.borderGray,
                borderRadius: 3,
                position: 'relative',
                overflow: 'hidden',
                ...(activeStep < 2 && {
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: `linear-gradient(90deg, ${palette.gold}, ${palette.goldDark})`,
                  },
                }),
              }}
            >
              {renderStepContent()}

              {activeStep < 2 && (
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: activeStep === 0 ? 'flex-end' : 'space-between',
                  mt: 4,
                  pt: 3,
                  borderTop: `1px solid ${palette.borderGray}`
                }}>
                  {activeStep > 0 && (
                    <Button
                      onClick={handleBack}
                      disabled={loading}
                      sx={{
                        color: palette.gold,
                        fontWeight: 600,
                        px: 4,
                        '&:hover': {
                          background: palette.goldLight + '20',
                        },
                      }}
                    >
                      Retour
                    </Button>
                  )}
                  
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    disabled={loading}
                    sx={{
                      background: palette.noir,
                      color: palette.white,
                      px: 6,
                      minWidth: 200,
                      py: 1.5,
                      fontWeight: 700,
                      fontSize: '1rem',
                      '&:hover': {
                        background: palette.gold,
                        transform: 'translateY(-2px)',
                        boxShadow: `0 8px 25px ${palette.gold}40`,
                      },
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {loading ? (
                      <CircularProgress size={24} sx={{ color: palette.white }} />
                    ) : activeStep === steps.length - 2 ? (
                      <>
                        <Lock sx={{ mr: 1 }} />
                        Confirmer la commande
                      </>
                    ) : (
                      'Continuer vers le paiement'
                    )}
                  </Button>
                </Box>
              )}
            </Paper>
          </Grid>

          {/* Right Column - Order Summary (Hidden on confirmation) */}
          {activeStep < 2 && (
            <Grid size={{ xs: 12, md: 5 }}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, md: 4 },
                  background: palette.white,
                  border: '1px solid',
                  borderColor: palette.borderGray,
                  borderRadius: 3,
                  position: 'sticky',
                  top: 20,
                  height: 'fit-content',
                  maxHeight: 'calc(100vh - 100px)',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: palette.noir,
                    mb: 3,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    fontWeight: 700,
                  }}
                >
                  <Assignment sx={{ color: palette.gold }} />
                  Récapitulatif
                </Typography>

                {/* Cart Items */}
                <Box sx={{ 
                  flex: 1, 
                  overflowY: 'auto', 
                  pr: 1, 
                  mb: 3,
                  maxHeight: 300,
                }}>
                  <AnimatePresence>
                    {cart.map((item, index) => (
                      <motion.div
                        key={`${item._id}-${item.selectedSize || ''}-${item.selectedColor || ''}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Box sx={{ mb: 2 }}>
                          <Box sx={{ display: 'flex', gap: 2 }}>
                            {/* Product Image */}
                            <Box sx={{ 
                              width: 60, 
                              height: 60, 
                              borderRadius: 1,
                              overflow: 'hidden',
                              flexShrink: 0,
                              border: `1px solid ${palette.borderGray}`
                            }}>
                              <img
                                src={item.mainImage?.url || '/placeholder-product.jpg'}
                                alt={item.name}
                                style={{ 
                                  width: '100%', 
                                  height: '100%', 
                                  objectFit: 'cover' 
                                }}
                              />
                            </Box>
                            
                            <Box sx={{ flex: 1 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Box sx={{ flex: 1 }}>
                                  <Typography sx={{ 
                                    fontWeight: 600, 
                                    color: palette.noir, 
                                    fontSize: '0.9rem',
                                    lineHeight: 1.3,
                                    mb: 0.5
                                  }}>
                                    {item.name}
                                  </Typography>
                                  
                                  {/* Variant chips */}
                                  {(item.selectedSize || item.selectedColor) && (
                                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 0.5 }}>
                                      {item.selectedSize && (
                                        <Chip
                                          label={`T: ${item.selectedSize}`}
                                          size="small"
                                          sx={{
                                            background: '#fef9e7',
                                            color: palette.goldDark,
                                            fontSize: '0.7rem',
                                            height: 20,
                                            fontWeight: 500,
                                          }}
                                        />
                                      )}
                                      {item.selectedColor && (
                                        <Chip
                                          label={`C: ${item.selectedColor}`}
                                          size="small"
                                          sx={{
                                            background: '#fef9e7',
                                            color: palette.goldDark,
                                            fontSize: '0.7rem',
                                            height: 20,
                                            fontWeight: 500,
                                          }}
                                        />
                                      )}
                                    </Box>
                                  )}
                                  
                                  <Typography variant="caption" sx={{ color: palette.slate, display: 'block' }}>
                                    {item.quantity} × {item.price.toFixed(2)} TND
                                  </Typography>
                                </Box>
                                
                                <Typography sx={{ 
                                  fontWeight: 700, 
                                  color: palette.noir,
                                  fontSize: '0.95rem'
                                }}>
                                  {(item.price * item.quantity).toFixed(2)} TND
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                          <Divider sx={{ my: 1.5, background: palette.borderGray }} />
                        </Box>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </Box>

                {/* Order Summary */}
                <Box sx={{ mt: 'auto' }}>
                  <Box sx={{ 
                    p: 2, 
                    bgcolor: palette.lightGray, 
                    borderRadius: 2,
                    mb: 3 
                  }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ color: palette.slate }}>
                        Sous-total ({cart.length} article{cart.length > 1 ? 's' : ''})
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {subtotal.toFixed(2)} TND
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ color: palette.slate }}>
                        Livraison
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {shippingCost.toFixed(2)} TND
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" sx={{ color: palette.slate }}>
                        TVA (18%)
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {tax.toFixed(2)} TND
                      </Typography>
                    </Box>
                    
                    <Divider sx={{ my: 2, background: palette.borderGray }} />
                    
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="h6" sx={{ color: palette.noir }}>
                        Total
                      </Typography>
                      <Typography
                        variant="h5"
                        sx={{
                          color: palette.gold,
                          fontWeight: 900,
                        }}
                      >
                        {total.toFixed(2)} TND
                      </Typography>
                    </Box>
                  </Box>
                  
                  {/* Delivery Info */}
                  <Alert
                    severity="info"
                    sx={{
                      bgcolor: '#f8fafc',
                      border: '1px solid',
                      borderColor: palette.borderGray,
                      color: palette.slate,
                      '& .MuiAlert-icon': { color: palette.gold },
                    }}
                  >
                    <Typography variant="caption" sx={{ display: 'block' }}>
                      <strong>Livraison gratuite</strong> à partir de 200 TND
                    </Typography>
                    <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                      Délai de livraison : 2-4 jours ouvrables
                    </Typography>
                  </Alert>
                </Box>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default Checkout;