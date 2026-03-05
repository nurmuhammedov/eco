import { GOST28147Engine } from './gost28147'

export class OzDSt1106Digest {
  private static readonly DIGEST_LENGTH = 32

  private H = new Uint8Array(32)
  private L = new Uint8Array(32)
  private M = new Uint8Array(32)
  private Sum = new Uint8Array(32)
  private C = [new Uint8Array(32), new Uint8Array(32), new Uint8Array(32), new Uint8Array(32)]

  private xBuf = new Uint8Array(32)
  private xBufOff = 0
  private byteCount = 0

  private cipher = new GOST28147Engine()
  private sBox: Uint8Array

  constructor() {
    this.sBox = GOST28147Engine.getSBox('D-A')
    this.cipher.initSbox(this.sBox)
    this.reset()
  }

  public reset() {
    this.byteCount = 0
    this.xBufOff = 0

    this.H.fill(0)
    this.L.fill(0)
    this.M.fill(0)
    this.Sum.fill(0)
    this.C[1].fill(0)
    this.C[3].fill(0)
    this.xBuf.fill(0)

    const C2 = new Uint8Array([
      0x00, 0xff, 0x00, 0xff, 0x00, 0xff, 0x00, 0xff, 0xff, 0x00, 0xff, 0x00, 0xff, 0x00, 0xff, 0x00, 0x00, 0xff, 0xff,
      0x00, 0xff, 0x00, 0x00, 0xff, 0xff, 0x00, 0x00, 0x00, 0xff, 0xff, 0x00, 0xff,
    ])
    this.C[2].set(C2)
  }

  public update(inByte: number) {
    this.xBuf[this.xBufOff++] = inByte
    if (this.xBufOff === this.xBuf.length) {
      this.sumByteArray(this.xBuf)
      this.processBlock(this.xBuf, 0)
      this.xBufOff = 0
    }
    this.byteCount++
  }

  public updateBytes(inBuf: Uint8Array, inOff: number, len: number) {
    while (this.xBufOff !== 0 && len > 0) {
      this.update(inBuf[inOff])
      inOff++
      len--
    }

    while (len > this.xBuf.length) {
      this.xBuf.set(inBuf.slice(inOff, inOff + 32))
      this.sumByteArray(this.xBuf)
      this.processBlock(this.xBuf, 0)
      inOff += this.xBuf.length
      len -= this.xBuf.length
      this.byteCount += this.xBuf.length
    }

    while (len > 0) {
      this.update(inBuf[inOff])
      inOff++
      len--
    }
  }

  private K = new Uint8Array(32)
  private P(inBuf: Uint8Array): Uint8Array {
    for (let k = 0; k < 8; k++) {
      this.K[4 * k] = inBuf[k]
      this.K[1 + 4 * k] = inBuf[8 + k]
      this.K[2 + 4 * k] = inBuf[16 + k]
      this.K[3 + 4 * k] = inBuf[24 + k]
    }
    return this.K
  }

  private a_temp = new Uint8Array(8)
  private A(inBuf: Uint8Array): Uint8Array {
    for (let j = 0; j < 8; j++) {
      this.a_temp[j] = inBuf[j] ^ inBuf[j + 8]
    }
    const result = new Uint8Array(32)
    result.set(inBuf.slice(8, 32), 0)
    result.set(this.a_temp, 24)
    return result
  }

  private E(key: Uint8Array, s: Uint8Array, sOff: number, inBuf: Uint8Array, inOff: number) {
    this.cipher.initKey(true, key)
    this.cipher.processBlock(inBuf, inOff, s, sOff)
  }

  private fw(inBuf: Uint8Array) {
    const wS = new Int16Array(16)
    for (let i = 0; i < 16; i++) {
      wS[i] = (inBuf[i * 2 + 1] << 8) | inBuf[i * 2]
    }

    const w_S = new Int16Array(16)
    w_S[15] = wS[0] ^ wS[1] ^ wS[2] ^ wS[3] ^ wS[12] ^ wS[15]
    w_S.set(wS.subarray(1, 16), 0)

    for (let i = 0; i < 16; i++) {
      inBuf[i * 2 + 1] = (w_S[i] >> 8) & 0xff
      inBuf[i * 2] = w_S[i] & 0xff
    }
  }

  private processBlock(inBuf: Uint8Array, inOff: number) {
    this.M.set(inBuf.subarray(inOff, inOff + 32))

    const U = new Uint8Array(this.H)
    let V: any = new Uint8Array(this.M)
    const W = new Uint8Array(32)

    for (let j = 0; j < 32; j++) {
      W[j] = U[j] ^ V[j]
    }

    const S = new Uint8Array(32)
    this.E(this.P(W), S, 0, this.H, 0)

    for (let i = 1; i < 4; i++) {
      const tmpA = this.A(U)
      for (let j = 0; j < 32; j++) {
        U[j] = tmpA[j] ^ this.C[i][j]
      }
      V = this.A(this.A(V))
      for (let j = 0; j < 32; j++) {
        W[j] = U[j] ^ V[j]
      }
      this.E(this.P(W), S, i * 8, this.H, i * 8)
    }

    for (let n = 0; n < 12; n++) {
      this.fw(S)
    }
    for (let n = 0; n < 32; n++) {
      S[n] ^= this.M[n]
    }

    this.fw(S)

    for (let n = 0; n < 32; n++) {
      S[n] ^= this.H[n]
    }
    for (let n = 0; n < 61; n++) {
      this.fw(S)
    }
    this.H.set(S)
  }

  private finish() {
    const bitCount = this.byteCount * 8
    const L = new Uint8Array(32)
    // Little endian long (64 bit)
    L[0] = bitCount & 0xff
    L[1] = (bitCount >>> 8) & 0xff
    L[2] = (bitCount >>> 16) & 0xff
    L[3] = (bitCount >>> 24) & 0xff
    // bitCount is usually small enough for 32 bit, but the rest are 0

    while (this.xBufOff !== 0) {
      this.update(0)
    }

    this.processBlock(L, 0)
    this.processBlock(this.Sum, 0)
  }

  public doFinal(out: Uint8Array, outOff: number): number {
    this.finish()
    out.set(this.H, outOff)
    this.reset()
    return OzDSt1106Digest.DIGEST_LENGTH
  }

  private sumByteArray(inBuf: Uint8Array) {
    let carry = 0
    for (let i = 0; i !== this.Sum.length; i++) {
      const sum = (this.Sum[i] & 0xff) + (inBuf[i] & 0xff) + carry
      this.Sum[i] = sum & 0xff
      carry = sum >>> 8
    }
  }

  public getDigestSize(): number {
    return OzDSt1106Digest.DIGEST_LENGTH
  }
}

/**
 * Convenience function to hash a string or Uint8Array using OzDSt1106
 */
export function ozdst1106(data: string | Uint8Array): Uint8Array {
  const digest = new OzDSt1106Digest()
  const bytes = typeof data === 'string' ? new TextEncoder().encode(data) : data
  digest.updateBytes(bytes, 0, bytes.length)
  const result = new Uint8Array(32)
  digest.doFinal(result, 0)
  return result
}
