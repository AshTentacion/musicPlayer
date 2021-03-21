require("./check-versions")();
var config = require("../config");
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = JSON.parse(config.dev.env.NODE_ENV);
}

var opn = require("opn");
var path = require("path");
var express = require("express");
var webpack = require("webpack");
var webpackConfig = require("./webpack.dev.conf");
var proxyMiddleware = require("http-proxy-middleware");

var port = process.env.PORT || config.dev.port;

var autoOpenBrowser = !!config.dev.autoOpenBrowser;

var proxyTable = config.dev.proxyTable;

var app = express();
var data = require("../music-data.json");

var apiRoutes = express.Router();

apiRoutes.get("/music-data", (req, res) => {
  res.json({
    errno: 0,
    musicData: data.musicData,
  });
});

// var opn = require('opn')
// var path = require('path')
// var express = require('express')
// var webpack = require('webpack')
// var proxyMiddleware = require('http-proxy-middleware')
// var webpackConfig = require('./webpack.dev.conf')
// var http = require('http');

app.use("/api", apiRoutes);

var compiler = webpack(webpackConfig);

var devMiddleware = require("webpack-dev-middleware")(compiler, {
  publicPath: webpackConfig.output.publicPath,
  quiet: true,
});

var hotMiddleware = require("webpack-hot-middleware")(compiler, {
  log: () => {},
});

compiler.plugin("compilation", function (compilation) {
  compilation.plugin("html-webpack-plugin-after-emit", function (data, cb) {
    hotMiddleware.publish({ action: "reload" });
    cb();
  });
});

// proxy api requests
Object.keys(proxyTable).forEach(function (context) {
  var options = proxyTable[context];
  if (typeof options === "string") {
    options = { target: options };
  }
  app.use(proxyMiddleware(options.filter || context, options));
});

// handle fallback for HTML5 history API
app.use(require("connect-history-api-fallback")());

// serve webpack bundle output
app.use(devMiddleware);

// compilation error display
app.use(hotMiddleware);

var staticPath = path.posix.join(
  config.dev.assetsPublicPath,
  config.dev.assetsSubDirectory
);
app.use(staticPath, express.static("./static"));

var uri = "http://localhost:" + port;

devMiddleware.waitUntilValid(function () {
  console.log("> Listening at " + uri + "\n");
});

module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err);
    return;
  }

  // when env is testing, don't need open it
  if (autoOpenBrowser && process.env.NODE_ENV !== "testing") {
    opn(uri);
  }
});
