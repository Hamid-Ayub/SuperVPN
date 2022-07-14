const path = require('path');
const express = require('express');
const compression = require('compression');
const proxyMiddleware = require('http-proxy-middleware');

module.exports = function addProdMiddlewares(app, options) {
  const publicPath = options.publicPath || '/';
  const outputPath = options.outputPath || path.resolve(process.cwd(), 'build');

  app.use(compression());
  app.use(publicPath, express.static(outputPath));

  const proxies = {
  }

  Object.keys(proxies).forEach(function(context) {
    app.use(proxyMiddleware.createProxyMiddleware(context, proxies[context]));
  });

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(outputPath, 'index.html')),
  );
};
