const fs = require('fs')

class FileSystemBridge {
  readFile (file) {
    return fs.readFileSync(file, 'utf8')
  }
}

module.exports = FileSystemBridge