const fs = require('fs')

const ParameterService = require('./services/ParameterService')
const KoinGraphService = require('./services/KoinGraphService')
const LinkNodeGraphService = require('./services/LinkNodeGraphService')
const TreeGraphService = require('./services/TreeGraphService')

/* get path and graph format */
let paramService = new ParameterService()
let param = paramService.getParameters()

/* build json graph */
let koinGraphService = new KoinGraphService(param)
let graph = koinGraphService.buildGraph()

/* show ui graph */
if (param.graph == 'tree') {
  let treeGraphService = new TreeGraphService(graph)

  let tree = treeGraphService.buildTree()
  fs.writeFileSync('ui/koin-graph.js', 'var treeData = ' + JSON.stringify(tree, null, 2))
} else {
  let linkNodeGraphService = new LinkNodeGraphService(graph)

  let linkNodeGraph = linkNodeGraphService.build()

  fs.writeFileSync('ui/koin-graph.js', '')
  fs.appendFileSync('ui/koin-graph.js', 'var nodes = ' + JSON.stringify(linkNodeGraph.nodes, null, 2))
  fs.appendFileSync('ui/koin-graph.js', '\nvar links = ' + JSON.stringify(linkNodeGraph.links, null, 2))
}