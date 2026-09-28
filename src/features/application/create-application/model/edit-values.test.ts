import { describe, expect, it } from 'vitest'
import { asUpdatePayload } from './edit-values'

describe('asUpdatePayload', () => {
  it('sends blanks as null and dates as the day', () => {
    expect(
      asUpdatePayload({
        address: '',
        phoneNumber: '+998',
        parentOrganization: null,
        identity: undefined,
        file3ExpiryDate: new Date(2027, 4, 17),
        activity: 5,
        isValid: false,
        model: 'RX-1',
      })
    ).toEqual({
      address: null,
      phoneNumber: null,
      parentOrganization: null,
      identity: null,
      file3ExpiryDate: '2027-05-17',
      activity: 5,
      isValid: false,
      model: 'RX-1',
    })
  })
})
