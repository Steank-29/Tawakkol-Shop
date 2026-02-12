import React, { useState, useEffect } from 'react';
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
  CardMedia,
  Grid,
  IconButton,
  Paper,
  Divider,
  Chip,
  FormHelperText,
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Snackbar,
  Container,
  LinearProgress,
  CircularProgress
} from '@mui/material';
import {
  AddPhotoAlternate,
  Delete,
  Visibility,
  CloudUpload,
  Refresh,
  CheckCircle,
  Cancel,
  Inventory,
  ShoppingBag,
  Style,
  Palette
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
// Add at the top of your NewProduct.js file
import { getToken, isAuthenticated, logout, getCurrentAdmin } from '../Config/auth';

// Custom theme with monospace font
const themeStyles = {
  fontFamily: "'Roboto Mono', 'Courier New', monospace",
  borderRadius: '10px',
};

// Styled components with custom styling
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const PreviewCard = styled(Card)(({ theme }) => ({
  maxWidth: 350,
  margin: '0 auto',
  transition: 'transform 0.3s',
  borderRadius: '16px',
  fontFamily: themeStyles.fontFamily,
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[8],
  },
}));

const ColorChip = styled(Chip)(({ color }) => ({
  backgroundColor: color,
  color: '#fff',
  fontWeight: 'bold',
  margin: '2px',
  borderRadius: '6px',
  fontFamily: themeStyles.fontFamily,
}));

const ImageUploadArea = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  textAlign: 'center',
  border: `2px dashed ${theme.palette.divider}`,
  backgroundColor: theme.palette.background.default,
  borderRadius: themeStyles.borderRadius,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  fontFamily: themeStyles.fontFamily,
  '&:hover': {
    borderColor: theme.palette.primary.main,
    backgroundColor: theme.palette.action.hover,
  },
}));

const CustomTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: themeStyles.borderRadius,
    fontFamily: themeStyles.fontFamily,
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.primary.light,
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderWidth: '2px',
    },
  },
}));

const CustomFormControl = styled(FormControl)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: themeStyles.borderRadius,
    fontFamily: themeStyles.fontFamily,
  },
}));

const CustomButton = styled(Button)(({ theme }) => ({
  borderRadius: '8px',
  fontFamily: themeStyles.fontFamily,
  fontWeight: 600,
  textTransform: 'none',
  padding: '10px 24px',
}));

const CustomSelect = styled(Select)(({ theme }) => ({
  borderRadius: themeStyles.borderRadius,
  fontFamily: themeStyles.fontFamily,
}));

// Available options
const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', '2XL'];
const COLOR_OPTIONS = [
  { name: 'Crimson Red', value: '#dc2626' },
  { name: 'Ocean Blue', value: '#2563eb' },
  { name: 'Forest Green', value: '#16a34a' },
  { name: 'Sunset Yellow', value: '#fbbf24' },
  { name: 'Midnight Black', value: '#000000' },
  { name: 'Arctic White', value: '#ffffff' },
  { name: 'Graphite Gray', value: '#4b5563' },
  { name: 'Royal Purple', value: '#9333ea' },
  { name: 'Blush Pink', value: '#ec4899' },
  { name: 'Amber Orange', value: '#f97316' },
];
const CATEGORY_OPTIONS = ['Sport', 'Casual', 'Religious', 'Streetwear'];

const steps = ['Product Information', 'Visual Assets', 'Final Review'];

const API_BASE_URL = '/api';

const NewProduct = () => {
  // Form state with Sport as default category
  const [product, setProduct] = useState({
    name: '',
    sizes: [],
    price: '',
    description: '',
    colors: [],
    mainImage: null,
    additionalImages: [],
    category: 'Sport', // Default to Sport
    stock: 0,
  });

  // UI state
  const [activeStep, setActiveStep] = useState(0);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [mainImagePreview, setMainImagePreview] = useState(null);
  const [additionalPreviews, setAdditionalPreviews] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});

  // Get admin token from localStorage or context
