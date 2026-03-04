const mongoose = require('mongoose');
const Admin = require('../server/models/admin')
require('dotenv').config();

const createSuperAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if super admin already exists
    const existingAdmin = await Admin.findOne({ email: 'superadmin@tawakkol.com' });
    
    if (existingAdmin) {
      console.log('ℹ️ Super admin already exists');
      console.log(`Email: ${existingAdmin.email}`);
      console.log(`Role: ${existingAdmin.role}`);
      mongoose.connection.close();
      return;
    }

    // Create super admin
    const superAdmin = await Admin.create({
      firstName: 'Iheb',
      lastName: 'Alili',
      email: 'ihebalili@tawakkol.tn',
      password: 'Super@lili03',
      phoneNumber: '+20129442957',
      contactEmail: 'ihebalili@tawakkol.tn',
      role: 'super-admin'
    });

    console.log('✅ Super admin created successfully:');
    console.log(`👤 Name: ${superAdmin.firstName} ${superAdmin.lastName}`);
    console.log(`📧 Email: ${superAdmin.email}`);
    console.log(`🔑 Password: superadmin123`);
    console.log(`👑 Role: ${superAdmin.role}`);
    console.log(`📞 Phone: ${superAdmin.phoneNumber}`);

    mongoose.connection.close();
  } catch (error) {
    console.error('❌ Error creating super admin:', error.message);
    process.exit(1);
  }
};

createSuperAdmin();