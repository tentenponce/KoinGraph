const ParameterService = require('./services/ParameterService')
const KoinGraphService = require('./services/KoinGraphService')
const LinkNodeGraphService = require('./services/LinkNodeGraphService')

/* get path and graph format */
let paramService = new ParameterService()
let param = paramService.getParameters()

/* build json graph */
let koinGraphService = new KoinGraphService(param)
let graph = koinGraphService.buildGraph()

/* show ui graph */
if (param.graph == 'tree') {

} else {
  let linkNodeGraphService = new LinkNodeGraphService(graph)

  linkNodeGraphService.buildNodes()
  linkNodeGraphService.buildLinks()
}