const fs = require('fs')
const opn = require('opn')
const path = require('path')

const ParameterService = require('./services/ParameterService')
const FileSystemService = require('./services/FileSystemService')
const KoinGraphService = require('./services/KoinGraphService')
const LinkNodeGraphService = require('./services/LinkNodeGraphService')
const TreeGraphService = require('./services/TreeGraphService')
const BubbleGraphService = require('./services/BubbleGraphService')
const FindModuleService = require('./services/FindModuleService')

/* init dependencies */
let fileSystemService = new FileSystemService()
let findModuleService = new FindModuleService()

/* get path and graph format */
let paramService = new ParameterService()
let param = paramService.getParameters()

/* build json graph */
let koinGraphService = new KoinGraphService(fileSystemService.getKotlinFiles(param.path), findModuleService, fileSystemService)
let graph = koinGraphService.buildGraph()

/* show ui graph */
switch (param.graph) {
  case 'tree':
    let treeGraphService = new TreeGraphService(graph)

    let tree = treeGraphService.build()
    fs.writeFileSync('ui/koin-graph.js', 'var treeData = ' + JSON.stringify(tree, null, 2))
    opn(path.resolve('ui/tree-graph.html'))
    break
  case 'bubble':
    let bubbleGraphService = new BubbleGraphService(graph)

    let bubble = bubbleGraphService.build()
    fs.writeFileSync('ui/koin-graph.js', 'var bubbleData = ' + JSON.stringify(bubble, null, 2))
    opn(path.resolve('ui/bubble-graph.html'))
    break
  case 'link-node':
    let linkNodeGraphService = new LinkNodeGraphService(graph)

    let linkNodeGraph = linkNodeGraphService.build()

    fs.writeFileSync('ui/koin-graph.js', '')
    fs.appendFileSync('ui/koin-graph.js', 'var nodes = ' + JSON.stringify(linkNodeGraph.nodes, null, 2))
    fs.appendFileSync('ui/koin-graph.js', '\nvar links = ' + JSON.stringify(linkNodeGraph.links, null, 2))
    opn(path.resolve('ui/link-node-graph.html'))
    break
  default:
    console.log('Please specify graph by using --graph parameter')
    console.log('options: bubble, tree, link-node')
    break
}
