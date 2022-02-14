let { readFileSync, existsSync } = require('fs')
let { join } = require('path')
let writeTmpFile = require('../../writeTmpFile')
let Mustache = require('mustache')
const { absSrcPath } = require('../../getPaths')
const { winPath } = require('../../utils')
/**
 * 写入临时文件
 */
const plugin = (pluginAPI) => {
  let plugins = []
  if (existsSync(join(absSrcPath, 'app.js'))) {
    plugins.push(join(absSrcPath, 'app.js'))
  }
  // 监听一个事件，生成文件了
  pluginAPI.onGenerateFiles(async () => {
    const pluginTpl = readFileSync(join(__dirname, 'plugin.tpl'), 'utf8')
    let content = Mustache.render(pluginTpl, {
      plugins: plugins.map((plugin, index) => {
        return {
          index,
          path: winPath(plugin)
        }
      })
    })
    writeTmpFile({
      path: 'core/plugin.js',
      content
    })
  })
}

module.exports = plugin