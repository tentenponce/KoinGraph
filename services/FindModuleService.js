const fs = require('fs')

class FindModuleService {

  /**
   * find the modules registered in Koin from the file.
   */
  getModules(file) {
    let contents = fs.readFileSync(file, 'utf8') // read file
    let contentsNoWhiteSpace = contents.replace(/\s/g, '') // minify file

    /* get array of single {...} from the file. */
    let singles = contentsNoWhiteSpace.match(/single\{((?!single).)*\(((?!single).)*\)\}/g)

    /* get the module names by removing `single{` and terminates on the first open parenthesis. */
    let moduleFiles = []
    for (var i in singles) {
      let single = singles[i].replace('single{', '') // remove `single{`.
      moduleFiles.push(single.match(/[^(]+(?:(?!\().)/)[0]) // get word up until first open parenthesis.
    }

    return moduleFiles
  }
}

module.exports = FindModuleService