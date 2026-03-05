export class GOST28147Engine {
  protected static readonly BLOCK_SIZE = 8
  private workingKey: Int32Array | null = null
  private forEncryption = true
  private S: Uint8Array = GOST28147Engine.Sbox_Default

  private static readonly Sbox_Default = new Uint8Array([
    0x4, 0xa, 0x9, 0x2, 0xd, 0x8, 0x0, 0xe, 0x6, 0xb, 0x1, 0xc, 0x7, 0xf, 0x5, 0x3, 0xe, 0xb, 0x4, 0xc, 0x6, 0xd, 0xf,
    0xa, 0x2, 0x3, 0x8, 0x1, 0x0, 0x7, 0x5, 0x9, 0x5, 0x8, 0x1, 0xd, 0xa, 0x3, 0x4, 0x2, 0xe, 0xf, 0xc, 0x7, 0x6, 0x0,
    0x9, 0xb, 0x7, 0xd, 0xa, 0x1, 0x0, 0x8, 0x9, 0xf, 0xe, 0x4, 0x6, 0xc, 0xb, 0x2, 0x5, 0x3, 0x6, 0xc, 0x7, 0x1, 0x5,
    0xf, 0xd, 0x8, 0x4, 0xa, 0x9, 0xe, 0x0, 0x3, 0xb, 0x2, 0x4, 0xb, 0xa, 0x0, 0x7, 0x2, 0x1, 0xd, 0x3, 0x6, 0x8, 0x5,
    0x9, 0xc, 0xf, 0xe, 0xd, 0xb, 0x4, 0x1, 0x3, 0xf, 0x5, 0x9, 0x0, 0xa, 0xe, 0x7, 0x6, 0x8, 0x2, 0xc, 0x1, 0xf, 0xd,
    0x0, 0x5, 0x7, 0xa, 0x4, 0x9, 0x2, 0x3, 0xe, 0x6, 0xb, 0x8, 0xc,
  ])

  private static readonly DSbox_A = new Uint8Array([
    0xa, 0x4, 0x5, 0x6, 0x8, 0x1, 0x3, 0x7, 0xd, 0xc, 0xe, 0x0, 0x9, 0x2, 0xb, 0xf, 0x5, 0xf, 0x4, 0x0, 0x2, 0xd, 0xb,
    0x9, 0x1, 0x7, 0x6, 0x3, 0xc, 0xe, 0xa, 0x8, 0x7, 0xf, 0xc, 0xe, 0x9, 0x4, 0x1, 0x0, 0x3, 0xb, 0x5, 0x2, 0x6, 0xa,
    0x8, 0xd, 0x4, 0xa, 0x7, 0xc, 0x0, 0xf, 0x2, 0x8, 0xe, 0x1, 0x6, 0x5, 0xd, 0xb, 0x9, 0x3, 0x7, 0x6, 0x4, 0xb, 0x9,
    0xc, 0x2, 0xa, 0x1, 0x8, 0x0, 0xe, 0xf, 0xd, 0x3, 0x5, 0x7, 0x6, 0x2, 0x4, 0xd, 0x9, 0xf, 0x0, 0xa, 0x1, 0x5, 0xb,
    0x8, 0xe, 0xc, 0x3, 0xd, 0xe, 0x4, 0x1, 0x7, 0x0, 0x5, 0xa, 0x3, 0xc, 0x8, 0xf, 0x6, 0x2, 0x9, 0xb, 0x1, 0x3, 0xa,
    0x9, 0x5, 0xb, 0x4, 0xf, 0x8, 0x6, 0x7, 0xe, 0xd, 0x0, 0x2, 0xc,
  ])

  private static readonly sBoxes: { [key: string]: Uint8Array } = {
    DEFAULT: GOST28147Engine.Sbox_Default,
    'D-A': GOST28147Engine.DSbox_A,
  }

  public initSbox(sBox: Uint8Array) {
    if (sBox.length !== GOST28147Engine.Sbox_Default.length) {
      throw new Error('invalid S-box passed to GOST28147 init')
    }
    this.S = new Uint8Array(sBox)
  }

  public initKey(forEncryption: boolean, key: Uint8Array) {
    this.forEncryption = forEncryption
    this.workingKey = this.generateWorkingKey(key)
  }

  private generateWorkingKey(userKey: Uint8Array): Int32Array {
    if (userKey.length !== 32) {
      throw new Error('Key length invalid. Key needs to be 32 byte - 256 bit!!!')
    }

    const key = new Int32Array(8)
    for (let i = 0; i !== 8; i++) {
      key[i] = this.bytesToint(userKey, i * 4)
    }

    return key
  }

  public processBlock(inBuf: Uint8Array, inOff: number, outBuf: Uint8Array, outOff: number): number {
    if (this.workingKey === null) {
      throw new Error('GOST28147 engine not initialised')
    }

    if (inOff + GOST28147Engine.BLOCK_SIZE > inBuf.length) {
      throw new Error('input buffer too short')
    }

    if (outOff + GOST28147Engine.BLOCK_SIZE > outBuf.length) {
      throw new Error('output buffer too short')
    }

    this.GOST28147Func(this.workingKey, inBuf, inOff, outBuf, outOff)

    return GOST28147Engine.BLOCK_SIZE
  }

  private GOST28147_mainStep(n1: number, key: number): number {
    const cm = (key + n1) | 0 // CM1

    // S-box replacing
    let om = (this.S[0 + ((cm >> (0 * 4)) & 0xf)] << (0 * 4)) >>> 0
    om = (om + (this.S[16 + ((cm >> (1 * 4)) & 0xf)] << (1 * 4))) >>> 0
    om = (om + (this.S[32 + ((cm >> (2 * 4)) & 0xf)] << (2 * 4))) >>> 0
    om = (om + (this.S[48 + ((cm >> (3 * 4)) & 0xf)] << (3 * 4))) >>> 0
    om = (om + (this.S[64 + ((cm >> (4 * 4)) & 0xf)] << (4 * 4))) >>> 0
    om = (om + (this.S[80 + ((cm >> (5 * 4)) & 0xf)] << (5 * 4))) >>> 0
    om = (om + (this.S[96 + ((cm >> (6 * 4)) & 0xf)] << (6 * 4))) >>> 0
    om = (om + (this.S[112 + ((cm >> (7 * 4)) & 0xf)] << (7 * 4))) >>> 0

    return ((om << 11) | (om >>> (32 - 11))) >>> 0 // 11-leftshift
  }

  private GOST28147Func(workingKey: Int32Array, inBuf: Uint8Array, inOff: number, outBuf: Uint8Array, outOff: number) {
    let N1: number, N2: number, tmp: number
    N1 = this.bytesToint(inBuf, inOff)
    N2 = this.bytesToint(inBuf, inOff + 4)

    if (this.forEncryption) {
      for (let k = 0; k < 3; k++) {
        for (let j = 0; j < 8; j++) {
          tmp = N1
          N1 = (N2 ^ this.GOST28147_mainStep(N1, workingKey[j])) | 0
          N2 = tmp
        }
      }
      for (let j = 7; j > 0; j--) {
        tmp = N1
        N1 = (N2 ^ this.GOST28147_mainStep(N1, workingKey[j])) | 0
        N2 = tmp
      }
    } else {
      for (let j = 0; j < 8; j++) {
        tmp = N1
        N1 = (N2 ^ this.GOST28147_mainStep(N1, workingKey[j])) | 0
        N2 = tmp
      }
      for (let k = 0; k < 3; k++) {
        for (let j = 7; j >= 0; j--) {
          if (k === 2 && j === 0) {
            break
          }
          tmp = N1
          N1 = (N2 ^ this.GOST28147_mainStep(N1, workingKey[j])) | 0
          N2 = tmp
        }
      }
    }

    N2 = (N2 ^ this.GOST28147_mainStep(N1, workingKey[0])) | 0

    this.intTobytes(N1, outBuf, outOff)
    this.intTobytes(N2, outBuf, outOff + 4)
  }

  private bytesToint(inBuf: Uint8Array, inOff: number): number {
    return (
      ((inBuf[inOff + 3] << 24) & 0xff000000) |
      ((inBuf[inOff + 2] << 16) & 0x00ff0000) |
      ((inBuf[inOff + 1] << 8) & 0x0000ff00) |
      (inBuf[inOff] & 0x000000ff)
    )
  }

  private intTobytes(num: number, outBuf: Uint8Array, outOff: number) {
    outBuf[outOff + 3] = (num >>> 24) & 0xff
    outBuf[outOff + 2] = (num >>> 16) & 0xff
    outBuf[outOff + 1] = (num >>> 8) & 0xff
    outBuf[outOff] = num & 0xff
  }

  public static getSBox(sBoxName: string): Uint8Array {
    const sBox = GOST28147Engine.sBoxes[sBoxName.toUpperCase()]

    if (!sBox) {
      throw new Error(`Unknown S-Box - possible types: "Default", "D-A".`)
    }

    return new Uint8Array(sBox)
  }
}
