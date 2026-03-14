// config/emailService.js
const nodemailer = require('nodemailer');

// Create transporter with your configuration
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER || 'samijlassi2909@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'tpzblgrlcjfbyger'
  }
});

// Send order confirmation to customer
const sendOrderConfirmationEmail = async (order, customerEmail) => {
  try {
    console.log(`📧 Attempting to send confirmation to customer: ${customerEmail} for order #${order.orderNumber}`);
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'Tawakkol Shop <info@tawakkol.tn>',
      to: customerEmail,
      subject: `✅ Order Confirmed #${order.orderNumber} - Tawakkol Shop`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 10px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #d4af37; margin: 0;">Tawakkol Shop</h1>
            <p style="color: #666; font-size: 14px;">Premium Clothing Store</p>
          </div>
          
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #333; margin-top: 0;">Thank You ${order.customer.fullName}!</h2>
            <p style="color: #666; font-size: 16px;">Your order <strong>#${order.orderNumber}</strong> has been confirmed and is being processed.</p>
          </div>
          
          <div style="margin-bottom: 20px;">
            <h3 style="color: #333; border-bottom: 2px solid #d4af37; padding-bottom: 10px;">Order Summary</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="background: #f5f5f5;">
                <th style="padding: 10px; text-align: left;">Item</th>
                <th style="padding: 10px; text-align: center;">Qty</th>
                <th style="padding: 10px; text-align: right;">Price</th>
                <th style="padding: 10px; text-align: right;">Total</th>
              </tr>
              ${order.items.map(item => `
                <tr style="border-bottom: 1px solid #eee;">
                  <td style="padding: 10px;">${item.name} ${item.selectedSize ? `(${item.selectedSize})` : ''} ${item.selectedColor ? `- ${item.selectedColor}` : ''}</td>
                  <td style="padding: 10px; text-align: center;">${item.quantity}</td>
                  <td style="padding: 10px; text-align: right;">${item.price} TND</td>
                  <td style="padding: 10px; text-align: right;">${(item.price * item.quantity)} TND</td>
                </tr>
              `).join('')}
            </table>
            
            <div style="margin-top: 20px; text-align: right;">
              <p><strong>Subtotal:</strong> ${order.subtotal} TND</p>
              <p><strong>Shipping:</strong> ${order.shippingCost} TND</p>
              <p><strong>Total:</strong> <span style="color: #d4af37; font-size: 18px;">${order.total} TND</span></p>
            </div>
          </div>
          
          <div style="margin-bottom: 20px;">
            <h3 style="color: #333;">Delivery Address</h3>
            <p style="color: #666; margin: 5px 0;">${order.customer.fullName}</p>
            <p style="color: #666; margin: 5px 0;">${order.customer.address}</p>
            <p style="color: #666; margin: 5px 0;">${order.customer.city}, ${order.customer.postalCode || ''}</p>
            <p style="color: #666; margin: 5px 0;">Phone: ${order.customer.phone}</p>
          </div>
          
          <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <p style="margin: 0; color: #856404;"><strong>Payment Method:</strong> Cash on Delivery</p>
            <p style="margin: 5px 0 0; color: #856404;">Please prepare the exact amount in cash for the delivery person.</p>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 12px;">
            <p>Tawakkol Shop - Premium Clothing Store<br>Contact: info@tawakkol.tn | Tel: +216 71 234 567</p>
            <p>© ${new Date().getFullYear()} All rights reserved.</p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ SUCCESS: Order confirmation sent to ${customerEmail} (Order #${order.orderNumber}) - Message ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
    
  } catch (error) {
    console.error(`❌ ERROR: Failed to send confirmation to ${customerEmail} for order #${order.orderNumber}`);
    console.error(`   Error details: ${error.message}`);
    return { success: false, error: error.message };
  }
};

// Send notification to admin
const sendAdminNotificationEmail = async (order) => {
  try {
    console.log(`📧 Attempting to send admin notification for order #${order.orderNumber}`);
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'Tawakkol Shop <info@tawakkol.tn>',
      to: 'samijlassi2909@gmail.com',
      subject: `🆕 NEW ORDER #${order.orderNumber} - ${order.total} TND`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 10px;">
          <div style="background: #d4af37; color: white; padding: 20px; text-align: center; border-radius: 8px; margin-bottom: 20px;">
            <h1 style="margin: 0;">🆕 New Order Received!</h1>
          </div>
          
          <div style="margin-bottom: 20px;">
            <h2 style="color: #333;">Order #${order.orderNumber}</h2>
            <p><strong>Date:</strong> ${new Date().toLocaleString('fr-TN')}</p>
            <p><strong>Status:</strong> Pending</p>
          </div>
          
          <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #333; margin-top: 0;">Customer Information</h3>
            <p><strong>Name:</strong> ${order.customer.fullName}</p>
            <p><strong>Email:</strong> ${order.customer.email}</p>
            <p><strong>Phone:</strong> ${order.customer.phone}</p>
            <p><strong>Address:</strong> ${order.customer.address}, ${order.customer.city} ${order.customer.postalCode || ''}</p>
            <p><strong>Country:</strong> ${order.customer.country}</p>
            ${order.customer.notes ? `<p><strong>Notes:</strong> ${order.customer.notes}</p>` : ''}
          </div>
          
          <div style="margin-bottom: 20px;">
            <h3 style="color: #333;">Order Items (${order.items.length})</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="background: #f5f5f5;">
                <th style="padding: 10px; text-align: left;">Product</th>
                <th style="padding: 10px; text-align: center;">Qty</th>
                <th style="padding: 10px; text-align: right;">Price</th>
                <th style="padding: 10px; text-align: right;">Total</th>
              </tr>
              ${order.items.map(item => `
                <tr style="border-bottom: 1px solid #eee;">
                  <td style="padding: 10px;">
                    ${item.name}
                    <div style="font-size: 12px; color: #666;">
                      ${item.selectedSize ? `Size: ${item.selectedSize}` : ''}
                      ${item.selectedColor ? `${item.selectedSize ? ' | ' : ''}Color: ${item.selectedColor}` : ''}
                    </div>
                  </td>
                  <td style="padding: 10px; text-align: center;">${item.quantity}</td>
                  <td style="padding: 10px; text-align: right;">${item.price} TND</td>
                  <td style="padding: 10px; text-align: right;">${(item.price * item.quantity)} TND</td>
                </tr>
              `).join('')}
            </table>
          </div>
          
          <div style="background: #f0f0f0; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #333; margin-top: 0;">Payment Summary</h3>
            <table style="width: 100%;">
              <tr>
                <td><strong>Subtotal:</strong></td>
                <td style="text-align: right;">${order.subtotal} TND</td>
              </tr>
              <tr>
                <td><strong>Shipping:</strong></td>
                <td style="text-align: right;">${order.shippingCost} TND</td>
              </tr>
              <tr>
                <td><strong>Tax:</strong></td>
                <td style="text-align: right;">${order.tax} TND</td>
              </tr>
              <tr style="font-size: 18px; color: #d4af37;">
                <td><strong>TOTAL:</strong></td>
                <td style="text-align: right;"><strong>${order.total} TND</strong></td>
              </tr>
            </table>
          </div>
          
          <div style="background: #e8f5e8; padding: 15px; border-radius: 8px;">
            <p style="margin: 0; color: #2e7d32;"><strong>Payment Method:</strong> Cash on Delivery</p>
            <p style="margin: 5px 0 0; color: #2e7d32;">Process this order in the admin panel.</p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ SUCCESS: Admin notification sent for order #${order.orderNumber} - Message ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
    
  } catch (error) {
    console.error(`❌ ERROR: Failed to send admin notification for order #${order.orderNumber}`);
    console.error(`   Error details: ${error.message}`);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendOrderConfirmationEmail,
  sendAdminNotificationEmail
};