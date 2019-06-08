const fs = require('fs')
const fileHound = require('filehound')

class FileSystemService {

  readFile(file) {
    return fs.readFileSync(file, 'utf8')
  }

  /**
   * get all kotlin files from the project path.
   */
  getKotlinFiles(path) {
    return fileHound.create()
      .paths(path)
      .ext('kt')
      .findSync()
  }
}

module.exports = FileSystemService