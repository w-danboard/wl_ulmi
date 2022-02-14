const { absPagesPath } = require('./getPaths')
const { join, basename, extname, relative, resolve } = require('path')
const { existsSync, readdirSync, statSync } = require('fs')
const { winPath } = require('./utils')

/**
 * 扫描pages文件系统，并生成路由文件
 * @param {} opts pages根目录
 * @param {} opts relDir 子目录
 */
function getRoutes (opts = {}) {
  const { root, relDir = '' } = opts
  const files = getFiles(join(root, relDir)) // 获取此目录下的所有文件列表
  const routes = files.reduce(fileToRouteReducer.bind(null, opts), [])
  return routes
}

function getFiles (root) {
  if (!existsSync(root)) return [] // 如果此目录不存在，则返回空数据
  return readdirSync(root).filter(file => {
    if (file.charAt(0) === '_' || file.charAt(0) === '.') return false // 凡是以下划线开头的文件，都不是路由文件，会被忽略
    return true
  })
}

/**
 * 把文件系统转换成路由文件 index.js => { "path": "/",  "exact": true, "component": require('@/pages/index.js').default }
 * @param {*} opts { root, relDir } 文件系统根目录，子目录
 * @param {*} routes 正在累加的数组
 * @param {*} file 一个个的文件
 * @returns 
 */
function fileToRouteReducer (opts, routes, file) {
  const { root, relDir = '' } = opts
  // 当前文件的绝对路径 = pages + '' + index.js
  // add.js的绝对路径 = pages/user/add.js
  const absFile = join(root, relDir, file)
  const stats = statSync(absFile) // 获取路径文件的信息
  if (stats.isDirectory()) {  // 如果是文件夹
    const relFile = join(relDir, file)
    let layoutFile = join(root, relFile, '_layout.js')
    const route = {
      path: normalizePath(relFile),
      routes: getRoutes({
        ...opts,
        relDir: relFile
      })
    }
    if (existsSync(layoutFile)) {
      route.component = toComponentPath(root, layoutFile)
    }
    routes.push(route)
  } else { // 文件
    // file=profile.js profile.js => profile
    let fileName = basename(file, extname(file))
    routes.push({
      path: normalizePath(join(relDir, fileName)),
      exact: true,
      component: toComponentPath(root, absFile)
    })
  }
  return routes
}

/**
 * 
 * @param {*} path 
 * @returns 
 */
function normalizePath (path) {
  path = winPath(path) // 路径分隔符 window\ mac linux / webpack统一成/
  path = `/${path}`
  path = path.replace(/\/index$/, '/') // 将index替换为/
  return path
}

/**
 * 
 * @param {*} root 文件系统根目录
 * @param {*} absFile 
 * @returns 
 */
function toComponentPath (root, absFile) {
  return `@/${winPath(relative(resolve(root, '..'), absFile))}`
}

let routes = getRoutes({ root: absPagesPath })

module.exports = routes