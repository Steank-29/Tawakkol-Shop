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
  Badge,
  Switch,
  FormControlLabel,
  Grid,
  InputAdornment,
  Fab,
} from '@mui/material';
import {
  Delete as DeleteIcon,
  Edit as EditIcon,
  Visibility as ViewIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  Image as ImageIcon,
  Style,
  AttachMoney as MoneyIcon,
  Description as DescriptionIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon,
  Add as AddIcon,
  Check as CheckIcon,
  CloudUpload as CloudUpload,
  Inventory as InventoryIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import API_BASE from '../../Config/api.js';

// ==================== THEME & STYLES ====================
const themeStyles = {
  primary: '#1a1a1a',
  secondary: '#d4af37',
  background: '#ffffff',
  tableHeader: '#f8f8f8',
  text: '#1a1a1a',
  textSecondary: '#666666',
  border: '#e0e0e0',
  fontFamily: "'Roboto Mono', monospace, 'Courier New', monospace"
};

// ==================== STYLED COMPONENTS ====================
const GoldenButton = styled(Button)({
  background: `linear-gradient(135deg, ${themeStyles.primary} 0%, ${themeStyles.secondary} 100%)`,
  color: '#ffffff',
  fontWeight: 'bold',
  padding: '10px 24px',
  borderRadius: '8px',
  textTransform: 'none',
  fontFamily: themeStyles.fontFamily,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: `0 8px 20px rgba(212, 175, 55, 0.3)`
  }
});

const GoldenTableRow = styled(TableRow)(({ selected }) => ({
  backgroundColor: selected ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
  transition: 'all 0.2s ease',
  '&:hover': {
    backgroundColor: 'rgba(212, 175, 55, 0.05)',
    '& td': {
      borderColor: themeStyles.secondary
    }
  },
  '& td': {
    borderBottom: `1px solid ${themeStyles.border}`,
    fontFamily: themeStyles.fontFamily,
    color: themeStyles.text,
    padding: '16px'
  }
}));

const GoldenTableCell = styled(TableCell)({
  fontFamily: themeStyles.fontFamily,
  fontWeight: 500
});

const GoldenTextField = styled(TextField)({
  '& .MuiOutlinedInput-root': {
    fontFamily: themeStyles.fontFamily,
    '& fieldset': {
      borderColor: themeStyles.border,
      borderWidth: '2px'
    },
    '&:hover fieldset': {
      borderColor: themeStyles.secondary
    },
    '&.Mui-focused fieldset': {
      borderColor: themeStyles.secondary,
      borderWidth: '2px'
    }
  },
  '& .MuiInputLabel-root': {
    fontFamily: themeStyles.fontFamily,
    color: themeStyles.textSecondary
  },
  '& .MuiInputLabel-root.Mui-focused': {
    color: themeStyles.secondary
  },
  '& .MuiInputBase-input': {
    fontFamily: themeStyles.fontFamily
  }
});

