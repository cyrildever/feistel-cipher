if (typeof window !== 'undefined') {
  // eslint-disable-next-line no-global-assign,@typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-require-imports
  Buffer = require('buffer/').Buffer
}

const CHARSET = '!"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^`abcdefghijklmnopqrstuvwxyz{|}€¡¢£¤¥¦§¨©ª«¬®¯°±²³´µ¶·¸¹»¼½¾¿ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷ùúûüýÿăąĊčđĕĘğħĩĭıĵķĿŀŁłňŋŏœŖřŝşŦŧũūůŲŵſƀƁƂƄƆƇƔƕƗƙƛƜƟƢƥƦƧƩƪƭƮưƱƲƵƸƺƾǀǁǂƿǬǮǵǶǹǻǿ")'

export type Readable = string

export const base256CharAt = (index: number): string =>
  CHARSET.charAt(index)

export const indexOfBase256 = (char: string): number =>
  CHARSET.indexOf(char)

export const toBase256Readable = (item: Buffer): Readable =>
  [...item].map(base256CharAt).join('')

export const hex2Readable = (hex: string): Readable =>
  toBase256Readable(Buffer.from(hex, 'hex'))

export const readable2Buffer = (readable: Readable): Buffer =>
  Buffer.from([...readable].map(indexOfBase256))

export const readable2Hex = (readable: Readable): string =>
  readable2Buffer(readable).toString('hex')
