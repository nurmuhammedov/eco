import DetailRow from '@/shared/components/common/detail-row.tsx';
import { getDate } from '@/shared/utils/date.ts';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { ACCREDITATION_SPHERE_OPTIONS } from '@/shared/constants/accreditation-data.ts';

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
      <DetailRow title={t(`labels.${type}.phoneNumber`)} value={data?.phoneNumber} />
      <DetailRow title={t(`labels.${type}.upperOrganization`)} value={data?.upperOrganization} />
      <DetailRow title={t(`labels.${type}.name`)} value={data?.name} />
      <DetailRow title={t(`labels.${type}.parentOrganization`)} value={data?.parentOrganization} />

      <DetailRow title={t(`labels.${type}.supervisorName`)} value={data?.supervisorName} />
      <DetailRow title={t(`labels.${type}.supervisorPosition`)} value={data?.supervisorPosition} />

      <DetailRow title={t(`labels.${type}.supervisorStatus`)} value={data?.supervisorStatus} />
      <DetailRow title={t(`labels.${type}.supervisorEducation`)} value={data?.supervisorEducation} />
      <DetailRow title={t(`labels.${type}.supervisorPhoneNumber`)} value={data?.supervisorPhoneNumber} />
      <DetailRow title={t(`labels.${type}.division`)} value={data?.division} />
      <DetailRow title={t(`labels.${type}.identifierType`)} value={data?.identifierType} />
      <DetailRow title={t(`labels.${type}.symbol`)} value={data?.symbol} />
      <DetailRow title={t(`labels.${type}.activity`)} value={data?.activity} />
      <DetailRow title={t(`labels.${type}.category`)} value={data?.category} />
      <DetailRow title={t(`labels.${type}.country`)} value={data?.country} />
      <DetailRow title={t(`labels.${type}.acceptedFrom`)} value={data?.acceptedFrom} />
      <DetailRow title={t(`labels.${type}.acceptedAt`)} value={getDate(data?.acceptedAt)} />
      {data?.isValid !== undefined && (
        <DetailRow
          title={t(`labels.${type}.isValid`)}
          value={
            data?.isValid ? (
              <span className="text-green-600">Aktiv</span>
            ) : (
              <span className="text-red-600">Aktiv emas</span>
            )
          }
        />
      )}
      <DetailRow title={t(`labels.${type}.usageType`)} value={data?.usageType} />
      <DetailRow title={t(`labels.${type}.storageLocation`)} value={data?.storageLocation} />
      <DetailRow title={t(`labels.${type}.hfTypeId`)} value={data?.hfTypeName} />
      {data?.spheres && (
        <DetailRow
          title={t(`labels.${type}.spheres`)}
          value={data?.spheres.map((item: string) => t('application.' + item)).join(', ')}
        />
      )}
      <DetailRow title={t(`labels.${type}.customerLegalName`)} value={data?.customerLegalName} />
      <DetailRow title={t(`labels.${type}.customerTin`)} value={data?.customerTin} />
      <DetailRow title={t(`labels.${type}.customerLegalForm`)} value={data?.customerLegalForm} />
      <DetailRow title={t(`labels.${type}.customerLegalAddress`)} value={data?.customerLegalAddress} />
      <DetailRow title={t(`labels.${type}.customerPhoneNumber`)} value={data?.customerPhoneNumber} />
      <DetailRow title={t(`labels.${type}.customerFullName`)} value={data?.customerFullName} />
      <DetailRow title={t(`labels.${type}.monitoringLetterDate`)} value={data?.monitoringLetterDate} />
      <DetailRow title={t(`labels.${type}.monitoringLetterNumber`)} value={data?.monitoringLetterNumber} />
      <DetailRow title={t(`labels.${type}.submissionDate`)} value={data?.submissionDate} />
      <DetailRow title={t(`labels.${type}.objectName`)} value={data?.objectName} />
      <DetailRow title={t(`labels.${type}.firstSymbolsGroup`)} value={data?.firstSymbolsGroup} />
      <DetailRow title={t(`labels.${type}.secondSymbolsGroup`)} value={data?.secondSymbolsGroup} />
      <DetailRow title={t(`labels.${type}.thirdSymbolsGroup`)} value={data?.thirdSymbolsGroup} />
      <DetailRow title={t(`labels.${type}.expertiseConclusionNumber`)} value={data?.expertiseConclusionNumber} />
      <DetailRow title={t(`labels.${type}.responsiblePersonName`)} value={data?.responsiblePersonName} />
      {data?.accreditationSpheres && (
        <DetailRow
          title={t(`labels.${type}.accreditationSpheres`)}
          value={
            <div>
              {Array.isArray(data?.accreditationSpheres) &&
                data?.accreditationSpheres?.map((item: string) => {
                  const currentItem = ACCREDITATION_SPHERE_OPTIONS.find((accItem) => String(accItem.id) === item);
                  return (
                    <p>
                      {currentItem?.point}. {currentItem?.name}
                    </p>
                  );
                })}
            </div>
          }
        />
      )}
      <DetailRow title={t(`labels.${type}.address`)} value={address} />
      <DetailRow title={t(`labels.${type}.location`)} value={data?.location} />
      <DetailRow title={t(`labels.${type}.extraArea`)} value={data?.extraArea} />
      <DetailRow title={t(`labels.${type}.hazardousSubstance`)} value={data?.hazardousSubstance} />
      <DetailRow title={t(`labels.${type}.hazardousFacilityId`)} value={data?.hazardousFacilityName} />
      <DetailRow title={t(`labels.${type}.childEquipmentId`)} value={data?.childEquipmentName} />
      <DetailRow title={t(`labels.${type}.factoryNumber`)} value={data?.factoryNumber} />
      <DetailRow title={t(`labels.${type}.factory`)} value={data?.factory} />
      <DetailRow title={t(`labels.${type}.model`)} value={data?.model} />
      <DetailRow title={t(`labels.${type}.boomLength`)} value={data?.parameters?.boomLength} />
      <DetailRow title={t(`labels.${type}.liftingCapacity`)} value={data?.parameters?.liftingCapacity} />
      <DetailRow title={t(`labels.${type}.manufacturedAt`)} value={getDate(data?.manufacturedAt)} />
      <DetailRow title={t(`labels.${type}.partialCheckDate`)} value={getDate(data?.partialCheckDate)} />
      <DetailRow title={t(`labels.${type}.fullCheckDate`)} value={getDate(data?.fullCheckDate)} />
      <DetailRow title={t(`labels.${type}.nonDestructiveCheckDate`)} value={getDate(data?.nonDestructiveCheckDate)} />
      <DetailRow title={t(`labels.${type}.capacity`)} value={data?.parameters?.capacity} />
      <DetailRow title={t(`labels.${type}.environment`)} value={data?.parameters?.environment} />
      <DetailRow title={t(`labels.${type}.pressure`)} value={data?.parameters?.pressure} />
      <DetailRow title={t(`labels.${type}.stopCount`)} value={data?.parameters?.stopCount} />
      <DetailRow title={t(`labels.${type}.speed`)} value={data?.parameters?.speed} />
      <DetailRow title={t(`labels.${type}.passengersPerMinute`)} value={data?.parameters?.passengersPerMinute} />
      <DetailRow title={t(`labels.${type}.passengerCount`)} value={data?.parameters?.passengerCount} />
      <DetailRow title={t(`labels.${type}.length`)} value={data?.parameters?.length} />
      <DetailRow title={t(`labels.${type}.height`)} value={data?.parameters?.height} />
      <DetailRow title={t(`labels.${type}.diameter`)} value={data?.parameters?.diameter} />
      <DetailRow title={t(`labels.${type}.thickness`)} value={data?.parameters?.thickness} />
      <DetailRow title={t(`labels.${type}.temperature`)} value={data?.parameters?.temperature} />
      <DetailRow title={t(`labels.${type}.density`)} value={data?.parameters?.density} />
      <DetailRow title={t(`labels.${type}.fuel`)} value={data?.parameters?.fuel} />
      <DetailRow title={t(`labels.${type}.sphere`)} value={data?.sphere} />
    </div>
  );
};

export default AppealMainInfo;
