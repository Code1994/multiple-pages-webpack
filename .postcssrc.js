module.exports = {
  "plugins": {
    "postcss-import": {},
    "postcss-url": {},
    // 浏览器兼容部分在package.json中
    "autoprefixer": {},
    // rem适配
    "postcss-pxtorem": {
      "rootValue": 37.5,
      "minPixelValue": 2,
      "propList": ['*']
    }
  }
}