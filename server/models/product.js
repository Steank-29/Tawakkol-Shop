const mongoose = require('mongoose');
const validator = require('validator');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true,
    maxlength: [200, 'Product name cannot exceed 200 characters'],
    minlength: [3, 'Product name must be at least 3 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters']
  },
  price: {
    type: Number,
    required: [true, 'Product price is required'],
    min: [0, 'Price cannot be negative']
  },
  category: {
    type: String,
    required: [true, 'Product category is required'],
    enum: ['Sport', 'Casual', 'Religious', 'Streetwear'],
    default: 'Sport'
  },
  sizes: [{
    type: String,
    enum: ['XS', 'S', 'M', 'L', 'XL', '2XL']
  }],
  colors: [{
    name: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true,
      validate: {
        validator: function(v) {
          return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(v);
        },
        message: 'Invalid color hex code'
      }
    }
  }],
  mainImage: {
    public_id: {
      type: String,
      default: ''
    },
    url: {
      type: String,
      default: ''
    },
    storage: {
      type: String,
      enum: ['cloudinary', 'local'],
      default: 'cloudinary'
    }
  },
  additionalImages: [{
    public_id: String,
    url: String,
    storage: {
      type: String,
      enum: ['cloudinary', 'local'],
      default: 'cloudinary'
    }
  }],
  stock: {
    type: Number,
    default: 0,
    min: [0, 'Stock cannot be negative']
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update timestamps before saving
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Add indexing for better query performance
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });

// Method to get product details for public view
productSchema.methods.getPublicView = function() {
  const product = this.toObject();
  
  // Remove internal fields
  delete product.__v;
  delete product.createdBy;
  delete product.updatedBy;
  delete product.isActive;
  
  return product;
};

// Method to check if product is in stock
productSchema.methods.isInStock = function() {
  return this.stock > 0;
};

// Method to update stock
productSchema.methods.updateStock = async function(quantity) {
  if (this.stock + quantity < 0) {
    throw new Error('Insufficient stock');
  }
  
  this.stock += quantity;
  return await this.save();
};

const Product = mongoose.model('Product', productSchema);

module.exports = Product;