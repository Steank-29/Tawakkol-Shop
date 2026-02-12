const Product = require('../models/product');
const { getFileInfo, cleanupFiles, deleteFilesFromStorage } = require('../middleware/productUpload');

// @desc    Create a new product
// @route   POST /api/products
// @access  Private/Admin
exports.createProduct = async (req, res) => {
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
        message: 'Please provide name, description, price, and category'
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

    const product = await Product.create(productData);

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
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
        message: 'Validation error',
        errors: messages
      });
    }
    
    // Handle JSON parsing errors
    if (error instanceof SyntaxError && error.message.includes('JSON')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid JSON in sizes or colors field'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error creating product',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
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

    const products = await Product.find(query)
      .populate('createdBy', 'firstName lastName email')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit))
      .select('-__v');

    const total = await Product.countDocuments(query);

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
      message: 'Error fetching products',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('createdBy', 'firstName lastName email')
      .populate('updatedBy', 'firstName lastName email');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    if (!product.isActive && req.admin?.role !== 'super-admin') {
      return res.status(403).json({
        success: false,
        message: 'This product is not available'
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
      message: 'Error fetching product',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const fileInfo = getFileInfo(req) || { mainImage: null, additionalImages: [] };
    const oldImages = [];

    // ── Prepare update data ──
    const updateData = {};

    // Whitelist fields
    const allowed = ['name', 'description', 'price', 'stock', 'sizes', 'colors', 'category' /* etc */];
    allowed.forEach(key => {
      if (req.body[key] !== undefined) updateData[key] = req.body[key];
    });

    // Parse JSON strings
    if (typeof updateData.sizes === 'string') updateData.sizes = JSON.parse(updateData.sizes);
    if (typeof updateData.colors === 'string') updateData.colors = JSON.parse(updateData.colors);

    // Numbers
    if (updateData.price) updateData.price = parseFloat(updateData.price);
    if (updateData.stock) updateData.stock = parseInt(updateData.stock, 10);

    // ── Images ──
    if (fileInfo.mainImage) {
      if (product.mainImage?.public_id) oldImages.push(product.mainImage);
      updateData.mainImage = fileInfo.mainImage;
    }

    // Decide on additional images strategy
    // Option A: replace
    if (fileInfo.additionalImages.length > 0) {
      // Collect old ones for cleanup if replacing
      oldImages.push(...product.additionalImages);
      updateData.additionalImages = fileInfo.additionalImages;
    }
    // Option B: append (your current behavior)
    // if (fileInfo.additionalImages.length > 0) { ... }

    updateData.updatedBy = req.admin.id;
    updateData.updatedAt = new Date();

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).populate('updatedBy', 'firstName lastName email');

    // Cleanup
    if (oldImages.length > 0) {
      await deleteFilesFromStorage(oldImages).catch(err => {
        console.error('Image cleanup failed (non-blocking):', err);
      });
    }

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      product: updatedProduct.getPublicView()
    });

  } catch (error) {
    const fileInfo = getFileInfo(req) || { mainImage: null, additionalImages: [] };
    cleanupFiles(fileInfo);

    console.error('Error updating product:', error);

    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(v => v.message)
      });
    }

    res.status(500).json({
      success: false,
      message: 'Error updating product',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Super-Admin
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Collect all images for deletion
    const imagesToDelete = [];
    if (product.mainImage.public_id) {
      imagesToDelete.push(product.mainImage);
    }
    
    product.additionalImages.forEach(img => {
      if (img.public_id) {
        imagesToDelete.push(img);
      }
    });

    // Delete product
    await product.deleteOne();

    // Delete images from storage
    await deleteFilesFromStorage(imagesToDelete);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Toggle product active status
// @route   PATCH /api/products/:id/status
// @access  Private/Admin
exports.toggleProductStatus = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    product.isActive = !product.isActive;
    product.updatedBy = req.admin.id;
    await product.save();

    res.status(200).json({
      success: true,
      message: `Product ${product.isActive ? 'activated' : 'deactivated'} successfully`,
      product: product.getPublicView()
    });

  } catch (error) {
    console.error('Error toggling product status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating product status',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update product stock
// @route   PATCH /api/products/:id/stock
// @access  Private/Admin
exports.updateStock = async (req, res) => {
  try {
    const { quantity } = req.body;

    if (typeof quantity !== 'number') {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be a number'
      });
    }

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    await product.updateStock(quantity);
    product.updatedBy = req.admin.id;
    await product.save();

    res.status(200).json({
      success: true,
      message: 'Stock updated successfully',
      product: product.getPublicView()
    });

  } catch (error) {
    console.error('Error updating stock:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating stock',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};