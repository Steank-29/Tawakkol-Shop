// backend/controllers/relProductController.js
const RelProduct = require('../models/relProduct');
const { getFileInfo, cleanupFiles, deleteFilesFromStorage } = require('../middleware/productUpload');

// @desc    Create a new product
// @route   POST /api/relproducts
// @access  Private/Admin
exports.createRelProduct = async (req, res) => {
  try {
    const { 
      name, 
      description, 
      price, 
      category, 
      sizes, 
      colors, 
      stock 
    } = req.body;

    // Validate required fields
    if (!name || !description || !price || !category) {
      return res.status(400).json({
        success: false,
        message: 'Veuillez fournir un nom, une description, un prix et une catégorie'
      });
    }

    // Parse sizes and colors if they are strings
    const parsedSizes = typeof sizes === 'string' ? JSON.parse(sizes) : sizes || [];
    const parsedColors = typeof colors === 'string' ? JSON.parse(colors) : colors || [];

    // Validate colors structure
    const validColors = parsedColors.map(color => {
      if (typeof color === 'string') {
        // Handle hex colors
        return { name: color, value: color };
      }
      return color;
    }).filter(color => color.name && color.value);

    // Get uploaded file info
    const fileInfo = getFileInfo(req);

    // Create product
    const productData = {
      name,
      description,
      price: parseFloat(price),
      category,
      sizes: parsedSizes,
      colors: validColors,
      stock: stock ? parseInt(stock) : 0,
      createdBy: req.admin.id,
      updatedBy: req.admin.id
    };

    // Add main image if uploaded
    if (fileInfo.mainImage) {
      productData.mainImage = {
        public_id: fileInfo.mainImage.public_id,
        url: fileInfo.mainImage.url,
        storage: fileInfo.mainImage.storage
      };
    }

    // Add additional images if uploaded
    if (fileInfo.additionalImages.length > 0) {
      productData.additionalImages = fileInfo.additionalImages.map(img => ({
        public_id: img.public_id,
        url: img.url,
        storage: img.storage
      }));
    }

    const product = await RelProduct.create(productData);

    res.status(201).json({
      success: true,
      message: 'Produit créé avec succès',
      product: product.getPublicView(),
      imagesInfo: {
        mainImage: fileInfo.mainImage ? {
          uploaded: true,
          storage: fileInfo.mainImage.storage
        } : null,
        additionalImages: fileInfo.additionalImages.length,
        storage: fileInfo.mainImage ? fileInfo.mainImage.storage : 'none'
      }
    });

  } catch (error) {
    // Cleanup uploaded files if error occurs
    const fileInfo = getFileInfo(req);
    cleanupFiles(fileInfo);
    
    console.error('Error creating product:', error);
    
    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: 'Erreur de validation',
        errors: messages
      });
    }
    
    // Handle JSON parsing errors
    if (error instanceof SyntaxError && error.message.includes('JSON')) {
      return res.status(400).json({
        success: false,
        message: 'JSON invalide dans les champs tailles ou couleurs'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la création du produit',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get all products
// @route   GET /api/relproducts
// @access  Public
exports.getRelProducts = async (req, res) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      size,
      color,
      search,
      page = 1,
      limit = 10,
      sort = '-createdAt'
    } = req.query;

    // Build query
    let query = { isActive: true };

    // Category filter
    if (category) {
      query.category = category;
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    // Size filter
    if (size) {
      query.sizes = size;
    }

    // Color filter
    if (color) {
      query['colors.value'] = color;
    }

    // Search filter
    if (search) {
      query.$text = { $search: search };
    }

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const products = await RelProduct.find(query)
      .populate('createdBy', 'firstName lastName email')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');

    const total = await RelProduct.countDocuments(query);

    res.status(200).json({
      success: true,
      count: products.length,
      total,
      totalPages: Math.ceil(total / parseInt(limit)),
      currentPage: parseInt(page),
      products: products.map(product => product.getPublicView())
    });

  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des produits',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get single product
// @route   GET /api/relproducts/:id
// @access  Public
exports.getRelProduct = async (req, res) => {
  try {
    const product = await RelProduct.findById(req.params.id)
      .populate('createdBy', 'firstName lastName email')
      .populate('updatedBy', 'firstName lastName email');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé'
      });
    }

    if (!product.isActive && req.admin?.role !== 'super-admin') {
      return res.status(403).json({
        success: false,
        message: 'Ce produit n\'est pas disponible'
      });
    }

    res.status(200).json({
      success: true,
      product: product.getPublicView()
    });

  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du produit',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update product
// @route   PUT /api/relproducts/:id
// @access  Private/Admin
exports.updateRelProduct = async (req, res) => {
  try {
    const product = await RelProduct.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Produit non trouvé' 
      });
    }

    const fileInfo = getFileInfo(req) || { mainImage: null, additionalImages: [] };
    const oldImages = [];

    // Prepare update data
    const updateData = {};

    // Whitelist fields
    const allowed = ['name', 'description', 'price', 'stock', 'sizes', 'colors', 'category'];
    allowed.forEach(key => {
      if (req.body[key] !== undefined) updateData[key] = req.body[key];
    });

    // Parse JSON strings
    if (typeof updateData.sizes === 'string') updateData.sizes = JSON.parse(updateData.sizes);
    if (typeof updateData.colors === 'string') updateData.colors = JSON.parse(updateData.colors);

    // Numbers
    if (updateData.price) updateData.price = parseFloat(updateData.price);
    if (updateData.stock) updateData.stock = parseInt(updateData.stock, 10);

    // Images
    if (fileInfo.mainImage) {
      if (product.mainImage?.public_id) oldImages.push(product.mainImage);
      updateData.mainImage = fileInfo.mainImage;
    }

    // Additional images (append)
    if (fileInfo.additionalImages.length > 0) {
      // Collect existing images for product
      const existingImages = product.additionalImages || [];
      updateData.additionalImages = [
        ...existingImages,
        ...fileInfo.additionalImages
      ];
    }

    updateData.updatedBy = req.admin.id;
    updateData.updatedAt = new Date();

    const updatedProduct = await RelProduct.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('updatedBy', 'firstName lastName email');

    // Cleanup old images if replaced
    if (oldImages.length > 0) {
      await deleteFilesFromStorage(oldImages).catch(err => {
        console.error('Image cleanup failed (non-blocking):', err);
      });
    }

    res.status(200).json({
      success: true,
      message: 'Produit mis à jour avec succès',
      product: updatedProduct.getPublicView()
    });

  } catch (error) {
    const fileInfo = getFileInfo(req) || { mainImage: null, additionalImages: [] };
    cleanupFiles(fileInfo);

    console.error('Error updating product:', error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Erreur de validation',
        errors: Object.values(error.errors).map(v => v.message)
      });
    }

    if (error instanceof SyntaxError && error.message.includes('JSON')) {
      return res.status(400).json({
        success: false,
        message: 'JSON invalide dans les champs tailles ou couleurs'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du produit',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/relproducts/:id
// @access  Private/Super-Admin
exports.deleteRelProduct = async (req, res) => {
  try {
    const product = await RelProduct.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé'
      });
    }

    // Collect all images for deletion
    const imagesToDelete = [];
    if (product.mainImage?.public_id) {
      imagesToDelete.push(product.mainImage);
    }
    
    if (product.additionalImages && product.additionalImages.length > 0) {
      product.additionalImages.forEach(img => {
        if (img.public_id) {
          imagesToDelete.push(img);
        }
      });
    }

    // Delete product
    await product.deleteOne();

    // Delete images from storage
    if (imagesToDelete.length > 0) {
      await deleteFilesFromStorage(imagesToDelete);
    }

    res.status(200).json({
      success: true,
      message: 'Produit supprimé avec succès'
    });

  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du produit',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Toggle product active status
// @route   PATCH /api/relproducts/:id/status
// @access  Private/Admin
exports.toggleRelProductStatus = async (req, res) => {
  try {
    const product = await RelProduct.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé'
      });
    }

    product.isActive = !product.isActive;
    product.updatedBy = req.admin.id;
    await product.save();

    res.status(200).json({
      success: true,
      message: `Produit ${product.isActive ? 'activé' : 'désactivé'} avec succès`,
      product: product.getPublicView()
    });

  } catch (error) {
    console.error('Error toggling product status:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du statut',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update product stock
// @route   PATCH /api/relproducts/:id/stock
// @access  Private/Admin
exports.updateRelProductStock = async (req, res) => {
  try {
    const { quantity } = req.body;

    if (typeof quantity !== 'number') {
      return res.status(400).json({
        success: false,
        message: 'La quantité doit être un nombre'
      });
    }

    const product = await RelProduct.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Produit non trouvé'
      });
    }

    await product.updateStock(quantity);
    product.updatedBy = req.admin.id;
    await product.save();

    res.status(200).json({
      success: true,
      message: 'Stock mis à jour avec succès',
      product: product.getPublicView()
    });

  } catch (error) {
    console.error('Error updating stock:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Erreur lors de la mise à jour du stock',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};