const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = {
  entry: {
    main: path.resolve(__dirname, '../src/main.js')
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../src')
    },
    extensions: ['.js', '.json']
  },
  output: {
    // 开发环境下 devServer.publicPath`与`output.publicPath`最好保持一致
    // publicPath: '/output/',
    path: path.resolve(__dirname, '../dist'),
    // 开发环境下不要使用chunkhash及contenthash HMR会有冲突
    filename: 'js/[name].[hash:6].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [path.resolve(__dirname, '../src')]
      },
      {
        test: /\.css$/,
        use: [
          // 默认支持HMR功能 无需额外设置
          // 'style-loader',
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              // mini-css-extract-plugin的loader需要开启hmr
              hmr: true,
              // 热更新失效时
              reloadAll: true
            }
          },
          {
            loader: 'css-loader'
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'file-loader',
        include: [path.resolve(__dirname, '../src/assets/images')],
        options: {
          limit: 10000,
          name: '/img/[name].[hash:4].[ext]'
        }
      },
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      // 生产环境下使用contenthash
      // 这里不能使用hash，否则mini-css-extract-plugin的hmr会失效 https://github.com/webpack-contrib/mini-css-extract-plugin/issues/391
      // filename: 'css/[name].[hash:6].css'
      filename: 'css/[name].css'
    }),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../public'),
        to: path.resolve(__dirname, '../dist')
      }
    ]),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../index.html')
    })
  ]
}
