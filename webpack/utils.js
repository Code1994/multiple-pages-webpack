const path = require('path')
const fs = require('fs')
// 获取所有入口信息，即src/views下的页面
const startPath = path.resolve(__dirname, '../src/views')
// 入口js文件
const entryJs = 'main.js'
// 入口html模板
const entryTem = ['index.art', 'index.html']

const getEntries = (startPath) => {
  let isHtmlEntry = (fileName) => {
    return entryTem.includes(fileName)
  }
  // 页面入口下的所有文件夹
  let directories = fs.readdirSync(startPath)
  const entry = {}
  const htmlEntry = {}
  directories.forEach(directory => {
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