const getAuthToken = () => getToken();

  const handleChange = (field) => (event) => {
    const value = event.target.value;
    setProduct(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  };

  const handleSizeChange = (event) => {
    const { value } = event.target;
    setProduct(prev => ({
      ...prev,
      sizes: typeof value === 'string' ? value.split(',') : value,
    }));
  };

  const handleColorChange = (event) => {
    const { value } = event.target;
    setProduct(prev => ({
      ...prev,
      colors: typeof value === 'string' ? value.split(',') : value,
    }));
  };

  const handleMainImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        setSnackbar({
          open: true,
          message: 'Main image exceeds 10MB limit',
          severity: 'error'
        });
        return;
      }

      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setSnackbar({
          open: true,
          message: 'Invalid file type. Please upload an image (jpg, jpeg, png, gif, webp)',
          severity: 'error'
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setProduct(prev => ({ ...prev, mainImage: file }));
        setMainImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  }

  const handleAdditionalImagesUpload = (event) => {
    const files = Array.from(event.target.files);
    
    // Validate total files (max 8 additional)
    if (product.additionalImages.length + files.length > 8) {
      setSnackbar({
        open: true,
        message: 'Maximum 8 additional images allowed',
        severity: 'error'
      });
      return;
    }

    // Validate each file
    const validFiles = files.filter(file => {
      // Validate file size
      if (file.size > 10 * 1024 * 1024) {
        setSnackbar({
          open: true,
          message: `${file.name} exceeds 10MB limit`,
          severity: 'error'
        });
        return false;
      }

      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setSnackbar({
          open: true,
          message: `${file.name} is not a valid image type`,
          severity: 'error'
        });
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

  const handleReset = () => {
    setProduct({
      name: '',
      sizes: [],
      price: '',
      description: '',
      colors: [],
      mainImage: null,
      additionalImages: [],
      category: 'Sport',
      stock: 0,
    });
    setMainImagePreview(null);
    setAdditionalPreviews([]);
    setActiveStep(0);
    setValidationErrors({});
    setSnackbar({
      open: true,
      message: 'All form fields have been successfully reset',
      severity: 'info'
    });
  };

  const validateForm = () => {
    const errors = {};
    
    if (!product.name.trim()) errors.name = 'Product name is required';
    if (!product.description.trim()) errors.description = 'Description is required';
    if (!product.price || parseFloat(product.price) <= 0) errors.price = 'Valid price is required';
    if (!product.category) errors.category = 'Category is required';
    if (activeStep >= 1 && !product.mainImage) errors.mainImage = 'Main image is required';
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setSnackbar({
        open: true,
        message: 'Please fix validation errors before submitting',
        severity: 'error'
      });
      return;
    }

    setLoading(true);
    setUploadProgress(0);

    try {
      // Create FormData for multipart upload
      const formData = new FormData();
      
      // Add text fields
      formData.append('name', product.name);
      formData.append('description', product.description);
      formData.append('price', product.price);
      formData.append('category', product.category);
      formData.append('sizes', JSON.stringify(product.sizes));
      formData.append('colors', JSON.stringify(product.colors.map(color => ({
        name: COLOR_OPTIONS.find(c => c.value === color)?.name || color,
        value: color
      }))));
      formData.append('stock', product.stock);

      // Add main image
      if (product.mainImage) {
        formData.append('mainImage', product.mainImage);
      }

      // Add additional images
      product.additionalImages.forEach((image, index) => {
        formData.append(`additionalImages`, image);
      });

      // Get auth token
      const token = getAuthToken();
      if (!token) {
        throw new Error('Authentication required. Please log in.');
      }

      // Create progress event handler for upload
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      });

      // Use fetch API with progress tracking
      const response = await fetch(`${API_BASE_URL}/products`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle validation errors from backend
        if (response.status === 400 && data.errors) {
          const backendErrors = {};
          data.errors.forEach(error => {
            // Map backend errors to form fields
            if (error.includes('name')) backendErrors.name = error;
            if (error.includes('price')) backendErrors.price = error;
            if (error.includes('category')) backendErrors.category = error;
            if (error.includes('description')) backendErrors.description = error;
          });
          setValidationErrors(backendErrors);
          throw new Error(data.message || 'Validation failed');
        }
        throw new Error(data.message || 'Failed to create product');
      }

      // Success
      setSnackbar({
        open: true,
        message: data.message || 'Product has been successfully created and added to inventory!',
        severity: 'success'
      });

      // Reset form after successful submission
      setTimeout(() => {
        handleReset();
      }, 1500);

    } catch (error) {
      console.error('Error creating product:', error);
      setSnackbar({
        open: true,
        message: error.message || 'Failed to create product. Please try again.',
        severity: 'error'
      });
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const handleNext = () => {
    if (activeStep === 0 && !validateForm()) {
      setSnackbar({
        open: true,
        message: 'Please fill in all required fields before proceeding',
        severity: 'error'
      });
      return;
    }
    
    if (activeStep === 1 && !product.mainImage) {
      setSnackbar({
        open: true,
        message: 'Please upload a main image before proceeding',
        severity: 'error'
      });
      return;
    }
    
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const PreviewModal = () => (
    <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ fontFamily: themeStyles.fontFamily, bgcolor: 'primary.main', color: 'white' }}>
        <Box display="flex" alignItems="center" gap={1}>
          <Visibility />
          Product Preview - {product.name || 'Unnamed Product'}
        </Box>
      </DialogTitle>
      <DialogContent sx={{ fontFamily: themeStyles.fontFamily }}>
        <PreviewCard>
          {mainImagePreview ? (
            <CardMedia
              component="img"
              height="240"
              image={mainImagePreview}
              alt={product.name || 'Product'}
              sx={{ objectFit: 'cover' }}
            />
          ) : (
            <Box height={240} display="flex" alignItems="center" justifyContent="center" bgcolor="#f5f5f5">
              <Typography color="textSecondary" fontFamily={themeStyles.fontFamily}>
                Product image preview
              </Typography>
            </Box>
          )}
          <CardContent>
            <Typography gutterBottom variant="h5" component="div" fontFamily={themeStyles.fontFamily} fontWeight="600">
              {product.name || 'Product Name'}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph fontFamily={themeStyles.fontFamily}>
              {product.description || 'Detailed product description will be displayed here for customer information.'}
            </Typography>
            
            <Box mb={2}>
              <Typography variant="subtitle2" color="textSecondary" fontFamily={themeStyles.fontFamily}>
                Product Category:
              </Typography>
              <Chip 
                label={product.category || 'Uncategorized'} 
                size="small" 
                sx={{ fontFamily: themeStyles.fontFamily }}
                icon={<Style fontSize="small" />}
              />
            </Box>
            
            <Box mb={2}>
              <Typography variant="subtitle2" color="textSecondary" fontFamily={themeStyles.fontFamily}>
                Available Sizes:
              </Typography>
              <Box display="flex" gap={0.5} flexWrap="wrap">
                {product.sizes.map(size => (
                  <Chip 
                    key={size} 
                    label={size} 
                    size="small" 
                    variant="outlined" 
                    sx={{ fontFamily: themeStyles.fontFamily }}
                  />
                ))}
                {product.sizes.length === 0 && (
                  <Typography variant="caption" color="textSecondary" fontFamily={themeStyles.fontFamily}>
                    Size options pending selection
                  </Typography>
                )}
              </Box>
            </Box>
            
            <Box mb={2}>
              <Typography variant="subtitle2" color="textSecondary" fontFamily={themeStyles.fontFamily}>
                Color Variations:
              </Typography>
              <Box display="flex" gap={0.5} flexWrap="wrap">
                {product.colors.map(color => {
                  const colorObj = COLOR_OPTIONS.find(c => c.value === color);
                  return (
                    <ColorChip
                      key={color}
                      label={colorObj?.name || color}
                      size="small"
                      color={color}
                      sx={{ fontFamily: themeStyles.fontFamily }}
                      icon={<Palette fontSize="small" />}
                    />
                  );
                })}
                {product.colors.length === 0 && (
                  <Typography variant="caption" color="textSecondary" fontFamily={themeStyles.fontFamily}>
                    Color options pending selection
                  </Typography>
                )}
              </Box>
            </Box>
            
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <Typography variant="h6" color="primary" fontFamily={themeStyles.fontFamily} fontWeight="700">
                ${product.price ? parseFloat(product.price).toFixed(2) : '0.00'}
              </Typography>
              <Chip
                icon={<CheckCircle />}
                label="Available in Stock"
                color="success"
                size="small"
                variant="outlined"
                sx={{ fontFamily: themeStyles.fontFamily }}
              />
            </Box>
          </CardContent>
        </PreviewCard>
      </DialogContent>
      <DialogActions sx={{ fontFamily: themeStyles.fontFamily }}>
        <CustomButton onClick={() => setPreviewOpen(false)} variant="outlined">
          Close Preview
        </CustomButton>
      </DialogActions>
    </Dialog>
  );

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            {/* Full width for description */}
            <Grid item xs={12}>
              <CustomTextField
                fullWidth
                label="Product Description *"
                value={product.description}
                onChange={handleChange('description')}
                multiline
                rows={6}
                variant="outlined"
                placeholder="Provide a detailed description of the product including materials, features, benefits, and care instructions..."
                helperText={validationErrors.description || "Comprehensive product description for customer information"}
                error={!!validationErrors.description}
                required
              />
            </Grid>
            
            {/* Three items per row for the rest */}
            <Grid item xs={12} md={4}>
              <CustomTextField
                fullWidth
                label="Product Name *"
                value={product.name}
                onChange={handleChange('name')}
                required
                variant="outlined"
                helperText={validationErrors.name || "Enter the official product name"}
                error={!!validationErrors.name}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <CustomFormControl fullWidth required error={!!validationErrors.category}>
                <InputLabel sx={{ fontFamily: themeStyles.fontFamily }}>Product Category *</InputLabel>
                <CustomSelect
                  value={product.category}
                  onChange={handleChange('category')}
                  label="Product Category *"
                >
                  {CATEGORY_OPTIONS.map(category => (
                    <MenuItem 
                      key={category} 
                      value={category}
                      sx={{ fontFamily: themeStyles.fontFamily }}
                    >
                      {category}
                    </MenuItem>
                  ))}
                </CustomSelect>
                <FormHelperText sx={{ fontFamily: themeStyles.fontFamily }}>
                  {validationErrors.category || "Default: Sport"}
                </FormHelperText>
              </CustomFormControl>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <CustomTextField
                fullWidth
                label="Retail Price *"
                type="number"
                value={product.price}
                onChange={handleChange('price')}
                required
                variant="outlined"
                InputProps={{
                  startAdornment: <Typography mr={1} fontFamily={themeStyles.fontFamily}>$</Typography>,
                  inputProps: { min: 0, step: 0.01 }
                }}
                helperText={validationErrors.price || "Set the retail price in TND"}
                error={!!validationErrors.price}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <CustomFormControl fullWidth>
                <InputLabel sx={{ fontFamily: themeStyles.fontFamily }}>Available Sizes</InputLabel>
                <CustomSelect
                  multiple
                  value={product.sizes}
                  onChange={handleSizeChange}
                  input={<OutlinedInput label="Available Sizes" />}
                  renderValue={(selected) => selected.join(', ')}
                  sx={{ fontFamily: themeStyles.fontFamily }}
                >
                  {SIZE_OPTIONS.map((size) => (
                    <MenuItem key={size} value={size} sx={{ fontFamily: themeStyles.fontFamily }}>
                      <Checkbox checked={product.sizes.indexOf(size) > -1} />
                      <ListItemText primary={size} sx={{ fontFamily: themeStyles.fontFamily }} />
                    </MenuItem>
                  ))}
                </CustomSelect>
                <FormHelperText sx={{ fontFamily: themeStyles.fontFamily }}>
                  Select multiple sizes for inventory
                </FormHelperText>
              </CustomFormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <CustomFormControl fullWidth>
                <InputLabel sx={{ fontFamily: themeStyles.fontFamily }}>Color Options</InputLabel>
                <CustomSelect
                  multiple
                  value={product.colors}
                  onChange={handleColorChange}
                  input={<OutlinedInput label="Color Options" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => {
                        const color = COLOR_OPTIONS.find(c => c.value === value);
                        return (
                          <Chip
                            key={value}
                            label={color?.name}
                            size="small"
                            sx={{ 
                              backgroundColor: value, 
                              color: '#fff',
                              fontFamily: themeStyles.fontFamily
                            }}
                          />
                        );
                      })}
                    </Box>
                  )}
                >
                  {COLOR_OPTIONS.map((color) => (
                    <MenuItem 
                      key={color.value} 
                      value={color.value}
                      sx={{ fontFamily: themeStyles.fontFamily }}
                    >
                      <Checkbox checked={product.colors.indexOf(color.value) > -1} />
                      <Box
                        sx={{
                          width: 20,
                          height: 20,
                          backgroundColor: color.value,
                          marginRight: 2,
                          border: '1px solid #ccc',
                          borderRadius: '4px'
                        }}
                      />
                      <ListItemText 
                        primary={color.name} 
                        sx={{ fontFamily: themeStyles.fontFamily }} 
                      />
                    </MenuItem>
                  ))}
                </CustomSelect>
                <FormHelperText sx={{ fontFamily: themeStyles.fontFamily }}>
                  Choose available color variations
                </FormHelperText>
              </CustomFormControl>
            </Grid>
            
            <Grid item xs={12} md={4}>
              <CustomTextField
                fullWidth
                label="Initial Stock"
                type="number"
                value={product.stock}
                onChange={handleChange('stock')}
                variant="outlined"
                InputProps={{
                  inputProps: { min: 0 }
                }}
                helperText="Initial quantity in inventory (optional)"
              />
            </Grid>
          </Grid>
        );
      
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom fontFamily={themeStyles.fontFamily} fontWeight="600">
                <CloudUpload sx={{ mr: 1, verticalAlign: 'middle' }} />
                Primary Product Image *
              </Typography>
              <ImageUploadArea>
                <CustomButton
                  component="label"
                  variant="contained"
                  startIcon={<CloudUpload />}
                  disabled={loading}
                >
                  Upload Primary Image
                  <VisuallyHiddenInput
                    type="file"
                    accept="image/*"
                    onChange={handleMainImageUpload}
                    disabled={loading}
                  />
                </CustomButton>
                <FormHelperText sx={{ mt: 2, fontFamily: themeStyles.fontFamily }}>
                  {validationErrors.mainImage || "High-quality main image for product display (Recommended: 1200x1200px, Max: 10MB)"}
                </FormHelperText>
                {validationErrors.mainImage && (
                  <Typography color="error" variant="caption" fontFamily={themeStyles.fontFamily}>
                    {validationErrors.mainImage}
                  </Typography>
                )}
                {mainImagePreview && (
                  <Box mt={3}>
                    <img
                      src={mainImagePreview}
                      alt="Main preview"
                      style={{ 
                        maxWidth: '100%', 
                        maxHeight: 300, 
                        borderRadius: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                      }}
                    />
                  </Box>
                )}
              </ImageUploadArea>
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom fontFamily={themeStyles.fontFamily} fontWeight="600">
                <AddPhotoAlternate sx={{ mr: 1, verticalAlign: 'middle' }} />
                Additional Product Images (Optional)
              </Typography>
              <ImageUploadArea>
                <CustomButton
                  component="label"
                  variant="outlined"
                  startIcon={<AddPhotoAlternate />}
                  disabled={loading || product.additionalImages.length >= 8}
                >
                  Add Gallery Images
                  <VisuallyHiddenInput
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleAdditionalImagesUpload}
                    disabled={loading || product.additionalImages.length >= 8}
                  />
                </CustomButton>
                <FormHelperText sx={{ mt: 1, fontFamily: themeStyles.fontFamily }}>
                  Upload multiple images for product gallery (Maximum 8 images, 10MB each)
                </FormHelperText>
                
                {additionalPreviews.length > 0 && (
                  <Box mt={3}>
                    <Typography 
                      variant="subtitle2" 
                      gutterBottom 
                      fontFamily={themeStyles.fontFamily}
                      fontWeight="600"
                    >
                      Gallery Images ({additionalPreviews.length} uploaded)
                    </Typography>
                    <Grid container spacing={2}>
                      {additionalPreviews.map((preview, index) => (
                        <Grid item xs={6} sm={4} md={3} key={index}>
                          <Box position="relative">
                            <img
                              src={preview}
                              alt={`Gallery ${index + 1}`}
                              style={{
                                width: '100%',
                                height: 120,
                                objectFit: 'cover',
                                borderRadius: '8px',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                              }}
                            />
                            <IconButton
                              size="small"
                              onClick={() => removeAdditionalImage(index)}
                              disabled={loading}
                              sx={{
                                position: 'absolute',
                                top: -8,
                                right: -8,
                                backgroundColor: 'error.main',
                                color: 'white',
                                fontFamily: themeStyles.fontFamily,
                                '&:hover': {
                                  backgroundColor: 'error.dark',
                                }
                              }}
                            >
                              <Delete fontSize="small" />
                            </IconButton>
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                display: 'block', 
                                mt: 0.5,
                                fontFamily: themeStyles.fontFamily 
                              }}
                            >
                              Image {index + 1}
                            </Typography>
                          </Box>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                )}
              </ImageUploadArea>
            </Grid>
            
            <Grid item xs={12}>
              <Box display="flex" justifyContent="center" mt={2}>
                <CustomButton
                  variant="contained"
                  color="secondary"
                  startIcon={<Visibility />}
                  onClick={() => setPreviewOpen(true)}
                  disabled={!product.name || loading}
                  sx={{ px: 4 }}
                >
                  Preview Product Card
                </CustomButton>
              </Box>
            </Grid>
          </Grid>
        );
      
      case 2:
        return (
          <Box sx={{ fontFamily: themeStyles.fontFamily }}>
            <Alert 
              severity="info" 
              sx={{ 
                mb: 3, 
                borderRadius: themeStyles.borderRadius,
                fontFamily: themeStyles.fontFamily
              }}
              icon={<Inventory />}
            >
              Review all product specifications and assets before final submission
            </Alert>
            
            {loading && (
              <Box mb={3}>
                <Typography variant="body2" gutterBottom fontFamily={themeStyles.fontFamily}>
                  Uploading product... {uploadProgress}%
                </Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={uploadProgress} 
                  sx={{ 
                    height: 10, 
                    borderRadius: 5,
                    mb: 2
                  }}
                />
              </Box>
            )}
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography 
                  variant="h6" 
                  fontWeight="bold" 
                  fontFamily={themeStyles.fontFamily}
                  color="primary"
                >
                  <ShoppingBag sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Product Specification Summary
                </Typography>
                <Divider sx={{ my: 2 }} />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Typography variant="body2" color="textSecondary" fontFamily={themeStyles.fontFamily}>
                  Product Name:
                </Typography>
                <Typography fontWeight="600" fontFamily={themeStyles.fontFamily}>
                  {product.name || 'Not specified'}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Typography variant="body2" color="textSecondary" fontFamily={themeStyles.fontFamily}>
                  Product Category:
                </Typography>
                <Chip 
                  label={product.category || 'Not selected'} 
                  color="primary" 
                  size="small"
                  sx={{ fontFamily: themeStyles.fontFamily }}
                />
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Typography variant="body2" color="textSecondary" fontFamily={themeStyles.fontFamily}>
                  Retail Price:
                </Typography>
                <Typography fontWeight="600" fontFamily={themeStyles.fontFamily} color="success.main">
                  ${product.price ? parseFloat(product.price).toFixed(2) : '0.00'}
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Typography variant="body2" color="textSecondary" fontFamily={themeStyles.fontFamily}>
                  Initial Stock:
                </Typography>
                <Typography fontWeight="600" fontFamily={themeStyles.fontFamily}>
                  {product.stock || 0} units
                </Typography>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Typography variant="body2" color="textSecondary" fontFamily={themeStyles.fontFamily}>
                  Available Sizes:
                </Typography>
                <Box display="flex" gap={1} flexWrap="wrap" mt={1}>
                  {product.sizes.map(size => (
                    <Chip 
                      key={size} 
                      label={size} 
                      size="small" 
                      variant="outlined"
                      sx={{ fontFamily: themeStyles.fontFamily }}
                    />
                  ))}
                  {product.sizes.length === 0 && (
                    <Typography variant="caption" color="textSecondary" fontFamily={themeStyles.fontFamily}>
                      No sizes configured
                    </Typography>
                  )}
                </Box>
              </Grid>
              
              <Grid item xs={12} md={4}>
                <Typography variant="body2" color="textSecondary" fontFamily={themeStyles.fontFamily}>
                  Color Variations:
                </Typography>
                <Box display="flex" gap={1} flexWrap="wrap" mt={1}>
                  {product.colors.map(color => {
                    const colorObj = COLOR_OPTIONS.find(c => c.value === color);
                    return (
                      <Chip
                        key={color}
                        label={colorObj?.name || color}
                        size="small"
                        sx={{ 
                          backgroundColor: color, 
                          color: '#fff',
                          fontFamily: themeStyles.fontFamily
                        }}
                      />
                    );
                  })}
                  {product.colors.length === 0 && (
                    <Typography variant="caption" color="textSecondary" fontFamily={themeStyles.fontFamily}>
                      No colors selected
                    </Typography>
                  )}
                </Box>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="body2" color="textSecondary" fontFamily={themeStyles.fontFamily}>
                  Product Description:
                </Typography>
                <Paper 
                  elevation={0} 
                  sx={{ 
                    p: 2, 
                    mt: 1, 
                    bgcolor: 'background.default',
                    borderRadius: themeStyles.borderRadius,
                    fontFamily: themeStyles.fontFamily
                  }}
                >
                  {product.description || 'No description provided'}
                </Paper>
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="body2" color="textSecondary" fontFamily={themeStyles.fontFamily}>
                  Media Assets:
                </Typography>
                <Grid container spacing={2} mt={1}>
                  <Grid item xs={12} md={6}>
                    <Paper 
                      elevation={1} 
                      sx={{ 
                        p: 2, 
                        borderRadius: themeStyles.borderRadius,
                        fontFamily: themeStyles.fontFamily
                      }}
                    >
                      <Typography variant="subtitle2" fontFamily={themeStyles.fontFamily}>
                        Primary Image:
                      </Typography>
                      <Typography fontFamily={themeStyles.fontFamily}>
                        {product.mainImage ? '✓ Uploaded' : '✗ Not uploaded'}
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Paper 
                      elevation={1} 
                      sx={{ 
                        p: 2, 
                        borderRadius: themeStyles.borderRadius,
                        fontFamily: themeStyles.fontFamily
                      }}
                    >
                      <Typography variant="subtitle2" fontFamily={themeStyles.fontFamily}>
                        Gallery Images:
                      </Typography>
                      <Typography fontFamily={themeStyles.fontFamily}>
                        {product.additionalImages.length} image(s) uploaded
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        );
      
      default:
        return 'Unknown step';
    }
  };

  return (
    <Container maxWidth="lg" sx={{ p: { xs: 2, sm: 3, md: 4,  } , display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center', }}>
      <Box sx={{ fontFamily: themeStyles.fontFamily,
 }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 4,
          p: 3,
          bgcolor: 'black',
          borderRadius: themeStyles.borderRadius,
          color: 'white'
        }}>
          <Inventory sx={{ fontSize: 40, mr: 2 }} />
          <Box>
            <Typography variant="h4" gutterBottom fontWeight="bold" fontFamily={themeStyles.fontFamily}>
              Product Inventory Management System
            </Typography>
            <Typography variant="subtitle1" fontFamily={themeStyles.fontFamily}>
              Add New Product to TAWAKKOL Catalog
            </Typography>
          </Box>
        </Box>
        
        <Paper elevation={3} sx={{ p: { xs: 2, sm: 3, md: 4 }, mb: 4, borderRadius: themeStyles.borderRadius }}>
          <Stepper activeStep={activeStep} sx={{ mb: 4, fontFamily: themeStyles.fontFamily }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel 
                  sx={{ 
                    '& .MuiStepLabel-label': {
                      fontFamily: themeStyles.fontFamily,
                      fontWeight: 500,
                    }
                  }}
                >
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
          
          <Box sx={{ mt: 3, fontFamily: themeStyles.fontFamily }}>
            {getStepContent(activeStep)}
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 6 }}>
            <CustomButton
              disabled={activeStep === 0 || loading}
              onClick={handleBack}
              startIcon={<Cancel />}
              variant="outlined"
              sx={{ backgroundColor:'#d4af37', color:'black' }}
            >
              Previous Step
            </CustomButton>
            
            <Box>
              <CustomButton
                variant="outlined"
                color="error"
                onClick={handleReset}
                startIcon={<Refresh />}
                sx={{ mr: 2 }}
                disabled={loading}
              >
                Reset Entire Form
              </CustomButton>
              
              {activeStep === steps.length - 1 ? (
                <CustomButton
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={loading || !product.name || !product.category || !product.price}
                  startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <CheckCircle />}
                >
                  {loading ? 'Publishing...' : 'Publish Product to Catalog'}
                </CustomButton>
              ) : (
                <CustomButton
                  variant="contained"
                  onClick={handleNext}
                  disabled={loading}
                  sx={{backgroundColor:'#1a1a1a', color:'white'}}
                >
                  Continue to Next Step
                </CustomButton>
              )}
            </Box>
          </Box>
        </Paper>
        
        <PreviewModal />
        
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert 
            severity={snackbar.severity} 
            sx={{ 
              fontFamily: themeStyles.fontFamily,
              borderRadius: themeStyles.borderRadius
            }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default NewProduct;