const MinifierUtil = require('./MinifierUtil')

class ClassCastHelper {

  isClassCast(fileContent, castName) {
    fileContent = MinifierUtil.minifyString(fileContent)
    let rawClassDetail = fileContent.match(/class[^{]+/)
    
    if (rawClassDetail) {
      let extAndInterface = rawClassDetail[0].substring(rawClassDetail[0].lastIndexOf(':'))
      return extAndInterface.indexOf(castName) >= 0
    }
  }
}

module.exports = ClassCastHelper