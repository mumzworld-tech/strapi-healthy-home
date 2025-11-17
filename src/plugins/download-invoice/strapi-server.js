import routes from "./server/routes/index.js";
import download from "./server/controllers/download.js";
import pdfGenerator from "./server/services/pdf-generator.js";
import emailService from "./server/services/email-service.js";
import logger from "./server/services/logger.js";

export default {
  register({ strapi }) {},

  bootstrap({ strapi }) {
    strapi.log.info(`🚀 Plugin download-invoice is loaded`);
  },

  routes,

  controllers: {
    download,
  },

  services: {
    pdfGenerator,
    emailService,
    logger,
  },
};