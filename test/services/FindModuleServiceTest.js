const expect = require('chai').expect
const sinon = require('sinon')

const FindModuleService = require('../../services/FindModuleService')

const service = new FindModuleService()

describe('getModules()', () => {
  it('should return modules with dependencies', () => {
    let fileContent = `
      single { componentA(get(), get()) }
      single { componentB(get(), get(), get(), get()) }
      viewModel { viewModelA(get(), get(), get(), get()) }
    `

    expect(service.getModules(fileContent)).to.include.members(['componentA', 'componentB', 'viewModelA'])
  })

  it('should return modules without dependencies', () => {
    let fileContent = `
      single { componentA(get(), get()) }
      single { componentB() }
      viewModel { viewModelA(get(), get(), get(), get()) }
      viewModel { viewModelB() }
    `

    expect(service.getModules(fileContent)).to.include.members(['componentA', 'componentB', 'viewModelA', 'viewModelB'])
  })
})
