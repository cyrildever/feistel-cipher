import * as feistel from '../../../lib/src/typescript/index'
import { BLAKE2b, H, KECCAK, SHA_256, SHA_3 } from '../../../lib/src/typescript/utils/hash'

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