const ImagePreview = styled('div')(({ src }) => ({
  width: '60px',
  height: '60px',
  backgroundImage: `url(${src})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  borderRadius: '8px',
  border: `2px solid ${themeStyles.border}`,
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.1)',
    borderColor: themeStyles.secondary
  }
}));

// ==================== MAIN COMPONENT ====================
const ManageProducts = () => {
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
  

  
  
  const token = localStorage.getItem('token') || 'your-token-here';

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Sport',
    stock: '',
    sizes: [],
    colors: [], // will store objects: { name, value }
    isActive: false,
    mainImageFile: null,
    mainImagePreview: null
  });

  // Available options
  const categories = ['Sport', 'Casual', 'Religious', 'Streetwear'];
  const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', '2XL'];
  const colorOptions = [
    { name: 'Gold', value: '#d4af37' },
    { name: 'Black', value: '#1a1a1a' },
    { name: 'White', value: '#ffffff' },
    { name: 'Red', value: '#ff4444' },
    { name: 'Blue', value: '#4488ff' },
    { name: 'Green', value: '#44ff44' },
    { name: 'Purple', value: '#aa44ff' }
  ];

  // ==================== API FUNCTIONS ====================
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/api/products`);
      setProducts(response.data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      alert('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async () => {
    if (!selectedProduct) {
      alert('No product selected for update');
      return;
    }

    setUploading(true);

    try {
      const formPayload = new FormData();

      // Append text fields
      formPayload.append('name', formData.name);
      formPayload.append('description', formData.description);
      formPayload.append('price', formData.price);
      formPayload.append('category', formData.category);
      formPayload.append('stock', formData.stock);
      formPayload.append('sizes', JSON.stringify(formData.sizes));
      formPayload.append('colors', JSON.stringify(formData.colors));
      formPayload.append('isActive', formData.isActive);

      // Append image if changed
      if (formData.mainImageFile) {
        formPayload.append('mainImage', formData.mainImageFile);
      }

      await axios.put(
        `${API_BASE}/${selectedProduct._id}`,
        formPayload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      alert('Product updated successfully!');
      handleCloseEditDialog();
      fetchProducts();
    } catch (error) {
      console.error('Update error:', error.response?.data || error);
      alert('Update failed: ' + (error.response?.data?.message || error.message));
    } finally {
      setUploading(false);
    }
  };

  // DELETE FUNCTION - JUST ADDED THIS
  const deleteProduct = async (productId) => {
    try {
      setDeleting(true);
      await axios.delete(`${API_BASE}/${productId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      alert('Product deleted successfully!');
      fetchProducts();
    } catch (error) {
      console.error('Delete error:', error);
      alert(`Delete failed: ${error.response?.data?.message || error.message}`);
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
      category: product.category || 'Sport',
      stock: product.stock?.toString() || '',
      sizes: product.sizes || [],
      colors: product.colors || [], // assuming array of {name, value}
      isActive: product.isActive ?? false,
      mainImageFile: null,
      mainImagePreview: product.mainImage?.url || null
    });
    setEditDialogOpen(true);
  };

  const handlePreviewClick = (product) => {
    setSelectedProduct(product);
    setPreviewDialogOpen(true);
  };

  // DELETE HANDLER - JUST ADDED THIS
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
      category: 'Sport',
      stock: '',
      sizes: [],
      colors: [],
      isActive: false,
      mainImageFile: null,
      mainImagePreview: null
    });
  };

  // CLOSE DELETE DIALOG HANDLER - JUST ADDED THIS
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
  const renderSizeChips = (sizes = []) => (
    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
      {sizes.slice(0, 3).map(size => (
        <Chip
          key={size}
          label={size}
          size="small"
          sx={{
            backgroundColor: 'rgba(212, 175, 55, 0.1)',
            color: themeStyles.secondary,
            fontFamily: themeStyles.fontFamily
          }}
        />
      ))}
      {sizes.length > 3 && (
        <Chip label={`+${sizes.length - 3}`} size="small" />
      )}
    </Box>
  );

  const renderColorChips = (colors = []) => (
    <AvatarGroup max={4} sx={{ justifyContent: 'flex-start' }}>
      {colors.map((color, i) => (
        <Tooltip key={i} title={color.name}>
          <Avatar
            sx={{
              width: 24,
              height: 24,
              backgroundColor: color.value,
              border: `2px solid ${themeStyles.secondary}`
            }}
          />
        </Tooltip>
      ))}
    </AvatarGroup>
  );

  // ==================== DELETE DIALOG - JUST ADDED THIS ====================
  const renderDeleteDialog = () => (
    <Dialog
      open={deleteDialogOpen}
      onClose={handleCloseDeleteDialog}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle sx={{
        bgcolor: '#d32f2f',
        color: 'white',
        fontFamily: themeStyles.fontFamily,
        fontWeight: 'bold'
      }}>
        Delete Product
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        {productToDelete && (
          <>
            <Typography variant="body1" sx={{ mb: 2, fontFamily: themeStyles.fontFamily }}>
              Are you sure you want to delete "{productToDelete.name}"?
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontFamily: themeStyles.fontFamily }}>
              This action cannot be undone.
            </Typography>
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={handleCloseDeleteDialog}
          disabled={deleting}
          sx={{ color: themeStyles.textSecondary, fontFamily: themeStyles.fontFamily }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleConfirmDelete}
          disabled={deleting}
          variant="contained"
          color="error"
          startIcon={<DeleteIcon />}
          sx={{ fontFamily: themeStyles.fontFamily }}
        >
          {deleting ? 'Deleting...' : 'Delete'}
        </Button>
      </DialogActions>
    </Dialog>
  );

  // ==================== PREVIEW DIALOG ====================
  const renderPreviewDialog = () => (
    <Dialog
      open={previewDialogOpen}
      onClose={() => setPreviewDialogOpen(false)}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          border: `2px solid ${themeStyles.secondary}`,
          borderRadius: '12px'
        }
      }}
    >
      <DialogTitle sx={{
        bgcolor: themeStyles.primary,
        color: 'white',
        fontFamily: themeStyles.fontFamily,
        fontWeight: 'bold'
      }}>
        <Box display="flex" alignItems="center" gap={1}>
          <ViewIcon />
          Product Preview
        </Box>
      </DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        {selectedProduct && (
          <Box>
            <Box sx={{ mb: 3, textAlign: 'center' }}>
              {selectedProduct.mainImage?.url ? (
                <Box
                  component="img"
                  src={selectedProduct.mainImage.url}
                  alt={selectedProduct.name}
                  sx={{
                    maxWidth: '100%',
                    maxHeight: 300,
                    borderRadius: '12px',
                    border: `2px solid ${themeStyles.secondary}`
                  }}
                />
              ) : (
                <Box sx={{
                  height: 200,
                  bgcolor: '#f5f5f5',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <ImageIcon sx={{ fontSize: 64, color: themeStyles.textSecondary }} />
                </Box>
              )}
            </Box>

            <Typography variant="h5" sx={{
              fontFamily: themeStyles.fontFamily,
              fontWeight: 'bold',
              color: themeStyles.primary,
              mb: 2
            }}>
              {selectedProduct.name}
            </Typography>

            <Typography variant="body1" sx={{
              color: themeStyles.textSecondary,
              mb: 3,
              fontFamily: themeStyles.fontFamily
            }}>
              {selectedProduct.description}
            </Typography>

            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="textSecondary">Price</Typography>
                <Typography variant="h6" sx={{ color: themeStyles.secondary, fontWeight: 'bold' }}>
                  {selectedProduct.price} TND
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="textSecondary">Stock</Typography>
                <Typography variant="h6">{selectedProduct.stock} units</Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography variant="subtitle2" color="textSecondary">Category</Typography>
                <Chip label={selectedProduct.category} size="small" sx={{ bgcolor: 'rgba(212,175,55,0.15)' }} />
              </Grid>
            </Grid>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="textSecondary">Sizes</Typography>
              {renderSizeChips(selectedProduct.sizes)}
            </Box>

            <Box>
              <Typography variant="subtitle2" color="textSecondary">Colors</Typography>
              {renderColorChips(selectedProduct.colors)}
            </Box>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <GoldenButton onClick={() => setPreviewDialogOpen(false)}>
          Close
        </GoldenButton>
      </DialogActions>
    </Dialog>
  );

  // ==================== EDIT FORM (DIALOG) ====================
  const renderEditForm = () => (
    <Dialog
      open={editDialogOpen}
      onClose={handleCloseEditDialog}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          background: '#ffffff',
          border: `2px solid ${themeStyles.secondary}`,
          borderRadius: '16px'
        }
      }}
    >
      <DialogTitle sx={{
        fontFamily: themeStyles.fontFamily,
        bgcolor: themeStyles.secondary,
        color: 'white',
        fontWeight: 'bold'
      }}>
        <Box display="flex" alignItems="center" gap={1}>
          <EditIcon />
          Edit Product: {selectedProduct?.name || ''}
        </Box>
      </DialogTitle>

      <DialogContent sx={{ fontFamily: themeStyles.fontFamily, p: 4 }}>
        <Grid container spacing={4}>
          {/* LEFT COLUMN */}
          <Grid item xs={12} md={6}>
            <GoldenTextField
              fullWidth
              label="Product Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Style sx={{ color: themeStyles.secondary }} />
                  </InputAdornment>
                )
              }}
            />

            <FormControl fullWidth sx={{ mt: 3 }}>
              <InputLabel sx={{ fontFamily: themeStyles.fontFamily }}>Category</InputLabel>
              <Select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                label="Category"
                sx={{
                  fontFamily: themeStyles.fontFamily,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: themeStyles.border,
                    borderWidth: '2px'
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: themeStyles.secondary
                  }
                }}
              >
                {categories.map(cat => (
                  <MenuItem key={cat} value={cat} sx={{ fontFamily: themeStyles.fontFamily }}>
                    {cat}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <GoldenTextField
              fullWidth
              multiline
              rows={4}
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              sx={{ mt: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <DescriptionIcon sx={{ color: themeStyles.secondary }} />
                  </InputAdornment>
                )
              }}
            />

            {/* Image Upload Section */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="subtitle1" sx={{
                fontWeight: 'bold',
                mb: 1.5,
                fontFamily: themeStyles.fontFamily
              }}>
                Main Image
              </Typography>

              {formData.mainImagePreview ? (
                <Box sx={{
                  width: '100%',
                  maxWidth: 320,
                  mb: 2,
                  borderRadius: '12px',
                  overflow: 'hidden',
                  border: `2px solid ${themeStyles.secondary}`
                }}>
                  <img
                    src={formData.mainImagePreview}
                    alt="preview"
                    style={{ width: '100%', height: 'auto' }}
                  />
                </Box>
              ) : (
                <Box sx={{
                  width: '100%',
                  height: 180,
                  bgcolor: '#f5f5f5',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: `2px dashed ${themeStyles.border}`,
                  mb: 2
                }}>
                  <ImageIcon sx={{ fontSize: 60, color: themeStyles.textSecondary }} />
                </Box>
              )}

              <Button
                component="label"
                variant="outlined"
                fullWidth
                startIcon={<CloudUpload />}
                sx={{
                  borderColor: themeStyles.secondary,
                  color: themeStyles.secondary,
                  fontFamily: themeStyles.fontFamily,
                  py: 1.5,
                  '&:hover': {
                    borderColor: themeStyles.primary,
                    bgcolor: 'rgba(212,175,55,0.05)'
                  }
                }}
              >
                {formData.mainImagePreview ? 'Change Image' : 'Upload Image'}
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
            <GoldenTextField
              fullWidth
              type="number"
              label="Price"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <MoneyIcon sx={{ color: themeStyles.secondary }} />
                  </InputAdornment>
                )
              }}
            />

            <GoldenTextField
              fullWidth
              type="number"
              label="Stock Quantity"
              name="stock"
              value={formData.stock}
              onChange={handleInputChange}
              sx={{ mt: 3 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <InventoryIcon sx={{ color: themeStyles.secondary }} />
                  </InputAdornment>
                )
              }}
            />

            {/* Sizes */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="subtitle1" sx={{
                fontFamily: themeStyles.fontFamily,
                fontWeight: 'bold',
                mb: 1.5
              }}>
                Available Sizes
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {sizeOptions.map(size => (
                  <Chip
                    key={size}
                    label={size}
                    onClick={() => handleSizeToggle(size)}
                    sx={{
                      backgroundColor: formData.sizes.includes(size)
                        ? themeStyles.secondary
                        : 'rgba(0,0,0,0.08)',
                      color: formData.sizes.includes(size) ? '#ffffff' : themeStyles.text,
                      fontFamily: themeStyles.fontFamily,
                      fontWeight: 'bold',
                      padding: '10px 16px',
                      '&:hover': {
                        backgroundColor: formData.sizes.includes(size)
                          ? themeStyles.primary
                          : 'rgba(212, 175, 55, 0.2)'
                      }
                    }}
                  />
                ))}
              </Box>
            </Box>

            {/* Colors */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="subtitle1" sx={{
                fontFamily: themeStyles.fontFamily,
                fontWeight: 'bold',
                mb: 1.5
              }}>
                Available Colors
              </Typography>
              <Grid container spacing={1.5}>
                {colorOptions.map(color => (
                  <Grid item xs={4} key={color.value}>
                    <Tooltip title={color.name}>
                      <Box
                        sx={{
                          width: '100%',
                          paddingTop: '100%',
                          position: 'relative',
                          borderRadius: '10px',
                          border: formData.colors.some(c => c.value === color.value)
                            ? `3px solid ${themeStyles.secondary}`
                            : `2px solid ${themeStyles.border}`,
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          '&:hover': { transform: 'scale(1.08)' }
                        }}
                        onClick={() => handleColorToggle(color)}
                      >
                        <Box
                          sx={{
                            position: 'absolute',
                            inset: 0,
                            backgroundColor: color.value,
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          {formData.colors.some(c => c.value === color.value) && (
                            <CheckIcon sx={{ color: '#ffffff', fontSize: 28 }} />
                          )}
                        </Box>
                      </Box>
                    </Tooltip>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Grid>
        </Grid>

        {uploading && (
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <CircularProgress sx={{ color: themeStyles.secondary }} />
            <Typography sx={{ mt: 1, fontFamily: themeStyles.fontFamily }}>
              Updating product...
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button
          onClick={handleCloseEditDialog}
          startIcon={<CancelIcon />}
          sx={{ color: themeStyles.textSecondary, fontFamily: themeStyles.fontFamily }}
        >
          Cancel
        </Button>
        <GoldenButton
          onClick={updateProduct}
          startIcon={<SaveIcon />}
          disabled={uploading}
        >
          {uploading ? 'Saving...' : 'Save Changes'}
        </GoldenButton>
      </DialogActions>
    </Dialog>
  );

  // ==================== MAIN RENDER ====================
  return (
    <Container maxWidth="xl" sx={{ py: 4, fontFamily: themeStyles.fontFamily, display: 'flex', flexDirection: 'column', alignItems: 'center', alignContent: 'center', ml: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h3" sx={{
          fontFamily: themeStyles.fontFamily,
          fontWeight: 'bold',
          background: `linear-gradient(135deg, ${themeStyles.primary} 0%, ${themeStyles.secondary} 100%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: 1
        }}>
          Product Manager
        </Typography>
        <Typography variant="subtitle1" sx={{
          color: themeStyles.textSecondary,
          fontFamily: themeStyles.fontFamily
        }}>
          Manage your clothing inventory
        </Typography>
      </Box>

      {/* Search & Actions */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: '12px', border: `1px solid ${themeStyles.secondary}` }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <GoldenTextField
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            sx={{ width: 300 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: themeStyles.secondary }} />
                </InputAdornment>
              )
            }}
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              startIcon={<RefreshIcon />}
              onClick={fetchProducts}
              sx={{ color: themeStyles.primary }}
            >
              Refresh
            </Button>
            <GoldenButton href='/Admin-Panel/Creating-New-Product' startIcon={<AddIcon />}>
              Add Product
            </GoldenButton>
          </Box>
        </Box>
      </Paper>

      {/* Products Table */}
      <Paper sx={{ borderRadius: '12px', overflow: 'hidden', border: `1px solid ${themeStyles.border}` }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress sx={{ color: themeStyles.secondary }} />
          </Box>
        ) : (
          <>
            <TableContainer>
              <Table>
                <TableHead sx={{ bgcolor: themeStyles.tableHeader }}>
                  <TableRow>
                    <TableCell padding="checkbox">
                      <Checkbox
                        indeterminate={selected.length > 0 && selected.length < products.length}
                        checked={products.length > 0 && selected.length === products.length}
                        onChange={handleSelectAllClick}
                        sx={{ color: themeStyles.secondary }}
                      />
                    </TableCell>
                    <GoldenTableCell>Product</GoldenTableCell>
                    <GoldenTableCell>Category</GoldenTableCell>
                    <GoldenTableCell align="right">Price</GoldenTableCell>
                    <GoldenTableCell>Stock</GoldenTableCell>
                    <GoldenTableCell>Sizes</GoldenTableCell>
                    <GoldenTableCell>Colors</GoldenTableCell>
                    <GoldenTableCell align="center">Actions</GoldenTableCell>
                  </TableRow>
                </TableHead>
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
                        <GoldenTableRow key={product._id} selected={isSelected}>
                          <TableCell padding="checkbox">
                            <Checkbox
                              checked={isSelected}
                              onChange={(event) => handleSelectClick(event, product._id)}
                              sx={{ color: themeStyles.secondary }}
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              {product.mainImage?.url ? (
                                <ImagePreview src={product.mainImage.url} />
                              ) : (
                                <Box sx={{
                                  width: 60,
                                  height: 60,
                                  bgcolor: '#f5f5f5',
                                  borderRadius: '8px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}>
                                  <ImageIcon sx={{ color: themeStyles.textSecondary }} />
                                </Box>
                              )}
                              <Box>
                                <Typography sx={{ fontWeight: 'bold', color: themeStyles.primary }}>
                                  {product.name}
                                </Typography>
                                <Typography variant="caption" sx={{ color: themeStyles.textSecondary }}>
                                  {product.description?.substring(0, 40)}...
                                </Typography>
                              </Box>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip label={product.category} size="small" sx={{ bgcolor: 'rgba(212,175,55,0.1)' }} />
                          </TableCell>
                          <TableCell align="right">
                            <Typography sx={{ fontWeight: 'bold', color: themeStyles.secondary }}>
                              {product.price} TND
                            </Typography>
                          </TableCell>
                          <TableCell>{product.stock}</TableCell>
                          <TableCell>{renderSizeChips(product.sizes)}</TableCell>
                          <TableCell>{renderColorChips(product.colors)}</TableCell>
                          <TableCell align="center">
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                              <IconButton onClick={() => handlePreviewClick(product)} size="small">
                                <ViewIcon />
                              </IconButton>
                              <IconButton onClick={() => handleEditClick(product)} size="small">
                                <EditIcon />
                              </IconButton>
                              {/* UPDATED DELETE BUTTON - JUST ADDED onClick */}
                              <IconButton 
                                onClick={() => handleDeleteClick(product)} 
                                size="small" 
                                color="error"
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Box>
                          </TableCell>
                        </GoldenTableRow>
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
            />
          </>
        )}
      </Paper>

      {/* Dialogs */}
      {renderPreviewDialog()}
      {renderEditForm()}
      {/* ADDED DELETE DIALOG */}
      {renderDeleteDialog()}

      {/* FAB */}
    </Container>
  );
};

export default ManageProducts;