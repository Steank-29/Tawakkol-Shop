const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Le nom complet est requis'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'L\'email est requis'],
    trim: true,
    lowercase: true
  },
  phone: {
    type: String,
    required: [true, 'Le numéro de téléphone est requis'],
    trim: true
  },
  importance: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  issue: {
    type: String,
    required: [true, 'La description du problème est requise'],
    trim: true
  },
  fileName: {
    type: String,
    default: null
  },
  fileUrl: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'resolved'],
    default: 'pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Contact', contactSchema);