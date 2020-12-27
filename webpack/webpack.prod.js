const { merge } = require('webpack-merge')
const commonConfig = require('./webpack.common')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const prodConfig = {
  mode: 'development',
  plugins: [
    new CleanWebpackPlugin()
  ]
}

module.exports = merge(commonConfig, prodConfig)
