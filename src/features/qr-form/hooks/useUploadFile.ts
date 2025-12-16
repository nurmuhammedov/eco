import { useMutation } from '@tanstack/react-query'
import { uploadFile } from '../api/upload-file'

export const useUploadFile = () => {
  return useMutation({
    mutationFn: (file: File) => uploadFile(file),
  })
}
