const { merge } = require('webpack-merge')
const commonConfig = require('./webpack.common')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")

const prodConfig = {
  mode: 'production',
  plugins: [
    new CleanWebpackPlugin(),
    // new OptimizeCSSAssetsPlugin()
  ],
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        libs: {
          name: 'chunk-libs',
          test: /[\\/]node_modules[\\/]/,
          priority: 10,
          chunks: 'initial' // 只打包初始时依赖的第三方
        }
      }
    },
    runtimeChunk: 'multiple',
    minimizer: [
      new OptimizeCSSAssetsPlugin()
    ]
  }
}

module.exports = merge(commonConfig, prodConfig)
