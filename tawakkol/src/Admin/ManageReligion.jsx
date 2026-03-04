// src/pages/ManageReligion.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Checkbox,
  IconButton,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Avatar,
  AvatarGroup,
  Tooltip,
  Switch,
  FormControlLabel,
  Grid,
  InputAdornment,
  Snackbar,
  Alert,
  Zoom,
  Fade,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Image as ImageIcon,
  Style as StyleIcon,
  AttachMoney as MoneyIcon,
  Description as DescriptionIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  Check as CheckIcon,
  CloudUpload as CloudUploadIcon,
  Inventory as InventoryIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import API_BASE from '../Config/api.js';

// ==================== PROFESSIONAL MONOCHROME PALETTE ====================
const palette = {
  black: '#1A1A1A',
  white: '#FFFFFF',
  gray50: '#FAFAFA',
  gray100: '#F5F5F5',
  gray200: '#EEEEEE',
  gray300: '#E0E0E0',
  gray400: '#BDBDBD',
  gray500: '#9E9E9E',
  gray600: '#757575',
  gray700: '#616161',
  gray800: '#424242',
  gray900: '#212121',
  gold: '#D4AF37',
  goldLight: 'rgba(212, 175, 55, 0.1)',
  goldHover: 'rgba(212, 175, 55, 0.2)',
  success: '#4CAF50',
  error: '#F44336',
  warning: '#FF9800',
  info: '#2196F3',
};

// ==================== STYLED COMPONENTS ====================
const StyledPaper = styled(Paper)(({ theme }) => ({
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.02)',
  border: `1px solid ${palette.gray200}`,
  backgroundColor: palette.white,
  transition: 'all 0.2s ease',
}));

const StyledTableHead = styled(TableHead)({
  backgroundColor: palette.gray50,
  '& .MuiTableCell-head': {
    fontWeight: 600,
    color: palette.gray800,
    fontSize: '0.85rem',
    textTransform: 'uppercase',
    letterSpacing: '0.02em',
    borderBottom: `2px solid ${palette.gray200}`,
  },
});

const StyledTableRow = styled(TableRow)(({ selected }) => ({
  backgroundColor: selected ? palette.goldLight : 'transparent',
  transition: 'all 0.2s ease',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: palette.gray50,
    '& .MuiTableCell-body': {
      color: palette.black,
    },
  },
  '& .MuiTableCell-body': {
    borderBottom: `1px solid ${palette.gray100}`,
    color: palette.gray700,
    fontSize: '0.9rem',
  },
}));

const StyledButton = styled(Button)(({ variant }) => ({
  borderRadius: '10px',
  textTransform: 'none',
  fontWeight: 500,
  fontSize: '0.9rem',
  padding: '8px 20px',
  transition: 'all 0.2s ease',
  ...(variant === 'primary' && {
    backgroundColor: palette.black,
    color: palette.white,
    '&:hover': {
      backgroundColor: palette.gray800,
      color: palette.white,
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    },
  }),
  ...(variant === 'secondary' && {
    backgroundColor: 'transparent',
    color: palette.gray700,
    border: `1px solid ${palette.gray300}`,
    '&:hover': {
      backgroundColor: palette.gray50,
      borderColor: palette.gray500,
    },
  }),
  ...(variant === 'gold' && {
    backgroundColor: palette.gold,
    color: palette.black,
    '&:hover': {
      backgroundColor: '#C4A030',
      color: palette.white,
      boxShadow: `0 4px 12px ${alpha(palette.gold, 0.3)}`,
    },
  }),
}));

const StyledTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
    fontSize: '0.95rem',
    backgroundColor: palette.white,
    '& fieldset': {
      borderColor: palette.gray300,
      borderWidth: '1.5px',
    },
    '&:hover fieldset': {
      borderColor: palette.gray500,
    },
    '&.Mui-focused fieldset': {
      borderColor: palette.black,
      borderWidth: '1.5px',
    },
  },
  '& .MuiInputLabel-root': {
    fontSize: '0.95rem',
    color: palette.gray600,
    '&.Mui-focused': {
      color: palette.black,
    },
  },
});

