const MinifierUtil = require('./MinifierUtil')

class ClassCastHelper {
  isClassCast (fileContent, castName) {
    const minifiedFileContent = MinifierUtil.minifyString(fileContent)
    const rawClassDetail = minifiedFileContent.match(/class[^{]+/)
    
    if (rawClassDetail) {
      const extAndInterface = rawClassDetail[0].substring(rawClassDetail[0].lastIndexOf(':'))
      return extAndInterface == `:${castName}`
    }

    return false
  }
}

module.exports = ClassCastHelper