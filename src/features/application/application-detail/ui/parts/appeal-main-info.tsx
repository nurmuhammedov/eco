import DetailRow from '@/shared/components/common/detail-row.tsx';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { getDate } from '@/shared/utils/date.ts';

interface Props {
  address: any;
  data: any;
  type: any;
}

const AppealMainInfo: FC<Props> = ({ type, data, address }) => {
  //TODO: zamenit dubliruyushisa translations
  const { t } = useTranslation();

  return (
    <div className="py-1 flex flex-col">
      <DetailRow title={t(`labels.${type}.upperOrganization`)} value={data?.upperOrganization} />
      <DetailRow title={t(`labels.${type}.name`)} value={data?.name} />
      <DetailRow title={t(`labels.${type}.phoneNumber`)} value={data?.phoneNumber} />
      <DetailRow title={t(`labels.${type}.hfTypeId`)} value={data?.hfTypeName} />
      {data?.spheres && <DetailRow title={t(`labels.${type}.spheres`)}
                                   value={data?.spheres.map((item: string) => t(
                                     'application.' + item)).join(', ')} />}
      <DetailRow title={t(`labels.${type}.address`)} value={address} />
      <DetailRow title={t(`labels.${type}.location`)} value={data?.location} />
      <DetailRow title={t(`labels.${type}.extraArea`)} value={data?.extraArea} />
      <DetailRow title={t(`labels.${type}.hazardousSubstance`)} value={data?.hazardousSubstance} />
      <DetailRow title={t(`labels.${type}.hazardousFacilityId`)} value={data?.hazardousFacilityName} />
      <DetailRow title={t(`labels.${type}.childEquipmentId`)} value={data?.childEquipmentName} />
      <DetailRow title={t(`labels.${type}.factoryNumber`)} value={data?.factoryNumber} />
      <DetailRow title={t(`labels.${type}.factory`)} value={data?.factory} />
      <DetailRow title={t(`labels.${type}.model`)} value={data?.model} />
      <DetailRow title={t(`labels.${type}.boomLength`)} value={data?.boomLength} />
      <DetailRow title={t(`labels.${type}.liftingCapacity`)} value={data?.liftingCapacity} />
      <DetailRow title={t(`labels.${type}.manufacturedAt`)} value={getDate(data?.manufacturedAt)} />
      <DetailRow title={t(`labels.${type}.partialCheckDate`)} value={getDate(data?.partialCheckDate)} />
      <DetailRow title={t(`labels.${type}.fullCheckDate`)} value={getDate(data?.fullCheckDate)} />
      <DetailRow title={t(`labels.${type}.nonDestructiveCheckDate`)} value={getDate(data?.nonDestructiveCheckDate)} />
      <DetailRow title={t(`labels.${type}.capacity`)} value={data?.capacity} />
      <DetailRow title={t(`labels.${type}.environment`)} value={data?.environment} />
      <DetailRow title={t(`labels.${type}.pressure`)} value={data?.pressure} />
      <DetailRow title={t(`labels.${type}.stopCount`)} value={data?.stopCount} />
      <DetailRow title={t(`labels.${type}.passengersPerMinute`)} value={data?.passengersPerMinute} />
      <DetailRow title={t(`labels.${type}.length`)} value={data?.length} />
      <DetailRow title={t(`labels.${type}.height`)} value={data?.height} />
      <DetailRow title={t(`labels.${type}.diameter`)} value={data?.diameter} />
      <DetailRow title={t(`labels.${type}.thickness`)} value={data?.thickness} />
      <DetailRow title={t(`labels.${type}.temperature`)} value={data?.temperature} />
      <DetailRow title={t(`labels.${type}.fuel`)} value={data?.fuel} />
      <DetailRow title={t(`labels.${type}.sphere`)} value={data?.sphere} />
    </div>
  );
};

export default AppealMainInfo;