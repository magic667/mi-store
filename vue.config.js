
module.exports = {
  publicPath: './',
  devServer: {
    open: true,
    proxy: {
      '/api': {
        target: 'http://106.15.179.105:3000/',
        // 允许跨域
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      }
    }
  }
}