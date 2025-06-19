import { useCheckListSelect } from '@/features/checklists/hooks/use-checklist-select.ts';
import FileLink from '@/shared/components/common/file-link.tsx';

const Checklists = () => {
  const { data } = useCheckListSelect();
  if (!data) return null;
  return (
    <div>
      <h5 className="text-2xl font-semibold uppercase mb-4">Cheklistlar</h5>
      <div className="grid grid-cols-2 gap-x-8 bg-white rounded-lg p-4 shadow">
        {data?.map((item: any) => {
          return (
            <div
              key={item.id}
              className="flex justify-between items-center border-b border-b-[#E5E7EB] py-4 px-3 gap-4"
            >
              <p>{item.name}</p>
              <p className="shrink-0">
                <FileLink url={item.path} />
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Checklists;
