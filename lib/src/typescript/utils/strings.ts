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

// Adds two strings in the sense that each charCode are added
export const add = (str1: string, str2: string): string => {
  if (str1.length != str2.length) {
    throw new Error('to be added, strings must be of the same length')
  }
  return Array.from(str1).reduce((addedString, c, idx) => addedString + String.fromCharCode(c.charCodeAt(0) + str2.charCodeAt(idx)), '')
}

// Returns an extraction of the passed string of the desired length from the passed start index.
// If the desired length is too long, the key string is repeated.
export const extract = (from: string, startIndex: number, desiredLength: number): string => {
  startIndex = startIndex % from.length
  const lengthNeeded = startIndex + desiredLength
  return from.repeat(Math.ceil(lengthNeeded / from.length)).substr(startIndex, desiredLength)
}

// Splits a string in two parts
export const split = (str: string): [string, string] => {
  const half = str.length / 2
  return [str.substr(0, half), str.substr(half)]
}
