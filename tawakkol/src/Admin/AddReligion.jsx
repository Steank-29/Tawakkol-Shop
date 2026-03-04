// src/pages/AddReligion.jsx
import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Typography,
  Card,
  CardContent,
  Grid,
  IconButton,
  Paper,
  Divider,
  Chip,
  FormHelperText,
  Alert,
  Snackbar,
  Container,
  LinearProgress,
  CircularProgress,
  Tooltip,
  InputAdornment,
  Fade,
  Zoom,
  Badge,
} from '@mui/material';
import {
  AddPhotoAlternate,
  Delete,
  CloudUpload,
  Refresh,
  CheckCircle,
  Cancel,
  Inventory,
  ShoppingBag,
  Style,
  Palette,
  Category,
  Description,
  AttachMoney,
  ColorLens,
  Image,
  PhotoLibrary,
  Save,
  Preview,
  Info,
  Warning,
  FormatSize,
  LocalOffer,
  Straighten,
  Verified,
  Diamond,
  Bolt,
  AutoAwesome,
  Speed,
  WorkspacePremium,
} from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Palette monochrome professionnelle avec contraste parfait
const monoPalette = {
  black: '#000000',
  white: '#ffffff',
  gray50: '#fafafa',
  gray100: '#f5f5f5',
  gray200: '#eeeeee',
  gray300: '#e0e0e0',
  gray400: '#bdbdbd',
  gray500: '#9e9e9e',
  gray600: '#757575',
  gray700: '#616161',
  gray800: '#424242',
  gray900: '#212121',
};

// API Base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Composants stylisés avec précision professionnelle
const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: monoPalette.white,
  border: `1px solid ${monoPalette.gray300}`,
  borderRadius: '20px',
  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.02)',
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: monoPalette.white,
    borderRadius: '12px',
    fontFamily: '"Fjalla One", sans-serif',
    fontSize: '0.95rem',
    transition: 'all 0.2s ease',
    '& fieldset': {
      borderColor: monoPalette.gray300,
      borderWidth: '1.5px',
    },
    '&:hover fieldset': {
      borderColor: monoPalette.gray600,
    },
    '&.Mui-focused fieldset': {
      borderColor: monoPalette.black,
      borderWidth: '2px',
    },
    '&.Mui-error fieldset': {
      borderColor: '#d32f2f',
    },
  },
  '& .MuiInputLabel-root': {
    color: monoPalette.gray600,
    fontFamily: '"Fjalla One", sans-serif',
    fontSize: '0.95rem',
    fontWeight: 500,
    '&.Mui-focused': {
      color: monoPalette.black,
    },
    '&.Mui-error': {
      color: '#d32f2f',
    },
  },
  '& .MuiFormHelperText-root': {
    fontFamily: '"Fjalla One", sans-serif',
    fontSize: '0.75rem',
    marginTop: '4px',
  },
}));

const StyledSelect = styled(Select)(({ theme }) => ({
  backgroundColor: monoPalette.white,
  borderRadius: '12px',
  fontFamily: '"Fjalla One", sans-serif',
  fontSize: '0.95rem',
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: monoPalette.gray300,
    borderWidth: '1.5px',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: monoPalette.gray600,
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: monoPalette.black,
    borderWidth: '2px',
  },
  '& .MuiSelect-icon': {
    color: monoPalette.gray600,
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: '12px',
  fontFamily: '"Fjalla One", sans-serif',
  fontWeight: 600,
  fontSize: '0.95rem',
  textTransform: 'none',
  padding: '10px 24px',
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  '&.primary': {
    backgroundColor: monoPalette.black,
    color: monoPalette.white,
    '&:hover': {
      backgroundColor: '#d4af37',
      color:'black',
      transform: 'translateY(-1px)',
      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
    },
    '&:disabled': {
      backgroundColor: monoPalette.gray400,
      color: monoPalette.gray600,
    },
  },
  '&.secondary': {
    backgroundColor: monoPalette.white,
    color: monoPalette.black,
    border: `1.5px solid ${monoPalette.gray300}`,
    '&:hover': {
      backgroundColor: monoPalette.gray50,
      borderColor: monoPalette.gray600,
      transform: 'translateY(-1px)',
    },
  },
}));

