const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validator = require('validator');

const adminSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'Please enter your first name'],
    trim: true,
    maxlength: [50, 'First name cannot exceed 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Please enter your last name'],
    trim: true,
    maxlength: [50, 'Last name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please enter your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: [true, 'Please enter a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't return password in queries
  },
  picture: {
    public_id: {
      type: String,
      default: ''
    },
    url: {
      type: String,
      default: 'https://res.cloudinary.com/dkr41arie/image/upload/v1700000000/default_avatar.png'
    },
    storage: {
      type: String,
      enum: ['cloudinary', 'local'],
      default: 'cloudinary'
    }
  },
  phoneNumber: {
    type: String,
    required: [true, 'Please enter your phone number'],
    validate: {
      validator: function(v) {
        return /^\+?[1-9]\d{1,14}$/.test(v);
      },
      message: 'Please enter a valid phone number'
    }
  },
  contactEmail: {
    type: String,
    lowercase: true,
    validate: [validator.isEmail, 'Please enter a valid contact email']
  },
  role: {
    type: String,
    enum: ['admin', 'super-admin'],
    default: 'admin'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
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

// Hash password before saving
adminSchema.pre('save', async function(next) {
  // Only hash the password if it's modified (or new)
  if (!this.isModified('password')) {
    return next();
  }
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Update updatedAt timestamp before saving
adminSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Compare password method
adminSchema.methods.comparePassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Generate JWT token
adminSchema.methods.generateAuthToken = function() {
  return jwt.sign(
    { 
      id: this._id, 
      email: this.email, 
      role: this.role,
      firstName: this.firstName,
      lastName: this.lastName 
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '24h' }
  );
};

// Method to get full name
adminSchema.methods.getFullName = function() {
  return `${this.firstName} ${this.lastName}`;
};

// Method to update picture
adminSchema.methods.updatePicture = function(pictureData) {
  this.picture = {
    public_id: pictureData.public_id || '',
    url: pictureData.url || '',
    storage: pictureData.storage || 'cloudinary'
  };
  return this.save();
};

// Method to get public profile (without sensitive info)
adminSchema.methods.getPublicProfile = function() {
  const adminObject = this.toObject();
  
  // Remove sensitive information
  delete adminObject.password;
  delete adminObject.__v;
  
  return adminObject;
};

const Admin = mongoose.model('Admin', adminSchema);

module.exports = Admin;