const StyledSelect = styled(Select)({
  borderRadius: '10px',
  fontSize: '0.95rem',
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: palette.gray300,
    borderWidth: '1.5px',
  },
  '&:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: palette.gray500,
  },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: palette.black,
    borderWidth: '1.5px',
  },
});

const ImagePreviewCard = styled(Box)({
  position: 'relative',
  borderRadius: '12px',
  overflow: 'hidden',
  border: `1.5px solid ${palette.gray200}`,
  backgroundColor: palette.gray50,
  transition: 'all 0.2s ease',
  '&:hover': {
    borderColor: palette.gold,
  },
});

const ColorSwatch = styled(Box)(({ color, selected }) => ({
  width: '100%',
  paddingTop: '100%',
  position: 'relative',
  borderRadius: '10px',
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  border: selected ? `3px solid ${palette.gold}` : `1.5px solid ${palette.gray300}`,
  backgroundColor: color,
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
}));

const SizeChip = styled(Chip)(({ selected }) => ({
  borderRadius: '8px',
  fontFamily: 'inherit',
  fontWeight: 500,
  fontSize: '0.9rem',
  height: '36px',
  backgroundColor: selected ? palette.gold : 'transparent',
  color: selected ? palette.black : palette.gray700,
  border: `1.5px solid ${selected ? palette.gold : palette.gray300}`,
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: selected ? palette.gold : palette.gray50,
    borderColor: selected ? palette.gold : palette.gray500,
  },
}));

