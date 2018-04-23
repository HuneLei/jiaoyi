// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path');
console.log(process.env.NODE_ENV);

var env = require('./prod.env');

var index = path.resolve(__dirname, '../public/' + process.env.NODE_ENV + '/index.html');
var assetsRoot = path.resolve(__dirname, '../public/' + process.env.NODE_ENV);

module.exports = {
  build: {
    env: env,
    index: index,
    assetsRoot: assetsRoot,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    productionSourceMap: false,
    productionGzip: true,
    productionGzipExtensions: ['js', 'css'],
    bundleAnalyzerReport: process.env.npm_config_report,
  },
  dev: {
    env: require('./dev.env'),
    port: 5000,
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/api/upload': {
        target: 'http://upload.test.api_test.wei3dian.com',
        changeOrigin: true,
        pathRewrite: {
          '^/api/upload': '/aliyun/upload',
        },
      },
      '/api/authorization': {
        target: 'http://upload.test.api_test.wei3dian.com',
        changeOrigin: true,
        pathRewrite: {
          '^/api/authorization': '/aliyun/authorization',
        },
      },
      '/api/revoke': {
        target: 'http://login.test.wei3dian.com',
        changeOrigin: true,
        pathRewrite: {
          '^/api/revoke': '/revoke',
        },
      },
      '/api': {
        target: 'http://trade.develop.api.wei3dian.com',
        // target: 'http://trade.test.api_test.wei3dian.com',
        // target: 'http://10.0.10.170:8080/', // 杜青
        // target: 'http://172.27.3.151:8080/', // 杜青
        // target: 'http://172.28.2.221:8080/', // 彭建华
        // target: 'http://10.0.10.65:8080/', // 章全
        // target: 'http://192.168.4.76:8080/', // Mr.蔡
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/',
        },
      },
      // '/oauth/token': {
      //   target: 'http://login.develop.opengpo.com',
      //   changeOrigin: true,
      //   pathRewrite: {
      //     '^/oauth/token': '/oauth/token'
      //   },
      // },
    },
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader READMEz
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false,
  },
};
