const expect = require('chai').expect
const sinon = require('sinon')

const KoinGraphService = require('../../services/KoinGraphService')
const FindModuleService = require('../../services/FindModuleService')
const FileSystemService = require('../../services/FileSystemService')

const findModuleService = new FindModuleService()
const fileSystemService = new FileSystemService()

describe('buildGraph()', () => {

  sinon.stub(fileSystemService, 'readFile').returns('test')

  sinon.stub(findModuleService, 'getModules').returns(['ComponentA'])
  sinon.stub(findModuleService, 'getClassDependencies').returns(['DependencyA', 'DependencyB'])

  it('should add dependencies to the graph also', () => {
    const service = new KoinGraphService(['ComponentA.kt'], findModuleService, fileSystemService)

    expect(service.buildGraph()).to.deep.equal({
      'ComponentA': [
        'DependencyA',
        'DependencyB'
      ],
      'DependencyA': [],
      'DependencyB': []
    })
  })

  it('should add dependencies of dependencies to the graph also', () => {
    const service = new KoinGraphService(['ComponentA.kt', 'DependencyA.kt', 'DependencyB.kt'], findModuleService, fileSystemService)

    expect(service.buildGraph()).to.deep.equal({
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