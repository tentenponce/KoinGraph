class MinifierHelper {
  
  minifyString(fileContent) {
    return fileContent.replace(/\s/g, '')
  }
}

module.exports = MinifierHelper