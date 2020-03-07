type Feistel = typeof import('../../..')
const feistel = require('../../../lib/src/typescript') as Feistel

describe('Cipher', () => {
  describe('apply', () => {
    it('should be deterministic', () => {
      const cipher = new feistel.Cipher('8ed9dcc1701c064f0fd7ae235f15143f989920e0ee9658bb7882c8d7d5f05692', 10)
      const found = cipher.encrypt('Edgewhere')

      const expected = '3d7c0a0f51415a521054'
      found.toString('hex').should.equal(expected)
    })
  })
  describe('unapply', () => {
    it('should be deterministic', () => {
      const cipher = new feistel.Cipher('8ed9dcc1701c064f0fd7ae235f15143f989920e0ee9658bb7882c8d7d5f05692', 10)
      const found = cipher.decrypt(Buffer.from('3d7c0a0f51415a521054', 'hex'))

      const expected = 'Edgewhere'
      found.should.equal(expected)
    })
  })
})
