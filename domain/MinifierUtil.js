function minifyString (fileContent) {
  return fileContent.replace(/\s/g, '')
}

module.exports = { minifyString }