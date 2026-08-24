/**
 * Hands a downloaded blob to the browser as a file.
 *
 * Revoking matters: the object URL pins the blob in memory for the life of the
 * document, so a few large exports in one session add up on a machine that
 * never reloads the tab.
 */
export const saveBlob = (blob: Blob, fileName: string): void => {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  link.remove()

  URL.revokeObjectURL(url)
}
