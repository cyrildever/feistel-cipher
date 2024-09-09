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

if (typeof window !== 'undefined') {
  // eslint-disable-next-line no-global-assign,@typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-require-imports
  Buffer = require('buffer/').Buffer
}

// xor applies XOR operation on two strings in the sense that each charCode are xored
export const xor = (str1: string, str2: string): string => {
  return Array.from(str1).reduce((xored, c, idx) => xored + String.fromCharCode(c.charCodeAt(0) ^ str2.charCodeAt(idx)), '')
}

// xorBytes applies XOR operation on thow byte arrays in the sense that each bit value are xored
export const xorBytes = (bytes1: Buffer, bytes2: Buffer): Buffer => {
  return Buffer.from(bytes1).reduce((xored, c, idx) => Buffer.concat([xored, Buffer.from([c ^ bytes2[idx]])]), Buffer.alloc(0))
}

export const NEUTRAL_BYTE = Buffer.from([0]).toString()
export const NEUTRAL = Buffer.from([0])
