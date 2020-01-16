# feistel-cipher

This is a TypeScript library implementing the Feistel cipher for "almost" format-preserving encryption.
"Almost" because as we use a balanced version of the implementation, we need the input string to be of even length. If that's the case, the length will be preserved, otherwise the output will be one character longer.

### Motivation

The main objective of this library is not to provide a secure encryption scheme but rather a safe obfuscation tool.


### Formal description

This library operates on the concept of the Feistel cipher described in [Wikipedia](https://en.wikipedia.org/wiki/Feistel_cipher) as:
> A Feistel network is subdivided into several rounds or steps. In its balanced version, the network processes the data in two parts of identical size. On each round, the two blocks are exchanged, then one of the blocks is combined with a transformed version of the other block.
> Half of the data is encoded with the key, then the result of this operation is added using an XOR operation to the other half of the data.
> Then in the next round, we reverse: it is the turn of the last half to be encrypted and then to be xored to the first half, except that we use the data previously encrypted.
> The diagram below shows the data flow (the $\oplus$ represents the XOR operation). Each round uses an intermediate key, usually taken from the main key via a generation called key schedule. The operations performed during encryption with these intermediate keys are specific to each algorithm.

![](assets/400px-Feistel_cipher_diagram_en.svg.png)

The algorithmic description (provided by Wikipedia) of the encryption is as follows:
* Let <img src="https://latex.codecogs.com/gif.latex?n+1" /> be the number of steps, <img src="https://latex.codecogs.com/gif.latex?K_{0}, K_{1}, ..., K_{n}" /> the keys associated with each step and <img src="https://latex.codecogs.com/gif.latex?F:\Omega\times\mathcal{K}\mapsto\Omega" /> a function of the <img src="https://latex.codecogs.com/gif.latex?(words\times keys)" /> space to the word space.
* For each step <img src="https://latex.codecogs.com/gif.latex?i \in [0; n]" />, note the encrypted word in step <img src="https://latex.codecogs.com/gif.latex?i, m_{i} = L_{i} || R_{i}" />:
  * <img src="https://latex.codecogs.com/gif.latex?L_{i+1}=R_{i}" />
  * <img src="https://latex.codecogs.com/gif.latex?R_{i+1}=L_{i} \oplus F(L_{i},K_{i})" />
* <img src="https://latex.codecogs.com/gif.latex?m_{0}=L_{0}||R_{0}" /> is the unciphered text, <img src="https://latex.codecogs.com/gif.latex?m_{n+1}=L_{n+1}||R_{n+1}" /> is the ciphered word.

There is no restriction on the $F$ function other than the XOR operation must be possible. For simplicity, we will choose <img src="https://latex.codecogs.com/gif.latex?L1" /> of the same size as $R1$ and the function <img src="https://latex.codecogs.com/gif.latex?F" /> shall transform a word of length <img src="https://latex.codecogs.com/gif.latex?k" /> into a word of length <img src="https://latex.codecogs.com/gif.latex?k" /> (and this for all <img src="https://latex.codecogs.com/gif.latex?k" />).


### Usage

```
npm i feistel-cipher
```

To get an obfuscated string from a source data, first instantiate a `Cipher` object, passing it a key and a number of rounds.
Then, use the `encrypt()` method with the source data as argument. The result will be a `Buffer`.
To ensure maximum security, we recommend you use a 256-bit key or longer and a minimum of 10 rounds.

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


### License

This module is distributed under an MIT license.
See the [LICENSE](LICENSE) file.


<hr />
&copy; 2020 Edgewhere SAS. All rights reserved.