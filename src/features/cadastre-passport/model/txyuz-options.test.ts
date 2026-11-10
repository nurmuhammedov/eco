import { describe, expect, it } from 'vitest'
import {
  CERTIFICATE_NUMBER_PATTERN,
  CERTIFICATE_NUMBER_SAMPLE,
  formatCertificateNumber,
  joinAddress,
  splitAddress,
} from './txyuz-options'

describe('joinAddress', () => {
  it('gives splitAddress back the parts it joined', () => {
    const address = joinAddress('Andijon viloyati', 'Marxamat tumani', '"Mingtepa" MFY, Olmazor ko‘chasi, 39-uy')

    expect(address).toBe('Andijon viloyati, Marxamat tumani, "Mingtepa" MFY, Olmazor ko‘chasi, 39-uy')
    expect(splitAddress(address)).toEqual({
      regionName: 'Andijon viloyati',
      districtName: 'Marxamat tumani',
      addressLine: '"Mingtepa" MFY, Olmazor ko‘chasi, 39-uy',
    })
  })

  it('trims the parts and leaves the blank ones out', () => {
    expect(joinAddress('  Andijon viloyati ', '', undefined, null, ' 39-uy')).toBe('Andijon viloyati, 39-uy')
  })
})

describe('formatCertificateNumber', () => {
  it('puts the space in for the typist', () => {
    expect(formatCertificateNumber('QV123456')).toBe('QV 123456')
  })

  it('accepts lower case and punctuation the reader copies from the paper document', () => {
    expect(formatCertificateNumber('qv-123456')).toBe('QV 123456')
    expect(formatCertificateNumber('  qv 123 456 ')).toBe('QV 123456')
  })

  it('holds back the space until both letters are typed', () => {
    expect(formatCertificateNumber('')).toBe('')
    expect(formatCertificateNumber('Q')).toBe('Q')
    expect(formatCertificateNumber('QV')).toBe('QV')
  })

  it('drops digits typed where the series belongs', () => {
    expect(formatCertificateNumber('12QV345678')).toBe('')
  })

  it('stops at six digits', () => {
    expect(formatCertificateNumber('QV1234567890')).toBe('QV 123456')
  })

  it('survives a missing value', () => {
    expect(formatCertificateNumber(undefined as unknown as string)).toBe('')
  })
})

describe('CERTIFICATE_NUMBER_PATTERN', () => {
  it('accepts what the formatter produces, including the sample shown to the reader', () => {
    expect(CERTIFICATE_NUMBER_PATTERN.test(CERTIFICATE_NUMBER_SAMPLE)).toBe(true)
    expect(CERTIFICATE_NUMBER_PATTERN.test(formatCertificateNumber('qv123456'))).toBe(true)
  })

  it('rejects a missing space, a short series and lower case', () => {
    expect(CERTIFICATE_NUMBER_PATTERN.test('QV123456')).toBe(false)
    expect(CERTIFICATE_NUMBER_PATTERN.test('Q 123456')).toBe(false)
    expect(CERTIFICATE_NUMBER_PATTERN.test('qv 123456')).toBe(false)
    expect(CERTIFICATE_NUMBER_PATTERN.test('QV 12345')).toBe(false)
  })
})
