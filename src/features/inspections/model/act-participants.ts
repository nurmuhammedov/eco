export interface ActParticipant {
  fullName: string
  position: string
  signBase64: string | null
}

export const TRANSPARENT_SIGNATURE_PLACEHOLDER =
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVR4nGNgAAIAAAUAAXpeqz8AAAAASUVORK5CYII='

export const areAllParticipantsSigned = (participants: ActParticipant[]) =>
  participants.every((participant) => Boolean(participant.signBase64))

export const getSignaturesKey = (participants: ActParticipant[]) =>
  participants.map((participant) => participant.signBase64 ?? '-').join('|')

export const toParticipantsPayload = (participants: ActParticipant[]) =>
  participants.map(({ fullName, position, signBase64 }) => ({
    fullName,
    position,
    signBase64: signBase64 ?? TRANSPARENT_SIGNATURE_PLACEHOLDER,
  }))
