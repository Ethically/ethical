const { join, basename } = require('path')

const isFile = (path) => ( basename(path).includes('.') )

const resolveDestPath = (path, dest, base) => {
    if (typeof dest !== 'string') return absolute(path)
    if (isFile(dest)) return absolute(dest)
    return join(absolute(dest), absolute(path).replace(absolute(base), ''))
}

const isRelative = (path) => {
    if (path.charAt(0) === '.' && (
        path.charAt(1) === '.' || path.charAt(1) === '/'))
        return true
    return false
}

const isAbsolute = (path) => {
    if (path.charAt(0) === '/') return true
    return false
}

const absolute = (path) => {
    if (isAbsolute(path)) return path
    return join(getRootPath(), path)
}

const relative = (path) => {
    if (!isAbsolute(path)) return path
    return path.replace(getRootPath() + '/' , '')
}

const getRootPath = () => process.cwd()

exports.isFile = isFile
exports.resolveDestPath = resolveDestPath
exports.isRelative = isRelative
exports.isAbsolute = isAbsolute
exports.absolute = absolute
exports.relative = relative
exports.getRootPath = getRootPath
