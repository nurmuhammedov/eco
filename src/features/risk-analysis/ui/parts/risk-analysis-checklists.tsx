// import RiskAnalysisChecklistForm from '@/features/risk-analysis/ui/parts/risk-analysis-checklist-form.tsx';
// import { useAuth } from '@/shared/hooks/use-auth.ts';
// import { useSearchParams } from 'react-router-dom';
// import { UserRoles } from '@/entities/user';
import { useChecklist } from '@/features/risk-analysis/hooks/use-checklist.ts'
import FileLink from '@/shared/components/common/file-link.tsx'
// import { Button } from '@/shared/components/ui/button.tsx';
// import { Trash2 } from 'lucide-react';
// import { useDeleteChecklist } from '@/features/risk-analysis/hooks/use-delete-checklist.ts';
// import { toast } from 'sonner';

const RiskAnalysisChecklists = () => {
  const { data } = useChecklist()
  // const { user } = useAuth();
  // const [searchParams] = useSearchParams();
  // const currentIntervalId = searchParams.get('intervalId') || '';
  // const isValidInterval = currentIntervalId == user?.interval?.id?.toString();
  // const isCanAction = isValidInterval && user?.role === UserRoles.LEGAL;
  // const { mutateAsync: deleteCheckList, isPending } = useDeleteChecklist();
  return (
    <div>
      {/*{isCanAction && <RiskAnalysisChecklistForm />}*/}
      <div className="grid grid-cols-2 gap-x-8">
        {data?.map((item: any) => {
          return (
            <div key={item.id} className="flex items-center justify-between border-b border-b-[#E5E7EB] px-3 py-4">
              <p>{item?.name || 'CHECKLIST NAME'}</p>
              <p className="flex shrink-0 items-center gap-2">
                <FileLink url={item.path} />
                {/*{isCanAction && (*/}
                {/*  <Button*/}
                {/*    disabled={isPending}*/}
                {/*    size="icon"*/}
                {/*    variant="destructiveOutline"*/}
                {/*    onClick={() => {*/}
                {/*      if (confirm('Ishonchingiz komilmi?')) {*/}
                {/*        deleteCheckList(item.id).then(() => toast.success('Muvaffaqiyatli saqlandi!'));*/}
                {/*      }*/}
                {/*    }}*/}
                {/*  >*/}
                {/*    <Trash2 />*/}
                {/*  </Button>*/}
                {/*)}*/}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default RiskAnalysisChecklists
