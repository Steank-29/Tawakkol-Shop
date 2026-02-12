// utils/emailService.js
const nodemailer = require('nodemailer');

// Configure email transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER || 'samijlassi2909@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'iawhmvlgvcytzgdi'
  }
});

const sendOrderConfirmationEmail = async (order, customerEmail) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'Tawakkol Shop <Store-Tawakkol@tawakkol.com>',
      to: customerEmail,
      subject: `Order Confirmation - #${order.orderNumber}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #d4af37; color: white; padding: 20px; text-align: center; }
            .content { background: #f9f9f9; padding: 20px; }
            .footer { background: #f1f1f1; padding: 10px; text-align: center; font-size: 12px; color: #666; }
            .order-details { background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #d4af37; }
            .item { border-bottom: 1px solid #eee; padding: 10px 0; }
            .total { font-size: 18px; font-weight: bold; color: #d4af37; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Thank You For Your Order!</h1>
              <p>Order #${order.orderNumber}</p>
            </div>
            
            <div class="content">
              <p>Hello ${order.customer.fullName},</p>
              <p>Your order has been confirmed and is being processed.</p>
              
              <div class="order-details">
                <h3>Order Summary</h3>
                ${order.items.map(item => `
                  <div class="item">
                    <strong>${item.quantity}x ${item.name}</strong><br>
                    ${item.selectedSize ? `Size: ${item.selectedSize} • ` : ''}
                    ${item.selectedColor ? `Color: ${item.selectedColor} • ` : ''}
                    ${(item.price * item.quantity).toFixed(2)} TND
                  </div>
                `).join('')}
                
                <hr>
                <p>Subtotal: ${order.subtotal.toFixed(2)} TND</p>
                <p>Shipping: ${order.shippingCost.toFixed(2)} TND</p>
                <p>Tax: ${order.tax.toFixed(2)} TND</p>
                <p class="total">Total: ${order.total.toFixed(2)} TND</p>
              </div>
              
              <h3>Delivery Information</h3>
              <p>
                ${order.customer.address}<br>
                ${order.customer.city}, ${order.customer.postalCode || ''}<br>
                ${order.customer.country}<br>
                Phone: ${order.customer.phone}
              </p>
              
              <p><strong>Payment Method:</strong> Cash on Delivery</p>
              
              <p>You will receive another email when your order ships.</p>
              
              <p>If you have any questions, contact us at <a href="mailto:contact@tawakkolshop.com">contact@tawakkolshop.com</a> or call 71 234 567.</p>
            </div>
            
            <div class="footer">
              <p>Tawakkol Shop &copy; ${new Date().getFullYear()}</p>
              <p>Premium Clothing Store</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Order confirmation email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

module.exports = {
  sendOrderConfirmationEmail
};