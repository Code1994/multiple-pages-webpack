const { merge } = require('webpack-merge')
const commonConfig = require('./webpack.common')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const prodConfig = {
  mode: 'production',
  plugins: [
    new CleanWebpackPlugin()
  ]
}

module.exports = merge(commonConfig, prodConfig)
