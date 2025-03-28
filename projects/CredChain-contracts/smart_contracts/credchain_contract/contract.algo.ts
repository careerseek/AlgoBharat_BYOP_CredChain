import { Contract } from '@algorandfoundation/algorand-typescript'

export class CredchainContract extends Contract {
  public hello(name: string): string {
    return `Hello, ${name}`
  }
}
