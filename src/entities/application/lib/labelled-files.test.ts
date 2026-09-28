import { describe, expect, it } from 'vitest'
import { toLabelledFiles } from './labelled-files'

const file = { path: 'a.pdf', number: null, uploadDate: null, expiryDate: null }

describe('toLabelledFiles', () => {
  it('lists the path entries under their labels', () => {
    expect(toLabelledFiles({ passportPath: file, note: file }, (field) => `label:${field}`)).toEqual([
      { label: 'label:passportPath', data: file, fieldName: 'passportPath' },
    ])
  })

  it('gives an empty list for a record without files', () => {
    expect(toLabelledFiles(null, String)).toEqual([])
  })
})
