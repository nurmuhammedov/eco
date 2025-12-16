import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog'
import { useCustomSearchParams, useDetail } from '@/shared/hooks'
import { SearchResultDisplay } from '@/features/permits/ui/add-permit-modal'
import { ExternalLink, Loader2 } from 'lucide-react'

export const PermitDetailModal = () => {
  const {
    removeParams,
    paramsObject: { detailId = '' },
  } = useCustomSearchParams()
  const { data: searchResult, isLoading } = useDetail<any>('/permits', detailId, !!detailId)

  return (
    <Dialog
      open={!!detailId}
      onOpenChange={() => {
        if (detailId) {
          removeParams('detailId')
        }
      }}
    >
      <DialogContent className="max-h-[95vh] overflow-y-auto sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-1.5">
            <a
              href="https://license.gov.uz"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-1 text-blue-600 transition-colors hover:text-blue-700 hover:underline"
            >
              License.gov.uz
              <ExternalLink className="h-4 w-4 opacity-70 transition-opacity group-hover:opacity-100" />
            </a>
            <span>dan kelgan maʼlumotlar</span>
          </DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="flex h-40 w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          </div>
        ) : (
          searchResult && <SearchResultDisplay type="detail" data={searchResult} />
        )}
      </DialogContent>
    </Dialog>
  )
}
