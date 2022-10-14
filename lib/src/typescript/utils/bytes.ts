/*
MIT License

Copyright (c) 2022 Cyril Dever

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

// Adds two byte arrays in the sense that each bit values are added modulo 256 to be rendered as UTF-8
export const addBytes = (bytes1: Buffer, bytes2: Buffer): Buffer => {
  if (bytes1.length != bytes2.length) {
    throw new Error('to be added, buffers must be of the same length')
  }
  return Buffer.from(bytes1).reduce((addedBuffer, c, idx) => {
    return Buffer.concat([addedBuffer, bitValueToUtf8Bytes((c + bytes2[idx]) % 256)])
  }, Buffer.alloc(0))
}

// Utility to mimic transformation of byte array to UTF-8 in Golang
const bitValueToUtf8Bytes = (value: number): Buffer =>
  value < 128
    ? Buffer.from([value])
    : value < 192
      ? Buffer.from([194, value])
      : Buffer.from([195, value - 64])

// Returns an extraction of the passed byte array of the desired length from the passed start index.
// If the desired length is too long, the key is repeated.
export const extractBytes = (from: Buffer, startIndex: number, desiredLength: number): Buffer => {
  startIndex = startIndex % from.length
  const buf = Buffer.alloc(desiredLength)
  const firstPart = from.slice(startIndex)
  buf.fill(firstPart, 0, Math.min(firstPart.length, desiredLength), 'binary')
  if (firstPart.length < desiredLength) {
    buf.fill(from.toString('binary'), firstPart.length, undefined, 'binary')
  }
  return buf
}

// Splits a byte array in two parts
export const splitBytes = (data: Buffer): [Buffer, Buffer] => {
  const half = data.length / 2
  return [data.slice(0, half), data.slice(half)]
}