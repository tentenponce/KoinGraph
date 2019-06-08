const fs = require('fs')
const opn = require('opn')
const path = require('path')
const fileHound = require('filehound')

const FileSystemBridge = require('./data/FileSystemBridge')

const KoinGraphService = require('./domain/KoinGraphService')
const DependencyReaderHelper = require('./domain/DependencyReaderHelper')
const MinifierHelper = require('./domain/MinifierHelper')
const ClassCastHelper = require('./domain/ClassCastHelper')

const LinkNodeGraphMapper = require('./ui/linknode/LinkNodeGraphMapper')
const TreeGraphMapper = require('./ui/tree/TreeGraphMapper')
const BubbleGraphMapper = require('./ui/bubble/BubbleGraphMapper')

/* read parameters */
let args = require('minimist')(process.argv.slice(2))

let projectPath = args['path']
let graph = args['graph']

/**
 * get all kotlin files from the project path.
 */
let projectFiles = fileHound.create()
  .paths(projectPath)
  .ext('kt')
  .findSync()

/* build json graph */
let koinGraphService = new KoinGraphService(new FileSystemBridge(),
  new DependencyReaderHelper(),
  new MinifierHelper(),
  new ClassCastHelper())
let jsonGraph = koinGraphService.buildGraph(projectFiles)

/* show ui graph */
switch (graph) {
  case 'tree':
    let treeGraphMapper = new TreeGraphMapper(jsonGraph)

    let tree = treeGraphMapper.toTreeGraph()
    fs.writeFileSync('ui/tree/koin-graph.js', 'var treeData = ' + JSON.stringify(tree, null, 2))
    opn(path.resolve('ui/tree/tree-graph.html'))
    break
  case 'bubble':
    let bubbleGraphMapper = new BubbleGraphMapper(jsonGraph)

    let bubble = bubbleGraphMapper.toBubbleGraph()
    fs.writeFileSync('ui/bubble/koin-graph.js', 'var bubbleData = ' + JSON.stringify(bubble, null, 2))
    opn(path.resolve('ui/bubble/bubble-graph.html'))
    break
  case 'link-node':
    let linkNodeGraphMapper = new LinkNodeGraphMapper(jsonGraph)

    let linkNodeGraph = linkNodeGraphMapper.toLinkNodeGraph()

    fs.writeFileSync('ui/linknode/koin-graph.js', '')
    fs.appendFileSync('ui/linknode/koin-graph.js', 'var nodes = ' + JSON.stringify(linkNodeGraph.nodes, null, 2))
    fs.appendFileSync('ui/linknode/koin-graph.js', '\nvar links = ' + JSON.stringify(linkNodeGraph.links, null, 2))
    opn(path.resolve('ui/linknode/link-node-graph.html'))
    break
  default:
    console.log('Please specify graph by using --graph parameter')
    console.log('options: bubble, tree, link-node')
    break
}
