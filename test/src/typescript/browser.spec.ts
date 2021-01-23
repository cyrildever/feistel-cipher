import * as feistel from '../../../lib/src/typescript/index'

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
