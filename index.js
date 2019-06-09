const fs = require('fs')
const opn = require('opn')
const path = require('path')
const fileHound = require('filehound')
const inquirer = require('inquirer')
const chalk = require('chalk')

const FileSystemBridge = require('./data/FileSystemBridge')

const KoinGraphService = require('./domain/KoinGraphService')
const DependencyReaderHelper = require('./domain/DependencyReaderHelper')
const ClassCastHelper = require('./domain/ClassCastHelper')

const LinkNodeGraphMapper = require('./ui/linknode/LinkNodeGraphMapper')
const TreeGraphMapper = require('./ui/tree/TreeGraphMapper')
const BubbleGraphMapper = require('./ui/bubble/BubbleGraphMapper')

/* load the project files */
const args = require('minimist')(process.argv.slice(2))
console.log(chalk.blue('Reading Project...'))
const files = fileHound.create()
  .paths(args.path)
  .ext('kt')
  .findSync()
  console.log(chalk.green('Project Loaded'))

/* build koin dependencies json graph */
console.log(chalk.blue('Reading Koin Dependencies...'))
const koinGraphService = new KoinGraphService(new FileSystemBridge(),
  new DependencyReaderHelper(),
  new ClassCastHelper())
const jsonGraph = koinGraphService.buildGraph(files)
console.log(chalk.green('Success building Koin dependencies'))

/* ask for type of graph to render */
inquirer.prompt([{
  type: 'list',
  name: 'graph',
  message: 'Now, what graph do you want to render?',
  choices: ['Tree Graph', 'Bubble Graph', 'Link Node Graph']
}]).then(answers => {
  /* show ui graph */
  switch (answers.graph) {
    case 'Tree Graph':
      const treeGraphMapper = new TreeGraphMapper(jsonGraph)

      const tree = treeGraphMapper.toTreeGraph()
      fs.writeFileSync('ui/tree/koin-graph.js', `var treeData = ${  JSON.stringify(tree, null, 2)}`)
      opn(path.resolve('ui/tree/tree-graph.html'))
      break
    case 'Bubble Graph':
      const bubbleGraphMapper = new BubbleGraphMapper(jsonGraph)

      const bubble = bubbleGraphMapper.toBubbleGraph()
      fs.writeFileSync('ui/bubble/koin-graph.js', `var bubbleData = ${  JSON.stringify(bubble, null, 2)}`)
      opn(path.resolve('ui/bubble/bubble-graph.html'))
      break
    case 'Link Node Graph':
      const linkNodeGraphMapper = new LinkNodeGraphMapper(jsonGraph)

      const linkNodeGraph = linkNodeGraphMapper.toLinkNodeGraph()

      fs.writeFileSync('ui/linknode/koin-graph.js', '')
      fs.appendFileSync('ui/linknode/koin-graph.js', `var nodes = ${  JSON.stringify(linkNodeGraph.nodes, null, 2)}`)
      fs.appendFileSync('ui/linknode/koin-graph.js', `\nvar links = ${  JSON.stringify(linkNodeGraph.links, null, 2)}`)
      opn(path.resolve('ui/linknode/link-node-graph.html'))
      break
    default:
      console.log('Please specify graph by using --graph parameter')
      console.log('options: bubble, tree, link-node')
      break
  }
})