const path = require('path')
const fs = require('fs')
const chalk = require('chalk')
const { log } = console

// 获取所有入口信息，即src/views下的页面
const startPath = path.resolve(__dirname, '../src/views')
// 入口js文件
const entryJs = 'main.js'
// 入口html模板
const entryTem = ['index.art', 'index.html']
// 第一项为”node”，第二项为执行的js的完整路径，后面是附加在命令行后的参数 找最后一项即可
const index = process.argv.length - 1
const target = process.argv[index].slice(2)

const getEntries = (startPath) => {
  let isHtmlEntry = (fileName) => {
    return entryTem.includes(fileName)
  }
  // 页面入口下的所有文件夹
  let directories = fs.readdirSync(startPath)
  // 将命令行参数与views文件夹下的实际项目包作比较 如果存在就打这个命令行的包 否则打所有的包
  let resultList = []
  if (directories.includes(target)) {
    resultList = [target]
  } else {
    resultList = directories
    // 防止用户失误 给出警告和提示
    log(chalk.yellow(`请注意，当前命令行并未按需打包，该操作会默认打包所有项目。如果有疑问，请跟开发同事确认。理想的打包命令如下：
    yarn start/build --项目名`))
  }
  log(chalk.green(`当前打包项目为${resultList}`))
  // 存储入口js文件及模板html文件
  const entry = {}
  const htmlEntry = {}
  resultList.forEach(directory => {
    let directoryPath = path.join(startPath, directory)
    let stats = fs.statSync(directoryPath)
    if (stats.isDirectory()) {
      // 入口文件为main.js
      entry[directory] = path.join(directoryPath, entryJs)
      // 模板为index.html 或者 index.art
      const files = fs.readdirSync(directoryPath)
      files.forEach(file => {
          const filePath = path.join(directoryPath, file)
          const fileStat = fs.statSync(filePath)
          if (fileStat.isFile()) {
            if (isHtmlEntry(file)) {
              htmlEntry[directory] = filePath
            }
          }
      })
    }
  })
  return {
    entry,
    htmlEntry
  }
}

module.exports = getEntries(startPath)

// TODO:
// 1.热更新 2.less