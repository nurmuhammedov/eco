import { Description } from '@/shared/components/common/description';
import { Checklist } from '@/entities/admin/inspection';
import { inspectionCategoryOptions } from '@/entities/admin/inspection/shared/static-options/inspection-category-options';

export const ChecklistView = ({ data }: { data: Checklist | null }) => {
  if (!data) return null;

  console.log(data);

  return (
    <Description>
      <Description.Item key="category" label="Kategoriya">
        {inspectionCategoryOptions?.find((i) => i?.id == data?.category)?.name || ''}
      </Description.Item>
      <Description.Item key="categoryTypeName" label="Tekshiruv turi">
        {data?.categoryTypeName}
      </Description.Item>
      <Description.Item key="orderNumber" label="Navbat raqami">
        {data?.orderNumber}
      </Description.Item>
      <Description.Item key="question" label="Savol">
        {data?.question}
      </Description.Item>
      <Description.Item key="negative" label="Yo‘q belgilanganda dalolatnomaga tushadigan matn">
        {data?.negative || '-'}
      </Description.Item>
      <Description.Item key="corrective" label="Yo‘q belgilanganda qilinadigan chora-tadbir matni">
        {data?.corrective || '-'}
      </Description.Item>
    </Description>
  );
};
