import { FC } from 'react'
import { Paperclip } from 'lucide-react'
import { cn } from '@/shared/lib/utils'
import { apiConfig } from '@/shared/api/constants'

interface FileLinkProps {
  url: string
  title?: string
  isSmall?: boolean
  className?: string
}

export const FileLink: FC<FileLinkProps> = ({ url, title, isSmall = false, className }) => {
  if (!url) return null

  const fileName = title || url.split('/').pop() || 'Hujjatni yuklash'

  return (
    <a
      href={`${apiConfig?.baseURL}${url}`}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'inline-flex items-center rounded-md border border-blue-200 bg-blue-50 font-medium text-blue-700 transition-colors',
        'hover:bg-blue-100 hover:text-blue-800 focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 focus:outline-none',
        isSmall ? 'gap-1.5 px-2 py-0.5 text-xs' : 'gap-2 px-3 py-1.5 text-sm',
        className
      )}
      title={fileName}
    >
      <Paperclip size={isSmall ? 13 : 15} className="flex-shrink-0" />
      <span className={cn('truncate', isSmall ? 'max-w-[150px]' : 'max-w-[200px]')}>{fileName}</span>
    </a>
  )
}

export default FileLink
