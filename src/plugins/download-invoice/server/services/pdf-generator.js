const { jsPDF } = require("jspdf");
const fs = require("fs-extra");
const path = require("path");

module.exports = ({ strapi }) => ({
  /**
   * Format date for display
   * @param {String} dateStr - Date string
   * @returns {String} Formatted date
   */
  formatDate(dateStr) {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  },

  /**
   * Generate PDF invoice for an order
   * @param {Object} orderData - Complete order data with relations
   * @param {String} orderId - Order ID
   * @returns {Promise<String>} Path to generated PDF
   */
  async generateInvoice(orderData, orderId) {
    const uploadsDir = path.join(strapi.dirs.static.public, 'uploads', 'invoices');
    await fs.ensureDir(uploadsDir);

    const pdfPath = path.join(uploadsDir, `invoice-${orderId}.pdf`);

    // Check if PDF already exists
    if (await fs.pathExists(pdfPath)) {
      strapi.log.info(`Invoice already exists for order ${orderId}`);
      return pdfPath;
    }

    // Create PDF using jsPDF
    const pdf = new jsPDF();

    // Extract and format data (matching the actual order collection structure)
    const customerName = orderData?.customer?.fullName || 'N/A';
    const customerEmail = orderData?.customer?.email || 'N/A';
    const customerPhone = `${orderData?.customer?.countryCode || ''} ${orderData?.customer?.phone || ''}`.trim() || 'N/A';
    const customerAddress = orderData?.location?.address || 'N/A';
    const customerCity = orderData?.location?.city || 'N/A';
    const customerArea = orderData?.location?.area || 'N/A';
    const customerCountry = orderData?.location?.country || 'N/A';

    // Package info from service relation
    const packageTitle = orderData?.package?.title || 'N/A';
    const packagePrice = parseFloat(orderData?.package?.price || 0);

    // Order financials
    const currency = orderData?.currencyCode || 'AED';
    const orderPrice = parseFloat(orderData?.price || 0);
    const orderTotal = parseFloat(orderData?.total || 0);

    // Order metadata
    const paymentStatus = orderData?.paymentStatus || 'N/A';
    const invoiceDate = new Date().toLocaleDateString();
    const orderDate = this.formatDate(orderData?.createdAt);

    // Add pink header background
    pdf.setFillColor(233, 30, 99);
    pdf.rect(0, 0, 210, 40, 'F');

    // Add logo text (MUMZWORLD)
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.setFont(undefined, 'bold');
    pdf.text('MUMZWORLD', 20, 25);

    // Invoice title
    pdf.setFontSize(28);
    pdf.text('INVOICE', 150, 25);

    // Reset text color
    pdf.setTextColor(0, 0, 0);

    // Order ID and Date
    pdf.setFontSize(10);
    pdf.setFont(undefined, 'normal');
    pdf.text(`Order ID: ${orderId}`, 20, 50);
    pdf.text(`Date: ${invoiceDate}`, 20, 56);

    // Section: Customer Information
    pdf.setFontSize(14);
    pdf.setFont(undefined, 'bold');
    pdf.setTextColor(233, 30, 99);
    pdf.text('Customer Information', 20, 70);

    // Draw line under section title
    pdf.setDrawColor(233, 30, 99);
    pdf.setLineWidth(0.5);
    pdf.line(20, 72, 190, 72);

    pdf.setFontSize(10);
    pdf.setFont(undefined, 'normal');
    pdf.setTextColor(0, 0, 0);

    pdf.text(`Customer: ${customerName}`, 20, 82);
    pdf.text(`Email: ${customerEmail}`, 20, 88);
    pdf.text(`Phone: ${customerPhone}`, 20, 94);
    pdf.text(`Location: ${customerAddress}, ${customerArea}, ${customerCity}`, 20, 100);
    pdf.text(`Country: ${customerCountry}`, 20, 106);

    // Section: Service Details
    pdf.setFontSize(14);
    pdf.setFont(undefined, 'bold');
    pdf.setTextColor(233, 30, 99);
    pdf.text('Service Details', 20, 115);

    pdf.setDrawColor(233, 30, 99);
    pdf.line(20, 117, 190, 117);

    pdf.setFontSize(10);
    pdf.setFont(undefined, 'normal');
    pdf.setTextColor(0, 0, 0);

    pdf.text(`Service: ${packageTitle}`, 20, 127);
    pdf.text(`Order Date: ${orderDate}`, 20, 133);
    pdf.text(`Payment Status: ${paymentStatus}`, 20, 139);

    // Summary box
    pdf.setFillColor(249, 249, 249);
    pdf.rect(20, 160, 170, 40, 'F');

    pdf.setFontSize(11);
    pdf.text(`Service Price:`, 30, 172);
    pdf.text(`${currency} ${orderPrice.toFixed(2)}`, 160, 172);

    // Total with pink background
    pdf.setFillColor(233, 30, 99);
    pdf.rect(20, 178, 170, 10, 'F');

    pdf.setFont(undefined, 'bold');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(14);
    pdf.text('Total Amount:', 30, 185);
    pdf.text(`${currency} ${orderTotal.toFixed(2)}`, 160, 185);

    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(11);
    pdf.setFont(undefined, 'normal');

    // Footer
    pdf.setFontSize(9);
    pdf.setTextColor(100, 100, 100);
    pdf.text('mumzworld.com - The Biggest Online Baby Shop in the Middle East', 105, 270, { align: 'center' });
    pdf.text('Thank you for your business!', 105, 276, { align: 'center' });

    // Save PDF
    const pdfBuffer = pdf.output('arraybuffer');
    await fs.writeFile(pdfPath, Buffer.from(pdfBuffer));

    strapi.log.info(`Invoice generated successfully for order ${orderId}`);

    return pdfPath;
  },

  /**
   * Check if invoice exists
   * @param {String} orderId - Order ID
   * @returns {Boolean} Whether invoice exists
   */
  async invoiceExists(orderId) {
    const uploadsDir = path.join(strapi.dirs.static.public, 'uploads', 'invoices');
    const pdfPath = path.join(uploadsDir, `invoice-${orderId}.pdf`);
    return await fs.pathExists(pdfPath);
  },

  /**
   * Get invoice path
   * @param {String} orderId - Order ID
   * @returns {String} Invoice file path
   */
  getInvoicePath(orderId) {
    const uploadsDir = path.join(strapi.dirs.static.public, 'uploads', 'invoices');
    return path.join(uploadsDir, `invoice-${orderId}.pdf`);
  },

  /**
   * Prepare order data for invoice
   * @param {Object} order - Order entity
   * @returns {Object} Prepared order data
   */
  prepareOrderData(order) {
    return {
      id: order.id,
      orderId: order.orderId,
      documentId: order.documentId,
      customer: order.customer,
      location: order.location,
      package: order.package,
      price: order.price,
      total: order.total,
      currencyCode: order.currencyCode,
      paymentStatus: order.paymentStatus,
      paymentId: order.paymentId,
      responseId: order.responseId,
      locales: order.locales,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  },
});