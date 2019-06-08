const expect = require('chai').expect
const sinon = require('sinon')

const KoinGraphService = require('../../domain/KoinGraphService')
const FileSystemBridge = require('../../data/FileSystemBridge')
const DependencyReaderHelper = require('../../domain/DependencyReaderHelper')
const ClassCastHelper = require('../../domain/ClassCastHelper')

const fileSystemBridge = new FileSystemBridge()
const dependencyReaderHelper = new DependencyReaderHelper()
const classCastHelper = new ClassCastHelper()

describe('buildGraph()', () => {

  sinon.stub(fileSystemBridge, 'readFile').returns('test')

  sinon.stub(dependencyReaderHelper, 'getModulesFromFile').returns(['ComponentA'])
  sinon.stub(dependencyReaderHelper, 'getDependenciesFromFile').returns(['DependencyA', 'DependencyB'])
  sinon.stub(classCastHelper, 'isClassCast').returns(false)

  const service = new KoinGraphService(fileSystemBridge, dependencyReaderHelper, classCastHelper)

  it('should add dependencies to the graph also', () => {
    expect(service.buildGraph(['ComponentA.kt'])).to.deep.equal({
      'ComponentA': [
        'DependencyA',
        'DependencyB'
      ],
      'DependencyA': [],
      'DependencyB': []
    })
  })

  it('should add dependencies of dependencies to the graph also', () => {
    expect(service.buildGraph(['ComponentA.kt', 'DependencyA.kt', 'DependencyB.kt'])).to.deep.equal({
      'ComponentA': [
        'DependencyA',
        'DependencyB'
      ],
      'DependencyA': [
        'DependencyA',
        'DependencyB'
      ],
      'DependencyB': [
        'DependencyA',
        'DependencyB'
      ]
    })
  })
})