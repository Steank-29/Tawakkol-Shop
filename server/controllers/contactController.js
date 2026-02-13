const Contact = require('../models/contact');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
const submitContact = async (req, res) => {
  try {
    const { fullName, email, phone, importance, issue } = req.body;

    const contactData = {
      fullName,
      email,
      phone,
      importance,
      issue
    };

    // Handle file upload if exists
    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'tawakkol/contact',
          resource_type: 'auto'
        });

        contactData.fileName = req.file.originalname;
        contactData.fileUrl = result.secure_url;

        // Remove temporary file
        fs.unlinkSync(req.file.path);
      } catch (uploadError) {
        console.error('File upload error:', uploadError);
        // Continue without file
      }
    }

    const contact = await Contact.create(contactData);

    res.status(201).json({
      success: true,
      message: 'Message envoyé avec succès',
      data: {
        id: contact._id,
        fullName: contact.fullName,
        email: contact.email,
        importance: contact.importance,
        status: contact.status,
        submittedAt: contact.createdAt
      }
    });

  } catch (error) {
    console.error('Contact submission error:', error);

    // Clean up uploaded file if error occurs
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'envoi du message'
    });
  }
};

// @desc    Get all contact submissions (Admin only)
// @route   GET /api/contact
// @access  Private (Admin)
const getAllContacts = async (req, res) => {
  try {
    const contacts = await Contact.find()
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts
    });

  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des messages'
    });
  }
};

// @desc    Get single contact submission (Admin only)
// @route   GET /api/contact/:id
// @access  Private (Admin)
const getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Message non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      data: contact
    });

  } catch (error) {
    console.error('Get contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du message'
    });
  }
};

// @desc    Update contact status (Admin only)
// @route   PUT /api/contact/:id/status
// @access  Private (Admin)
const updateContactStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Message non trouvé'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Statut mis à jour avec succès',
      data: contact
    });

  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du statut'
    });
  }
};

// @desc    Delete contact submission (Admin only)
// @route   DELETE /api/contact/:id
// @access  Private (Super Admin only)
const deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Message non trouvé'
      });
    }

    // Delete file from cloudinary if exists
    if (contact.fileUrl) {
      try {
        const publicId = contact.fileUrl.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(`tawakkol/contact/${publicId}`);
      } catch (cloudinaryError) {
        console.error('Cloudinary deletion error:', cloudinaryError);
      }
    }

    await contact.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Message supprimé avec succès'
    });

  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression'
    });
  }
};

// @desc    Get contact statistics (Admin only)
// @route   GET /api/contact/stats/overview
// @access  Private (Admin)
const getContactStats = async (req, res) => {
  try {
    const total = await Contact.countDocuments();
    const pending = await Contact.countDocuments({ status: 'pending' });
    const resolved = await Contact.countDocuments({ status: 'resolved' });
    const urgent = await Contact.countDocuments({ importance: 'urgent', status: 'pending' });
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayCount = await Contact.countDocuments({
      createdAt: { $gte: today }
    });

    res.status(200).json({
      success: true,
      data: {
        total,
        pending,
        resolved,
        urgent,
        todayCount
      }
    });

  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des statistiques'
    });
  }
};

module.exports = {
  submitContact,
  getAllContacts,
  getContactById,
  updateContactStatus,
  deleteContact,
  getContactStats
};