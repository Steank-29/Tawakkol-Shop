// config/emailService.js
const nodemailer = require('nodemailer');
require('dotenv').config();

// Email configuration validation
const requiredEnvVars = ['EMAIL_USER', 'EMAIL_PASSWORD'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:', missingEnvVars.join(', '));
  console.error('Please check your .env file');
}

// Create transporter with retry logic and connection pooling
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    },
    pool: true, // Use pooled connections
    maxConnections: 5, // Maximum number of connections to create
    maxMessages: 100, // Maximum number of messages to send per connection
    rateDelta: 1000, // How many milliseconds between messages
    rateLimit: 5, // Maximum number of messages per second
    logger: process.env.NODE_ENV === 'development',
    debug: process.env.NODE_ENV === 'development'
  });
};

let transporter = createTransporter();

// Verify transporter connection with retry mechanism
const verifyTransporter = async (retries = 3) => {
  for (let i = 0; i < retries; i++) {
    try {
      await transporter.verify();
      console.log('✅ Email service connected successfully');
      return true;
    } catch (error) {
      console.log(`⚠️ Email connection attempt ${i + 1} failed:`, error.message);
      if (i === retries - 1) {
        console.error('❌ Failed to connect email service after', retries, 'attempts');
        return false;
      }
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, i)));
    }
  }
  return false;
};

// Initialize connection check
verifyTransporter();

// Recreate transporter on connection issues
const reconnectTransporter = () => {
  transporter.close();
  transporter = createTransporter();
  verifyTransporter();
};

