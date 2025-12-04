import { useTranslation } from 'react-i18next'
import { Description } from '@/shared/components/common/description'
import { CommitteeStaffResponse } from '@/entities/admin/committee-staffs'
import { formatPhoneNumber, getUserRoleDisplay, getUserStatusDisplay } from '@/shared/lib'

export const CommitteeStaffView = ({ data }: { data: CommitteeStaffResponse | null }) => {
  const { t } = useTranslation('common')

  if (!data) return null

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
      <Description.Item key="department" label={t('committee_division_department')}>
        {data?.department}
      </Description.Item>
      <Description.Item key="status" label={t('status')}>
        {getUserStatusDisplay(!!data?.enabled, t)}
      </Description.Item>
    </Description>
  )
}
