const nodemailer = require('nodemailer');

/**
 * Send Email using Gmail SMTP
 * @param {Object} options - Email options
 * @param {string} options.email - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.message - Email message (plain text)
 * @param {string} options.html - Email message (HTML)
 */
const sendEmail = async (options) => {
  try {
    // In development, just log the email
    if (process.env.NODE_ENV === 'development' && !process.env.EMAIL_USER) {
      console.log('📧 Email would be sent:');
      console.log('To:', options.email);
      console.log('Subject:', options.subject);
      console.log('Message:', options.message);
      return { success: true, messageId: 'dev-mode' };
    }

    // Create transporter
    const transporter = nodemailer.createTransporter({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: process.env.EMAIL_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS // Use App Password for Gmail
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    // Email options
    const mailOptions = {
      from: `${process.env.EMAIL_FROM_NAME || 'FutureLabs'} <${process.env.EMAIL_USER}>`,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html || options.message
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    console.log('✅ Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };

  } catch (error) {
    console.error('❌ Email sending failed:', error.message);
    throw new Error(`Email could not be sent: ${error.message}`);
  }
};

/**
 * Send Order Confirmation Email
 */
const sendOrderConfirmation = async (order, user) => {
  const subject = `Order Confirmation - ${order._id}`;

  const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #3498db; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; background: #f9f9f9; }
                .order-details { background: white; padding: 15px; margin: 15px 0; border-radius: 5px; }
                .item { padding: 10px 0; border-bottom: 1px solid #eee; }
                .total { font-size: 18px; font-weight: bold; color: #3498db; padding: 15px 0; }
                .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🏥 FutureLabs</h1>
                    <p>Order Confirmation</p>
                </div>
                <div class="content">
                    <h2>Thank you for your order!</h2>
                    <p>Hi ${user.name || 'Customer'},</p>
                    <p>Your order has been confirmed and is being processed.</p>
                    
                    <div class="order-details">
                        <h3>Order Details</h3>
                        <p><strong>Order ID:</strong> ${order._id}</p>
                        <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
                        <p><strong>Status:</strong> ${order.orderStatus}</p>
                        
                        <h4>Items:</h4>
                        ${order.orderItems.map(item => `
                            <div class="item">
                                <strong>${item.name}</strong><br>
                                Quantity: ${item.quantity} × ₹${item.price} = ₹${item.quantity * item.price}
                            </div>
                        `).join('')}
                        
                        <div class="total">
                            Total Amount: ₹${order.totalPrice}
                        </div>
                    </div>
                    
                    <p>We'll send you another email when your order is ready for sample collection.</p>
                    <p>If you have any questions, please contact us at support@futurelabs.com</p>
                </div>
                <div class="footer">
                    <p>© 2025 FutureLabs Healthcare Platform. All rights reserved.</p>
                    <p>This is an automated email. Please do not reply.</p>
                </div>
            </div>
        </body>
        </html>
    `;

  const message = `
        Thank you for your order!
        
        Order ID: ${order._id}
        Date: ${new Date(order.createdAt).toLocaleDateString()}
        Status: ${order.orderStatus}
        
        Items:
        ${order.orderItems.map(item => `${item.name} - Qty: ${item.quantity} × ₹${item.price}`).join('\n')}
        
        Total Amount: ₹${order.totalPrice}
        
        We'll send you another email when your order is ready for sample collection.
        
        Best regards,
        FutureLabs Team
    `;

  return await sendEmail({
    email: user.email || user.phone + '@temp.com',
    subject,
    message,
    html
  });
};

/**
 * Send OTP Email
 */
const sendOTPEmail = async (email, otp, name) => {
  const subject = 'Your OTP for FutureLabs';

  const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #3498db; color: white; padding: 20px; text-align: center; }
                .content { padding: 30px; background: #f9f9f9; text-align: center; }
                .otp { font-size: 32px; font-weight: bold; color: #3498db; letter-spacing: 5px; padding: 20px; background: white; border-radius: 5px; margin: 20px 0; }
                .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🏥 FutureLabs</h1>
                </div>
                <div class="content">
                    <h2>Your OTP Code</h2>
                    <p>Hi ${name || 'there'},</p>
                    <p>Your One-Time Password (OTP) for verification is:</p>
                    <div class="otp">${otp}</div>
                    <p>This OTP is valid for 10 minutes.</p>
                    <p>If you didn't request this, please ignore this email.</p>
                </div>
                <div class="footer">
                    <p>© 2025 FutureLabs Healthcare Platform. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `;

  const message = `
        Your OTP for FutureLabs verification is: ${otp}
        
        This OTP is valid for 10 minutes.
        
        If you didn't request this, please ignore this email.
        
        Best regards,
        FutureLabs Team
    `;

  return await sendEmail({
    email,
    subject,
    message,
    html
  });
};

/**
 * Send Welcome Email
 */
const sendWelcomeEmail = async (user) => {
  const subject = 'Welcome to FutureLabs!';

  const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #3498db; color: white; padding: 20px; text-align: center; }
                .content { padding: 30px; background: #f9f9f9; }
                .button { display: inline-block; padding: 12px 30px; background: #3498db; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🏥 Welcome to FutureLabs!</h1>
                </div>
                <div class="content">
                    <h2>Hi ${user.name || 'there'}!</h2>
                    <p>Thank you for joining FutureLabs Healthcare Platform.</p>
                    <p>We're excited to have you on board!</p>
                    
                    <h3>What you can do:</h3>
                    <ul>
                        <li>Browse our extensive catalog of lab tests</li>
                        <li>Book health checkup packages</li>
                        <li>Schedule home sample collection</li>
                        <li>Track your orders in real-time</li>
                        <li>Access your test reports online</li>
                    </ul>
                    
                    <p style="text-align: center;">
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}" class="button">
                            Start Exploring
                        </a>
                    </p>
                    
                    <p>If you have any questions, feel free to contact our support team.</p>
                </div>
                <div class="footer">
                    <p>© 2025 FutureLabs Healthcare Platform. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `;

  const message = `
        Welcome to FutureLabs!
        
        Hi ${user.name || 'there'},
        
        Thank you for joining FutureLabs Healthcare Platform.
        
        What you can do:
        - Browse our extensive catalog of lab tests
        - Book health checkup packages
        - Schedule home sample collection
        - Track your orders in real-time
        - Access your test reports online
        
        Visit: ${process.env.FRONTEND_URL || 'http://localhost:3000'}
        
        Best regards,
        FutureLabs Team
    `;

  return await sendEmail({
    email: user.email,
    subject,
    message,
    html
  });
};

module.exports = {
  sendEmail,
  sendOrderConfirmation,
  sendOTPEmail,
  sendWelcomeEmail
};