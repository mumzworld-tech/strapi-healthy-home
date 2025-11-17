const nodemailer = require("nodemailer");

module.exports = ({ strapi }) => ({
  /**
   * Send email
   * @param {Object} options - Email options
   * @returns {Promise}
   */
  async sendEmail(options) {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.SMTP_FROM || "noreply@mumzworld.com",
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
      attachments: options.attachments || [],
    };

    return transporter.sendMail(mailOptions);
  },

  /**
   * Prepare email content
   * @param {Object} orderData - Order data
   * @returns {Object} Email content
   */
  prepareEmailContent(orderData) {
    const customerName = orderData.customer?.fullName || "Valued Customer";
    const orderId = orderData.orderId || "N/A";
    const documentId = orderData.documentId || orderId;
    const baseUrl = process.env.STRAPI_URL || "http://localhost:1337";
    const downloadUrl = `${baseUrl}/download-invoice/download/${documentId}`;

    const text = `
Dear ${customerName},

Thank you for booking your service with Mumzworld.

We're happy to let you know that your service order #${orderId} has been successfully confirmed.

Please find attached the invoice for your order, or download it here: ${downloadUrl}

Order Details:
- Order ID: ${orderId}
- Service Date: ${orderData.date || "N/A"}
- Total Amount: ${orderData.currencyCode || "AED"} ${orderData.total || "0.00"}
- Payment Status: ${orderData.paymentStatus || "Confirmed"}

We'll be in touch shortly to guide you through the next steps and make sure everything goes smoothly.

We're here to support you and can't wait to make this part of your journey a little easier.

Warmly,
The Mumzworld Team
    `.trim();

    const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #e50056; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background-color: #f9f9f9; }
    .details { background-color: white; padding: 15px; margin: 15px 0; border-left: 4px solid #e50056; }
    .download-btn {
      display: inline-block;
      background-color: #e50056;
      color: white;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 4px;
      margin: 15px 0;
      font-weight: bold;
    }
    .download-btn:hover { background-color: #c4004a; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Your Mumzworld Service Order is Confirmed 🎉</h1>
    </div>
    <div class="content">
      <p>Dear ${customerName},</p>
      <p>Thank you for booking your service with Mumzworld.</p>
      <p>We're happy to let you know that your service order <strong>#${orderId}</strong> has been successfully confirmed.</p>
      <p>Please find attached the invoice for your order.</p>

      <div style="text-align: center; margin: 20px 0;">
        <a href="${downloadUrl}" class="download-btn">Download Invoice</a>
      </div>

      <div class="details">
        <h3>Order Details</h3>
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p><strong>Service Date:</strong> ${orderData.date || "N/A"}</p>
        <p><strong>Total Amount:</strong> ${orderData.currencyCode || "AED"} ${orderData.total || "0.00"}</p>
        <p><strong>Payment Status:</strong> Confirmed</p>
      </div>

      <p>We'll be in touch shortly to guide you through the next steps and make sure everything goes smoothly.</p>
      <p>We're here to support you and can't wait to make this part of your journey a little easier.</p>
      <p>Warmly,<br>The Mumzworld Team</p>
    </div>
    <div class="footer">
      <p>This is an automated message. Please do not reply to this email.</p>
    </div>
  </div>
</body>
</html>
    `.trim();

    return { text, html };
  },

  /**
   * Send invoice email with attachment
   * @param {String} orderId - Order ID
   * @param {Object} orderData - Order data
   * @param {String} pdfPath - Path to PDF file
   */
  async sendInvoiceEmail(orderId, orderData, pdfPath) {
    const customerName = orderData.customer?.fullName || "Valued Customer";
    const baseUrl = process.env.STRAPI_URL || "http://localhost:1337";
    const downloadLink = `${baseUrl}/download-invoice/download/${orderData.documentId}`;

    const subject = `Your Mumzworld Service Order is Confirmed 🎉`;
    const text = `
Dear ${customerName},

Thank you for booking your service with Mumzworld.

We're happy to let you know that your service order #${orderId} has been successfully confirmed.

Please find attached the invoice for your order, or download it here: ${downloadLink}

We'll be in touch shortly to guide you through the next steps and make sure everything goes smoothly.

We're here to support you and can't wait to make this part of your journey a little easier.

Warmly,
The Mumzworld Team
    `.trim();

    const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background-color: #e50056; color: white; padding: 20px; text-align: center; }
    .content { padding: 20px; background-color: #f9f9f9; }
    .download-btn {
      display: inline-block;
      background-color: #e50056;
      color: white;
      padding: 12px 24px;
      text-decoration: none;
      border-radius: 4px;
      margin: 15px 0;
      font-weight: bold;
    }
    .download-btn:hover { background-color: #c4004a; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Your Mumzworld Service Order is Confirmed 🎉</h1>
    </div>
    <div class="content">
      <p>Dear ${customerName},</p>
      <p>Thank you for booking your service with Mumzworld.</p>
      <p>We're happy to let you know that your service order <strong>#${orderId}</strong> has been successfully confirmed.</p>
      <p>Please find attached the invoice for your order.</p>

      <div style="text-align: center; margin: 20px 0;">
        <a href="${downloadLink}" class="download-btn">Download Invoice</a>
      </div>

      <p>We'll be in touch shortly to guide you through the next steps and make sure everything goes smoothly.</p>
      <p>We're here to support you and can't wait to make this part of your journey a little easier.</p>
      <p>Warmly,<br>The Mumzworld Team</p>
    </div>
    <div class="footer">
      <p>This is an automated message. Please do not reply to this email.</p>
    </div>
  </div>
</body>
</html>
    `.trim();

    const attachments = [
      {
        filename: `invoice-${orderId}.pdf`,
        path: pdfPath,
        contentType: "application/pdf",
      },
    ];

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: parseInt(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.SMTP_FROM || "no-reply@mumzworld.com",
      to: orderData.customer.email,
      subject,
      text,
      html,
      attachments,
    };

    return transporter.sendMail(mailOptions);
  },
});
