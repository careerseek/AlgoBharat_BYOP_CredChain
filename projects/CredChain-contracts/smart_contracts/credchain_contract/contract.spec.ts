import { TestExecutionContext } from '@algorandfoundation/algorand-typescript-testing'
import { describe, expect, it } from 'vitest'
import { CredchainContract } from './contract.algo'

describe('CredchainContract contract', () => {
  const ctx = new TestExecutionContext()
  it('Logs the returned value when sayHello is called', () => {
    const contract = ctx.contract.create(CredchainContract)

    const result = contract.hello('Sally')

    expect(result).toBe('Hello, Sally')
  })
})
