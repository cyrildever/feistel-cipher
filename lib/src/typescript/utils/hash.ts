/*
MIT License

Copyright (c) 2020 Cyril Dever

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import { createHash, BinaryLike } from 'crypto'
import createKeccak from 'keccak'
import { SHA3 } from 'sha3'
const blake2 = require('blakejs') // eslint-disable-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-require-imports

if (typeof window !== 'undefined') {
  // eslint-disable-next-line no-global-assign,@typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-require-imports
  Buffer = require('buffer/').Buffer
}

export const Hash = (msg: BinaryLike): Buffer =>
  createHash('sha256').update(msg).digest()

export type Engine = string

export const BLAKE2b: Engine = 'blake-2b-256'
export const KECCAK: Engine = 'keccak-256'
export const SHA_256: Engine = 'sha-256'
export const SHA_3: Engine = 'sha-3'

export const isAvailableEngine = (engine: Engine): boolean =>
  engine === BLAKE2b || engine === KECCAK || engine === SHA_256 || engine === SHA_3

/**
 * Create a hash from the passed message using the specified algorithm
 * 
 * @param {Buffer} msg - The message to hash 
 * @param {Enging} using - The algorithm name
 * @returns the hashed byte array
 * @throws unknown hash algorithm
 */
export const H = (msg: Buffer, using: Engine): Buffer => {
  switch (using) {
    case BLAKE2b:
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
      return Buffer.from(blake2.blake2b(msg, '', 32), 'hex')
    case KECCAK:
      return createKeccak('keccak256').update(msg).digest()
    case SHA_256:
      return Hash(msg)
    case SHA_3:
      return new SHA3(256).update(msg).digest()
    default:
      throw new Error('unknown hash algorithm')
  }
}