const ImageUploadArea = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  textAlign: 'center',
  border: `2px dashed ${monoPalette.gray300}`,
  backgroundColor: monoPalette.gray50,
  borderRadius: '16px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  '&:hover': {
    borderColor: monoPalette.gray800,
    backgroundColor: monoPalette.gray100,
  },
}));

const StyledChip = styled(Chip)(({ theme, colorvalue }) => ({
  backgroundColor: colorvalue || monoPalette.gray200,
  color: colorvalue && colorvalue !== '#FFFFFF' ? monoPalette.white : monoPalette.gray800,
  border: colorvalue === '#FFFFFF' ? `1.5px solid ${monoPalette.gray300}` : 'none',
  borderRadius: '10px',
  fontFamily: '"Fjalla One", sans-serif',
  fontWeight: 500,
  fontSize: '0.85rem',
  height: '32px',
  '& .MuiChip-deleteIcon': {
    color: colorvalue && colorvalue !== '#FFFFFF' ? 'rgba(255,255,255,0.7)' : monoPalette.gray600,
    '&:hover': {
      color: colorvalue || monoPalette.gray900,
    },
  },
}));

const SectionDivider = styled(Divider)(({ theme }) => ({
  margin: theme.spacing(5, 0, 4, 0),
  borderColor: monoPalette.gray200,
  borderWidth: '1.5px',
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
  color: monoPalette.gray900,
  fontFamily: '"Fjalla One", sans-serif',
  fontWeight: 700,
  fontSize: '1.25rem',
  letterSpacing: '-0.01em',
  marginBottom: theme.spacing(3),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1.5),
  '& svg': {
    color: monoPalette.gray700,
    fontSize: '1.5rem',
  },
}));

const FieldLabel = styled(Typography)(({ theme }) => ({
  color: monoPalette.gray700,
  fontFamily: '"Fjalla One", sans-serif',
  fontWeight: 600,
  fontSize: '0.85rem',
  textTransform: 'uppercase',
  letterSpacing: '0.02em',
  marginBottom: theme.spacing(1),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(0.5),
}));

// Options avec métadonnées enrichies
const SIZE_OPTIONS = [
  { value: 'XS', label: 'XS', description: 'Extra Small' },
  { value: 'S', label: 'S', description: 'Small' },
  { value: 'M', label: 'M', description: 'Medium' },
  { value: 'L', label: 'L', description: 'Large' },
  { value: 'XL', label: 'XL', description: 'Extra Large' },
  { value: '2XL', label: '2XL', description: 'Double Extra Large' },
];

const COLOR_OPTIONS = [
  { name: 'Noir', value: '#000000', description: 'Noir Classique' },
  { name: 'Blanc', value: '#FFFFFF', description: 'Blanc Pur' },
  { name: 'Charbon', value: '#36454F', description: 'Gris Foncé' },
  { name: 'Ardoise', value: '#708090', description: 'Gris Moyen' },
  { name: 'Marron', value: '#8B4513', description: 'Brun Selle' },
  { name: 'Beige', value: '#F5F5DC', description: 'Beige Crème' },
  { name: 'Bleu Marine', value: '#000080', description: 'Bleu Profond' },
  { name: 'Bordeaux', value: '#800020', description: 'Bordeaux Profond' },
  { name: 'Vert Forêt', value: '#228B22', description: 'Vert Forêt' },
  { name: 'Or', value: '#D4AF37', description: 'Or Métallique' },
  { name: 'Argent', value: '#C0C0C0', description: 'Argent Métallique' },
  { name: 'Bronze', value: '#CD7F32', description: 'Bronze Métallique' },
];

const CATEGORY_OPTIONS = ['Sport', 'Casual', 'Religious', 'Streetwear'];

