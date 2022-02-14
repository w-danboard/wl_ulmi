let { readFileSync } = require('fs')
let { join } = require('path')
let writeTmpFile = require('../../writeTmpFile')
let Mustache = require('mustache') // handlebar ejs jade
let routes = require('../../getRoutes')
console.log(JSON.stringify(routes))
/**
 * 写入临时文件
 */
const plugin = (pluginAPI) => {
  // 监听一个事件，生成文件了
  pluginAPI.onGenerateFiles(async () => {
    const routesTpl = readFileSync(join(__dirname, 'routes.tpl'), 'utf8')
    let content = Mustache.render(routesTpl, {
      routes: JSON.stringify(routes, replacer, 2).replace(/\"component\": (\"(.+?)\")/g, (global, m1, m2) => {
        return `"component": ${m2.replace(/\^/g, '"')}`
      })
    })
    writeTmpFile({
      path: 'core/routes.js',
      content
    })
  })
}

// 替换器
function replacer (key, value) {
  switch (key) {
    case "component":
      return `require('${value}').default`
    default:
      return value
  }
}

module.exports = plugin