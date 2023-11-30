# feistel-cipher

![GitHub tag (latest by date)](https://img.shields.io/github/v/tag/cyrildever/feistel-cipher)
![npm](https://img.shields.io/npm/dw/feistel-cipher)
![GitHub last commit](https://img.shields.io/github/last-commit/cyrildever/feistel-cipher)
![GitHub issues](https://img.shields.io/github/issues/cyrildever/feistel-cipher)
![NPM](https://img.shields.io/npm/l/feistel-cipher)

This is a TypeScript library implementing the Feistel cipher for format-preserving encryption (FPE).

### Motivation

The main objective of this library is not to provide a secure encryption scheme but rather a safe obfuscation tool.


### Formal description

This library operates on the concept of the Feistel cipher described in [Wikipedia](https://en.wikipedia.org/wiki/Feistel_cipher) as:
> A Feistel network is subdivided into several rounds or steps. In its balanced version, the network processes the data in two parts of identical size. On each round, the two blocks are exchanged, then one of the blocks is combined with a transformed version of the other block.
> Half of the data is encoded with the key, then the result of this operation is added using an XOR operation to the other half of the data.
> Then in the next round, we reverse: it is the turn of the last half to be encrypted and then to be xored to the first half, except that we use the data previously encrypted.
> The diagram below shows the data flow (the ${\oplus}$ represents the XOR operation). Each round uses an intermediate key, usually taken from the main key via a generation called key schedule. The operations performed during encryption with these intermediate keys are specific to each algorithm.

![](assets/400px-Feistel_cipher_diagram_en.svg.png)

The algorithmic description (provided by Wikipedia) of the encryption is as follows:
* Let $n+1$ be the number of steps, $K_{0},K_{1},...,K_{n}$ the keys associated with each step and $F:\Omega\times\mathcal{K}\mapsto\Omega$ a function of the $(words{\times}keys)$ space to the $words$ space.
* For each step $i{\in}[0;n]$, note the encrypted word in step $i,m_{i}=L_{i}||R_{i}$:
  * $L_{i+1}=R_{i}$
  * $R_{i+1}=L_{i}{\oplus}F(L_{i},K_{i})$
* $m_{0}=L_{0}||R_{0}$ is the unciphered text, $m_{n+1}=L_{n+1}||R_{n+1}$ is the ciphered word. 

There is no restriction on the $F$ function other than the XOR operation must be possible. For simplicity, we will choose $L_1$ of the same size as $R_1$ and the function $F$ shall transform a word of length $k$ into a word of length $k$ (and this for all $k$).

_NB: You may also read my original white paper [here](https://github.com/cyrildever/feistel-cipher/blob/master/feistel_whitepaper.pdf) as well as the latest one on the [full FPE version](https://github.com/cyrildever/feistel-cipher/blob/master/fpe_whitepaper.pdf)._


### Usage

```
npm i feistel-cipher
```

To get an obfuscated string from a source data using the SHA-256 hashing function at each round, first instantiate a `Cipher` object, passing it a key and a number of rounds.
Then, use the `encrypt()` method with the source data as argument. The result will be a `Buffer`.
To ensure maximum security, I recommend you use a 256-bit key or longer and a minimum of 10 rounds.

The decryption process uses the obfuscated buffered data and pass it to the `decrypt()` method of the `Cipher`. 

```typescript
import * as feistel from 'feistel-cipher'

const source = 'my-source-data'

// Encrypt
const cipher = new feistel.Cipher('some-32-byte-long-key-to-be-safe', 10)
const obfuscated = cipher.encrypt(source)

// Decrypt
const deciphered = cipher.decrypt(obfuscated)

assert(deciphered == source)
```
_NB: This is the same default behaviour as in my Golang implementation (see below)._

You may also want to use your own set of keys with `CustomCipher` and a number of rounds depending on the number of provided keys, eg.
```typescript
const cipher = new feistel.CustomCipher([
  '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
  '9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba',
  'abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789'
])
```

Finally, you might want to use the latest `FPECipher` providing true format-preserving encryption for strings:
```typescript
import { SHA_256 } from 'feistel-cipher'

const cipher = new feistel.FPECipher(SHA_256, 'some-32-byte-long-key-to-be-safe', 128)
const obfuscated = cipher.encrypt(source)
assert(obfuscated.length, source.length)
```

If you want to use FPE for numbers, you might want to use the `encryptNumber()` method on the `FPECipher` which will return a number that you may pad if need be to match your requirements:
```typescript
const obfuscatedNumber = cipher.encryptNumber(sourceNumber)
const deobfuscatedNumber = cipher.decryptNumber(obfuscatedNumber)
assert(sourceNumber == deobfuscatedNumber)
```
_NB: For stability and security purposes, the number `0` always returns itself._


### Dependencies

This library relies on four dependencies:
* [`blakejs`](https://www.npmjs.com/package/blakejs);
* [`buffer`](https://www.npmjs.com/package/buffer);
* [`keccak`](https://www.npmjs.com/package/keccak);
* [`sha3`](https://www.npmjs.com/package/sha3).

Besides, to run the tests, you would need to install [`live-server`](https://www.npmjs.com/package/live-server):
```console
npm i -g live-server
```

To run specific tests for NodeJS, run the following: _(eg. `decryptNumber` in [node.spec.ts](test/src/typescript/node.spec.ts))_
```console
$ npm run test-node -- --grep "decryptNumber"
```


### Other implementations

For those interested, I also made two other implementations of these Feistel ciphers:
* In [Golang](https://github.com/cyrildever/feistel);
* In [Scala](https://github.com/cyrildever/feistel-jar).


### License

This module is distributed under a MIT license. \
See the [LICENSE](LICENSE) file.


<hr />
&copy; 2019-2023 Cyril Dever. All rights reserved.