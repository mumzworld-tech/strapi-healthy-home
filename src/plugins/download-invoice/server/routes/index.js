export default [
  {
    method: "GET",
    path: "/generate/:orderId",
    handler: "download.generate",
    config: {
      auth: false,
    },
  },
  {
    method: "GET",
    path: "/download/:id",
    handler: "download.download",
    config: {
      auth: false, // Allow public access for invoice downloads
    },
  },
  {
    method: "POST",
    path: "/send-email",
    handler: "download.sendEmail",
    config: {
      auth: false,
    },
  },
];