const nodemailer = require('nodemailer');

// Create transporter with your configuration
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER || 'samijlassi2909@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'iawhmvlgvcytzgdi'
  }
});

// Simple HTML template for order confirmation
const getOrderEmailHTML = (order) => {
  const itemsList = order.items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.name} ${item.selectedSize ? `(Size: ${item.selectedSize})` : ''} ${item.selectedColor ? `(Color: ${item.selectedColor})` : ''}</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">${item.price} TND</td>
      <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">${item.price * item.quantity} TND</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #d4af37; color: white; padding: 20px; text-align: center; }
        .order-info { background: #f5f5f5; padding: 15px; margin: 20px 0; }
        table { width: 100%; border-collapse: collapse; }
        th { background: #f0f0f0; padding: 10px; text-align: left; }
        .total { font-size: 18px; font-weight: bold; color: #d4af37; margin-top: 20px; }
        .footer { margin-top: 30px; font-size: 12px; color: #666; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Order Confirmation</h2>
          <p>Order #${order.orderNumber}</p>
        </div>
        
        <p>Dear ${order.customer.fullName},</p>
        <p>Thank you for your order! We've received it and will process it soon.</p>
        
        <div class="order-info">
          <h3>Order Summary</h3>
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsList}
            </tbody>
          </table>
          
          <div class="total">
            <p>Subtotal: ${order.subtotal} TND</p>
            <p>Shipping: ${order.shippingCost} TND</p>
            <p>Total: ${order.total} TND</p>
          </div>
        </div>
        
        <h3>Delivery Address</h3>
        <p>
          ${order.customer.address}<br>
          ${order.customer.city}, ${order.customer.postalCode || ''}<br>
          ${order.customer.country}<br>
          Phone: ${order.customer.phone}
        </p>
        
        <p><strong>Payment Method:</strong> Cash on Delivery</p>
        
        <div class="footer">
          <p>Tawakkol Shop - Premium Clothing Store</p>
          <p>Contact: info@tawakkol.tn | Tel: +216 71 234 567</p>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Simple text version
const getOrderEmailText = (order) => {
  const itemsList = order.items.map(item => 
    `${item.quantity}x ${item.name} ${item.selectedSize ? `(Size: ${item.selectedSize})` : ''} ${item.selectedColor ? `(Color: ${item.selectedColor})` : ''} - ${item.price * item.quantity} TND`
  ).join('\n');

  return `
ORDER CONFIRMATION - #${order.orderNumber}

Dear ${order.customer.fullName},

Thank you for your order! We've received it and will process it soon.

ORDER SUMMARY:
${itemsList}

Subtotal: ${order.subtotal} TND
Shipping: ${order.shippingCost} TND
Total: ${order.total} TND

DELIVERY ADDRESS:
${order.customer.address}
${order.customer.city}, ${order.customer.postalCode || ''}
${order.customer.country}
Phone: ${order.customer.phone}

Payment Method: Cash on Delivery

Thank you for shopping with Tawakkol Shop!
  `;
};

// Send order confirmation to customer
const sendOrderConfirmationEmail = async (order, customerEmail) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'Tawakkol Shop <info@tawakkol.tn>',
      to: customerEmail,
      subject: `Order Confirmation #${order.orderNumber} - Tawakkol Shop`,
      html: getOrderEmailHTML(order),
      text: getOrderEmailText(order)
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Order confirmation email sent to ${customerEmail}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending order confirmation:', error.message);
    return { success: false, error: error.message };
  }
};

// Send admin notification
const sendAdminNotificationEmail = async (order) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'Tawakkol Shop <info@tawakkol.tn>',
      to: 'samijlassi2909@gmail.com', // Send to your email
      subject: `🆕 New Order #${order.orderNumber} - Tawakkol Shop`,
      html: `
        <h2>New Order Received!</h2>
        <p><strong>Order #:</strong> ${order.orderNumber}</p>
        <p><strong>Customer:</strong> ${order.customer.fullName}</p>
        <p><strong>Email:</strong> ${order.customer.email}</p>
        <p><strong>Phone:</strong> ${order.customer.phone}</p>
        <p><strong>Total:</strong> ${order.total} TND</p>
        <p><strong>Items:</strong> ${order.items.length}</p>
        <p><a href="${process.env.ADMIN_URL || 'http://localhost:3000'}/admin/orders/${order._id}">View Order</a></p>
      `,
      text: `
        New Order Received!
        Order #: ${order.orderNumber}
        Customer: ${order.customer.fullName}
        Email: ${order.customer.email}
        Phone: ${order.customer.phone}
        Total: ${order.total} TND
        Items: ${order.items.length}
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Admin notification sent for order #${order.orderNumber}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending admin notification:', error.message);
    return { success: false, error: error.message };
  }
};

// Send order status update
const sendOrderStatusUpdateEmail = async (order, oldStatus, newStatus) => {
  try {
    const statusMessages = {
      confirmed: 'Your order has been confirmed!',
      processing: 'Your order is now being processed.',
      shipped: 'Your order has been shipped!',
      delivered: 'Your order has been delivered. Enjoy!',
      cancelled: 'Your order has been cancelled.'
    };

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'Tawakkol Shop <info@tawakkol.tn>',
      to: order.customer.email,
      subject: `Order #${order.orderNumber} Status Update - Tawakkol Shop`,
      html: `
        <h2>Order Status Update</h2>
        <p>Dear ${order.customer.fullName},</p>
        <p>Your order #${order.orderNumber} has been updated:</p>
        <p><strong>Previous Status:</strong> ${oldStatus}</p>
        <p><strong>New Status:</strong> ${newStatus}</p>
        <p>${statusMessages[newStatus] || 'Thank you for your patience.'}</p>
        <p>Track your order: <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/orders/${order.orderNumber}">Click here</a></p>
      `,
      text: `
        Order Status Update
        
        Dear ${order.customer.fullName},
        
        Your order #${order.orderNumber} has been updated:
        Previous Status: ${oldStatus}
        New Status: ${newStatus}
        
        ${statusMessages[newStatus] || 'Thank you for your patience.'}
        
        Track your order: ${process.env.FRONTEND_URL || 'http://localhost:3000'}/orders/${order.orderNumber}
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✅ Status update email sent for order #${order.orderNumber}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error sending status update:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = {
  sendOrderConfirmationEmail,
  sendAdminNotificationEmail,
  sendOrderStatusUpdateEmail
};