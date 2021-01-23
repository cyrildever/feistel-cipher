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

import { Hash } from './utils/hash'
import { PADDING_CHARACTER, unpad } from './utils/padding'
import { add, extract, split } from './utils/strings'
import { xor } from './utils/xor'

/**
 * The CustomCipher class is the entry point to the Feistel cipher if you want to use your own set of keys.
 * The number of rounds will be defined by the number of keys provided at instantiation.
 * For better security, you should choose a 256-bit keys or longer.
 * Once instantiated, use the encrypt() or decrypt() methods on the Cipher instance with the appropriate data.
 * 
 * @throws no key provided
 */
export class CustomCipher {
  keys: ReadonlyArray<string>

  constructor(keys: ReadonlyArray<string>) {
    if (keys.length == 0) {
      throw new Error('no key provided')
    }
    this.keys = keys
  }

  /**
   * Obfuscate the passed data
   * 
   * @param {string} data - The data to obfuscate
   * @returns {Buffer} The byte array of the obfuscated result
   */
  encrypt(data: string): Buffer {
    if (data.length % 2 == 1) {
      data = data.padStart(data.length + 1, PADDING_CHARACTER)
    }
    // Apply the Feistel cipher
    let parts = split(data)
    for (let i = 0; i < this.keys.length; ++i) { // eslint-disable-line no-loops/no-loops
      const tmp = xor(parts[0], this.round(parts[1], i))
      parts = [parts[1], tmp]
    }
    return Buffer.from(parts[0] + parts[1])
  }

  /**
   * Deobfuscate the passed data
   * 
   * @param {Buffer} obfuscated - The byte array to use
   * @returns {string} The deobfuscated string.
   * @throws invalid obfuscated data
   */
  decrypt(obfuscated: Buffer): string {
    const o = obfuscated.toString('utf-8')
    if (o.length % 2 != 0) {
      throw new Error('invalid obfuscated data')
    }
    // Apply Feistel cipher
    const parts = split(o)
    let a = parts[1]
    let b = parts[0]
    for (let i = 0; i < this.keys.length; ++i) { // eslint-disable-line no-loops/no-loops
      const tmp = xor(a, this.round(b, this.keys.length - i - 1))
      a = b
      b = tmp
    }
    return unpad(b + a)
  }

  // Feistel implementation

  // Round is the function applied at each round of the obfuscation process to the right side of the Feistel cipher
  private round(item: string, index: number): string {
    const addition = add(item, extract(this.keys[index], index, item.length))
    const hashed = Hash(addition).toString('hex')
    return extract(hashed, index, item.length)
  }
}
