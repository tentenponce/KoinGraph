const ParameterService = require('./services/ParameterService')
const KoinGraphService = require('./services/KoinGraphService')
const D3GraphService = require('./services/D3GraphService')

/* get path and graph format */
let paramService = new ParameterService()
let param = paramService.getParameters()

/* build json graph */
let koinGraphService = new KoinGraphService(param)
let graph = koinGraphService.buildGraph()

/* show ui graph */
let d3GraphService = new D3GraphService(graph)

d3GraphService.buildNodes()
d3GraphService.buildLinks()