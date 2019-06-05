const ParameterService = require('./services/ParameterService')
const KoinGraphService = require('./services/KoinGraphService')

/* get path and graph format */
let paramService = new ParameterService()
let param = paramService.getParameters()

/* build json graph */
let koinGraphService = new KoinGraphService(param)
koinGraphService.buildGraph()