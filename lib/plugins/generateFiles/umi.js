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
    const umiTpl = readFileSync(join(__dirname, 'umi.tpl'), 'utf8')
    let content = Mustache.render(umiTpl)
    writeTmpFile({
      path: 'umi.js',
      content
    })
  })
}

module.exports = plugin