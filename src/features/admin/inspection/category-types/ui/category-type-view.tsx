import { Description } from '@/shared/components/common/description';
import { CategoryType } from '@/entities/admin/inspection';
import { inspectionCategoryOptions } from '@/entities/admin/inspection/shared/static-options/inspection-category-options';

export const CategoryTypeView = ({ data }: { data: CategoryType | null }) => {
  if (!data) return null;

  const categoryName = inspectionCategoryOptions?.find((i) => i.id == data.type)?.name || '-';

  return (
    <Description>
      <Description.Item key="category" label="Kategoriya">
        {categoryName}
      </Description.Item>
      <Description.Item key="type" label="Tekshiruv turi">
        {data.name}
      </Description.Item>
    </Description>
  );
};
