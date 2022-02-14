let { readFileSync } = require('fs')
let { join } = require('path')
let writeTmpFile = require('../../writeTmpFile')
let Mustache = require('mustache')
/**
 * 写入临时文件
 */
const plugin = (pluginAPI) => {
  // 生成文件了
  pluginAPI.onGenerateFiles(async () => {
    const historyTpl = readFileSync(join(__dirname, 'history.tpl'), 'utf8')
    let content = Mustache.render(historyTpl)
    writeTmpFile({
      path: 'core/history.js',
      content
    })
  })
}

module.exports = plugin