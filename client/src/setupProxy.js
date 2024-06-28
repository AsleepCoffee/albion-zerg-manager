const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api/players',
    createProxyMiddleware({
      target: 'https://murderledger.com',
      changeOrigin: true,
      pathRewrite: {
        '^/api/players': '/api/players', // Keep the /api/players prefix
      },
    })
  );
};
