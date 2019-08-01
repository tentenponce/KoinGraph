const { expect } = require('chai')
const sinon = require('sinon')

const ClassCastHelper = require('../../domain/ClassCastHelper')

const helper = new ClassCastHelper()

describe('isClassCast(fileContent, castName)', () => {
  it('should return true if class is castName exists on the extension and interface', () => {
    const fileContent = `class ComponentA(dependencyA: DependencyA) : ComponentAlias {
      ...more codes...
    }`

    expect(helper.isClassCast(fileContent, 'ComponentAlias')).to.be.true
  })

  it('should return false if castName does not exists on the extension and interface', () => {
    const fileContent = `class ComponentA(dependencyA: DependencyA) {
      ...more codes...
    }`

    expect(helper.isClassCast(fileContent, 'ComponentAlias')).to.be.false
  })

  it('should return false if castName exists as parameter instead of extension or interface', () => {
    const fileContent = `class ComponentA(parameterComponentAlias: ComponentAlias) {
      ...more codes...
    }`

    expect(helper.isClassCast(fileContent, 'ComponentAlias')).to.be.false
  })
})