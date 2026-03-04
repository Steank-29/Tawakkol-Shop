// backend/models/RelProduct.js
const mongoose = require('mongoose');
const validator = require('validator');

const relProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom du produit est requis'],
    trim: true,
    maxlength: [200, 'Le nom du produit ne peut pas dépasser 200 caractères'],
    minlength: [3, 'Le nom du produit doit contenir au moins 3 caractères']
  },
  description: {
    type: String,
    required: [true, 'La description du produit est requise'],
    trim: true,
    minlength: [10, 'La description doit contenir au moins 10 caractères']
  },
  price: {
    type: Number,
    required: [true, 'Le prix du produit est requis'],
    min: [0, 'Le prix ne peut pas être négatif']
  },
  category: {
    type: String,
    required: [true, 'La catégorie du produit est requise'],
    enum: ['Sport', 'Casual', 'Religious', 'Streetwear'],
    default: 'Religious'
  },
  sizes: [{
    type: String,
    enum: ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL']
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
        message: 'Code couleur hexadécimal invalide'
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
    min: [0, 'Le stock ne peut pas être négatif']
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
relProductSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Add indexing for better query performance
relProductSchema.index({ name: 'text', description: 'text' });
relProductSchema.index({ category: 1 });
relProductSchema.index({ price: 1 });
relProductSchema.index({ createdAt: -1 });

// Method to get product details for public view
relProductSchema.methods.getPublicView = function() {
  const product = this.toObject();
  
  // Remove internal fields
  delete product.__v;
  delete product.createdBy;
  delete product.updatedBy;
  delete product.isActive;
  
  return product;
};

// Method to check if product is in stock
relProductSchema.methods.isInStock = function() {
  return this.stock > 0;
};

// Method to update stock
relProductSchema.methods.updateStock = async function(quantity) {
  if (this.stock + quantity < 0) {
    throw new Error('Stock insuffisant');
  }
  
  this.stock += quantity;
  return await this.save();
};

const relProduct = mongoose.model('RelProduct', relProductSchema);

module.exports = relProduct;