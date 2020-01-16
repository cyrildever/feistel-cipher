/*
MIT License

Copyright (c) 2020 Edgewhere

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

const sha256 = (msg: BinaryLike): Buffer =>
    createHash("sha256").update(msg).digest()

/**
 * The Cipher class is the main entry point to the Feistel cipher.
 * You should instantiate it with the key you want to use and the number of rounds to apply.
 * For better security, you should choose a 256-bit key or longer, and 10 rounds is a good start.
 * Once instantiated, use the apply() or unapply() methods on the Cipher instance with the appropriate data.
 */
export class Cipher {
    key: string
    rounds: number

    constructor(key: string, rounds: number) {
        this.key = key
        this.rounds = rounds
    }

    /**
     * Obfuscate the passed data
     * 
     * @param {string} data - The data to obfuscate
     * @returns {Buffer} The byte array of the obfuscated result.
     */
    encrypt(data: string): Buffer {
        if (data.length % 2 == 1) {
            data = leftPad(data, data.length + 1)
        }
        // Apply the Feistel cipher
        let parts = this.split(data)
        for (let i = 0; i < this.rounds; i++) {
            const tmp = this.xor(parts[0], this.round(parts[1], i))
            parts = [parts[1], tmp]
        }
        return Buffer.from(parts[0] + parts[1], 'utf-8')
    }

    /**
     * Deobfuscate the passed data
     * 
     * @param {Buffer} obfuscated - The byte array to use
     * @returns {string} The deobfuscated string.
     */
    decrypt(obfuscated: Buffer): string {
        const o = obfuscated.toString('utf-8')
        if (o.length % 2 != 0) {
            throw new Error('invalid obfuscated data')
        }
        // Apply Feistel cipher
        const parts = this.split(o)
        let a = parts[1]
        let b = parts[0]
        for (let i = 0; i < this.rounds; i++) {
            const tmp = this.xor(a, this.round(b, this.rounds - i - 1))
            a = b
            b = tmp
        }
        return unpad(b + a)
    }

    // Feistel implementation

    // Add adds two strings in the sense that each charCode are added
    private add(str1: string, str2: string): string {
        if (str1.length != str2.length) {
            throw new Error('to be added, strings must be of the same length')
        }
        let addedString = ''
        for (let i = 0; i < str1.length; i++) {
            addedString += String.fromCharCode(str1.charCodeAt(i) + str2.charCodeAt(i))
        }
        return addedString
    }

    // Extract returns an extraction of the passed string of the desired length from the passed start index.
    // If the desired length is too long, the key string is repeated.
    private extract(from: string, startIndex: number, desiredLength: number): string {
        startIndex = startIndex % from.length
        const lengthNeeded = startIndex + desiredLength
        return from.repeat(Math.ceil(lengthNeeded / from.length)).substr(startIndex, desiredLength)
    }

    // Round is the function applied at each round of the obfuscation process to the right side of the Feistel cipher
    private round(item: string, index: number): string {
        const addition = this.add(item, this.extract(this.key, index, item.length))
        let hashed = sha256(addition).toString('hex')
        return this.extract(hashed, index, item.length)
    }

    // Split splits a string in two equal parts
    private split(str: string): Array<string> {
        if (str.length % 2 != 0) {
            throw new Error('invalid string length: cannot be split')
        }
        const half = str.length / 2
        return [str.substr(0, half), str.substr(half)]
    }

    // Xor function XOR two strings in the sense that each charCode are xored
    private xor(str1: string, str2: string): string {
        var xored = ''
        for (let i = 0; i < str1.length; i++) {
            xored += String.fromCharCode(str1.charCodeAt(i) ^ str2.charCodeAt(i))
        }
        return xored
    }
}

//--- PADDING utilities

// Unicode U+0002: start of text
const PADDING_CHARACTER = '\u0002'

const leftPad = (str: string, minLength: number): string => {
    if (str.length >= minLength) {
        return str
    }
    while (str.length < minLength) {
        str = PADDING_CHARACTER + str
    }
    return str
}

const unpad = (str: string): string => {
    while (str.startsWith(PADDING_CHARACTER)) {
        str = str.substr(1)
    }
    return str
}
