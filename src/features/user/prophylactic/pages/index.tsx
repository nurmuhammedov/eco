import { ApplicationStatus } from '@/shared/types/enums';
import { StatusBadge, YandexMap } from '@/shared/components/common';
import { useYandexMap } from '@/shared/components/common/yandex-map';
import { DetailCard, DetailCardAccordion } from '@/shared/components/common/detail-card';

export default function Index() {
  const { coords, addCoord, center, zoom } = useYandexMap();
  return (
    <div className="">
      <div className="flex gap-2">
        <StatusBadge status={ApplicationStatus.NEW}>Yangi</StatusBadge>
        <StatusBadge status={ApplicationStatus.PROCESS}>Ijroda</StatusBadge>
        <StatusBadge status={ApplicationStatus.AGREEMENT}>Kelishishda</StatusBadge>
        <StatusBadge status={ApplicationStatus.REJECTED}>Qaytarib yuborilgan</StatusBadge>
        <StatusBadge status={ApplicationStatus.CONFIRMATION}>Tasdiqlashda</StatusBadge>
      </div>
      <DetailCard title="Ариза тўғрисида маълумот">
        <YandexMap
          zoom={zoom}
          width="100%"
          height="500px"
          center={center}
          coords={coords}
          onMapClick={(coords) => addCoord(coords)}
        />
      </DetailCard>
      <DetailCardAccordion>
        <DetailCardAccordion.Item
          value="execution"
          className="my-4"
          title="Ижро (Тадбиркор томонидан текшириш натижаси буйича килинган ишлар, такдим этилган хужжатлар)"
        >
          <p>
            ХИЧОда саноат хавфсизлиги талабларига риоя этилиши устидан ишлаб чиқариш назоратини ташкил этиш тугрисида
            Низом ишлаб чиқилмаган. (ЎзР ВМ 19.05.2020й. 291-сонли қарорининг 2-иловаси)
          </p>
        </DetailCardAccordion.Item>

        <DetailCardAccordion.Item value="another-item" title="Текшириш маълумотлари">
          <YandexMap
            zoom={zoom}
            width="100%"
            height="500px"
            center={center}
            coords={coords}
            onMapClick={(coords) => addCoord(coords)}
          />
        </DetailCardAccordion.Item>
      </DetailCardAccordion>
    </div>
  );
}
