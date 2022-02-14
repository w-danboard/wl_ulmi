/**
 * 统一路径分隔符/
 * @param {string} path 文件或者文件夹路径
 * @returns 统一后的路径
 */
function winPath (path) {
  return path.replace(/\\/g, '/')
}

/**
 * 获取当前机器IP
 * 参考地址：https://blog.csdn.net/weixin_30236595/article/details/98395908
 */
function getIPAdress () {
  let interfaces = require('os').networkInterfaces()
  for (let devName in interfaces) {
    let iface = interfaces[devName]
    for (let i = 0; i < iface.length; i++) {
      let alias = iface[i]
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        return alias.address
      }
    }
  }
}

/**
 * 通过浏览器打开链接
 * @param {string} url  链接
 * @param {string} type 浏览器
 * 参考地址：https://www.jb51.net/article/113860.htm
 */
function openUrl (url, type = 'chrome') {
  const open = require('open')
  open(url, type)
}

module.exports = {
  winPath,
  getIPAdress,
  openUrl
}