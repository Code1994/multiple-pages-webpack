const path = require('path')
// const webpack = require('webpack')
const { merge } = require('webpack-merge')
const commonConfig = require('./webpack.common')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const ip = require('ip')
const portfinder = require('portfinder')

const devConfig = merge(commonConfig, {
  mode: 'development',
  devtool: 'cheap-module-eval-source-map',
  devServer: {
    // 配置开发环境访问前缀 默认空字符串 没有设置值时，取output.publicPath 两者作用不同 不存在优先级问题 推荐根据环境 配置不同的output.publicPath
    publicPath: '/prefix/',
    // 设置index.html的寻找路径 默认为当前工作目录 即path.resolve(__dirname, '../')
    contentBase: path.resolve(__dirname, '../'),
    watchContentBase: true, //保证contentBase下的index.html修改时页面热更新 依赖于live reload。关闭live reload的话 失效。

    host: '0.0.0.0', //默认 localhost
    port: '9527', //默认 8080
    open: false, //自动打开浏览器
    useLocalIp: true, //自动打开浏览器时是否使用本地ip 设置成true时，配合host设置成'0.0.0.0'使用

    hot: true, //开发环境下的output当中不要使用chunkhash或者contenthash
    liveReload: false, //测试的时候发现 需要将此属性设置为false（虽然官网并无此属性配置） 否则HMR不会生效，一直采用live reload的方式。
    hotOnly: true, //只采用hot模式刷新 即使设置了hot，但改变main.js的时候，还是live reload，所以设置此属性。
    inline: true, // inline模式或者iframe模式 默认为true 即inline模式
    
    headers: {
      "x-response-header": "dev-server-demo"
    }, //设置代理服务器的自定义响应头
    // proxy: {
    //   // 单个代理路径
    //   '/blog': {
    //     target: 'http://www.jsgoshu.cn',
    //     pathRewrite: { '^/blog': '/project' }
    //   }
    // },
    proxy: [
      // 多个代理路径
      {
        context: ['/blog', '/project'],
        target: 'http://www.jsgoshu.cn'
      }
    ],

    quiet: true, //净化终端信息 清除掉无用冗余的打包信息（坑比属性 连报错也会隐藏 害的我好久才排查到chunkhash在HMR下报错 最好搭配friendly-errors-webpack-plugin使用）
    overlay: true, //将errors满屏显示在浏览器中
    watchOptions: {} //watch默认在webpack-dev-server是开启的 这个选项可以来针对场景配置一些具体的watch属性 https://www.webpackjs.com/configuration/watch/
  },
  plugins: [
    // hot为true时 会自动启用 无需再添加
    // new webpack.HotModuleReplacementPlugin()
  ]
})

// 支持返回一个promise resolve的是devConfig
module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = devConfig.devServer.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // 找到可使用的port后 对devServer重新设置
      devConfig.devServer.port = port
      const httpType = devConfig.devServer.https ? 'https' : 'http'
      devConfig.plugins.push(
        new FriendlyErrorsPlugin({
          compilationSuccessInfo: {
            messages: [
              `Your application is running here: ${ httpType }://${ devConfig.devServer.host }:${ port } ${ httpType }://127.0.0.1:${ port } ${ httpType }://${ ip.address() }:${ port }`
            ]
          }
        })
      )
      resolve(devConfig)
    }
  })
})

// devServer.publicPath只会改变开发环境下的访问地址前缀
// 当设置为‘/prefix/’时 浏览器地址会变为127.0.0.1:8080/prefix/，会自动找/prefix/下的index.html 找不到时，index.html的寻找路径以contentBase为主 另外注意webpack-dev-server本身依赖的是一个虚拟的dist目录

// output.publicPath会改变静态资源的引用前缀 (使用html-webpack-plugin时，在dist/index.html中一看便知)

/*
1.ip 本地ip portfinder 自动寻找未被占用的端口
2.hmr css-hmr  部分loader内置了对HMR的支持 无需配置 譬如vue loader与react hot loader。
3.proxy  可以是对象或数组
4.devtool development/cheap-module-eval-source-map production/source-map

*/ 