// Email template utilities
const emailTemplates = {
  orderConfirmation: (order, customerEmail) => ({
    from: process.env.EMAIL_FROM || `"${process.env.APP_NAME}" <${process.env.EMAIL_USER}>`,
    to: customerEmail,
    subject: `✅ Order Confirmed #${order.orderNumber} - ${process.env.APP_NAME}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          @media only screen and (max-width: 600px) {
            .container { width: 100% !important; }
            .content { padding: 10px !important; }
          }
        </style>
      </head>
      <body style="font-family: 'Arial', sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 20px auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <div style="background: #d4af37; padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 28px;">${process.env.APP_NAME}</h1>
            <p style="color: #fff3e0; margin: 5px 0 0;">Premium Clothing Store</p>
          </div>
          
          <!-- Content -->
          <div style="padding: 30px;">
            <!-- Thank You Message -->
            <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 30px; text-align: center;">
              <h2 style="color: #333; margin: 0 0 10px;">Thank You ${order.customer.fullName}!</h2>
              <p style="color: #666; font-size: 16px; margin: 0;">Your order <strong style="color: #d4af37;">#${order.orderNumber}</strong> has been confirmed and is being processed.</p>
            </div>
            
            <!-- Order Summary -->
            <div style="margin-bottom: 30px;">
              <h3 style="color: #333; border-bottom: 2px solid #d4af37; padding-bottom: 10px; margin: 0 0 20px;">Order Summary</h3>
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr style="background: #f5f5f5;">
                    <th style="padding: 12px; text-align: left;">Item</th>
                    <th style="padding: 12px; text-align: center;">Qty</th>
                    <th style="padding: 12px; text-align: right;">Price</th>
                    <th style="padding: 12px; text-align: right;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${order.items.map(item => `
                    <tr style="border-bottom: 1px solid #eee;">
                      <td style="padding: 12px;">
                        ${item.name}
                        <div style="font-size: 12px; color: #666;">
                          ${item.selectedSize ? `Size: ${item.selectedSize}` : ''}
                          ${item.selectedColor ? (item.selectedSize ? ' | ' : '') + `Color: ${item.selectedColor}` : ''}
                        </div>
                      </td>
                      <td style="padding: 12px; text-align: center;">${item.quantity}</td>
                      <td style="padding: 12px; text-align: right;">${item.price.toFixed(3)} TND</td>
                      <td style="padding: 12px; text-align: right;">${(item.price * item.quantity).toFixed(3)} TND</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
              
              <!-- Totals -->
              <div style="margin-top: 20px; text-align: right;">
                <p style="margin: 5px 0;"><strong>Subtotal:</strong> ${order.subtotal.toFixed(3)} TND</p>
                <p style="margin: 5px 0;"><strong>Shipping:</strong> ${order.shippingCost.toFixed(3)} TND</p>
                ${order.tax ? `<p style="margin: 5px 0;"><strong>Tax:</strong> ${order.tax.toFixed(3)} TND</p>` : ''}
                <p style="margin: 10px 0 0; font-size: 20px;"><strong>Total:</strong> <span style="color: #d4af37;">${order.total.toFixed(3)} TND</span></p>
              </div>
            </div>
            
            <!-- Delivery Address -->
            <div style="margin-bottom: 30px;">
              <h3 style="color: #333; border-bottom: 2px solid #d4af37; padding-bottom: 10px; margin: 0 0 20px;">Delivery Address</h3>
              <div style="background: #f9f9f9; padding: 15px; border-radius: 8px;">
                <p style="margin: 5px 0;"><strong>${order.customer.fullName}</strong></p>
                <p style="margin: 5px 0; color: #666;">${order.customer.address}</p>
                <p style="margin: 5px 0; color: #666;">${order.customer.city}${order.customer.postalCode ? ', ' + order.customer.postalCode : ''}</p>
                <p style="margin: 5px 0; color: #666;">Phone: ${order.customer.phone}</p>
              </div>
            </div>
            
            <!-- Payment Info -->
            <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin-bottom: 30px;">
              <p style="margin: 0; color: #856404;"><strong>💳 Payment Method:</strong> Cash on Delivery</p>
              <p style="margin: 5px 0 0; color: #856404;">Please prepare the exact amount in cash for the delivery person.</p>
            </div>
            
            <!-- Footer -->
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 12px;">
              <p style="margin: 5px 0;">${process.env.APP_NAME} - Premium Clothing Store</p>
              <p style="margin: 5px 0;">📧 info@tawakkol.tn | 📞 +216 71 234 567</p>
              <p style="margin: 5px 0;">📍 Tunis, Tunisia</p>
              <p style="margin: 15px 0 0;">© ${new Date().getFullYear()} All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  }),

  adminNotification: (order) => ({
    from: process.env.EMAIL_FROM || `"${process.env.APP_NAME}" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_ADMIN,
    subject: `🆕 NEW ORDER #${order.orderNumber} - ${order.total.toFixed(3)} TND`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          @media only screen and (max-width: 600px) {
            .container { width: 100% !important; }
          }
        </style>
      </head>
      <body style="font-family: 'Arial', sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
        <div style="max-width: 600px; margin: 20px auto; background: white; border-radius: 10px; overflow: hidden;">
          
          <!-- Admin Header -->
          <div style="background: #d4af37; padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">🆕 New Order Alert</h1>
          </div>
          
          <div style="padding: 30px;">
            <!-- Quick Stats -->
            <div style="display: flex; justify-content: space-between; margin-bottom: 30px;">
              <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; flex: 1; text-align: center; margin-right: 10px;">
                <div style="font-size: 24px; font-weight: bold; color: #d4af37;">#${order.orderNumber}</div>
                <div style="font-size: 12px; color: #666;">Order Number</div>
              </div>
              <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; flex: 1; text-align: center;">
                <div style="font-size: 24px; font-weight: bold; color: #d4af37;">${order.total.toFixed(3)} TND</div>
                <div style="font-size: 12px; color: #666;">Total Amount</div>
              </div>
            </div>
            
            <!-- Customer Info -->
            <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #333; margin: 0 0 15px;">👤 Customer Information</h3>
              <table style="width: 100%;">
                <tr>
                  <td style="padding: 5px 0; color: #666;">Name:</td>
                  <td style="padding: 5px 0; font-weight: bold;">${order.customer.fullName}</td>
                </tr>
                <tr>
                  <td style="padding: 5px 0; color: #666;">Email:</td>
                  <td style="padding: 5px 0;"><a href="mailto:${order.customer.email}" style="color: #d4af37;">${order.customer.email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 5px 0; color: #666;">Phone:</td>
                  <td style="padding: 5px 0;"><a href="tel:${order.customer.phone}" style="color: #d4af37;">${order.customer.phone}</a></td>
                </tr>
                <tr>
                  <td style="padding: 5px 0; color: #666;">Address:</td>
                  <td style="padding: 5px 0;">${order.customer.address}, ${order.customer.city}</td>
                </tr>
              </table>
            </div>
            
            <!-- Order Items -->
            <div style="margin-bottom: 20px;">
              <h3 style="color: #333; margin: 0 0 15px;">📦 Order Items (${order.items.length})</h3>
              <table style="width: 100%; border-collapse: collapse;">
                ${order.items.map((item, index) => `
                  <tr style="${index !== order.items.length - 1 ? 'border-bottom: 1px solid #eee;' : ''}">
                    <td style="padding: 10px 0;">
                      <div style="font-weight: bold;">${item.name}</div>
                      <div style="font-size: 12px; color: #666;">
                        ${item.selectedSize ? `Size: ${item.selectedSize}` : ''}
                        ${item.selectedColor ? (item.selectedSize ? ' | ' : '') + `Color: ${item.selectedColor}` : ''}
                      </div>
                    </td>
                    <td style="padding: 10px 0; text-align: center;">x${item.quantity}</td>
                    <td style="padding: 10px 0; text-align: right;">${(item.price * item.quantity).toFixed(3)} TND</td>
                  </tr>
                `).join('')}
              </table>
            </div>
            
            <!-- Action Buttons -->
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.APP_URL}/admin/orders/${order._id}" 
                 style="background: #d4af37; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                View Order in Admin Panel →
              </a>
            </div>
            
            <!-- Admin Footer -->
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #999; font-size: 12px;">
              <p style="margin: 5px 0;">This is an automated notification from ${process.env.APP_NAME}</p>
              <p style="margin: 5px 0;">© ${new Date().getFullYear()} All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  })
};

