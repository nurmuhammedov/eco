import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { useCustomSearchParams, useDetail } from '@/shared/hooks';
import { SearchResultDisplay } from '@/features/permits/ui/add-permit-modal';

export const PermitDetailModal = () => {
  const {
    removeParams,
    paramsObject: { detailId = '' },
  } = useCustomSearchParams();
  const { data: searchResult, isLoading } = useDetail<any>('/permits', detailId, !!detailId);

  return (
    <Dialog
      open={!!detailId}
      onOpenChange={() => {
        if (detailId) {
          removeParams('detailId');
        }
      }}
    >
      <DialogContent className="sm:max-w-[800px] max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tafsilotlar</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="text-center">Yuklanmoqda...</div>
        ) : (
          searchResult && (
            <>
              <SearchResultDisplay type="detail" data={searchResult} />
            </>
          )
        )}
      </DialogContent>
    </Dialog>
  );
};
