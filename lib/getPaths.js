let mkdirp = require('mkdirp')
let { join } = require('path')
let { existsSync, statSync } = require('fs')

/**
 * 判断某个路径的文件是否存在，并且是一个目录
 * @param {*} path 文件夹路径
 * @returns 
 */
function isDirectoryAndExist (path) {
  return existsSync(path) && statSync(path).isDirectory()
}

let cwd = process.cwd()
let absSrcPath = cwd

/**
 * 如果src目录存在，那么当前目录下的src目录才是src的根目录
 */
if (isDirectoryAndExist(join(absSrcPath, 'src'))) {
  absSrcPath = join(absSrcPath, 'src')
}

const absPagesPath = join(absSrcPath, 'pages')
const absTmpPath = join(absSrcPath, '._umi')


module.exports = {
  absSrcPath,   // src目录路径
  absPagesPath, // 路由文件系统路径
  absTmpPath    // 临时文件夹路径
}