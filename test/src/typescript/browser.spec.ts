import * as feistel from '../../../lib/src/typescript/index'
import {
  base256CharAt, hex2Readable, indexOfBase256, readable2Buffer, readable2Hex, toBase256Readable
} from '../../../lib/src/typescript/index'
import { extractBytes, splitBytes } from '../../../lib/src/typescript/utils/bytes'
import { BLAKE2b, H, KECCAK, SHA_256, SHA_3 } from '../../../lib/src/typescript/utils/hash'
import { extract, split } from '../../../lib/src/typescript/utils/strings'
import { xor, xorBytes } from '../../../lib/src/typescript/utils/xor'

describe('Cipher', () => {
  describe('encrypt', () => {
    it('should be deterministic', () => {
      const cipher = new feistel.Cipher('8ed9dcc1701c064f0fd7ae235f15143f989920e0ee9658bb7882c8d7d5f05692', 10)
      const found = cipher.encrypt('Edgewhere')

      const expected = '3d7c0a0f51415a521054'
      found.toString('hex').should.equal(expected)
    })
  })
  describe('decrypt', () => {
    it('should be deterministic', () => {
      const cipher = new feistel.Cipher('8ed9dcc1701c064f0fd7ae235f15143f989920e0ee9658bb7882c8d7d5f05692', 10)
      const found = cipher.decrypt(Buffer.from('3d7c0a0f51415a521054', 'hex'))

      const expected = 'Edgewhere'
      found.should.equal(expected)
    })
  })
})
describe('CustomCipher', () => {
  describe('encrypt', () => {
    it('should be deterministic', () => {
      // Identical to Cipher.encrypt test above
      let cipher = new feistel.CustomCipher([
        '8ed9dcc1701c064f0fd7ae235f15143f989920e0ee9658bb7882c8d7d5f05692',
        '8ed9dcc1701c064f0fd7ae235f15143f989920e0ee9658bb7882c8d7d5f05692',
        '8ed9dcc1701c064f0fd7ae235f15143f989920e0ee9658bb7882c8d7d5f05692',
        '8ed9dcc1701c064f0fd7ae235f15143f989920e0ee9658bb7882c8d7d5f05692',
        '8ed9dcc1701c064f0fd7ae235f15143f989920e0ee9658bb7882c8d7d5f05692',
        '8ed9dcc1701c064f0fd7ae235f15143f989920e0ee9658bb7882c8d7d5f05692',
        '8ed9dcc1701c064f0fd7ae235f15143f989920e0ee9658bb7882c8d7d5f05692',
        '8ed9dcc1701c064f0fd7ae235f15143f989920e0ee9658bb7882c8d7d5f05692',
        '8ed9dcc1701c064f0fd7ae235f15143f989920e0ee9658bb7882c8d7d5f05692',
        '8ed9dcc1701c064f0fd7ae235f15143f989920e0ee9658bb7882c8d7d5f05692'
      ])
      let found = cipher.encrypt('Edgewhere')

      let expected = '3d7c0a0f51415a521054'
      found.toString('hex').should.equal(expected)

      // Another test with different custom keys
      cipher = new feistel.CustomCipher([
        '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        '9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba',
        'abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789'
      ])
      found = cipher.encrypt('Edgewhere')

      expected = '445951465c5a19613633'
      found.toString('hex').should.equal(expected)
    })
  })
  describe('decrypt', () => {
    it('should be deterministic', () => {
      const cipher = new feistel.CustomCipher([
        '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        '9876543210fedcba9876543210fedcba9876543210fedcba9876543210fedcba',
        'abcdef0123456789abcdef0123456789abcdef0123456789abcdef0123456789'
      ])
      const found = cipher.decrypt(Buffer.from('445951465c5a19613633', 'hex'))

      const expected = 'Edgewhere'
      found.should.equal(expected)
    })
  })
})
describe('FPECipher', () => {
  describe('encrypt', () => {
    it('should be deterministic', () => {
      const expected = 'K¡(#q|r5*'
      const cipher = new feistel.FPECipher(SHA_256, '8ed9dcc1701c064f0fd7ae235f15143f989920e0ee9658bb7882c8d7d5f05692', 10)
      const found = cipher.encrypt('Edgewhere')
      found.should.equal(expected)
    })
  })
  describe('encryptNumber', () => {
    it('should produce the right number', () => {
      const expected = 22780178
      const cipher = new feistel.FPECipher(SHA_256, 'some-32-byte-long-key-to-be-safe', 128)
      const found = cipher.encryptNumber(123456789)
      found.should.equal(expected)

      const smallNumber = cipher.encryptNumber(123)
      smallNumber.should.equal(24359)
    })
  })
  describe('decrypt', () => {
    it('should be deterministic', () => {
      const nonFPE = 'Edgewhere'
      const cipher = new feistel.FPECipher(SHA_256, '8ed9dcc1701c064f0fd7ae235f15143f989920e0ee9658bb7882c8d7d5f05692', 10)
      let found = cipher.decrypt(hex2Readable('3d7c0a0f51415a521054'))
      found.should.equal(nonFPE)

      const expected = 'Edgewhere'
      found = cipher.decrypt(hex2Readable('2a5d07024f5a501409'))
      found.should.equal(expected)

      found = cipher.decrypt('K¡(#q|r5*')
      found.should.equal(expected)
    })
  })
  describe('decryptNumber', () => {
    it('should return the right number', () => {
      const expected = 123456789
      const cipher = new feistel.FPECipher(SHA_256, 'some-32-byte-long-key-to-be-safe', 128)
      const found = cipher.decryptNumber(22780178)
      found.should.equal(expected)

      const smallNumber = cipher.decryptNumber(24359)
      smallNumber.should.equal(123)

      const zero = cipher.decryptNumber(0)
      zero.should.equal(24402)
    })
  })
})
describe('hash', () => {
  describe('H', () => {
    const data = Buffer.from('Edgewhere')
    it('should create a blake-2b hash', () => {
      const expected = 'e5ff44a9b2caa01099082dd6e9055ea5d002beea078e9251454494ccf6869b2f'
      const found = H(data, BLAKE2b)
      found.toString('hex').should.equal(expected)
    })
    it('should create a keccak hash', () => {
      const expected = 'ac501ee78bc9b9429f6b923953946606b260a8de141eb253567342b678bc5f10'
      const found = H(data, KECCAK)
      found.toString('hex').should.equal(expected)
    })
    it('should create a SHA-256 hash', () => {
      const expected = 'c0c77f225dd222144bc4ef79dca00ab7d955f26da2b1e0f25df81f8a7e86917c'
      const found = H(data, SHA_256)
      found.toString('hex').should.equal(expected)
    })
    it('should create a SHA-3 hash', () => {
      const expected = '9d6bf5763cb18bceb7c15270ff8400ae70bf3cd71928463a30f02805d913409d'
      const found = H(data, SHA_3)
      found.toString('hex').should.equal(expected)
    })
  })
})
describe('bytes', () => {
  describe('extractBytes', () => {
    it('should return the appropriate byte array with the right length', () => {
      const input = Buffer.from('abcd1234', 'binary')
      let expected = Buffer.from('1234', 'binary')
      let found = extractBytes(input, 4, 4)
      found.should.eqls(expected)

      expected = Buffer.from('1234abcd12', 'binary')
      found = extractBytes(input, 4, 10)
      found.should.eqls(expected)
    })
  })
  describe('splitBytes', () => {
    it('should split a byte array in two, the first part being the smallest if it is of odd length', () => {
      const odd = Buffer.from([1, 2, 3, 4, 5])
      let parts = splitBytes(odd)
      parts.should.have.lengthOf(2)
      parts[0].should.eqls(Buffer.from([1, 2]))
      parts[1].should.eqls(Buffer.from([3, 4, 5]))

      const even = Buffer.from([1, 2, 3, 4, 5, 6])
      parts = splitBytes(even)
      parts.should.have.lengthOf(2)
      parts[0].should.eqls(Buffer.from([1, 2, 3]))
      parts[1].should.eqls(Buffer.from([4, 5, 6]))
    })
  })
})
describe('strings', () => {
  describe('extract', () => {
    it('should return the appropriate string with the right length', () => {
      const input = 'abcd1234'
      let expected = '1234'
      let found = extract(input, 4, 4)
      found.should.equal(expected)

      expected = '1234abcd12'
      found = extract(input, 4, 10)
      found.should.equal(expected)
    })
  })
  describe('split', () => {
    it('should split a string in two, the first part being the smallest if it is of odd length', () => {
      const odd = 'Edgewhere'
      let parts = split(odd)
      parts.should.have.lengthOf(2)
      parts[0].should.equal('Edge')
      parts[1].should.equal('where')

      const even = 'cyrildever'
      parts = split(even)
      parts.should.have.lengthOf(2)
      parts[0].should.equal('cyril')
      parts[1].should.equal('dever')
    })
  })
})
describe('Readable', () => {
  it('should use the appropriate base-256 character set', () => {
    base256CharAt(0).should.equal('!')
    base256CharAt(255).should.equal('ǿ')
    indexOfBase256('ǿ').should.equal(255)
  })
  it('should be built from a byte array or an hexadecimal string', () => {
    const expected = 'K¡(#q|r5*'
    const fpeBytes = Buffer.from([42, 93, 7, 2, 79, 90, 80, 20, 9])
    const found = toBase256Readable(fpeBytes)
    found.should.equal(expected)
    readable2Buffer(found).should.eqls(fpeBytes)
    readable2Hex(found).should.equal('2a5d07024f5a501409')
    const hex = hex2Readable('2a5d07024f5a501409')
    hex.should.equal(found)
  })
})
describe('XOR', () => {
  describe('xor', () => {
    it('should apply XOR operation to two strings appropriately', () => {
      const expected = 'PPPP'
      const found = xor('1234', 'abcd')
      found.should.equal(expected)
    })
  })
  describe('xorBytes', () => {
    it('should apply XOR operation to two byte arrays appropriately', () => {
      const expected = Buffer.from('PPPP', 'binary')
      const found = xorBytes(Buffer.from('1234', 'binary'), Buffer.from('abcd', 'binary'))
      found.should.eqls(expected)
    })
  })
})