// Composant Modal d'Aperçu
const PreviewModal = ({ product, mainImagePreview, open, onClose }) => {
  if (!open) return null;

  return (
    <Fade in={open}>
      <Box sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bgcolor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1300,
        p: 2,
      }} onClick={onClose}>
        <Zoom in={open}>
          <StyledCard sx={{ maxWidth: 800, width: '100%', maxHeight: '90vh', overflow: 'auto' }} onClick={e => e.stopPropagation()}>
            <Box sx={{ p: 3, borderBottom: `1.5px solid ${monoPalette.gray200}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box display="flex" alignItems="center" gap={1}>
                <WorkspacePremium sx={{ color: monoPalette.gray700 }} />
                <Typography variant="h6" sx={{ color: monoPalette.gray900, fontWeight: 700 }}>Aperçu du Produit</Typography>
              </Box>
              <IconButton onClick={onClose} size="small" sx={{ color: monoPalette.gray600 }}>
                <Cancel />
              </IconButton>
            </Box>
            <Box sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={5}>
                  <Box sx={{
                    border: `1.5px solid ${monoPalette.gray200}`,
                    borderRadius: '16px',
                    overflow: 'hidden',
                    bgcolor: monoPalette.gray50,
                    height: 280,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {mainImagePreview ? (
                      <img src={mainImagePreview} alt={product.name} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                    ) : (
                      <Image sx={{ fontSize: 80, color: monoPalette.gray400 }} />
                    )}
                  </Box>
                </Grid>
                <Grid item xs={12} md={7}>
                  <Typography variant="h5" sx={{ color: monoPalette.gray900, fontWeight: 800, mb: 1 }}>
                    {product.name || 'Nom du Produit'}
                  </Typography>
                  <Box display="flex" gap={1} mb={2} flexWrap="wrap">
                    {product.category && (
                      <Chip
                        label={product.category}
                        size="small"
                        sx={{ bgcolor: monoPalette.gray200, color: monoPalette.gray800, fontWeight: 600 }}
                      />
                    )}
                    {product.stock > 0 && (
                      <Chip
                        icon={<Inventory sx={{ fontSize: 14 }} />}
                        label={`${product.stock} en stock`}
                        size="small"
                        sx={{ bgcolor: monoPalette.gray200, color: monoPalette.gray800 }}
                      />
                    )}
                  </Box>
                  <Typography variant="body2" sx={{ color: monoPalette.gray600, mb: 3, lineHeight: 1.6 }}>
                    {product.description || 'La description du produit apparaîtra ici...'}
                  </Typography>
                  <Divider sx={{ my: 2, borderColor: monoPalette.gray200 }} />
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <FieldLabel>Prix</FieldLabel>
                      <Typography sx={{ color: monoPalette.gray900, fontWeight: 700, fontSize: '1.5rem' }}>
                        {product.price ? `${Number(product.price).toFixed(2)} TND` : '—'}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <FieldLabel>Tailles</FieldLabel>
                      <Box display="flex" gap={0.5} flexWrap="wrap">
                        {product.sizes?.length > 0 ? (
                          product.sizes.map(s => (
                            <Chip key={s} label={s} size="small" sx={{ bgcolor: monoPalette.gray200 }} />
                          ))
                        ) : (
                          <Typography variant="caption" sx={{ color: monoPalette.gray500 }}>Non spécifié</Typography>
                        )}
                      </Box>
                    </Grid>
                    <Grid item xs={12}>
                      <FieldLabel>Couleurs</FieldLabel>
                      <Box display="flex" gap={1} flexWrap="wrap">
                        {product.colors?.map((color, idx) => (
                          <Tooltip key={idx} title={color.name}>
                            <Box
                              sx={{
                                width: 32,
                                height: 32,
                                borderRadius: '50%',
                                bgcolor: color.value,
                                border: `2px solid ${color.value === '#FFFFFF' ? monoPalette.gray300 : monoPalette.white}`,
                                boxShadow: `0 2px 8px rgba(0,0,0,0.1)`,
                                cursor: 'default',
                              }}
                            />
                          </Tooltip>
                        ))}
                        {product.colors?.length === 0 && (
                          <Typography variant="caption" sx={{ color: monoPalette.gray500 }}>Non spécifié</Typography>
                        )}
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          </StyledCard>
        </Zoom>
      </Box>
    </Fade>
  );
};

// Composant Principal
const AddReligion = () => {
  const navigate = useNavigate();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [validationErrors, setValidationErrors] = useState({});

  // État du formulaire
  const [product, setProduct] = useState({
    name: '',
    category: '',
    description: '',
    price: '',
    stock: 0,
    sizes: [],
    colors: [],
    mainImage: null,
    additionalImages: [],
  });

  // États d'aperçu
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [additionalPreviews, setAdditionalPreviews] = useState([]);

  // Get auth token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem('token') || sessionStorage.getItem('token');
  };

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setProduct(prev => ({ ...prev, [field]: value }));
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleSizeChange = (event) => {
    const { value } = event.target;
    setProduct(prev => ({ ...prev, sizes: value }));
  };

  const handleColorChange = (event) => {
    const { value } = event.target;
    const selectedColors = value.map(colorValue => 
      COLOR_OPTIONS.find(c => c.value === colorValue)
    ).filter(Boolean);
    setProduct(prev => ({ ...prev, colors: selectedColors }));
  };

  const handleMainImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setSnackbar({ open: true, message: 'L\'image dépasse la limite de 10 Mo', severity: 'error' });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProduct(prev => ({ ...prev, mainImage: file }));
        setMainImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdditionalImagesUpload = (event) => {
    const files = Array.from(event.target.files);
    if (product.additionalImages.length + files.length > 8) {
      setSnackbar({ open: true, message: 'Maximum 8 images supplémentaires autorisées', severity: 'error' });
      return;
    }

    const validFiles = files.filter(file => {
      if (file.size > 10 * 1024 * 1024) {
        setSnackbar({ open: true, message: `${file.name} dépasse la limite de 10 Mo`, severity: 'error' });
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    const readers = validFiles.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve({ file, preview: reader.result });
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readers).then(results => {
      const newFiles = results.map(r => r.file);
      const newPreviews = results.map(r => r.preview);
      
      setProduct(prev => ({
        ...prev,
        additionalImages: [...prev.additionalImages, ...newFiles]
      }));
      setAdditionalPreviews(prev => [...prev, ...newPreviews]);
    });
  };

  const removeAdditionalImage = (index) => {
    setProduct(prev => ({
      ...prev,
      additionalImages: prev.additionalImages.filter((_, i) => i !== index)
    }));
    setAdditionalPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const errors = {};
    if (!product.name?.trim()) errors.name = 'Le nom du produit est requis';
    if (!product.category) errors.category = 'La catégorie est requise';
    if (!product.description?.trim()) errors.description = 'La description est requise';
    if (!product.price || parseFloat(product.price) <= 0) errors.price = 'Un prix valide est requis';
    if (!product.mainImage) errors.mainImage = 'L\'image principale est requise';
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleReset = () => {
    setProduct({
      name: '',
      category: '',
      description: '',
      price: '',
      stock: 0,
      sizes: [],
      colors: [],
      mainImage: null,
      additionalImages: [],
    });
    setMainImagePreview(null);
    setAdditionalPreviews([]);
    setValidationErrors({});
    setSnackbar({ open: true, message: 'Formulaire réinitialisé', severity: 'info' });
  };

  const createFormData = () => {
    const formData = new FormData();
    
    // Append basic fields
    formData.append('name', product.name);
    formData.append('category', product.category);
    formData.append('description', product.description);
    formData.append('price', product.price);
    formData.append('stock', product.stock);
    
    // Append sizes as JSON string
    if (product.sizes.length > 0) {
      formData.append('sizes', JSON.stringify(product.sizes));
    }
    
    // Append colors as JSON string
    if (product.colors.length > 0) {
      formData.append('colors', JSON.stringify(product.colors));
    }
    
    // Append main image
    if (product.mainImage) {
      formData.append('mainImage', product.mainImage);
    }
    
    // Append additional images
    if (product.additionalImages.length > 0) {
      product.additionalImages.forEach((image, index) => {
        formData.append('additionalImages', image);
      });
    }
    
    return formData;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setSnackbar({ open: true, message: 'Veuillez remplir tous les champs obligatoires', severity: 'error' });
      return;
    }

    setLoading(true);
    setUploadProgress(0);

    try {
      const token = getAuthToken();
      
      if (!token) {
        setSnackbar({ 
          open: true, 
          message: 'Vous devez être connecté pour ajouter un produit', 
          severity: 'error' 
        });
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      const formData = createFormData();

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await axios.post(`${API_URL}/relproducts`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (response.data.success) {
        setSnackbar({ 
          open: true, 
          message: 'Produit ajouté avec succès !', 
          severity: 'success' 
        });
        
        // Reset form after successful submission
        setTimeout(() => {
          handleReset();
          // Optionally navigate to products list
          // navigate('/relproducts');
        }, 1500);
      }
    } catch (error) {
      console.error('Error adding product:', error);
      
      let errorMessage = 'Erreur lors de l\'ajout du produit';
      
      if (error.response) {
        // Server responded with error
        if (error.response.status === 401) {
          errorMessage = 'Session expirée. Veuillez vous reconnecter.';
          setTimeout(() => navigate('/login'), 2000);
        } else if (error.response.status === 403) {
          errorMessage = 'Vous n\'avez pas les permissions nécessaires';
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.errors) {
          errorMessage = error.response.data.errors.join(', ');
        }
      } else if (error.request) {
        // Request made but no response
        errorMessage = 'Impossible de contacter le serveur';
      }
      
      setSnackbar({ 
        open: true, 
        message: errorMessage, 
        severity: 'error' 
      });
    } finally {
      setLoading(false);
      // Don't reset upload progress immediately to show 100% briefly on success
      if (!snackbar.severity === 'error') {
        setTimeout(() => setUploadProgress(0), 1000);
      } else {
        setUploadProgress(0);
      }
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: monoPalette.gray50, py: 4 }}>
      <Container maxWidth="lg">
        {/* En-tête */}
        <StyledCard sx={{ mb: 4, p: 3 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" gap={2}>
            <Box display="flex" alignItems="center" gap={2.5}>
              <Box sx={{
                width: 56,
                height: 56,
                bgcolor: monoPalette.black,
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: monoPalette.white,
              }}>
                <ShoppingBag sx={{ fontSize: 28 }} />
              </Box>
              <Box>
                <Typography variant="h4" sx={{ color: monoPalette.gray900, fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                  Ajouter un Nouveau Produit
                </Typography>
                <Typography variant="body2" sx={{ color: monoPalette.gray600, mt: 0.5 }}>
                  Remplissez les détails ci-dessous pour ajouter un nouveau produit à votre catalogue
                </Typography>
              </Box>
            </Box>
            <StyledButton
              className="secondary"
              startIcon={<Refresh />}
              onClick={handleReset}
              disabled={loading}
            >
              Réinitialiser le Formulaire
            </StyledButton>
          </Box>
        </StyledCard>

        {/* Formulaire Principal */}
        <StyledCard>
          <CardContent sx={{ p: 4 }}>
            {loading && (
              <Box mb={4}>
                <Box display="flex" justifyContent="space-between" mb={1}>
                  <Typography variant="body2" sx={{ color: monoPalette.gray600, fontWeight: 500 }}>
                    {uploadProgress === 100 ? 'Téléchargement terminé...' : 'Téléchargement des données du produit...'}
                  </Typography>
                  <Typography variant="body2" sx={{ color: monoPalette.gray900, fontWeight: 600 }}>
                    {uploadProgress}%
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={uploadProgress}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    bgcolor: monoPalette.gray200,
                    '& .MuiLinearProgress-bar': {
                      bgcolor: uploadProgress === 100 ? '#4caf50' : monoPalette.gray800,
                      borderRadius: 4,
                    },
                  }}
                />
              </Box>
            )}

            <Grid container spacing={4}>
                {/* Colonne de Gauche - Informations de Base */}
                <Grid item xs={12} md={6}>
                <SectionTitle>
                    <Info /> Informations de Base
                </SectionTitle>

                <Grid container spacing={3}>
                    {/* Première rangée : Nom, Catégorie, Prix */}
                    <Grid item xs={12} md={4}>
                    <FieldLabel>Nom du Produit <span style={{ color: '#d32f2f' }}>*</span></FieldLabel>
                    <StyledTextField
                        fullWidth
                        placeholder="ex., Chapelet, Croix Sacrée, Coussin de Méditation"
                        value={product.name}
                        onChange={handleChange('name')}
                        error={!!validationErrors.name}
                        helperText={validationErrors.name || "Entrez le nom officiel du produit"}
                        InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                            <LocalOffer sx={{ color: monoPalette.gray500 }} />
                            </InputAdornment>
                        ),
                        }}
                    />
                    </Grid>

                    <Grid item xs={12} md={4}>
                    <FieldLabel>Catégorie <span style={{ color: '#d32f2f' }}>*</span></FieldLabel>
                    <FormControl fullWidth error={!!validationErrors.category}>
                        <StyledSelect
                        value={product.category}
                        onChange={handleChange('category')}
                        displayEmpty
                        renderValue={(selected) => {
                            if (!selected) return <span style={{ color: monoPalette.gray500 }}>Sélectionnez une catégorie</span>;
                            return selected;
                        }}
                        startAdornment={
                            <InputAdornment position="start">
                            <Category sx={{ color: monoPalette.gray500 }} />
                            </InputAdornment>
                        }
                        >
                        {CATEGORY_OPTIONS.map(category => (
                                            <MenuItem 
                                              key={category} 
                                              value={category}
                                              sx={{ fontFamily:"'Fjalla One', sans-serif" }}
                                            >
                                              {category}
                                            </MenuItem>
                                          ))}
                        </StyledSelect>
                        <FormHelperText>{validationErrors.category || "Sélectionnez une catégorie"}</FormHelperText>
                    </FormControl>
                    </Grid>

                    <Grid item xs={12} md={4}>
                    <FieldLabel>Prix <span style={{ color: '#d32f2f' }}>*</span></FieldLabel>
                    <StyledTextField
                        fullWidth
                        type="number"
                        placeholder="0.00"
                        value={product.price}
                        onChange={handleChange('price')}
                        error={!!validationErrors.price}
                        helperText={validationErrors.price || "Définissez le prix de vente"}
                        InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                            <AttachMoney sx={{ color: monoPalette.gray500 }} />
                            </InputAdornment>
                        ),
                        endAdornment: <InputAdornment position="end">TND</InputAdornment>,
                        inputProps: { min: 0, step: 0.01 }
                        }}
                    />
                    </Grid>

                    {/* Deuxième rangée : Description (prend toute la largeur) */}
                    <Grid item xs={12}>
                    <FieldLabel>Description <span style={{ color: '#d32f2f' }}>*</span></FieldLabel>
                    <StyledTextField
                        fullWidth
                        placeholder="Décrivez les caractéristiques du produit, les matériaux, les dimensions et la signification sacrée..."
                        value={product.description}
                        onChange={handleChange('description')}
                        multiline
                        rows={5}
                        error={!!validationErrors.description}
                        helperText={validationErrors.description || "Fournissez une description détaillée"}
                        InputProps={{
                        startAdornment: (
                            <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                            <Description sx={{ color: monoPalette.gray500 }} />
                            </InputAdornment>
                        ),
                        }}
                    />
                    </Grid>

                    {/* Troisième rangée : Stock (seul sur sa ligne) */}
                    <Grid item xs={12} md={4}>
                    <FieldLabel>Stock Initial</FieldLabel>
                    <StyledTextField
                        fullWidth
                        type="number"
                        placeholder="0"
                        value={product.stock}
                        onChange={handleChange('stock')}
                        helperText="Quantité disponible à la vente"
                        InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                            <Inventory sx={{ color: monoPalette.gray500 }} />
                            </InputAdornment>
                        ),
                        inputProps: { min: 0 }
                        }}
                    />
                    </Grid>
                </Grid>
                </Grid>

              {/* Colonne de Droite - Variations */}
              <Grid item xs={12} md={6}>
                <SectionTitle>
                  <Style /> Variations du Produit
                </SectionTitle>

                <Grid container spacing={3}>
                  {/* Première rangée : Tailles, Couleurs */}
                  <Grid item xs={12} md={6}>
                    <FieldLabel>Tailles</FieldLabel>
                    <FormControl fullWidth>
                      <StyledSelect
                        multiple
                        value={product.sizes}
                        onChange={handleSizeChange}
                        displayEmpty
                        renderValue={(selected) => {
                          if (selected.length === 0) {
                            return <span style={{ color: monoPalette.gray500 }}>Sélectionnez les tailles disponibles</span>;
                          }
                          return (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {selected.map((value) => {
                                const size = SIZE_OPTIONS.find(s => s.value === value);
                                return (
                                  <StyledChip
                                    key={value}
                                    label={value}
                                    size="small"
                                    deleteIcon={<Cancel />}
                                    onDelete={() => {
                                      const newSizes = product.sizes.filter(s => s !== value);
                                      setProduct(prev => ({ ...prev, sizes: newSizes }));
                                    }}
                                  />
                                );
                              })}
                            </Box>
                          );
                        }}
                        startAdornment={
                          <InputAdornment position="start">
                            <FormatSize sx={{ color: monoPalette.gray500 }} />
                          </InputAdornment>
                        }
                      >
                        {SIZE_OPTIONS.map((size) => (
                          <MenuItem key={size.value} value={size.value}>
                            <Checkbox checked={product.sizes.indexOf(size.value) > -1} />
                            <Box>
                              <Typography variant="body1">{size.label}</Typography>
                              <Typography variant="caption" sx={{ color: monoPalette.gray500 }}>
                                {size.description}
                              </Typography>
                            </Box>
                          </MenuItem>
                        ))}
                      </StyledSelect>
                      <FormHelperText>Sélectionnez plusieurs tailles si disponibles</FormHelperText>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <FieldLabel>Couleurs</FieldLabel>
                    <FormControl fullWidth>
                      <StyledSelect
                        multiple
                        value={product.colors.map(c => c.value)}
                        onChange={handleColorChange}
                        displayEmpty
                        renderValue={(selected) => {
                          if (selected.length === 0) {
                            return <span style={{ color: monoPalette.gray500 }}>Sélectionnez les couleurs disponibles</span>;
                          }
                          return (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {selected.map((value) => {
                                const color = COLOR_OPTIONS.find(c => c.value === value);
                                return (
                                  <StyledChip
                                    key={value}
                                    label={color?.name}
                                    size="small"
                                    colorvalue={value}
                                    deleteIcon={<Cancel />}
                                    onDelete={() => {
                                      const newColors = product.colors.filter(c => c.value !== value);
                                      setProduct(prev => ({ ...prev, colors: newColors }));
                                    }}
                                  />
                                );
                              })}
                            </Box>
                          );
                        }}
                        startAdornment={
                          <InputAdornment position="start">
                            <ColorLens sx={{ color: monoPalette.gray500 }} />
                          </InputAdornment>
                        }
                      >
                        {COLOR_OPTIONS.map((color) => (
                          <MenuItem key={color.value} value={color.value}>
                            <Checkbox checked={product.colors.some(c => c.value === color.value)} />
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Box sx={{ width: 24, height: 24, borderRadius: '6px', bgcolor: color.value, border: `1px solid ${monoPalette.gray300}` }} />
                              <Box>
                                <Typography variant="body1">{color.name}</Typography>
                                <Typography variant="caption" sx={{ color: monoPalette.gray500 }}>
                                  {color.description}
                                </Typography>
                              </Box>
                            </Box>
                          </MenuItem>
                        ))}
                      </StyledSelect>
                      <FormHelperText>Sélectionnez plusieurs couleurs si disponibles</FormHelperText>
                    </FormControl>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <SectionDivider />

            {/* Section Images */}
            <SectionTitle>
              <Image /> Images du Produit
            </SectionTitle>

            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FieldLabel>
                  Image Principale <span style={{ color: '#d32f2f' }}>*</span>
                  {mainImagePreview && (
                    <Badge
                      badgeContent={<CheckCircle sx={{ fontSize: 16, color: '#4caf50' }} />}
                      sx={{ ml: 1 }}
                    />
                  )}
                </FieldLabel>
                <ImageUploadArea>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleMainImageUpload}
                    style={{ display: 'none' }}
                    id="main-image-upload"
                    disabled={loading}
                  />
                  <label htmlFor="main-image-upload" style={{ cursor: loading ? 'not-allowed' : 'pointer', width: '100%', display: 'block' }}>
                    {mainImagePreview ? (
                      <Box sx={{ position: 'relative' }}>
                        <img
                          src={mainImagePreview}
                          alt="Aperçu principal"
                          style={{
                            maxWidth: '100%',
                            maxHeight: 200,
                            borderRadius: '12px',
                            marginBottom: '8px',
                          }}
                        />
                        <Typography variant="caption" sx={{ color: monoPalette.gray600, display: 'block' }}>
                          Cliquez pour remplacer
                        </Typography>
                      </Box>
                    ) : (
                      <>
                        <CloudUpload sx={{ fontSize: 48, color: monoPalette.gray500, mb: 1 }} />
                        <Typography sx={{ color: monoPalette.gray800, fontWeight: 600 }}>Télécharger l'Image Principale</Typography>
                        <Typography variant="caption" sx={{ color: monoPalette.gray500, display: 'block', mt: 1 }}>
                          Glissez-déposez ou cliquez pour parcourir
                        </Typography>
                        <Typography variant="caption" sx={{ color: monoPalette.gray500 }}>
                          Max 10 Mo • 1200x1200px recommandé
                        </Typography>
                      </>
                    )}
                  </label>
                </ImageUploadArea>
                {validationErrors.mainImage && (
                  <Typography color="error" variant="caption" sx={{ mt: 1, display: 'block' }}>
                    {validationErrors.mainImage}
                  </Typography>
                )}
                {mainImagePreview && !loading && (
                  <Box mt={1} display="flex" justifyContent="flex-end">
                    <StyledButton
                      className="outlined"
                      size="small"
                      startIcon={<Delete />}
                      onClick={() => {
                        setProduct(prev => ({ ...prev, mainImage: null }));
                        setMainImagePreview(null);
                      }}
                      sx={{ py: 0.5, px: 1.5 }}
                    >
                      Supprimer
                    </StyledButton>
                  </Box>
                )}
              </Grid>

              <Grid item xs={12} md={6}>
                <FieldLabel>
                  Images de Galerie
                  {additionalPreviews.length > 0 && (
                    <Badge
                      badgeContent={additionalPreviews.length}
                      color="primary"
                      sx={{ ml: 1 }}
                    />
                  )}
                </FieldLabel>
                <ImageUploadArea>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleAdditionalImagesUpload}
                    style={{ display: 'none' }}
                    id="gallery-images-upload"
                    disabled={product.additionalImages.length >= 8 || loading}
                  />
                  <label htmlFor="gallery-images-upload" style={{ cursor: (product.additionalImages.length >= 8 || loading) ? 'not-allowed' : 'pointer', width: '100%', display: 'block' }}>
                    <AddPhotoAlternate sx={{ fontSize: 48, color: monoPalette.gray500, mb: 1 }} />
                    <Typography sx={{ color: monoPalette.gray800, fontWeight: 600 }}>Ajouter des Images de Galerie</Typography>
                    <Typography variant="caption" sx={{ color: monoPalette.gray500, display: 'block', mt: 1 }}>
                      {product.additionalImages.length}/8 images • Max 8 images
                    </Typography>
                    <Typography variant="caption" sx={{ color: monoPalette.gray500 }}>
                      Chaque image max 10 Mo
                    </Typography>
                  </label>
                </ImageUploadArea>

                {additionalPreviews.length > 0 && !loading && (
                  <Box mt={2}>
                    <Grid container spacing={1.5}>
                      {additionalPreviews.map((preview, index) => (
                        <Grid item xs={4} sm={3} key={index}>
                          <Box sx={{ position: 'relative' }}>
                            <img
                              src={preview}
                              alt={`Galerie ${index + 1}`}
                              style={{
                                width: '100%',
                                height: 80,
                                objectFit: 'cover',
                                borderRadius: '10px',
                                border: `1.5px solid ${monoPalette.gray300}`,
                              }}
                            />
                            <IconButton
                              size="small"
                              onClick={() => removeAdditionalImage(index)}
                              sx={{
                                position: 'absolute',
                                top: -8,
                                right: -8,
                                bgcolor: monoPalette.white,
                                border: `1.5px solid ${monoPalette.gray300}`,
                                p: 0.5,
                                '&:hover': { bgcolor: monoPalette.gray100 },
                              }}
                            >
                              <Delete sx={{ fontSize: 14, color: monoPalette.gray700 }} />
                            </IconButton>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}
              </Grid>
            </Grid>

            {/* Actions du Formulaire */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mt={5} pt={3} sx={{ borderTop: `1.5px solid ${monoPalette.gray200}` }}>
              <StyledButton
                className="outlined"
                startIcon={<Preview />}
                onClick={() => setPreviewOpen(true)}
                disabled={!product.name || loading}
              >
                Aperçu du Produit
              </StyledButton>
              
              <StyledButton
                className="primary"
                onClick={handleSubmit}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} sx={{ color: '#d4af37' }} /> : <Save />}
                sx={{ 
                  minWidth: 180,
                  '&:hover': {
                    backgroundColor: '#d4af37',
                  }
                }}
              >
                {loading ? 'Enregistrement...' : 'Enregistrer le Produit'}
              </StyledButton>
            </Box>
          </CardContent>
        </StyledCard>

        {/* Modal d'Aperçu */}
        <PreviewModal
          product={product}
          mainImagePreview={mainImagePreview}
          open={previewOpen}
          onClose={() => setPreviewOpen(false)}
        />

        {/* Snackbar */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert
            onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
            severity={snackbar.severity}
            sx={{
              borderRadius: '12px',
              bgcolor: monoPalette.white,
              color: monoPalette.gray900,
              border: `1.5px solid ${snackbar.severity === 'success' ? '#4caf50' : '#f44336'}`,
              '& .MuiAlert-icon': {
                color: snackbar.severity === 'success' ? '#4caf50' : '#f44336',
              },
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
};

export default AddReligion;