// Send order confirmation to customer
const sendOrderConfirmationEmail = async (order, customerEmail) => {
  const startTime = Date.now();
  
  try {
    console.log(`📧 [${new Date().toISOString()}] Attempting to send confirmation to customer: ${customerEmail} for order #${order.orderNumber}`);
    
    if (!customerEmail) {
      throw new Error('Customer email is required');
    }

    const mailOptions = emailTemplates.orderConfirmation(order, customerEmail);
    const info = await transporter.sendMail(mailOptions);
    
    const duration = Date.now() - startTime;
    console.log(`✅ [${new Date().toISOString()}] Order confirmation sent to ${customerEmail} (Order #${order.orderNumber})`);
    console.log(`   Message ID: ${info.messageId} | Duration: ${duration}ms`);
    
    return { 
      success: true, 
      messageId: info.messageId,
      response: info.response,
      duration 
    };
    
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`❌ [${new Date().toISOString()}] Failed to send confirmation to ${customerEmail} for order #${order.orderNumber}`);
    console.error(`   Error: ${error.message} | Duration: ${duration}ms`);
    
    // Attempt to reconnect if it's a connection error
    if (error.code === 'ECONNECTION' || error.code === 'ETIMEDOUT') {
      console.log('🔄 Attempting to reconnect email transporter...');
      reconnectTransporter();
    }
    
    return { 
      success: false, 
      error: error.message,
      code: error.code,
      duration 
    };
  }
};

// Send notification to admin
const sendAdminNotificationEmail = async (order) => {
  const startTime = Date.now();
  
  try {
    console.log(`📧 [${new Date().toISOString()}] Attempting to send admin notification for order #${order.orderNumber}`);
    
    const mailOptions = emailTemplates.adminNotification(order);
    const info = await transporter.sendMail(mailOptions);
    
    const duration = Date.now() - startTime;
    console.log(`✅ [${new Date().toISOString()}] Admin notification sent for order #${order.orderNumber}`);
    console.log(`   Message ID: ${info.messageId} | Duration: ${duration}ms`);
    
    return { 
      success: true, 
      messageId: info.messageId,
      response: info.response,
      duration 
    };
    
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`❌ [${new Date().toISOString()}] Failed to send admin notification for order #${order.orderNumber}`);
    console.error(`   Error: ${error.message} | Duration: ${duration}ms`);
    
    // Attempt to reconnect if it's a connection error
    if (error.code === 'ECONNECTION' || error.code === 'ETIMEDOUT') {
      console.log('🔄 Attempting to reconnect email transporter...');
      reconnectTransporter();
    }
    
    return { 
      success: false, 
      error: error.message,
      code: error.code,
      duration 
    };
  }
};

// Send test email (useful for debugging)
const sendTestEmail = async (testEmail = process.env.EMAIL_ADMIN) => {
  try {
    console.log('🧪 Sending test email...');
    
    const testOrder = {
      orderNumber: 'TEST-001',
      customer: {
        fullName: 'Test Customer',
        email: testEmail,
        phone: '+21612345678',
        address: '123 Test Street',
        city: 'Tunis'
      },
      items: [
        { name: 'Test Product', quantity: 2, price: 50, selectedSize: 'M', selectedColor: 'Black' }
      ],
      subtotal: 100,
      shippingCost: 10,
      tax: 18,
      total: 128,
      _id: 'test123'
    };
    
    const result = await sendOrderConfirmationEmail(testOrder, testEmail);
    console.log('🧪 Test email result:', result);
    return result;
    
  } catch (error) {
    console.error('🧪 Test email failed:', error);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendOrderConfirmationEmail,
  sendAdminNotificationEmail,
  sendTestEmail,
  verifyTransporter
};