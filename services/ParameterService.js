const Param = require('../models/Param')

class ParameterService {

  getParameters() {
    let args = require('minimist')(process.argv.slice(2))

    let path = args['path']
    let graph = args['graph'] || 'tree'

    return Param(path, graph)
  }
}

module.exports = ParameterService