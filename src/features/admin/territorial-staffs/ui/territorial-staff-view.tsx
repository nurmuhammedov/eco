import { useTranslation } from 'react-i18next';
import { Description } from '@/shared/components/common/description';
import { formatPhoneNumber, getUserRoleDisplay, getUserStatusDisplay } from '@/shared/lib';
import { TerritorialStaffResponse } from '@/entities/admin/territorial-staffs';

export const TerritorialStaffView = ({ data }: { data: TerritorialStaffResponse | null }) => {
  const { t } = useTranslation('common');

  if (!data) return null;

  return (
    <Description>
      <Description.Item key="full_name" label={t('short.full_name')}>
        {data?.fullName}
      </Description.Item>
      <Description.Item key="role" label={t('role')}>
        {getUserRoleDisplay(data?.role, t)}
      </Description.Item>
      <Description.Item key="position" label={t('position')}>
        {data?.position}
      </Description.Item>
      <Description.Item key="phone" label={t('phone')}>
        {formatPhoneNumber(data?.phoneNumber)}
      </Description.Item>
      <Description.Item key="pin" label={t('short.pin')}>
        {data?.pin}
      </Description.Item>
      <Description.Item key="office" label={t('territorial_department_name')}>
        {data?.office}
      </Description.Item>
      <Description.Item key="status" label={t('status')}>
        {getUserStatusDisplay(!!data?.enabled, t)}
      </Description.Item>
    </Description>
  );
};
