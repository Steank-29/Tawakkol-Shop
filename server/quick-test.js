// test-email.js
// Simple test script for email service
// Run with: node test-email.js

// Load environment variables
require('dotenv').config();

const nodemailer = require('nodemailer');

// Use your actual credentials
const TEST_CONFIG = {
  email: 'samijlassi2909@gmail.com',
  password: 'tpzblgrlcjfbyger',
  testRecipient: 'samijlassi2909@gmail.com' // Send to yourself for testing
};

async function testEmailService() {
  console.log('='.repeat(50));
  console.log('📧 TESTING EMAIL SERVICE');
  console.log('='.repeat(50));
  console.log(`Using email: ${TEST_CONFIG.email}`);
  console.log('='.repeat(50));

  // 1. Create test data
  const testOrder = {
    orderNumber: 'TEST-' + Date.now().toString().slice(-6),
    customer: {
      fullName: 'Test Customer',
      email: TEST_CONFIG.testRecipient,
      phone: '+216 99 999 999',
      address: '123 Test Street',
      city: 'Tunis',
      postalCode: '1000',
      country: 'Tunisia',
      notes: 'This is a test order'
    },
    items: [
      {
        name: 'Premium T-Shirt',
        price: 45.99,
        quantity: 2,
        selectedSize: 'L',
        selectedColor: 'Black'
      },
      {
        name: 'Slim Fit Jeans',
        price: 89.99,
        quantity: 1,
        selectedSize: '32',
        selectedColor: 'Blue'
      }
    ],
    subtotal: 181.97,
    shippingCost: 8.00,
    tax: 27.30,
    total: 217.27,
    status: 'pending'
  };

  // 2. Create transporter with your credentials
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: TEST_CONFIG.email,
      pass: TEST_CONFIG.password
    }
  });

  // 3. Verify connection
  try {
    console.log('\n🔍 Verifying email connection...');
    await transporter.verify();
    console.log('✅ Connection successful! Your Gmail credentials are working!');
  } catch (error) {
    console.log('❌ Connection failed:', error.message);
    console.log('\n💡 TROUBLESHOOTING TIPS:');
    console.log('1. Make sure you\'re using the correct App Password');
    console.log('2. Check if 2-factor authentication is enabled');
    console.log('3. Verify the app password is 16 characters');
    return;
  }

  // 4. Test customer email
  console.log('\n📧 Testing CUSTOMER confirmation email...');
  
  const customerMailOptions = {
    from: '"Tawakkol Store" <info@tawakkol.tn>',
    to: TEST_CONFIG.testRecipient,
    subject: `✅ TEST: Order Confirmed #${testOrder.orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 10px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #d4af37; margin: 0;">Tawakkol Store</h1>
          <p style="color: #666; font-size: 14px;">Premium Clothing Store</p>
          <p style="color: #ff4444; font-size: 12px; margin-top: 5px;">🔴 THIS IS A TEST EMAIL</p>
        </div>
        
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #333; margin-top: 0;">Hello ${testOrder.customer.fullName}!</h2>
          <p style="color: #666; font-size: 16px;">Your test order <strong>#${testOrder.orderNumber}</strong> has been confirmed.</p>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h3 style="color: #333; border-bottom: 2px solid #d4af37; padding-bottom: 10px;">Order Summary</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="background: #f5f5f5;">
              <th style="padding: 10px; text-align: left;">Item</th>
              <th style="padding: 10px; text-align: center;">Qty</th>
              <th style="padding: 10px; text-align: right;">Price</th>
            </tr>
            ${testOrder.items.map(item => `
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px;">${item.name} (${item.selectedSize}, ${item.selectedColor})</td>
                <td style="padding: 10px; text-align: center;">${item.quantity}</td>
                <td style="padding: 10px; text-align: right;">${item.price} TND</td>
              </tr>
            `).join('')}
          </table>
          
          <div style="margin-top: 20px; text-align: right;">
            <p><strong>Total:</strong> <span style="color: #d4af37; font-size: 18px;">${testOrder.total} TND</span></p>
          </div>
        </div>
        
        <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <p style="margin: 0; color: #856404;"><strong>This is a TEST email</strong> - Please ignore if you received this by mistake.</p>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 12px;">
          <p>Tawakkol Store - Premium Clothing Store<br>Contact: info@tawakkol.tn</p>
        </div>
      </div>
    `
  };

  try {
    const customerInfo = await transporter.sendMail(customerMailOptions);
    console.log('✅ Customer email sent!');
    console.log(`   Message ID: ${customerInfo.messageId}`);
  } catch (error) {
    console.log('❌ Customer email failed:', error.message);
  }

  // 5. Test admin email
  console.log('\n📧 Testing ADMIN notification email...');
  
  const adminMailOptions = {
    from: '"Tawakkol Store" <info@tawakkol.tn>',
    to: 'samijlassi2909@gmail.com',
    subject: `🔔 TEST: New Order #${testOrder.orderNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 10px;">
        <div style="background: #d4af37; color: white; padding: 20px; text-align: center; border-radius: 8px; margin-bottom: 20px;">
          <h1 style="margin: 0;">🆕 TEST: New Order</h1>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h2 style="color: #333;">Order #${testOrder.orderNumber}</h2>
          <p><strong>Date:</strong> ${new Date().toLocaleString('fr-TN')}</p>
          <p><strong>Status:</strong> TEST MODE</p>
        </div>
        
        <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #333; margin-top: 0;">Customer Information</h3>
          <p><strong>Name:</strong> ${testOrder.customer.fullName}</p>
          <p><strong>Email:</strong> ${testOrder.customer.email}</p>
          <p><strong>Phone:</strong> ${testOrder.customer.phone}</p>
          <p><strong>Address:</strong> ${testOrder.customer.address}, ${testOrder.customer.city}</p>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h3 style="color: #333;">Order Items</h3>
          <table style="width: 100%; border-collapse: collapse;">
            <tr style="background: #f5f5f5;">
              <th style="padding: 10px; text-align: left;">Product</th>
              <th style="padding: 10px; text-align: center;">Qty</th>
              <th style="padding: 10px; text-align: right;">Price</th>
            </tr>
            ${testOrder.items.map(item => `
              <tr style="border-bottom: 1px solid #eee;">
                <td style="padding: 10px;">${item.name} (${item.selectedSize}, ${item.selectedColor})</td>
                <td style="padding: 10px; text-align: center;">${item.quantity}</td>
                <td style="padding: 10px; text-align: right;">${item.price} TND</td>
              </tr>
            `).join('')}
          </table>
        </div>
        
        <div style="background: #f0f0f0; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #333; margin-top: 0;">Payment Summary</h3>
          <table style="width: 100%;">
            <tr>
              <td><strong>Subtotal:</strong></td>
              <td style="text-align: right;">${testOrder.subtotal} TND</td>
            </tr>
            <tr>
              <td><strong>Shipping:</strong></td>
              <td style="text-align: right;">${testOrder.shippingCost} TND</td>
            </tr>
            <tr>
              <td><strong>Tax:</strong></td>
              <td style="text-align: right;">${testOrder.tax} TND</td>
            </tr>
            <tr style="font-size: 18px; color: #d4af37;">
              <td><strong>TOTAL:</strong></td>
              <td style="text-align: right;"><strong>${testOrder.total} TND</strong></td>
            </tr>
          </table>
        </div>
        
        <div style="background: #ff4444; color: white; padding: 10px; text-align: center; border-radius: 8px;">
          <p style="margin: 0;">🔴 THIS IS A TEST NOTIFICATION - No action required</p>
        </div>
      </div>
    `
  };

  try {
    const adminInfo = await transporter.sendMail(adminMailOptions);
    console.log('✅ Admin email sent!');
    console.log(`   Message ID: ${adminInfo.messageId}`);
  } catch (error) {
    console.log('❌ Admin email failed:', error.message);
  }

  // 6. Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(50));
  console.log(`Order #: ${testOrder.orderNumber}`);
  console.log(`Customer: ${testOrder.customer.fullName}`);
  console.log(`Recipient: ${TEST_CONFIG.testRecipient}`);
  console.log(`Total: ${testOrder.total} TND`);
  console.log('='.repeat(50));
  console.log('\n✅ Test completed! Check your inbox at: samijlassi2909@gmail.com');
}

// Run the test
console.log('Starting email service test...\n');
testEmailService().catch(console.error);