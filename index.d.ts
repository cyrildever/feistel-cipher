/// <reference types="node" />
/**
 * The Cipher class is the main entry point to the Feistel cipher.
 * You should instantiate it with the key you want to use and the number of rounds to apply.
 * For better security, you should choose a 256-bit key or longer, and 10 rounds is a good start.
 * Once instantiated, use the apply() or unapply() methods on the Cipher instance with the appropriate data.
 * @class
 */
export declare class Cipher {
    key: string;
    rounds: number;

    /**
     * @param {string} key - A hexadecimal string representation of a 256-bit key (or longer)
     * @param {number} rounds - The number of rounds to apply
     */
    constructor(key: string, rounds: number);

    /**
     * Obfuscate the passed data
     * 
     * @param {string} data - The data to obfuscate
     * @returns {Buffer} The byte array of the obfuscated result.
     */
    encrypt(data: string): Buffer;

    /**
     * Deobfuscate the passed data
     * 
     * @param {Buffer} obfuscated - The byte array to use
     * @returns {string} The deobfuscated string.
     */
    decrypt(obfuscated: Buffer): string;

    private add;
    private extract;
    private round;
    private split;
    private xor;
}