const ProductImage = styled(Box)(({ src }) => ({
  width: '70px',
  height: '70px',
  backgroundImage: `url(${src})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  borderRadius: '10px',
  border: `1.5px solid ${palette.gray200}`,
  transition: 'all 0.2s ease',
}));

// ==================== OPTIONS ====================
const CATEGORY_OPTIONS = ['Sport', 'Casual', 'Religious', 'Streetwear'];
const SIZE_OPTIONS = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];
const COLOR_OPTIONS = [
  { name: 'Noir', value: '#000000' },
  { name: 'Blanc', value: '#FFFFFF' },
  { name: 'Charbon', value: '#36454F' },
  { name: 'Ardoise', value: '#708090' },
  { name: 'Marron', value: '#8B4513' },
  { name: 'Beige', value: '#F5F5DC' },
  { name: 'Bleu Marine', value: '#000080' },
  { name: 'Bordeaux', value: '#800020' },
  { name: 'Vert Forêt', value: '#228B22' },
  { name: 'Or', value: '#D4AF37' },
  { name: 'Argent', value: '#C0C0C0' },
  { name: 'Bronze', value: '#CD7F32' },
];

// ==================== MAIN COMPONENT ====================
const ManageReligion = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState([]);
  const [search, setSearch] = useState('');
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  
  // Snackbar state
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const token = localStorage.getItem('token') || sessionStorage.getItem('token');

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Religious',
    stock: 0,
    sizes: [],
    colors: [],
    isActive: true,
    mainImageFile: null,
    mainImagePreview: null
  });

  // ==================== SNACKBAR HELPER ====================
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // ==================== API FUNCTIONS ====================
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/api/relproducts`);
      setProducts(response.data.products || []);
    } catch (error) {
      console.error('Error fetching religious products:', error);
      showSnackbar('Erreur lors du chargement des produits', 'error');
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async () => {
    if (!selectedProduct) {
      showSnackbar('Aucun produit sélectionné', 'error');
      return;
    }

    setUploading(true);

    try {
      const formPayload = new FormData();

      formPayload.append('name', formData.name);
      formPayload.append('description', formData.description);
      formPayload.append('price', formData.price);
      formPayload.append('category', formData.category);
      formPayload.append('stock', formData.stock);
      formPayload.append('sizes', JSON.stringify(formData.sizes));
      formPayload.append('colors', JSON.stringify(formData.colors));
      formPayload.append('isActive', formData.isActive);

      if (formData.mainImageFile) {
        formPayload.append('mainImage', formData.mainImageFile);
      }

      await axios.put(
        `${API_BASE}/api/relproducts/${selectedProduct._id}`,
        formPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      showSnackbar('Produit mis à jour avec succès !', 'success');
      handleCloseEditDialog();
      fetchProducts();
    } catch (error) {
      console.error('Update error:', error.response?.data || error);
      showSnackbar(
        error.response?.data?.message || 'Erreur lors de la mise à jour',
        'error'
      );
    } finally {
      setUploading(false);
    }
  };

  const deleteProduct = async (productId) => {
    try {
      setDeleting(true);
      await axios.delete(`${API_BASE}/api/relproducts/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      showSnackbar('Produit supprimé avec succès !', 'success');
      fetchProducts();
    } catch (error) {
      console.error('Delete error:', error);
      showSnackbar(
        error.response?.data?.message || 'Erreur lors de la suppression',
        'error'
      );
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  // ==================== HANDLERS ====================
  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price?.toString() || '',
      category: product.category || 'Religious',
      stock: product.stock?.toString() || '0',
      sizes: product.sizes || [],
      colors: product.colors || [],
      isActive: product.isActive ?? true,
      mainImageFile: null,
      mainImagePreview: product.mainImage?.url || null
    });
    setEditDialogOpen(true);
  };

  const handlePreviewClick = (product) => {
    setSelectedProduct(product);
    setPreviewDialogOpen(true);
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (productToDelete) {
      deleteProduct(productToDelete._id);
    }
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setSelectedProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'Religious',
      stock: 0,
      sizes: [],
      colors: [],
      isActive: true,
      mainImageFile: null,
      mainImagePreview: null
    });
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setProductToDelete(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSizeToggle = (size) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
  };

  const handleColorToggle = (colorObj) => {
    setFormData(prev => ({
      ...prev,
      colors: prev.colors.some(c => c.value === colorObj.value)
        ? prev.colors.filter(c => c.value !== colorObj.value)
        : [...prev.colors, colorObj]
    }));
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        showSnackbar('L\'image dépasse la limite de 10 Mo', 'error');
        return;
      }
      setFormData(prev => ({
        ...prev,
        mainImageFile: file,
        mainImagePreview: URL.createObjectURL(file)
      }));
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = products.map((n) => n._id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleSelectClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  // ==================== EFFECTS ====================
  useEffect(() => {
    fetchProducts();
  }, []);

  // ==================== RENDER HELPERS ====================
  const renderColorPreview = (colors = []) => (
    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
      {colors.slice(0, 4).map((color, index) => (
        <Tooltip key={index} title={color.name} arrow>
          <Box
            sx={{
              width: 24,
              height: 24,
              borderRadius: '6px',
              backgroundColor: color.value,
              border: `2px solid ${palette.white}`,
              boxShadow: `0 2px 4px ${alpha(palette.black, 0.1)}`,
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'scale(1.2)',
                boxShadow: `0 4px 8px ${alpha(palette.black, 0.15)}`,
              },
            }}
          />
        </Tooltip>
      ))}
      {colors.length > 4 && (
        <Typography variant="caption" sx={{ color: palette.gray500, ml: 0.5 }}>
          +{colors.length - 4}
        </Typography>
      )}
    </Box>
  );

  // ==================== DELETE DIALOG ====================
  const renderDeleteDialog = () => (
    <Dialog
      open={deleteDialogOpen}
      onClose={handleCloseDeleteDialog}
      maxWidth="sm"
      fullWidth
      TransitionComponent={Fade}
      PaperProps={{
        sx: {
          borderRadius: '20px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: palette.error }}>
          Supprimer le Produit
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ py: 2 }}>
        {productToDelete && (
          <>
            <Typography variant="body1" sx={{ mb: 2, color: palette.gray800 }}>
              Êtes-vous sûr de vouloir supprimer "{productToDelete.name}" ?
            </Typography>
            <Typography variant="body2" sx={{ color: palette.gray500 }}>
              Cette action est irréversible. Toutes les données associées seront définitivement effacées.
            </Typography>
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 2 }}>
        <StyledButton
          variant="secondary"
          onClick={handleCloseDeleteDialog}
          disabled={deleting}
        >
          Annuler
        </StyledButton>
        <StyledButton
          variant="primary"
          onClick={handleConfirmDelete}
          disabled={deleting}
          sx={{ 
            backgroundColor: palette.error,
            '&:hover': { 
              backgroundColor: '#D32F2F',
              color: palette.white,
            }
          }}
        >
          {deleting ? <CircularProgress size={24} sx={{ color: palette.white }} /> : 'Supprimer'}
        </StyledButton>
      </DialogActions>
    </Dialog>
  );

  // ==================== PREVIEW DIALOG ====================
  const renderPreviewDialog = () => (
    <Dialog
      open={previewDialogOpen}
      onClose={() => setPreviewDialogOpen(false)}
      maxWidth="md"
      fullWidth
      TransitionComponent={Fade}
      PaperProps={{
        sx: {
          borderRadius: '24px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
          overflow: 'hidden',
        }
      }}
    >
      <DialogTitle sx={{ 
        p: 3, 
        borderBottom: `1px solid ${palette.gray200}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <Box display="flex" alignItems="center" gap={1.5}>
          <ViewIcon sx={{ color: palette.gold }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: palette.gray900 }}>
            Aperçu du Produit
          </Typography>
        </Box>
        <IconButton onClick={() => setPreviewDialogOpen(false)} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <DialogContent sx={{ p: 4 }}>
        {selectedProduct && (
          <Grid container spacing={4}>
            <Grid item xs={12} md={5}>
              <ImagePreviewCard sx={{ height: 300 }}>
                {selectedProduct.mainImage?.url ? (
                  <img
                    src={selectedProduct.mainImage.url}
                    alt={selectedProduct.name}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  <Box sx={{
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: palette.gray50,
                  }}>
                    <ImageIcon sx={{ fontSize: 60, color: palette.gray400 }} />
                  </Box>
                )}
              </ImagePreviewCard>
            </Grid>
            
            <Grid item xs={12} md={7}>
              <Typography variant="h4" sx={{ 
                fontWeight: 700, 
                color: palette.gray900,
                mb: 2,
                fontSize: '1.75rem',
              }}>
                {selectedProduct.name}
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Chip
                  label={selectedProduct.category}
                  size="small"
                  sx={{
                    backgroundColor: palette.goldLight,
                    color: palette.gold,
                    fontWeight: 500,
                    borderRadius: '8px',
                  }}
                />
                <Chip
                  label={selectedProduct.isActive ? 'Actif' : 'Inactif'}
                  size="small"
                  sx={{
                    backgroundColor: selectedProduct.isActive ? alpha(palette.success, 0.1) : alpha(palette.error, 0.1),
                    color: selectedProduct.isActive ? palette.success : palette.error,
                    fontWeight: 500,
                    borderRadius: '8px',
                  }}
                />
              </Box>

              <Typography variant="body1" sx={{ 
                color: palette.gray600,
                mb: 4,
                lineHeight: 1.6,
              }}>
                {selectedProduct.description}
              </Typography>

              <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={6}>
                  <Typography variant="caption" sx={{ color: palette.gray500, display: 'block', mb: 0.5 }}>
                    Prix
                  </Typography>
                  <Typography variant="h5" sx={{ 
                    fontWeight: 700, 
                    color: palette.gold,
                  }}>
                    {selectedProduct.price} TND
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" sx={{ color: palette.gray500, display: 'block', mb: 0.5 }}>
                    Stock
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: palette.gray800 }}>
                    {selectedProduct.stock} unités
                  </Typography>
                </Grid>
              </Grid>

              <Box sx={{ mb: 3 }}>
                <Typography variant="caption" sx={{ color: palette.gray500, display: 'block', mb: 1 }}>
                  Tailles disponibles
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {selectedProduct.sizes?.map(size => (
                    <Chip
                      key={size}
                      label={size}
                      size="small"
                      sx={{
                        backgroundColor: palette.gray100,
                        borderRadius: '6px',
                      }}
                    />
                  ))}
                </Box>
              </Box>

              <Box>
                <Typography variant="caption" sx={{ color: palette.gray500, display: 'block', mb: 1 }}>
                  Couleurs disponibles
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {selectedProduct.colors?.map((color, index) => (
                    <Tooltip key={index} title={color.name} arrow>
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: '8px',
                          backgroundColor: color.value,
                          border: `2px solid ${palette.white}`,
                          boxShadow: `0 2px 8px ${alpha(palette.black, 0.1)}`,
                        }}
                      />
                    </Tooltip>
                  ))}
                </Box>
              </Box>
            </Grid>
          </Grid>
        )}
      </DialogContent>
    </Dialog>
  );

  // ==================== EDIT FORM (DIALOG) ====================
  const renderEditForm = () => (
    <Dialog
      open={editDialogOpen}
      onClose={handleCloseEditDialog}
      maxWidth="lg"
      fullWidth
      TransitionComponent={Fade}
      PaperProps={{
        sx: {
          borderRadius: '24px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
        }
      }}
    >
      <DialogTitle sx={{ 
        p: 3, 
        borderBottom: `1px solid ${palette.gray200}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <Box display="flex" alignItems="center" gap={1.5}>
          <EditIcon sx={{ color: palette.gold }} />
          <Typography variant="h6" sx={{ fontWeight: 600, color: palette.gray900 }}>
            Modifier le Produit
          </Typography>
        </Box>
        <IconButton onClick={handleCloseEditDialog} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 4 }}>
        <Grid container spacing={4}>
          {/* LEFT COLUMN */}
          <Grid item xs={12} md={6}>
            <StyledTextField
              fullWidth
              label="Nom du produit"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <StyleIcon sx={{ color: palette.gray400, fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
            />

            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Catégorie</InputLabel>
              <StyledSelect
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                label="Catégorie"
              >
                {CATEGORY_OPTIONS.map(cat => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </StyledSelect>
            </FormControl>

            <StyledTextField
              fullWidth
              multiline
              rows={5}
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                    <DescriptionIcon sx={{ color: palette.gray400, fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
            />

            <Box>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: palette.gray700 }}>
                Image principale
              </Typography>

              {formData.mainImagePreview ? (
                <ImagePreviewCard sx={{ width: '100%', maxWidth: 320, mb: 2 }}>
                  <img
                    src={formData.mainImagePreview}
                    alt="preview"
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                  />
                </ImagePreviewCard>
              ) : (
                <Box sx={{
                  width: '100%',
                  height: 180,
                  backgroundColor: palette.gray50,
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `2px dashed ${palette.gray300}`,
                  mb: 2,
                }}>
                  <ImageIcon sx={{ fontSize: 48, color: palette.gray400 }} />
                </Box>
              )}

              <Button
                component="label"
                variant="outlined"
                fullWidth
                startIcon={<CloudUploadIcon />}
                sx={{
                  borderColor: palette.gray300,
                  color: palette.gray700,
                  borderRadius: '10px',
                  py: 1.5,
                  '&:hover': {
                    borderColor: palette.gold,
                    backgroundColor: palette.goldLight,
                  },
                }}
              >
                {formData.mainImagePreview ? 'Changer l\'image' : 'Télécharger une image'}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleMainImageChange}
                />
              </Button>
            </Box>
          </Grid>

          {/* RIGHT COLUMN */}
          <Grid item xs={12} md={6}>
            <StyledTextField
              fullWidth
              type="number"
              label="Prix (TND)"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MoneyIcon sx={{ color: palette.gray400, fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
            />

            <StyledTextField
              fullWidth
              type="number"
              label="Stock"
              name="stock"
              value={formData.stock}
              onChange={handleInputChange}
              sx={{ mb: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <InventoryIcon sx={{ color: palette.gray400, fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
            />

            <FormControlLabel
              control={
                <Switch
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: palette.gold,
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: palette.gold,
                    },
                  }}
                />
              }
              label="Produit actif"
              sx={{ mb: 4, color: palette.gray700 }}
            />

            <Box sx={{ mb: 4 }}>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: palette.gray700 }}>
                Tailles disponibles
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {SIZE_OPTIONS.map(size => (
                  <SizeChip
                    key={size}
                    label={size}
                    onClick={() => handleSizeToggle(size)}
                    selected={formData.sizes.includes(size)}
                  />
                ))}
              </Box>
            </Box>

            <Box>
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600, color: palette.gray700 }}>
                Couleurs disponibles
              </Typography>
              <Grid container spacing={1.5}>
                {COLOR_OPTIONS.map(color => (
                  <Grid item xs={4} sm={3} key={color.value}>
                    <Tooltip title={color.name} arrow placement="top">
                      <ColorSwatch
                        color={color.value}
                        selected={formData.colors.some(c => c.value === color.value)}
                        onClick={() => handleColorToggle(color)}
                      >
                        {formData.colors.some(c => c.value === color.value) && (
                          <Box
                            sx={{
                              position: 'absolute',
                              top: '50%',
                              left: '50%',
                              transform: 'translate(-50%, -50%)',
                              zIndex: 2,
                              width: 20,
                              height: 20,
                              borderRadius: '50%',
                              backgroundColor: palette.white,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                            }}
                          >
                            <CheckIcon sx={{ fontSize: 14, color: palette.black }} />
                          </Box>
                        )}
                      </ColorSwatch>
                    </Tooltip>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>
        </Grid>

        {uploading && (
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <CircularProgress sx={{ color: palette.gold }} />
            <Typography sx={{ mt: 1, color: palette.gray600 }}>
              Mise à jour du produit...
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <StyledButton
          variant="secondary"
          onClick={handleCloseEditDialog}
          disabled={uploading}
        >
          Annuler
        </StyledButton>
        <StyledButton
          variant="primary"
          onClick={updateProduct}
          disabled={uploading}
        >
          {uploading ? <CircularProgress size={24} sx={{ color: palette.white }} /> : 'Enregistrer'}
        </StyledButton>
      </DialogActions>
    </Dialog>
  );

  // ==================== MAIN RENDER ====================
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ 
          fontWeight: 700, 
          color: palette.gray900,
          mb: 1,
          letterSpacing: '-0.02em',
        }}>
          Produits Religieux
        </Typography>
        <Typography variant="body1" sx={{ color: palette.gray500 }}>
          Gérez votre collection d'articles religieux
        </Typography>
      </Box>

      {/* Search & Actions */}
      <StyledPaper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
          <StyledTextField
            placeholder="Rechercher un produit..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            sx={{ width: 300 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: palette.gray400, fontSize: 20 }} />
                </InputAdornment>
              ),
            }}
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <StyledButton
              variant="secondary"
              startIcon={<RefreshIcon />}
              onClick={fetchProducts}
            >
              Actualiser
            </StyledButton>
            <StyledButton
              variant="gold"
              startIcon={<AddIcon />}
              href='/Admin-Panel/Add-Religion'
            >
              Nouveau produit
            </StyledButton>
          </Box>
        </Box>
      </StyledPaper>

      {/* Products Table */}
      <StyledPaper sx={{ overflow: 'hidden' }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 10 }}>
            <CircularProgress sx={{ color: palette.gold }} />
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <StyledTableHead>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        indeterminate={selected.length > 0 && selected.length < products.length}
                        checked={products.length > 0 && selected.length === products.length}
                        onChange={handleSelectAllClick}
                        sx={{ color: palette.gray400 }}
                      />
                    </TableCell>
                    <TableCell>Produit</TableCell>
                    <TableCell>Catégorie</TableCell>
                    <TableCell align="right">Prix</TableCell>
                    <TableCell>Stock</TableCell>
                    <TableCell>Tailles</TableCell>
                    <TableCell>Couleurs</TableCell>
                    <TableCell align="center">Actions</TableCell>
                  </TableRow>
                </StyledTableHead>
                <TableBody>
                  {products
                    .filter(p =>
                      p.name?.toLowerCase().includes(search.toLowerCase()) ||
                      p.description?.toLowerCase().includes(search.toLowerCase())
                    )
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map(product => {
                      const isSelected = selected.includes(product._id);
                      return (
                        <StyledTableRow key={product._id} selected={isSelected}>
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={isSelected}
                              onChange={(event) => handleSelectClick(event, product._id)}
                              sx={{ color: palette.gray400 }}
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              {product.mainImage?.url ? (
                                <ProductImage src={product.mainImage.url} />
                              ) : (
                                <Box sx={{
                                  width: 70,
                                  height: 70,
                                  backgroundColor: palette.gray50,
                                  borderRadius: '10px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  border: `1.5px solid ${palette.gray200}`,
                                }}>
                                  <ImageIcon sx={{ color: palette.gray400 }} />
                                </Box>
                              )}
                              <Box>
                                <Typography sx={{ fontWeight: 600, color: palette.gray900, mb: 0.5 }}>
                                  {product.name}
                                </Typography>
                                <Typography variant="caption" sx={{ color: palette.gray500 }}>
                                  {product.description?.substring(0, 50)}...
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={product.category}
                              size="small"
                              sx={{
                                backgroundColor: palette.goldLight,
                                color: palette.gold,
                                fontWeight: 500,
                                borderRadius: '6px',
                              }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <Typography sx={{ fontWeight: 600, color: palette.gold }}>
                              {product.price} TND
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography sx={{ color: palette.gray700 }}>
                              {product.stock}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                              {product.sizes?.slice(0, 3).map(size => (
                                <Chip
                                  key={size}
                                  label={size}
                                  size="small"
                                  sx={{
                                    backgroundColor: palette.gray100,
                                    borderRadius: '4px',
                                    height: 24,
                                  }}
                                />
                              ))}
                              {product.sizes?.length > 3 && (
                                <Typography variant="caption" sx={{ color: palette.gray500, ml: 0.5 }}>
                                  +{product.sizes.length - 3}
                                </Typography>
                              )}
                            </Box>
                          </TableCell>
                          <TableCell>
                            {renderColorPreview(product.colors)}
                          </TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                              <Tooltip title="Aperçu" arrow>
                                <IconButton
                                  onClick={() => handlePreviewClick(product)}
                                  size="small"
                                  sx={{ color: palette.gray600 }}
                                >
                                  <ViewIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Modifier" arrow>
                                <IconButton
                                  onClick={() => handleEditClick(product)}
                                  size="small"
                                  sx={{ color: palette.gold }}
                                >
                                  <EditIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Supprimer" arrow>
                                <IconButton
                                  onClick={() => handleDeleteClick(product)}
                                  size="small"
                                  sx={{ color: palette.error }}
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          </TableCell>
                        </StyledTableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </TableContainer>

            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={products.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={(_, newPage) => setPage(newPage)}
              onRowsPerPageChange={(e) => {
                setRowsPerPage(parseInt(e.target.value, 10));
                setPage(0);
              }}
              labelRowsPerPage="Lignes par page"
              sx={{
                borderTop: `1px solid ${palette.gray200}`,
                '.MuiTablePagination-select': {
                  borderRadius: '8px',
                },
              }}
            />
          </>
        )}
      </StyledPaper>

      {/* Dialogs */}
      {renderPreviewDialog()}
      {renderEditForm()}
      {renderDeleteDialog()}

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        TransitionComponent={Zoom}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{
            borderRadius: '12px',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.1)',
            fontWeight: 500,
            '& .MuiAlert-icon': {
              fontSize: 20,
            },
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ManageReligion;