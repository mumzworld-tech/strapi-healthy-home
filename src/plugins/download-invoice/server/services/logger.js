const fs = require("fs-extra");
const path = require("path");

module.exports = ({ strapi }) => ({
  /**
   * Log an event
   * @param {String} orderId - Order ID
   * @param {String} event - Event type
   * @param {Object} metadata - Additional metadata
   */
  async logEvent(orderId, event, metadata = {}) {
    try {
      const logDir = path.join(strapi.dirs.static.public, 'logs');
      await fs.ensureDir(logDir);

      const logEntry = {
        timestamp: new Date().toISOString(),
        orderId,
        event,
        ...metadata,
      };

      const logFile = path.join(logDir, 'invoice-events.log');
      const logLine = JSON.stringify(logEntry) + '\n';

      await fs.appendFile(logFile, logLine);

      strapi.log.info(`Invoice event logged: ${event} for order ${orderId}`);
    } catch (error) {
      strapi.log.error("Failed to log invoice event:", error);
    }
  },

  /**
   * Get logs for an order
   * @param {String} orderId - Order ID
   * @returns {Array} Log entries
   */
  async getOrderLogs(orderId) {
    try {
      const logDir = path.join(strapi.dirs.static.public, 'logs');
      const logFile = path.join(logDir, 'invoice-events.log');

      if (!await fs.pathExists(logFile)) {
        return [];
      }

      const logContent = await fs.readFile(logFile, 'utf-8');
      const lines = logContent.trim().split('\n');

      return lines
        .map(line => {
          try {
            return JSON.parse(line);
          } catch {
            return null;
          }
        })
        .filter(entry => entry && entry.orderId === orderId);
    } catch (error) {
      strapi.log.error("Failed to get order logs:", error);
      return [];
    }
  },
});